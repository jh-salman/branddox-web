import { NextRequest, NextResponse } from "next/server";

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
    const adminSecret = req.cookies.get("branddox_admin")?.value;
    const headers: Record<string, string> = {};
    if (adminSecret) headers["x-admin-secret"] = adminSecret;
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
    const isJson = contentType.includes("application/json");
    const body = await req.arrayBuffer();
    const headers: Record<string, string> = {};
    if (contentType) headers["Content-Type"] = contentType;
    const adminSecret = req.cookies.get("branddox_admin")?.value;
    if (adminSecret) headers["x-admin-secret"] = adminSecret;
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
