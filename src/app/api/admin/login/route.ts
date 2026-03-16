import { NextRequest, NextResponse } from "next/server";

const ADMIN_COOKIE = "branddox_admin";

export async function POST(request: NextRequest) {
  const secret = process.env.ADMIN_PASSWORD || process.env.ADMIN_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "Admin not configured. Set ADMIN_PASSWORD in .env" },
      { status: 503 }
    );
  }
  const body = await request.json().catch(() => ({}));
  const password = body.password as string | undefined;
  if (password !== secret) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, secret, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    sameSite: "lax",
  });
  return res;
}
