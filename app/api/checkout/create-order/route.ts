import { NextResponse } from "next/server";
import { getDb } from "@/lib/firebaseAdmin";
import { PROPERTY_DATA } from "@/lib/siteContent";
import { listStayDates } from "@/lib/calendarSync";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { propertySlug, checkIn, checkOut, guests, name, contact } = body;

    if (!propertySlug || !checkIn || !checkOut || !name || !contact) {
      return NextResponse.json({ error: "Missing required booking details" }, { status: 400 });
    }

    const property = PROPERTY_DATA[propertySlug];
    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 });
    }

    const db = getDb();

    // 1. Verify availability in Firestore
    const blockedSnap = await db
      .collection("blockedDates")
      .where("propertySlug", "==", propertySlug)
      .get();

    const blockedDatesSet = new Set(blockedSnap.docs.map((doc) => doc.data().date));
    const requestedDates = listStayDates(new Date(checkIn), new Date(checkOut));

    const isOverlap = requestedDates.some((d) => blockedDatesSet.has(d));
    if (isOverlap) {
      return NextResponse.json({ error: "Selected dates are no longer available" }, { status: 400 });
    }

    // 2. Calculate Pricing
    const nights = requestedDates.length;
    const finalPrice = property.price * nights;

    // 3. Create a pending booking in Firestore
    const bookingRef = await db.collection("bookings").add({
      propertySlug,
      propertyName: property.name,
      checkIn,
      checkOut,
      guests: guests || 1,
      name,
      contact,
      status: "pending",
      source: "direct_website",
      amountPaid: finalPrice,
      createdAt: new Date().toISOString(),
    });

    // 4. Create Payment Order (e.g. Razorpay or Mock Checkout)
    // If Razorpay credentials exist, we would generate a real order here.
    // Otherwise, we provide mock payment details for testing and staging.
    const keyId = process.env.RAZORPAY_KEY_ID || "rzp_test_mockkeyid123";
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    let orderId = `order_mock_${Math.random().toString(36).substring(2, 9)}`;

    if (keySecret && keyId !== "rzp_test_mockkeyid123") {
      try {
        // Dynamic load razorpay if keys are present
        const Razorpay = require("razorpay");
        const rzp = new Razorpay({ key_id: keyId, key_secret: keySecret });
        const order = await rzp.orders.create({
          amount: finalPrice * 100, // paise
          currency: "INR",
          receipt: bookingRef.id,
        });
        orderId = order.id;
      } catch (err) {
        console.error("Razorpay order creation failed, falling back to mock", err);
      }
    }

    // Save order ID to the pending booking
    await bookingRef.update({ paymentOrderId: orderId });

    return NextResponse.json({
      success: true,
      bookingId: bookingRef.id,
      orderId,
      amount: finalPrice,
      currency: "INR",
      keyId,
      propertyName: property.name,
    });
  } catch (error: any) {
    console.error("Create order failed", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
