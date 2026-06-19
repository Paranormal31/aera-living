import { cookies } from "next/headers";
import { createHmac } from "crypto";

const ADMIN_PASSKEY = process.env.ADMIN_PASSKEY || "AeraLivingFTW@2026";
const SESSION_SECRET = process.env.CHATBOT_ADMIN_TOKEN || "aera-living-secret-salt-2026";

export function generateSessionToken(): string {
  return createHmac("sha256", SESSION_SECRET).update(ADMIN_PASSKEY).digest("hex");
}

export async function verifyAuth(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;
  if (!token) return false;
  const expectedToken = generateSessionToken();
  return token === expectedToken;
}
