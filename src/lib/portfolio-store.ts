import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";
import type { PortfolioItem } from "./portfolio-types";

export type { PortfolioItem } from "./portfolio-types";
export { PORTFOLIO_CATEGORIES } from "./portfolio-types";

/** Map old category names to the 4 allowed ones. */
export function normalizeCategory(cat: string): string {
  const map: Record<string, string> = {
    Graphics: "Art/Banner",
    Branding: "Logo",
    Canva: "Brand Kit",
  };
  return map[cat] ?? cat;
}

const DATA_DIR = path.join(process.cwd(), "data");
const FILE_PATH = path.join(DATA_DIR, "portfolio.json");

export async function getPortfolioItems(): Promise<PortfolioItem[]> {
  try {
    const raw = await readFile(FILE_PATH, "utf-8");
    const data = JSON.parse(raw) as PortfolioItem[];
    if (!Array.isArray(data)) return [];
    return data.map((item) => ({
      ...item,
      category: normalizeCategory(item.category),
    }));
  } catch {
    return [];
  }
}

export async function savePortfolioItems(items: PortfolioItem[]): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(FILE_PATH, JSON.stringify(items, null, 2), "utf-8");
}

export function nextId(items: PortfolioItem[]): string {
  const nums = items.map((i) => parseInt(i.id, 10)).filter((n) => !Number.isNaN(n));
  const max = nums.length ? Math.max(...nums) : 0;
  return String(max + 1);
}
