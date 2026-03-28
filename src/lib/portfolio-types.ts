/** Only these 4 categories are allowed. */
export const PORTFOLIO_CATEGORIES = ["Thumbnails", "Logo", "Art/Banner", "Brand Kit"] as const;
export type PortfolioCategory = (typeof PORTFOLIO_CATEGORIES)[number];

/** Public UI labels (filters still use canonical {@link PortfolioCategory} values). */
export const CATEGORY_FILTER_LABELS: Record<PortfolioCategory, string> = {
  Thumbnails: "Thumbnails",
  Logo: "Logo",
  "Art/Banner": "Channel art",
  "Brand Kit": "Brand Kit",
};

/**
 * Map stored/API category strings to a canonical filter key so "All" vs category pills work
 * even if older data used alternate spellings.
 */
export function normalizePortfolioCategory(raw: string): string {
  const s = raw.trim();
  if ((PORTFOLIO_CATEGORIES as readonly string[]).includes(s)) {
    return s;
  }
  const legacy: Record<string, PortfolioCategory> = {
    Graphics: "Art/Banner",
    Branding: "Logo",
    Canva: "Brand Kit",
  };
  if (legacy[s]) return legacy[s];

  const lower = s.toLowerCase();
  const map: [string, PortfolioCategory][] = [
    ["thumbnail", "Thumbnails"],
    ["thumbnails", "Thumbnails"],
    ["logo", "Logo"],
    ["logos", "Logo"],
    ["branding", "Logo"],
    ["art/banner", "Art/Banner"],
    ["channel art", "Art/Banner"],
    ["channelart", "Art/Banner"],
    ["art banner", "Art/Banner"],
    ["banner", "Art/Banner"],
    ["graphics", "Art/Banner"],
    ["graphic", "Art/Banner"],
    ["canva", "Brand Kit"],
    ["brand kit", "Brand Kit"],
    ["brandkit", "Brand Kit"],
  ];
  for (const [key, cat] of map) {
    if (lower === key) return cat;
  }
  return s;
}

export type PortfolioItem = {
  id: string;
  title?: string | null;
  category: string;
  imageUrl: string;
  aspectClass: "tall" | "square" | "wide" | "xtall";
  width?: number;
  height?: number;
  /** If set, work belongs to a YouTube client / channel portfolio */
  clientId?: string | null;
  /** Set when imported from YouTube (dedupe on re-import) */
  youtubeVideoId?: string | null;
};
