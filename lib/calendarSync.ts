import { getDb } from "@/lib/firebaseAdmin";

export function parseICal(icalText: string): { start: Date; end: Date }[] {
  const events: { start: Date; end: Date }[] = [];
  const eventRegex = /BEGIN:VEVENT[\s\S]*?END:VEVENT/g;
  let match;
  while ((match = eventRegex.exec(icalText)) !== null) {
    const eventText = match[0];
    const dtstartMatch = eventText.match(/DTSTART(?:;[^:]*)?:(\d{8})(?:T(\d{6})Z?)?/);
    const dtendMatch = eventText.match(/DTEND(?:;[^:]*)?:(\d{8})(?:T(\d{6})Z?)?/);
    if (dtstartMatch && dtendMatch) {
      const startStr = dtstartMatch[1];
      const endStr = dtendMatch[1];
      
      const start = new Date(
        Date.UTC(
          parseInt(startStr.slice(0, 4)),
          parseInt(startStr.slice(4, 6)) - 1,
          parseInt(startStr.slice(6, 8))
        )
      );
      const end = new Date(
        Date.UTC(
          parseInt(endStr.slice(0, 4)),
          parseInt(endStr.slice(4, 6)) - 1,
          parseInt(endStr.slice(6, 8))
        )
      );
      
      events.push({ start, end });
    }
  }
  return events;
}

export function listStayDates(checkIn: Date, checkOut: Date): string[] {
  const dates: string[] = [];
  const cursor = new Date(checkIn);
  while (cursor < checkOut) {
    dates.push(cursor.toISOString().slice(0, 10));
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return dates;
}

// Recursively walks a JSON tree to extract dates marked as unavailable/booked
function findBookedDatesInObject(obj: any, dates: Set<string>) {
  if (!obj || typeof obj !== "object") return;

  // Airbnb date state schema matching
  // Matches both: { date: "YYYY-MM-DD", available: false } and { date: "YYYY-MM-DD", isAvailable: false }
  // Matches niobe schema: { calendarDay: { date: "YYYY-MM-DD", available: false } }
  if (obj.date && (obj.available === false || obj.isAvailable === false || obj.booked === true)) {
    if (typeof obj.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(obj.date)) {
      dates.add(obj.date);
    }
  }

  // Support alternate niobe structures: { date: "YYYY-MM-DD", bookable: false }
  if (obj.date && obj.bookable === false) {
    if (typeof obj.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(obj.date)) {
      dates.add(obj.date);
    }
  }

  // Handle nested array values or sub-objects
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const val = obj[key];
      if (typeof val === "object" && val !== null) {
        findBookedDatesInObject(val, dates);
      } else if (typeof val === "string" && val.startsWith("{")) {
        // Attempt to parse stringified JSON variables inside Niobe state strings
        try {
          const parsed = JSON.parse(val);
          findBookedDatesInObject(parsed, dates);
        } catch (e) {
          // ignore
        }
      }
    }
  }
}

