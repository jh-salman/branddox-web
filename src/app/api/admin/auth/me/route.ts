import { NextRequest, NextResponse } from "next/server";

const BACKEND =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  (process.env.VERCEL ? "https://branddox-api.vercel.app" : "http://localhost:4000");

export async function GET(request: NextRequest) {
  try {
    const headers: Record<string, string> = {};
    const cookie = request.headers.get("cookie");
    if (cookie) headers["cookie"] = cookie;

    const res = await fetch(`${BACKEND.replace(/\/$/, "")}/auth/me`, {
      method: "GET",
      headers,
      cache: "no-store",
    });

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "Session check failed" },
      { status: 502 }
    );
  }
}

