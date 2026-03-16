import { NextRequest, NextResponse } from "next/server";

const ADMIN_COOKIE = "branddox_admin";

export async function GET(request: NextRequest) {
  const secret = process.env.ADMIN_PASSWORD || process.env.ADMIN_SECRET;
  const token = request.cookies.get(ADMIN_COOKIE)?.value;
  const ok = !!secret && token === secret;
  return NextResponse.json({ ok });
}
