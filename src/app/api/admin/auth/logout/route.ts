import { NextRequest, NextResponse } from "next/server";

const BACKEND =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  (process.env.VERCEL ? "https://branddox-api.vercel.app" : "http://localhost:4000");

export async function POST(request: NextRequest) {
  try {
    const headers: Record<string, string> = {};
    const cookie = request.headers.get("cookie");
    if (cookie) headers["cookie"] = cookie;

    const res = await fetch(`${BACKEND.replace(/\/$/, "")}/api/auth/sign-out`, {
      method: "POST",
      headers,
    });

    const data = await res.json().catch(() => ({ ok: true }));
    const out = NextResponse.json(data, { status: res.status });
    const setCookie = res.headers.get("set-cookie");
    if (setCookie) out.headers.set("set-cookie", setCookie);
    return out;
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Logout failed" },
      { status: 502 }
    );
  }
}

