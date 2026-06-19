import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { generateSessionToken } from "@/lib/auth";

const ADMIN_PASSKEY = process.env.ADMIN_PASSKEY || "AeraLivingFTW@2026";

export async function POST(request: Request) {
  try {
    const { passkey } = await request.json();
    if (passkey === ADMIN_PASSKEY) {
      const token = generateSessionToken();
      const cookieStore = await cookies();
      cookieStore.set("admin_session", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ success: false, error: "Invalid passkey" }, { status: 401 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Bad Request" }, { status: 400 });
  }
}
