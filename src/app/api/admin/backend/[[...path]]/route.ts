import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_COOKIE_NAME,
  verifyAdminSessionToken,
  getAdminPasswordForProxy,
} from "@/lib/admin-session";

const BACKEND =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  (process.env.VERCEL ? "https://branddox-api.vercel.app" : "http://localhost:4000");

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ path?: string[] }> }
) {
  const { path = [] } = await context.params;
  const slug = path.join("/");
  const url = `${BACKEND.replace(/\/$/, "")}/${slug}`;
  try {
    const session = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
    const headers: Record<string, string> = {};
    if (session && (await verifyAdminSessionToken(session))) {
      const pwd = getAdminPasswordForProxy();
      if (pwd) headers["x-admin-secret"] = pwd;
    }
    const cookie = req.headers.get("cookie");
    if (cookie) headers["cookie"] = cookie;
    const res = await fetch(url, { cache: "no-store", headers });
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Proxy request failed" },
      { status: 502 }
    );
  }
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ path?: string[] }> }
) {
  return proxy("POST", req, context);
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ path?: string[] }> }
) {
  return proxy("PATCH", req, context);
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ path?: string[] }> }
) {
  return proxy("PUT", req, context);
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ path?: string[] }> }
) {
  return proxy("DELETE", req, context);
}

async function proxy(
  method: string,
  req: NextRequest,
  context: { params: Promise<{ path?: string[] }> }
) {
  const { path = [] } = await context.params;
  const slug = path.join("/");
  const url = `${BACKEND.replace(/\/$/, "")}/${slug}`;
  try {
    const contentType = req.headers.get("content-type") || "";
    const body = await req.arrayBuffer();
    const headers: Record<string, string> = {};
    if (contentType) headers["Content-Type"] = contentType;
    const session = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
    if (session && (await verifyAdminSessionToken(session))) {
      const pwd = getAdminPasswordForProxy();
      if (pwd) headers["x-admin-secret"] = pwd;
    }
    const cookie = req.headers.get("cookie");
    if (cookie) headers["cookie"] = cookie;
    const res = await fetch(url, {
      method,
      headers,
      body: body.byteLength ? body : undefined,
    });
    if (res.status === 204) return new NextResponse(null, { status: 204 });
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Proxy request failed" },
      { status: 502 }
    );
  }
}