export async function scrapeAirbnbListingPage(airbnbUrl: string): Promise<Set<string>> {
  const bookedDates = new Set<string>();

  // 1. Extract Listing ID from URL (e.g. rooms/1348558040063059763)
  const urlMatch = airbnbUrl.match(/\/rooms\/(\d+)/);
  let listingId = urlMatch ? urlMatch[1] : null;

  let airbnbApiKey = "d306zoyjsyarp7ifhu67rjxn52tv0t20"; // default fallback key

  // 2. Fetch listing page HTML to find the API key if needed
  let html = "";
  try {
    const scraperApiKey = process.env.SCRAPER_API_KEY;
    let targetUrl = airbnbUrl;
    let requestHeaders: Record<string, string> = {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Accept-Language": "en-US,en;q=0.9",
    };

    if (scraperApiKey) {
      targetUrl = `http://api.scraperapi.com/?api_key=${scraperApiKey}&url=${encodeURIComponent(airbnbUrl)}`;
      requestHeaders = {};
    }

    const response = await fetch(targetUrl, {
      headers: requestHeaders,
      next: { revalidate: 0 },
    });

    if (response.ok) {
      html = await response.text();
      // Extract API key from HTML
      const keyMatch = html.match(/"key"\s*:\s*"([a-zA-Z0-9_-]{32})"/);
      if (keyMatch) {
        airbnbApiKey = keyMatch[1];
      }
      if (!listingId) {
        const idMatch = html.match(/"listingId"\s*:\s*"(\d+)"/);
        if (idMatch) {
          listingId = idMatch[1];
        }
      }
    }
  } catch (e) {
    console.error("Failed to fetch Airbnb HTML page for API key extraction, using fallback:", e);
  }

  if (!listingId) {
    throw new Error(`Could not extract listing ID from URL: ${airbnbUrl}`);
  }

  // 3. Query the PdpAvailabilityCalendar GraphQL API
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  const variables = {
    request: {
      count: 12,
      listingId: listingId,
      month: month,
      year: year,
      returnPropertyLevelCalendarIfApplicable: false
    }
  };

  const extensions = {
    persistedQuery: {
      version: 1,
      sha256Hash: "aa50718a18caa3f9685dbcac86fa9501eaad29d942ddb49b5a63467706d0d799"
    }
  };

  const gqlUrl = `https://www.airbnb.co.in/api/v3/PdpAvailabilityCalendar/aa50718a18caa3f9685dbcac86fa9501eaad29d942ddb49b5a63467706d0d799?operationName=PdpAvailabilityCalendar&locale=en-IN&currency=INR&variables=${encodeURIComponent(JSON.stringify(variables))}&extensions=${encodeURIComponent(JSON.stringify(extensions))}`;

  // Try direct fetch first
  let success = false;
  try {
    console.log(`Fetching calendar directly for listing ${listingId}...`);
    const res = await fetch(gqlUrl, {
      headers: {
        'x-airbnb-api-key': airbnbApiKey,
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      next: { revalidate: 0 }
    });

    if (res.ok) {
      const json = await res.json() as any;
      const months = json.data?.merlin?.pdpAvailabilityCalendar?.calendarMonths;
      if (months && Array.isArray(months)) {
        const todayStr = new Date().toISOString().slice(0, 10);
        months.forEach((m: any) => {
          if (m.days && Array.isArray(m.days)) {
            m.days.forEach((d: any) => {
              if (d.calendarDate && !d.available && d.bookable === false && d.calendarDate >= todayStr) {
                bookedDates.add(d.calendarDate);
              }
            });
          }
        });
        success = true;
        console.log(`Successfully fetched ${bookedDates.size} blocked dates directly.`);
      }
    } else {
      console.warn(`Direct calendar fetch returned status: ${res.status}`);
    }
  } catch (err) {
    console.error("Direct calendar fetch failed:", err);
  }

  // Fallback to ScraperAPI if direct fetch failed and scraper key is present
  if (!success) {
    const scraperApiKey = process.env.SCRAPER_API_KEY;
    if (scraperApiKey) {
      try {
        console.log(`Attempting calendar fetch via ScraperAPI for listing ${listingId}...`);
        const proxyUrl = `http://api.scraperapi.com/?api_key=${scraperApiKey}&url=${encodeURIComponent(gqlUrl)}`;
        const res = await fetch(proxyUrl, {
          headers: {
            'x-airbnb-api-key': airbnbApiKey,
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
          },
          next: { revalidate: 0 }
        });

        if (res.ok) {
          const json = await res.json() as any;
          const months = json.data?.merlin?.pdpAvailabilityCalendar?.calendarMonths;
          if (months && Array.isArray(months)) {
            const todayStr = new Date().toISOString().slice(0, 10);
            months.forEach((m: any) => {
              if (m.days && Array.isArray(m.days)) {
                m.days.forEach((d: any) => {
                  if (d.calendarDate && !d.available && d.bookable === false && d.calendarDate >= todayStr) {
                    bookedDates.add(d.calendarDate);
                  }
                });
              }
            });
            console.log(`Successfully fetched ${bookedDates.size} blocked dates via ScraperAPI.`);
          }
        } else {
          console.warn(`ScraperAPI calendar fetch returned status: ${res.status}`);
        }
      } catch (proxyErr) {
        console.error("ScraperAPI calendar fetch failed:", proxyErr);
      }
    }
  }

  return bookedDates;
}

export async function syncPropertyCalendar(propertySlug: string, airbnbCalendarUrl: string) {
  const isPublicUrl = airbnbCalendarUrl.includes("/rooms/") || /^\d+$/.test(airbnbCalendarUrl);
  let cleanUrl = airbnbCalendarUrl.trim();
  
  if (/^\d+$/.test(cleanUrl)) {
    cleanUrl = `https://www.airbnb.com/rooms/${cleanUrl}`;
  }

  const db = getDb();
  const allBlockedDates = new Set<string>();

  if (isPublicUrl) {
    console.log(`Scraping public Airbnb page for: ${propertySlug} using ${cleanUrl}`);
    const scrapedDates = await scrapeAirbnbListingPage(cleanUrl);
    for (const d of scrapedDates) {
      allBlockedDates.add(d);
    }
  } else {
    const response = await fetch(cleanUrl, {
      headers: {
        "User-Agent": "AeraLiving-CalendarSync/1.0",
      },
      next: { revalidate: 0 },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch iCal feed: ${response.status} ${response.statusText}`);
    }

    const text = await response.text();
    const events = parseICal(text);
    for (const event of events) {
      const dates = listStayDates(event.start, event.end);
      for (const d of dates) {
        allBlockedDates.add(d);
      }
    }
  }

  // Delete all existing airbnb blocked dates for this property
  const batch = db.batch();
  const existingQuery = await db
    .collection("blockedDates")
    .where("propertySlug", "==", propertySlug)
    .where("type", "==", "airbnb")
    .get();

  for (const doc of existingQuery.docs) {
    batch.delete(doc.ref);
  }

  // Add new airbnb blocked dates
  for (const dateStr of allBlockedDates) {
    const docRef = db.collection("blockedDates").doc(`${propertySlug}:airbnb:${dateStr}`);
    batch.set(docRef, {
      propertySlug,
      date: dateStr,
      type: "airbnb",
      syncedAt: new Date().toISOString(),
    });
  }

  await batch.commit();

  // Update config in Firestore
  await db.collection("propertyConfigs").doc(propertySlug).set(
    {
      lastSyncedAt: new Date().toISOString(),
      airbnbCalendarUrl: cleanUrl,
    },
    { merge: true }
  );

  return {
    success: true,
    blockedCount: allBlockedDates.size,
  };
}
