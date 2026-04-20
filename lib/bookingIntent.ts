import crypto from "crypto";
import { FieldValue } from "firebase-admin/firestore";
import { getDb } from "@/lib/firebaseAdmin";
import { PROPERTY_DATA } from "@/lib/siteContent";

export type BookingIntentInput = {
  sessionId?: string;
  path?: string;
  userAgent?: string;
  ip?: string;
  source?: "chatbot" | "widget" | "api";
  propertySlug?: string;
  propertyName?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  name?: string;
  contact?: string;
  message?: string;
  website?: string;
  formStartedAt?: number;
};

export type BookingIntentResult =
  | {
      ok: true;
      inquiryId: string;
      status: "new";
      propertySlug: string;
      propertyName: string;
      checkIn: string;
      checkOut: string;
      nights: number;
      guests: number;
      pricePerNight: number;
      finalPrice: number;
      currency: "INR";
    }
  | {
      ok: false;
      code:
        | "invalid_input"
        | "spam_blocked"
        | "rate_limited"
        | "duplicate"
        | "not_available"
        | "server_error";
      message: string;
      details?: Record<string, unknown>;
    };

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const DUPLICATE_WINDOW_MS = 24 * 60 * 60 * 1000;
const MIN_SUBMIT_MS = 3000;
const SPAM_PROTECTION_ENABLED = false;

function hash(value: string) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function normalizePhone(raw: string) {
  return raw.replace(/[^0-9+]/g, "");
}

function isEmail(raw: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw);
}

function isPhone(raw: string) {
  return /^[+]?[0-9]{10,15}$/.test(normalizePhone(raw));
}

function parseDate(value: string) {
  const safe = value?.trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(safe)) {
    return null;
  }
  const parsed = new Date(`${safe}T00:00:00.000Z`);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }
  return parsed;
}

function toDateOnly(date: Date) {
  return date.toISOString().slice(0, 10);
}

