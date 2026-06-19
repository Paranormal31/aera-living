import { NextResponse } from "next/server";
import { getDb } from "@/lib/firebaseAdmin";
import { verifyAuth } from "@/lib/auth";

function findBookedDatesInObject(obj: any, dates: Set<string>) {
  if (!obj || typeof obj !== "object") return;

  if (obj.date && (obj.available === false || obj.isAvailable === false || obj.booked === true)) {
    if (typeof obj.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(obj.date)) {
      dates.add(obj.date);
    }
  }

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      findBookedDatesInObject(obj[key], dates);
    }
  }
}

export async function POST(request: Request) {
  try {
    if (!(await verifyAuth())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await request.json().catch(() => ({}));
    const { propertySlug, htmlContent } = body;

    if (!propertySlug || !htmlContent) {
      return NextResponse.json({ error: "Missing propertySlug or HTML content" }, { status: 400 });
    }

    const bookedDates = new Set<string>();

    // Attempt 1: Parse standard data-state scripts
    const stateMatch = htmlContent.match(/<script[^>]*id="data-state"[^>]*>([\s\S]*?)<\/script>/);
    if (stateMatch && stateMatch[1]) {
      try {
        const stateJson = JSON.parse(stateMatch[1]);
        findBookedDatesInObject(stateJson, bookedDates);
      } catch (e) {
        console.warn("Failed to parse data-state script JSON from paste", e);
      }
    }

    // Attempt 2: Search for raw json occurrences
    if (bookedDates.size === 0) {
      const rawMatches = htmlContent.match(/"date"\s*:\s*"\d{4}-\d{2}-\d{2}"\s*,\s*"available"\s*:\s*false/g);
      if (rawMatches) {
        for (const rawMatch of rawMatches) {
          const dateMatch = rawMatch.match(/\d{4}-\d{2}-\d{2}/);
          if (dateMatch) {
            bookedDates.add(dateMatch[0]);
          }
        }
      }
    }

    // Attempt 3: Search for alternate schema keys
    if (bookedDates.size === 0) {
      const rawMatches = htmlContent.match(/"date"\s*:\s*"\d{4}-\d{2}-\d{2}"\s*,\s*"isAvailable"\s*:\s*false/g);
      if (rawMatches) {
        for (const rawMatch of rawMatches) {
          const dateMatch = rawMatch.match(/\d{4}-\d{2}-\d{2}/);
          if (dateMatch) {
            bookedDates.add(dateMatch[0]);
          }
        }
      }
    }

    const db = getDb();
    
    // Delete existing airbnb dates for this property
    const batch = db.batch();
    const existingQuery = await db
      .collection("blockedDates")
      .where("propertySlug", "==", propertySlug)
      .where("type", "==", "airbnb")
      .get();

    for (const doc of existingQuery.docs) {
      batch.delete(doc.ref);
    }

    // Insert new airbnb dates
    for (const dateStr of bookedDates) {
      const docRef = db.collection("blockedDates").doc(`${propertySlug}:airbnb:${dateStr}`);
      batch.set(docRef, {
        propertySlug,
        date: dateStr,
        type: "airbnb",
        syncedAt: new Date().toISOString(),
      });
    }

    await batch.commit();

    // Update last synced in config
    await db.collection("propertyConfigs").doc(propertySlug).set(
      {
        lastSyncedAt: new Date().toISOString(),
      },
      { merge: true }
    );

    return NextResponse.json({
      success: true,
      blockedCount: bookedDates.size,
    });
  } catch (error: any) {
    console.error("HTML parse sync failed", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
