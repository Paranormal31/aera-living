import { NextResponse } from "next/server";
import { getDb } from "@/lib/firebaseAdmin";
import { syncPropertyCalendar } from "@/lib/calendarSync";
import { verifyAuth } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    if (!(await verifyAuth())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await request.json().catch(() => ({}));
    const { propertySlug, airbnbCalendarUrl } = body;

    const db = getDb();

    // Case 1: Specific property and url provided directly
    if (propertySlug && airbnbCalendarUrl) {
      const result = await syncPropertyCalendar(propertySlug, airbnbCalendarUrl);
      return NextResponse.json({ propertySlug, ...result });
    }

    // Case 2: Specific property slug provided, fetch URL from Firestore
    if (propertySlug) {
      const doc = await db.collection("propertyConfigs").doc(propertySlug).get();
      if (!doc.exists) {
        return NextResponse.json(
          { error: `No configuration found for property: ${propertySlug}` },
          { status: 400 }
        );
      }
      const data = doc.data();
      if (!data?.airbnbCalendarUrl) {
        return NextResponse.json(
          { error: `No Airbnb calendar URL configured for property: ${propertySlug}` },
          { status: 400 }
        );
      }
      const result = await syncPropertyCalendar(propertySlug, data.airbnbCalendarUrl);
      return NextResponse.json({ propertySlug, ...result });
    }

    // Case 3: Sync all properties configured in Firestore
    const configsSnap = await db.collection("propertyConfigs").get();
    const results: Record<string, any> = {};

    for (const doc of configsSnap.docs) {
      const data = doc.data();
      const slug = doc.id;
      if (data?.airbnbCalendarUrl) {
        try {
          const syncRes = await syncPropertyCalendar(slug, data.airbnbCalendarUrl);
          results[slug] = { ...syncRes };
        } catch (err: any) {
          results[slug] = { success: false, error: err.message };
        }
      }
    }

    return NextResponse.json({ success: true, results });
  } catch (error: any) {
    console.error("Calendar sync API failed", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

// Support GET for testing/cron triggers
export async function GET() {
  // Sync all properties configured in Firestore
  try {
    if (!(await verifyAuth())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const db = getDb();
    const configsSnap = await db.collection("propertyConfigs").get();
    const results: Record<string, any> = {};

    for (const doc of configsSnap.docs) {
      const data = doc.data();
      const slug = doc.id;
      if (data?.airbnbCalendarUrl) {
        try {
          const syncRes = await syncPropertyCalendar(slug, data.airbnbCalendarUrl);
          results[slug] = { ...syncRes };
        } catch (err: any) {
          results[slug] = { success: false, error: err.message };
        }
      }
    }
    return NextResponse.json({ success: true, results });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
