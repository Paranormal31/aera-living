import { NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const cookieName = type === "expenses" ? "expenses_session" : "admin_session";
  const authenticated = await verifyAuth(cookieName);
  return NextResponse.json({ authenticated });
}
