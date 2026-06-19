import { NextResponse } from "next/server";
import { getDb } from "@/lib/firebaseAdmin";
import { verifyAuth } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    if (!(await verifyAuth())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const propertySlug = searchParams.get("propertySlug");

    if (!propertySlug) {
      return NextResponse.json({ error: "Missing propertySlug parameter" }, { status: 400 });
    }

    const db = getDb();

    // 1. Fetch blocked dates
    const blockedSnap = await db
      .collection("blockedDates")
      .where("propertySlug", "==", propertySlug)
      .get();
    
    const blockedDates = blockedSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // 2. Fetch active bookings (manual blocks and confirmed website bookings)
    const bookingsSnap = await db
      .collection("bookings")
      .where("propertySlug", "==", propertySlug)
      .get();

    const bookings: Record<string, any> = {};
    bookingsSnap.docs.forEach((doc) => {
      const data = doc.data();
      if (data.status === "confirmed" || data.status === "manual_block") {
        bookings[doc.id] = {
          id: doc.id,
          ...data,
        };
      }
    });

    // 3. Fetch property config
    const configDoc = await db.collection("propertyConfigs").doc(propertySlug).get();
    const config = configDoc.exists ? configDoc.data() : null;

    return NextResponse.json({
      success: true,
      blockedDates,
      bookings,
      config,
    });
  } catch (error: any) {
    console.error("Fetch admin blocked dates failed", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
