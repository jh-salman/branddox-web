import { SignJWT, jwtVerify } from "jose";

/** HttpOnly cookie name for admin session (JWT, not the raw password). */
export const ADMIN_COOKIE_NAME = "branddox_admin";

export function getJwtSecret(): Uint8Array | null {
  const raw =
    process.env.ADMIN_SESSION_SECRET ||
    process.env.ADMIN_PASSWORD ||
    process.env.ADMIN_SECRET ||
    "";
  if (!raw.trim()) return null;
  return new TextEncoder().encode(raw);
}

/** Backend `requireAdmin` expects this value in `x-admin-secret`. */
export function getAdminPasswordForProxy(): string {
  return process.env.ADMIN_PASSWORD || process.env.ADMIN_SECRET || "";
}

export async function createAdminSessionToken(): Promise<string> {
  const key = getJwtSecret();
  if (!key) {
    throw new Error("Admin auth not configured (set ADMIN_PASSWORD or ADMIN_SESSION_SECRET)");
  }
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject("admin")
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(key);
}

export async function verifyAdminSessionToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const key = getJwtSecret();
  if (!key) return false;
  try {
    await jwtVerify(token, key);
    return true;
  } catch {
    return false;
  }
}
