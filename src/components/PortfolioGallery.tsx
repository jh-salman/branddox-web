"use client";

import Image from "next/image";
import { useState } from "react";
import type { PortfolioItem } from "@/data/portfolio";
import { PORTFOLIO_CATEGORIES } from "@/lib/portfolio-types";

export type { PortfolioItem } from "@/data/portfolio";

const aspectRatioMap = {
  tall: "aspect-[3/4]",
  square: "aspect-square",
  wide: "aspect-[4/3]",
  xtall: "aspect-[3/5]",
};

/** Get aspect-ratio class from actual width/height or fallback to aspectClass */
function getAspectClass(item: PortfolioItem): string {
  if (item.width != null && item.height != null && item.width > 0 && item.height > 0) {
    return ""; // use inline style for exact ratio
  }
  return aspectRatioMap[item.aspectClass];
}

export function PortfolioGallery({ items }: { items: PortfolioItem[] }) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filtered =
    selectedCategory == null
      ? items
      : items.filter((i) => i.category === selectedCategory);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6">
      {/* Category pills – only Thumbnails, Logo, Art/Banner, Brand Kit */}
      <div className="mb-8 flex flex-wrap justify-center gap-2">
        <button
          type="button"
          onClick={() => setSelectedCategory(null)}
          className={`rounded-full px-4 py-2 text-sm font-medium transition ${
            selectedCategory === null
              ? "bg-[var(--brand-dark)] text-white"
              : "bg-[var(--brand-dark)]/10 text-[var(--brand-dark)] hover:bg-[var(--brand-dark)]/20"
          }`}
        >
          All
        </button>
        {PORTFOLIO_CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              selectedCategory === cat
                ? "bg-[var(--brand-dark)] text-white"
                : "bg-[var(--brand-dark)]/10 text-[var(--brand-dark)] hover:bg-[var(--brand-dark)]/20"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Masonry grid – images at actual aspect ratio with size label */}
      <div className="columns-2 gap-4 sm:columns-3 lg:columns-4">
        {filtered.map((item) => {
          const aspectClass = getAspectClass(item);
          const hasSize = item.width != null && item.height != null && item.width > 0 && item.height > 0;
          const style = hasSize
            ? { aspectRatio: `${item.width!} / ${item.height!}` }
            : undefined;
          return (
            <div
              key={item.id}
              className="break-inside-avoid mb-4 overflow-hidden rounded-xl bg-white shadow-md transition hover:shadow-lg"
            >
              <a
                href="#"
                className="block focus:outline-none focus:ring-2 focus:ring-[var(--brand-mint)] focus:ring-offset-2 rounded-xl"
                onClick={(e) => e.preventDefault()}
              >
                <div
                  className={`relative w-full overflow-hidden rounded-t-xl ${aspectClass}`}
                  style={style}
                >
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover transition duration-300 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--brand-dark)]/80 via-transparent to-transparent opacity-0 transition opacity duration-300 hover:opacity-100" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 text-white opacity-0 transition opacity duration-300 hover:opacity-100">
                    <span className="text-xs font-medium uppercase tracking-wider text-[var(--brand-mint)]">
                      {item.category}
                    </span>
                    <p className="font-semibold">{item.title}</p>
                    {hasSize && (
                      <p className="mt-1 text-xs text-white/90">
                        {item.width} × {item.height} px
                      </p>
                    )}
                  </div>
                </div>
                <div className="p-3">
                  <span className="text-xs font-medium text-[var(--brand-mint)]">
                    {item.category}
                  </span>
                  <p className="font-medium text-[var(--brand-dark)]">
                    {item.title}
                  </p>
                  {hasSize && (
                    <p className="mt-0.5 text-xs text-[var(--brand-dark)]/60">
                      Actual size: {item.width} × {item.height} px
                    </p>
                  )}
                </div>
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}
