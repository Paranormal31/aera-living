import { NextResponse } from "next/server";
import { processBookingIntent, type BookingIntentInput } from "@/lib/bookingIntent";

function getClientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }
  return request.headers.get("x-real-ip") || "unknown";
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as BookingIntentInput;

  const result = await processBookingIntent({
    ...body,
    source: body.source || "api",
    ip: getClientIp(request),
    userAgent: request.headers.get("user-agent") ?? body.userAgent,
  });

  if (!result.ok) {
    const status = result.code === "server_error" ? 500 : 400;
    return NextResponse.json(result, { status });
  }

  return NextResponse.json(result, { status: 201 });
}
