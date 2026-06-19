import { NextResponse } from "next/server";
import { getDb } from "@/lib/firebaseAdmin";
import { listStayDates } from "@/lib/calendarSync";
import { verifyAuth } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    if (!(await verifyAuth())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await request.json().catch(() => ({}));
    const { propertySlug, name, contact, checkIn, checkOut, guests } = body;

    if (!propertySlug || !name || !checkIn || !checkOut) {
      return NextResponse.json({ error: "Missing required booking details" }, { status: 400 });
    }

    const db = getDb();

    // 1. Verify availability (check if requested dates are already blocked)
    const blockedSnap = await db
      .collection("blockedDates")
      .where("propertySlug", "==", propertySlug)
      .get();

    const blockedDatesSet = new Set(blockedSnap.docs.map((doc) => doc.data().date));
    const requestedDates = listStayDates(new Date(checkIn), new Date(checkOut));

    const isOverlap = requestedDates.some((d) => blockedDatesSet.has(d));
    if (isOverlap) {
      return NextResponse.json({ error: "Selected dates overlap with an existing block" }, { status: 400 });
    }

    // 2. Create manual booking document
    const bookingRef = await db.collection("bookings").add({
      propertySlug,
      name,
      contact: contact || "In Person",
      checkIn,
      checkOut,
      guests: guests || 1,
      status: "manual_block",
      source: "in-person",
      createdAt: new Date().toISOString(),
    });

    // 3. Insert blocked dates in batch
    const batch = db.batch();
    for (const dateStr of requestedDates) {
      const docRef = db.collection("blockedDates").doc(`${propertySlug}:manual:${dateStr}`);
      batch.set(docRef, {
        propertySlug,
        date: dateStr,
        type: "manual",
        bookingId: bookingRef.id,
        createdAt: new Date().toISOString(),
      });
    }

    await batch.commit();

    return NextResponse.json({ success: true, bookingId: bookingRef.id });
  } catch (error: any) {
    console.error("Create manual booking failed", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    if (!(await verifyAuth())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { searchParams } = new URL(request.url);
    const bookingId = searchParams.get("bookingId");

    if (!bookingId) {
      return NextResponse.json({ error: "Missing bookingId parameter" }, { status: 400 });
    }

    const db = getDb();

    // Delete booking
    await db.collection("bookings").doc(bookingId).delete();

    // Delete all blocked dates referencing this bookingId
    const blockedSnap = await db
      .collection("blockedDates")
      .where("bookingId", "==", bookingId)
      .get();

    const batch = db.batch();
    for (const doc of blockedSnap.docs) {
      batch.delete(doc.ref);
    }

    await batch.commit();

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Delete manual booking failed", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
