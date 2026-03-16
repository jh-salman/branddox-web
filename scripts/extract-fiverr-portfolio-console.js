/**
 * Run this in the browser console on your Fiverr profile page (while logged in).
 * Open: https://www.fiverr.com/s/7Y9XdzL → Log in → F12 → Console → paste this whole script → Enter.
 * It will extract portfolio/gig images and copy a JSON array to your clipboard.
 * Paste the result into src/data/portfolio.json or use the npm script to update portfolio.ts.
 */
(function () {
  const items = [];
  const seen = new Set();

  function aspectClass(w, h) {
    if (!w || !h) return "square";
    const r = h / w;
    if (r >= 1.4) return "xtall";
    if (r >= 1.1) return "tall";
    if (r <= 0.75) return "wide";
    return "square";
  }

  // Try portfolio / gig gallery images (common Fiverr patterns)
  const selectors = [
    "[data-testid='portfolio-item'] img",
    "[data-testid='gig-gallery'] img",
    ".portfolio-item img",
    ".gig-gallery img",
    "[class*='portfolio'] img",
    "[class*='Gallery'] img",
    "main img[src*='cloudinary']",
    "main img[src*='fiverr']",
    "article img",
    "main img",
  ];

  let imgs = [];
  for (const sel of selectors) {
    try {
      const el = document.querySelectorAll(sel);
      if (el.length) {
        el.forEach((e) => imgs.push(e));
        break;
      }
    } catch (_) {}
  }

  // Fallback: all images in main with reasonable size
  if (imgs.length === 0) {
    document.querySelectorAll("main img, [role='main'] img, .page-content img").forEach((e) => imgs.push(e));
  }
  if (imgs.length === 0) {
    document.querySelectorAll("img").forEach((e) => {
      const w = e.naturalWidth || e.width;
      const h = e.naturalHeight || e.height;
      if (w >= 200 && h >= 150 && !e.src.includes("logo") && !e.src.includes("avatar")) imgs.push(e);
    });
  }

  imgs.forEach((img, i) => {
    const src = img.dataset.src || img.src || img.currentSrc;
    if (!src || seen.has(src)) return;
    const w = img.naturalWidth || img.width || 0;
    const h = img.naturalHeight || img.height || 0;
    if (w < 100 && h < 100) return;
    seen.add(src);

    let title = img.alt || "";
    let category = "Portfolio";
    const card = img.closest("a, [role='button'], article, [class*='card'], [class*='gig'], [class*='portfolio']");
    if (card) {
      const t = card.querySelector("h2, h3, [class*='title'], span");
      if (t && t.textContent) title = t.textContent.trim().slice(0, 80);
      const catEl = card.querySelector("[class*='category'], [class*='tag']");
      if (catEl && catEl.textContent) category = catEl.textContent.trim().slice(0, 40);
    }
    if (!title) title = "Portfolio item " + (i + 1);

    items.push({
      id: String(items.length + 1),
      title,
      category,
      imageUrl: src,
      aspectClass: aspectClass(w, h),
    });
  });

  const json = JSON.stringify(items, null, 2);
  try {
    navigator.clipboard.writeText(json);
    console.log("Copied " + items.length + " items to clipboard. Paste into src/data/portfolio.json or run: npm run update-portfolio");
  } catch (_) {
    console.log("Copy failed. Paste the following manually:\n", json);
  }
  console.log("Items:", items.length, items);
  return items;
})();
