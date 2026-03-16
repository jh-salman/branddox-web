#!/usr/bin/env node
/**
 * Fetches portfolio data from your Fiverr profile using Playwright.
 * First run: browser opens → log in on Fiverr → script saves auth and exits. Second run: fetches portfolio.
 *
 * Usage:
 *   npx playwright install chromium   # one-time
 *   node scripts/fetch-fiverr-portfolio.js
 *
 * Or: npm run fetch-fiverr
 */

const fs = require("fs");
const path = require("path");

const FIVERR_PROFILE = "https://www.fiverr.com/s/7Y9XdzL";
const STORAGE_FILE = path.join(__dirname, "..", ".fiverr-auth.json");

async function main() {
  let playwright;
  try {
    playwright = await import("playwright");
  } catch {
    console.log("Install Playwright first: npx playwright install chromium");
    process.exit(1);
  }

  const { chromium } = playwright;
  const browser = await chromium.launch({ headless: false });
  const loadStorage = fs.existsSync(STORAGE_FILE) ? STORAGE_FILE : undefined;
  const context = await browser.newContext(loadStorage ? { storageState: loadStorage } : {});

  const page = await context.newPage();
  await page.goto(FIVERR_PROFILE, { waitUntil: "domcontentloaded", timeout: 20000 }).catch(() => {});

  let url = page.url();
  if (url.includes("/login")) {
    console.log("Not logged in. Log in in the browser window; script will continue when your profile loads.");
    await page.waitForURL((u) => !u.href.includes("/login"), { timeout: 120000 }).catch(() => {});
    url = page.url();
    if (url.includes("/login")) {
      await browser.close();
      console.log("Timed out. Run again and log in when the browser opens.");
      return;
    }
    await context.storageState({ path: STORAGE_FILE });
  }

  await page.waitForTimeout(4000);

  const items = await page.evaluate(() => {
    const out = [];
    const seen = new Set();
    function aspectClass(w, h) {
      if (!w || !h) return "square";
      const r = h / w;
      if (r >= 1.4) return "xtall";
      if (r >= 1.1) return "tall";
      if (r <= 0.75) return "wide";
      return "square";
    }
    document.querySelectorAll("main img, [role='main'] img, img[src*='cloudinary'], img[src*='fiverr']").forEach((img, i) => {
      const src = (img.dataset && img.dataset.src) || img.src || img.currentSrc;
      if (!src || seen.has(src)) return;
      const w = img.naturalWidth || img.width || 0;
      const h = img.naturalHeight || img.height || 0;
      if (w < 150 || h < 150) return;
      seen.add(src);
      let title = img.alt || "Portfolio " + (i + 1);
      const card = img.closest("a, article, [class*='card'], [class*='gig']");
      if (card) {
        const t = card.querySelector("h2, h3, [class*='title']");
        if (t && t.textContent) title = t.textContent.trim().slice(0, 80);
      }
      out.push({
        id: String(out.length + 1),
        title,
        category: "Portfolio",
        imageUrl: src,
        aspectClass: aspectClass(w, h),
      });
    });
    return out;
  });

  await context.storageState({ path: STORAGE_FILE });
  await browser.close();

  const outPath = path.join(__dirname, "..", "src", "data", "portfolio.json");
  fs.writeFileSync(outPath, JSON.stringify(items, null, 2), "utf8");
  console.log("Wrote", items.length, "items to src/data/portfolio.json");
  console.log("Run: npm run update-portfolio  to merge into portfolio.ts");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
