import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_COOKIE_NAME,
  createAdminSessionToken,
  getJwtSecret,
} from "@/lib/admin-session";

export async function POST(request: NextRequest) {
  if (!getJwtSecret()) {
    return NextResponse.json(
      { error: "Admin not configured. Set ADMIN_PASSWORD in .env.local" },
      { status: 503 }
    );
  }

  const secret = process.env.ADMIN_PASSWORD || process.env.ADMIN_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "Admin not configured. Set ADMIN_PASSWORD in .env.local" },
      { status: 503 }
    );
  }

  const body = await request.json().catch(() => ({}));
  const password = body.password as string | undefined;
  if (password !== secret) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  let token: string;
  try {
    token = await createAdminSessionToken();
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Session error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
  return res;
}
