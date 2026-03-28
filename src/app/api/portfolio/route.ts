import path from "path";
import { NextRequest, NextResponse } from "next/server";
import {
  getPortfolioItems,
  savePortfolioItems,
  nextId,
  PORTFOLIO_CATEGORIES,
  type PortfolioItem,
} from "@/lib/portfolio-store";

import { ADMIN_COOKIE_NAME, verifyAdminSessionToken } from "@/lib/admin-session";

async function isAdmin(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  return verifyAdminSessionToken(token);
}

export async function GET() {
  const items = await getPortfolioItems();
  return NextResponse.json(items);
}

export async function POST(request: NextRequest) {
  if (!(await isAdmin(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const contentType = request.headers.get("content-type") || "";
  let body: {
    title: string;
    category: string;
    imageUrl?: string;
    aspectClass: PortfolioItem["aspectClass"];
    width?: number;
    height?: number;
  };
  let imageUrl: string | null = null;

  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    const title = formData.get("title") as string;
    const category = formData.get("category") as string;
    const aspectClass = (formData.get("aspectClass") as PortfolioItem["aspectClass"]) || "square";
    const file = formData.get("image") as File | null;
    const urlInput = formData.get("imageUrl") as string | null;
    const w = formData.get("width");
    const h = formData.get("height");
    const width = w != null && w !== "" ? parseInt(String(w), 10) : undefined;
    const height = h != null && h !== "" ? parseInt(String(h), 10) : undefined;

    if (!title?.trim() || !category?.trim()) {
      return NextResponse.json(
        { error: "title and category are required" },
        { status: 400 }
      );
    }
    if (!PORTFOLIO_CATEGORIES.includes(category as (typeof PORTFOLIO_CATEGORIES)[number])) {
      return NextResponse.json(
        { error: "category must be one of: " + PORTFOLIO_CATEGORIES.join(", ") },
        { status: 400 }
      );
    }

    if (file?.size) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const ext = path.extname(file.name) || ".jpg";
      const filename = `portfolio-${Date.now()}${ext}`;
      const publicDir = path.join(process.cwd(), "public", "portfolio");
      const { mkdir, writeFile } = await import("fs/promises");
      await mkdir(publicDir, { recursive: true });
      await writeFile(path.join(publicDir, filename), buffer);
      imageUrl = `/portfolio/${filename}`;
    } else if (urlInput?.trim()) {
      imageUrl = urlInput.trim();
    } else {
      return NextResponse.json(
        { error: "Provide either image file or imageUrl" },
        { status: 400 }
      );
    }

    body = { title, category, imageUrl, aspectClass, width, height };
  } else {
    const json = await request.json();
    body = json;
    if (!body.title?.trim() || !body.category?.trim()) {
      return NextResponse.json(
        { error: "title and category are required" },
        { status: 400 }
      );
    }
    if (!PORTFOLIO_CATEGORIES.includes(body.category as (typeof PORTFOLIO_CATEGORIES)[number])) {
      return NextResponse.json(
        { error: "category must be one of: " + PORTFOLIO_CATEGORIES.join(", ") },
        { status: 400 }
      );
    }
    imageUrl = body.imageUrl?.trim() || null;
    if (!imageUrl) {
      return NextResponse.json(
        { error: "imageUrl is required when not uploading a file" },
        { status: 400 }
      );
    }
    body.aspectClass = body.aspectClass || "square";
  }

  const items = await getPortfolioItems();
  const newItem: PortfolioItem = {
    id: nextId(items),
    title: body.title.trim(),
    category: body.category.trim(),
    imageUrl: imageUrl!,
    aspectClass: body.aspectClass || "square",
    width: body.width,
    height: body.height,
  };
  items.push(newItem);
  await savePortfolioItems(items);
  return NextResponse.json(newItem);
}
