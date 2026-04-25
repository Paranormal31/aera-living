type BookingSheetPayload = {
  inquiryId: string;
  source: "chatbot" | "widget" | "api";
  name: string;
  contact: string;
  checkIn: string;
  checkOut: string;
  guests: number;
};

const BOOKING_SHEET_WEBHOOK_URL = process.env.BOOKING_GSHEET_WEBHOOK_URL;
const BOOKING_WEBHOOK_SECRET = process.env.BOOKING_WEBHOOK_SECRET;

export async function logBookingInquiryToSheet(input: BookingSheetPayload) {
  if (!BOOKING_SHEET_WEBHOOK_URL) {
    return { sent: false as const, reason: "missing_env" as const };
  }

  await fetch(BOOKING_SHEET_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      secret: BOOKING_WEBHOOK_SECRET || "",
      timestamp: new Date().toISOString(),
      inquiryId: input.inquiryId,
      source: input.source,
      name: input.name,
      contact: input.contact,
      checkIn: input.checkIn,
      checkOut: input.checkOut,
      guests: input.guests,
    }),
  });

  return { sent: true as const };
}
