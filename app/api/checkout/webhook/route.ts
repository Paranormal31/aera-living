import { NextResponse } from "next/server";
import { getDb } from "@/lib/firebaseAdmin";
import { listStayDates } from "@/lib/calendarSync";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId, isMock } = body;

    const db = getDb();

    // Fetch the booking document
    const bookingRef = db.collection("bookings").doc(bookingId);
    const bookingSnap = await bookingRef.get();

    if (!bookingSnap.exists) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const bookingData = bookingSnap.data()!;

    // 1. Signature Verification
    if (isMock || razorpay_order_id?.startsWith("order_mock_")) {
      // Mock validation
      console.log("Mock checkout confirmed for booking:", bookingId);
    } else {
      const keySecret = process.env.RAZORPAY_KEY_SECRET;
      if (keySecret) {
        const expectedSignature = crypto
          .createHmac("sha256", keySecret)
          .update(razorpay_order_id + "|" + razorpay_payment_id)
          .digest("hex");

        if (expectedSignature !== razorpay_signature) {
          return NextResponse.json({ error: "Invalid payment signature verification failed" }, { status: 400 });
        }
      }
    }

    // 2. Mark booking as confirmed
    await bookingRef.update({
      status: "confirmed",
      razorpayPaymentId: razorpay_payment_id || "mock_payment",
      confirmedAt: new Date().toISOString(),
    });

    // 3. Insert blocked dates in blockedDates collection
    const requestedDates = listStayDates(new Date(bookingData.checkIn), new Date(bookingData.checkOut));
    const batch = db.batch();

    for (const dateStr of requestedDates) {
      const docRef = db.collection("blockedDates").doc(`${bookingData.propertySlug}:direct_website:${dateStr}`);
      batch.set(docRef, {
        propertySlug: bookingData.propertySlug,
        date: dateStr,
        type: "direct_website",
        bookingId: bookingId,
        createdAt: new Date().toISOString(),
      });
    }

    await batch.commit();

    return NextResponse.json({ success: true, bookingId });
  } catch (error: any) {
    console.error("Payment confirmation failed", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
