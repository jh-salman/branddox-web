"use client";

import Image from "next/image";
import { useState } from "react";
import type { PortfolioItem } from "@/lib/portfolio-types";
import { PORTFOLIO_CATEGORIES } from "@/lib/portfolio-types";

// Each item keeps its own size/ratio – no fixed height/width
const ASPECT_MAP: Record<string, string> = {
  tall: "aspect-[3/4]",
  square: "aspect-square",
  wide: "aspect-video",   // 16:9
  xtall: "aspect-[3/5]",
};

function getAspectClass(item: PortfolioItem): string {
  if (item.width != null && item.height != null && item.width > 0 && item.height > 0) {
    return "";
  }
  return ASPECT_MAP[item.aspectClass] ?? "aspect-video";
}

export function PortfolioGallery({ items }: { items: PortfolioItem[] }) {
  const [category, setCategory] = useState<string | null>(null);
  const filtered = category ? items.filter((i) => i.category === category) : items;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* Category filter */}
      <div className="mb-10 flex flex-wrap justify-center gap-2">
        <button
          type="button"
          onClick={() => setCategory(null)}
          className={`rounded-full px-4 py-2.5 text-sm font-semibold transition-all ${
            category === null
              ? "bg-[var(--brand-dark)] text-white shadow-md"
              : "bg-white text-[var(--brand-dark)]/80 ring-1 ring-[var(--brand-dark)]/10 hover:ring-[var(--brand-mint)]/50"
          }`}
        >
          All
        </button>
        {PORTFOLIO_CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategory(cat)}
            className={`rounded-full px-4 py-2.5 text-sm font-semibold transition-all ${
              category === cat
                ? "bg-[var(--brand-dark)] text-white shadow-md"
                : "bg-white text-[var(--brand-dark)]/80 ring-1 ring-[var(--brand-dark)]/10 hover:ring-[var(--brand-mint)]/50"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Masonry-style: each item its own size/ratio, no fixed height/width; flows by content */}
      <div
        className="columns-2 gap-4 sm:columns-3 lg:columns-4"
        style={{ columnFill: "balance" }}
      >
        {filtered.map((item) => {
          const aspectClass = getAspectClass(item);
          const hasSize = item.width != null && item.height != null && item.width > 0 && item.height > 0;
          const style = hasSize ? { aspectRatio: `${item.width!} / ${item.height!}` } : undefined;
          return (
            <article
              key={item.id}
              className="group relative mb-4 break-inside-avoid overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-[var(--brand-dark)]/5 transition-all duration-300 hover:shadow-xl hover:ring-[var(--brand-mint)]/20"
            >
              <div
                className={`relative w-full overflow-hidden ${aspectClass}`}
                style={style}
              >
                <Image
                  src={item.imageUrl}
                  alt={item.title || item.category}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Title only on hover */}
                <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-[var(--brand-dark)]/90 via-[var(--brand-dark)]/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <div className="p-4 text-white">
                    <span className="text-xs font-semibold uppercase tracking-widest text-[var(--brand-mint)]">
                      {item.category}
                    </span>
                    {hasSize && (
                      <p className="mt-1 text-xs text-white/90">
                        {item.width} × {item.height} px
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="rounded-2xl border-2 border-dashed border-[var(--brand-dark)]/20 bg-[var(--brand-dark)]/5 py-16 text-center">
          <p className="text-[var(--brand-dark)]/70">
            No items in this category. Try &quot;All&quot; or add items from admin.
          </p>
        </div>
      )}
    </div>
  );
}
