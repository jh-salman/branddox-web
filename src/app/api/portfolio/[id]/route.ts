import { NextRequest, NextResponse } from "next/server";
import {
  getPortfolioItems,
  savePortfolioItems,
  PORTFOLIO_CATEGORIES,
  type PortfolioItem,
} from "@/lib/portfolio-store";

const ADMIN_COOKIE = "branddox_admin";

function isAdmin(request: NextRequest): boolean {
  const token = request.cookies.get(ADMIN_COOKIE)?.value;
  const secret = process.env.ADMIN_PASSWORD || process.env.ADMIN_SECRET;
  return !!secret && token === secret;
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const items = await getPortfolioItems();
  const item = items.find((i) => i.id === id);
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(item);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const body = (await request.json()) as Partial<PortfolioItem>;
  const items = await getPortfolioItems();
  const index = items.findIndex((i) => i.id === id);
  if (index === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (body.category != null && !PORTFOLIO_CATEGORIES.includes(body.category as (typeof PORTFOLIO_CATEGORIES)[number])) {
    return NextResponse.json(
      { error: "category must be one of: " + PORTFOLIO_CATEGORIES.join(", ") },
      { status: 400 }
    );
  }

  items[index] = {
    ...items[index],
    ...body,
    id: items[index].id,
  };
  if (body.title != null) items[index].title = String(body.title).trim();
  if (body.category != null) items[index].category = String(body.category).trim();
  if (body.imageUrl != null) items[index].imageUrl = String(body.imageUrl).trim();
  if (body.aspectClass != null) items[index].aspectClass = body.aspectClass;
  if (body.width !== undefined) items[index].width = body.width;
  if (body.height !== undefined) items[index].height = body.height;

  await savePortfolioItems(items);
  return NextResponse.json(items[index]);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const items = await getPortfolioItems();
  const filtered = items.filter((i) => i.id !== id);
  if (filtered.length === items.length) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  await savePortfolioItems(filtered);
  return NextResponse.json({ ok: true });
}
