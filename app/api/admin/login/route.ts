import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { 
  getAdminPasskey, 
  isRateLimited, 
  recordFailedAttempt, 
  resetRateLimit, 
  generateSessionToken 
} from "@/lib/auth";

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || 
             request.headers.get("x-real-ip") || 
             "127.0.0.1";

  try {
    // 1. Check Rate Limit
    const { limited, timeLeftMs } = isRateLimited(ip);
    if (limited) {
      const minutesLeft = Math.ceil(timeLeftMs / 60000);
      return NextResponse.json(
        { success: false, error: `Too many failed attempts. Please try again in ${minutesLeft} minute(s).` },
        { status: 429 }
      );
    }

    const { passkey, type } = await request.json();
    const isExpenses = type === "expenses";
    const adminPasskey = isExpenses
      ? (process.env.EXPENSES_PASSKEY || "AeraLivingExpenses@2026")
      : getAdminPasskey();
    const cookieName = isExpenses ? "expenses_session" : "admin_session";

    // 2. Validate Password
    if (passkey === adminPasskey) {
      // Reset rate limits on success
      resetRateLimit(ip);

      // Create an expirable session token valid for 7 days
      const maxAge = 60 * 60 * 24 * 7; // 7 days in seconds
      const expiresAt = Date.now() + maxAge * 1000;
      const token = generateSessionToken(expiresAt);

      const cookieStore = await cookies();
      cookieStore.set(cookieName, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: maxAge,
      });

      return NextResponse.json({ success: true });
    }

    // 3. Record Failure
    recordFailedAttempt(ip);
    return NextResponse.json({ success: false, error: "Invalid passkey. Please try again." }, { status: 401 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Bad Request" }, { status: 400 });
  }
}
