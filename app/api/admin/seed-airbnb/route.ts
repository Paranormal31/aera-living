import { NextResponse } from "next/server";
import { getDb } from "@/lib/firebaseAdmin";
import { syncPropertyCalendar } from "@/lib/calendarSync";
import { verifyAuth } from "@/lib/auth";

export async function GET() {
  try {
    if (!(await verifyAuth())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const db = getDb();

    const properties = [
      {
        slug: "doons-den",
        url: "https://www.airbnb.co.in/rooms/1348558040063059763",
      },
      {
        slug: "retro-den",
        url: "https://www.airbnb.co.in/rooms/1602663606542685170",
      },
      {
        slug: "terra-house",
        url: "https://www.airbnb.co.in/rooms/1671101506953932809",
      },
    ];

    const results: Record<string, any> = {};

    for (const prop of properties) {
      // 1. Write config to Firestore
      await db.collection("propertyConfigs").doc(prop.slug).set(
        {
          airbnbCalendarUrl: prop.url,
          lastSyncedAt: new Date().toISOString(),
        },
        { merge: true }
      );

      // 2. Trigger sync
      try {
        const syncResult = await syncPropertyCalendar(prop.slug, prop.url);
        results[prop.slug] = { ...syncResult };
      } catch (err: any) {
        results[prop.slug] = { success: false, error: err.message };
      }
    }

    return NextResponse.json({ success: true, seeded: true, results });
  } catch (error: any) {
    console.error("Seeding Airbnb URLs failed", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
