import { cookies } from "next/headers";
import { createHmac } from "crypto";

const ADMIN_PASSKEY = process.env.ADMIN_PASSKEY || "AeraLivingFTW@2026";
const SESSION_SECRET = process.env.CHATBOT_ADMIN_TOKEN || "aera-living-secret-salt-2026";

// Rate limiting in-memory storage
type RateLimitInfo = {
  attempts: number;
  blockUntil: number;
};
const rateLimitMap = new Map<string, RateLimitInfo>();

const MAX_ATTEMPTS = 5;
const BLOCK_DURATION_MS = 15 * 60 * 1000; // 15 minutes

export function getAdminPasskey(): string {
  return ADMIN_PASSKEY;
}

/**
 * Checks if a given IP is currently rate-limited due to too many failed attempts.
 */
export function isRateLimited(ip: string): { limited: boolean; timeLeftMs: number } {
  const info = rateLimitMap.get(ip);
  if (!info) {
    return { limited: false, timeLeftMs: 0 };
  }

  const now = Date.now();
  if (info.blockUntil > now) {
    return { limited: true, timeLeftMs: info.blockUntil - now };
  }

  // If block duration has expired, clean up the rate limit record
  if (info.blockUntil > 0 && info.blockUntil <= now) {
    rateLimitMap.delete(ip);
  }

  return { limited: false, timeLeftMs: 0 };
}

/**
 * Records a failed attempt for the given IP. Blocks the IP if attempts exceed MAX_ATTEMPTS.
 */
export function recordFailedAttempt(ip: string): number {
  const now = Date.now();
  const info = rateLimitMap.get(ip) || { attempts: 0, blockUntil: 0 };

  info.attempts += 1;
  if (info.attempts >= MAX_ATTEMPTS) {
    info.blockUntil = now + BLOCK_DURATION_MS;
  }

  rateLimitMap.set(ip, info);
  return info.attempts;
}

/**
 * Resets the rate limit counter for a given IP upon a successful login.
 */
export function resetRateLimit(ip: string): void {
  rateLimitMap.delete(ip);
}

/**
 * Generates a dynamic, cryptographically signed session token.
 * Token structure: base64(payload).signature
 */
export function generateSessionToken(expiresAt: number): string {
  const payloadStr = JSON.stringify({ expiresAt });
  const base64Payload = Buffer.from(payloadStr).toString("base64");
  const signature = createHmac("sha256", SESSION_SECRET)
    .update(base64Payload)
    .digest("hex");
  return `${base64Payload}.${signature}`;
}

/**
 * Verifies the validity and expiration of the session token.
 */
export async function verifyAuth(cookieName: string = "admin_session"): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(cookieName)?.value;
    if (!token) return false;

    const parts = token.split(".");
    if (parts.length !== 2) return false;

    const [base64Payload, signature] = parts;

    // Verify cryptographic signature
    const expectedSignature = createHmac("sha256", SESSION_SECRET)
      .update(base64Payload)
      .digest("hex");

    if (signature !== expectedSignature) {
      return false;
    }

    // Verify token expiration
    const payloadStr = Buffer.from(base64Payload, "base64").toString("utf-8");
    const payload = JSON.parse(payloadStr);

    if (!payload.expiresAt || typeof payload.expiresAt !== "number") {
      return false;
    }

    return payload.expiresAt > Date.now();
  } catch (error) {
    console.error("Token verification failed", error);
    return false;
  }
}
