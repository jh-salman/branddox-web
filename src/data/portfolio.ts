/**
 * Portfolio items – thumbnails, logo, art/banner, brand kit.
 * Categories: Thumbnails | Logo | Art/Banner | Brand Kit only.
 */

export type PortfolioItem = {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  aspectClass: "tall" | "square" | "wide" | "xtall";
  width?: number;
  height?: number;
};

const BRAND_DARK = "262833";
const BRAND_MINT = "38e991";
const BRAND_GREEN = "39ac73";
const WHITE = "ffffff";

/** Fallback placeholder items. Categories: Thumbnails, Logo, Art/Banner, Brand Kit only. */
export const portfolioItems: PortfolioItem[] = [
  { id: "1", title: "YouTube Thumbnail Pack", category: "Thumbnails", imageUrl: `https://placehold.co/600x800/${BRAND_DARK}/${BRAND_MINT}?text=YouTube+Thumbnail`, aspectClass: "tall", width: 600, height: 800 },
  { id: "2", title: "Channel Art / Banner", category: "Art/Banner", imageUrl: `https://placehold.co/1280x400/${BRAND_DARK}/${BRAND_MINT}?text=Channel+Art+Banner`, aspectClass: "wide", width: 1280, height: 400 },
  { id: "3", title: "Logo Design", category: "Logo", imageUrl: `https://placehold.co/600x600/${BRAND_DARK}/${BRAND_MINT}?text=Logo+Design`, aspectClass: "square", width: 600, height: 600 },
  { id: "4", title: "Brand Kit Sample", category: "Brand Kit", imageUrl: `https://placehold.co/600x900/${BRAND_DARK}/${BRAND_GREEN}?text=Brand+Kit`, aspectClass: "xtall", width: 600, height: 900 },
  { id: "5", title: "Video Thumbnail", category: "Thumbnails", imageUrl: `https://placehold.co/600x800/${BRAND_DARK}/${BRAND_MINT}?text=Video+Thumbnail`, aspectClass: "tall", width: 600, height: 800 },
  { id: "6", title: "YouTube Channel Art", category: "Art/Banner", imageUrl: `https://placehold.co/1280x350/${BRAND_DARK}/${BRAND_MINT}?text=Channel+Art`, aspectClass: "wide", width: 1280, height: 350 },
  { id: "7", title: "Podcast Art", category: "Thumbnails", imageUrl: `https://placehold.co/600x600/${BRAND_DARK}/${BRAND_GREEN}?text=Podcast+Art`, aspectClass: "square", width: 600, height: 600 },
  { id: "8", title: "Banner & Covers", category: "Art/Banner", imageUrl: `https://placehold.co/600x350/${BRAND_DARK}/${BRAND_MINT}?text=Banner+Cover`, aspectClass: "wide", width: 600, height: 350 },
  { id: "9", title: "Brand Logo", category: "Logo", imageUrl: `https://placehold.co/600x600/${BRAND_DARK}/${WHITE}?text=Brand+Logo`, aspectClass: "square", width: 600, height: 600 },
  { id: "10", title: "Click-Worthy Thumbnail", category: "Thumbnails", imageUrl: `https://placehold.co/600x850/${BRAND_DARK}/${BRAND_MINT}?text=Thumbnail+Design`, aspectClass: "xtall", width: 600, height: 850 },
];
