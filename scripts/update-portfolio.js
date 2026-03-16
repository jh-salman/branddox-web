#!/usr/bin/env node
/**
 * Reads src/data/portfolio.json (from fetch-fiverr or console extract) and updates src/data/portfolio.ts.
 * Usage: npm run update-portfolio
 */

const fs = require("fs");
const path = require("path");

const jsonPath = path.join(__dirname, "..", "src", "data", "portfolio.json");
const tsPath = path.join(__dirname, "..", "src", "data", "portfolio.ts");

if (!fs.existsSync(jsonPath)) {
  console.log("No src/data/portfolio.json found. Run fetch-fiverr or paste JSON from the console script first.");
  process.exit(1);
}

const items = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
if (!Array.isArray(items) || items.length === 0) {
  console.log("portfolio.json is empty. Add items from Fiverr first (fetch-fiverr or console script).");
  process.exit(1);
}

function tsEntry(item) {
  return `  {
    id: "${item.id}",
    title: ${JSON.stringify(item.title)},
    category: ${JSON.stringify(item.category)},
    imageUrl: ${JSON.stringify(item.imageUrl)},
    aspectClass: "${item.aspectClass}",
  }`;
}

const ts = `/**
 * Portfolio items for the gallery.
 *
 * To use your Fiverr portfolio:
 * 1. Open https://www.fiverr.com/s/7Y9XdzL and go to your Portfolio (or Gigs → each gig has gallery images).
 * 2. Right‑click each image → "Copy image address" (or open image in new tab and copy URL).
 * 3. Add entries below: id, title, category, imageUrl, aspectClass.
 * aspectClass: "tall" | "square" | "wide" | "xtall" (controls card proportion in the masonry grid).
 *
 * Or run: npm run fetch-fiverr (after logging in once), then npm run update-portfolio.
 */

export type PortfolioItem = {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  aspectClass: "tall" | "square" | "wide" | "xtall";
};

export const portfolioItems: PortfolioItem[] = [
${items.map(tsEntry).join(",\n")}
];
`;

fs.writeFileSync(tsPath, ts, "utf8");
console.log("Updated src/data/portfolio.ts with", items.length, "items.");