function listStayDates(checkIn: Date, checkOut: Date) {
  const dates: string[] = [];
  const cursor = new Date(checkIn);
  while (cursor < checkOut) {
    dates.push(toDateOnly(cursor));
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return dates;
}

function overlaps(startA: Date, endA: Date, startB: Date, endB: Date) {
  return startA < endB && endA > startB;
}
function normalizeText(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function resolvePropertySlug(input: BookingIntentInput): string {
  const directSlug = (input.propertySlug || "").trim().toLowerCase();
  if (directSlug && PROPERTY_DATA[directSlug]) {
    return directSlug;
  }

  const candidate = normalizeText((input.propertyName || input.propertySlug || "").trim());
  if (!candidate) {
    return "";
  }

  for (const [slug, property] of Object.entries(PROPERTY_DATA)) {
    const names = [
      slug,
      property.name,
      property.name.replace("The ", ""),
      property.name.replace("’", "'"),
    ].map((value) => normalizeText(value));

    if (names.some((name) => name === candidate || name.includes(candidate) || candidate.includes(name))) {
      return slug;
    }
  }

  return "";
}

export async function processBookingIntent(input: BookingIntentInput): Promise<BookingIntentResult> {
  try {
    const nowMs = Date.now();

    if (SPAM_PROTECTION_ENABLED && input.website?.trim()) {
      return {
        ok: false,
        code: "spam_blocked",
        message: "Unable to process this request.",
      };
    }

    if (SPAM_PROTECTION_ENABLED && input.formStartedAt && nowMs - input.formStartedAt < MIN_SUBMIT_MS) {
      return {
        ok: false,
        code: "spam_blocked",
        message: "Please try again after a few seconds.",
      };
    }

    const propertySlug = resolvePropertySlug(input);
    const property = PROPERTY_DATA[propertySlug];
    const checkIn = parseDate(input.checkIn || "");
    const checkOut = parseDate(input.checkOut || "");
    const guests = Number(input.guests);
    const contact = (input.contact || "").trim();
    const name = (input.name || "").trim();

    if (!property || !checkIn || !checkOut || !Number.isFinite(guests) || guests < 1 || !contact || !name) {
      return {
        ok: false,
        code: "invalid_input",
        message: "Please provide property, check-in/check-out, guests, name, and contact.",
      };
    }

    if (!isEmail(contact) && !isPhone(contact)) {
      return {
        ok: false,
        code: "invalid_input",
        message: "Contact should be a valid phone number or email.",
      };
    }

    if (checkOut <= checkIn) {
      return {
        ok: false,
        code: "invalid_input",
        message: "Check-out must be after check-in.",
      };
    }

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    if (checkIn < today) {
      return {
        ok: false,
        code: "invalid_input",
        message: "Check-in date cannot be in the past.",
      };
    }

    if (guests > property.guests) {
      return {
        ok: false,
        code: "invalid_input",
        message: `Maximum guests for ${property.name} is ${property.guests}.`,
      };
    }

    const ipHash = hash((input.ip || "unknown").trim());
    const sessionHash = hash((input.sessionId || "unknown").trim());
    const contactHash = hash(contact.toLowerCase());
    const spamKey = `${ipHash}:${sessionHash}:${contactHash}`;

    const db = getDb();

    if (SPAM_PROTECTION_ENABLED) {
      const attemptsSnap = await db
        .collection("bookingInquiryAttempts")
        .where("spamKey", "==", spamKey)
        .where("createdAtMs", ">=", nowMs - RATE_LIMIT_WINDOW_MS)
        .get();

      if (attemptsSnap.size >= RATE_LIMIT_MAX) {
        await db.collection("bookingInquiryAttempts").add({
          spamKey,
          createdAtMs: nowMs,
          blocked: true,
          reason: "rate_limited",
          createdAt: FieldValue.serverTimestamp(),
        });
        return {
          ok: false,
          code: "rate_limited",
          message: "Too many attempts. Please try again in a while.",
        };
      }

      await db.collection("bookingInquiryAttempts").add({
        spamKey,
        createdAtMs: nowMs,
        blocked: false,
        reason: null,
        createdAt: FieldValue.serverTimestamp(),
      });
    }

    const dedupeKey = hash(
      `${propertySlug}|${toDateOnly(checkIn)}|${toDateOnly(checkOut)}|${contact.toLowerCase()}`,
    );

    if (SPAM_PROTECTION_ENABLED) {
      const duplicateSnap = await db
        .collection("bookingInquiries")
        .where("dedupeKey", "==", dedupeKey)
        .where("createdAtMs", ">=", nowMs - DUPLICATE_WINDOW_MS)
        .get();

      if (!duplicateSnap.empty) {
        return {
          ok: false,
          code: "duplicate",
          message: "We already received this inquiry and will reach out shortly.",
        };
      }
    }

    const requestedDates = listStayDates(checkIn, checkOut);
    const builtInBookedDates = new Set((property.bookedDates || []).map((date) => date.trim()));
    const blockedByBuiltIn = requestedDates.some((date) => builtInBookedDates.has(date));

    if (blockedByBuiltIn) {
      return {
        ok: false,
        code: "not_available",
        message: "These dates are not available. Please try different dates.",
      };
    }

    const overlappingSnap = await db
      .collection("bookingInquiries")
      .where("propertySlug", "==", propertySlug)
      .where("status", "in", ["new", "contacted", "confirmed"])
      .get();

    const hasOverlap = overlappingSnap.docs.some((doc) => {
      const data = doc.data();
      const existingCheckIn = parseDate(String(data.checkIn || ""));
      const existingCheckOut = parseDate(String(data.checkOut || ""));
      if (!existingCheckIn || !existingCheckOut) {
        return false;
      }
      return overlaps(checkIn, checkOut, existingCheckIn, existingCheckOut);
    });

    if (hasOverlap) {
      return {
        ok: false,
        code: "not_available",
        message: "These dates are currently unavailable. Please choose alternate dates.",
      };
    }

    const nights = Math.max(
      1,
      Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)),
    );
    const pricePerNight = property.price;
    const finalPrice = pricePerNight * nights;

    const docRef = await db.collection("bookingInquiries").add({
      status: "new",
      source: input.source || "api",
      propertySlug,
      propertyName: property.name,
      checkIn: toDateOnly(checkIn),
      checkOut: toDateOnly(checkOut),
      nights,
      guests,
      pricePerNight,
      finalPrice,
      currency: "INR",
      name,
      contact,
      message: (input.message || "").trim() || null,
      sessionId: input.sessionId ?? null,
      path: input.path ?? null,
      userAgent: input.userAgent ?? null,
      ipHash,
      contactHash,
      dedupeKey,
      createdAtMs: nowMs,
      createdAt: FieldValue.serverTimestamp(),
      risk: {
        spamKey,
        honeypotTriggered: false,
        fastSubmit: Boolean(input.formStartedAt && nowMs - input.formStartedAt < MIN_SUBMIT_MS),
      },
    });

    return {
      ok: true,
      inquiryId: docRef.id,
      status: "new",
      propertySlug,
      propertyName: property.name,
      checkIn: toDateOnly(checkIn),
      checkOut: toDateOnly(checkOut),
      nights,
      guests,
      pricePerNight,
      finalPrice,
      currency: "INR",
    };
  } catch (error) {
    console.error("processBookingIntent failed", error);
    return {
      ok: false,
      code: "server_error",
      message: "Unable to process booking inquiry right now.",
    };
  }
}




