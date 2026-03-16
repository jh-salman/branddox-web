/** Only these 4 categories are allowed. */
export const PORTFOLIO_CATEGORIES = ["Thumbnails", "Logo", "Art/Banner", "Brand Kit"] as const;
export type PortfolioCategory = (typeof PORTFOLIO_CATEGORIES)[number];

export type PortfolioItem = {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  aspectClass: "tall" | "square" | "wide" | "xtall";
  width?: number;
  height?: number;
};
