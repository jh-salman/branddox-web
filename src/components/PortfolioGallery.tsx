"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { PortfolioItem } from "@/lib/portfolio-types";
import {
  CATEGORY_FILTER_LABELS,
  PORTFOLIO_CATEGORIES,
  normalizePortfolioCategory,
  type PortfolioCategory,
} from "@/lib/portfolio-types";
import type { ClientItem } from "@/lib/api";

// Each item keeps its own size/ratio – no fixed height/width
const ASPECT_MAP: Record<string, string> = {
  tall: "aspect-[3/4]",
  square: "aspect-square",
  wide: "aspect-video", // 16:9
  xtall: "aspect-[3/5]",
};

function getAspectClass(item: PortfolioItem): string {
  if (item.width != null && item.height != null && item.width > 0 && item.height > 0) {
    return "";
  }
  return ASPECT_MAP[item.aspectClass] ?? "aspect-video";
}

function displayCategoryLabel(item: PortfolioItem): string {
  const n = normalizePortfolioCategory(item.category);
  if ((PORTFOLIO_CATEGORIES as readonly string[]).includes(n)) {
    return CATEGORY_FILTER_LABELS[n as PortfolioCategory];
  }
  return item.category;
}

type Props = {
  items: PortfolioItem[];
  /** Used for the "Channels" tab (cards link to /portfolio/channels/[slug]) */
  clients?: ClientItem[];
  /** When false, only category filter + grid (e.g. channel detail page) */
  showChannelTabs?: boolean;
};

export function PortfolioGallery({ items, clients = [], showChannelTabs = true }: Props) {
  const [mainTab, setMainTab] = useState<"all" | "channels">("all");
  const [category, setCategory] = useState<PortfolioCategory | null>(null);

  const filtered = useMemo(() => {
    if (!category) return items;
    return items.filter((i) => normalizePortfolioCategory(i.category) === category);
  }, [items, category]);

  const channelsWithWork = useMemo(() => {
    const ids = new Set(items.filter((i) => i.clientId).map((i) => i.clientId as string));
    return clients.filter((c) => ids.has(c.id));
  }, [items, clients]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {showChannelTabs && (
        <div className="mb-8 flex flex-wrap justify-center gap-2">
          <button
            type="button"
            onClick={() => {
              setMainTab("all");
            }}
            className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-all ${
              mainTab === "all"
                ? "bg-[var(--brand-dark)] text-white shadow-md"
                : "bg-white text-[var(--brand-dark)]/80 ring-1 ring-[var(--brand-dark)]/10 hover:ring-[var(--brand-mint)]/50"
            }`}
          >
            All work
          </button>
          <button
            type="button"
            onClick={() => {
              setMainTab("channels");
              setCategory(null);
            }}
            className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-all ${
              mainTab === "channels"
                ? "bg-[var(--brand-dark)] text-white shadow-md"
                : "bg-white text-[var(--brand-dark)]/80 ring-1 ring-[var(--brand-dark)]/10 hover:ring-[var(--brand-mint)]/50"
            }`}
          >
            Channels
          </button>
        </div>
      )}

      {mainTab === "channels" && showChannelTabs ? (
        channelsWithWork.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-[var(--brand-dark)]/20 bg-[var(--brand-dark)]/5 py-16 text-center">
            <p className="text-[var(--brand-dark)]/70">
              No channel portfolios yet. Add clients in admin, then assign portfolio images to a channel.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {channelsWithWork.map((c) => {
              const preview = items
                .filter((i) => i.clientId === c.id)
                .slice(0, 4);
              return (
                <Link
                  key={c.id}
                  href={`/portfolio/channels/${encodeURIComponent(c.slug)}`}
                  className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-[var(--brand-dark)]/5 transition-all hover:shadow-xl hover:ring-[var(--brand-mint)]/25"
                >
                  <div className="flex items-center gap-3 border-b border-[var(--brand-dark)]/10 bg-[var(--brand-dark)]/5 px-4 py-3">
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-[var(--brand-dark)]/10">
                      <Image
                        src={c.logoUrl || c.imageUrl}
                        alt=""
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-[var(--brand-dark)] group-hover:text-[var(--brand-green)]">
                        {c.channelName}
                      </p>
                      <p className="text-xs text-[var(--brand-dark)]/60">
                        {preview.length} piece{preview.length === 1 ? "" : "s"} · View portfolio
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-1 p-2">
                    {preview.map((p) => (
                      <div key={p.id} className="relative aspect-video overflow-hidden rounded-lg bg-[var(--brand-dark)]/5">
                        <Image
                          src={p.imageUrl}
                          alt=""
                          fill
                          sizes="(max-width: 768px) 50vw, 200px"
                          className="object-cover"
                        />
                      </div>
                    ))}
                    {preview.length === 0 && (
                      <div className="col-span-2 px-3 py-6 text-center text-sm text-[var(--brand-dark)]/50">
                        No images yet
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )
      ) : (
        <>
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
                {CATEGORY_FILTER_LABELS[cat]}
              </button>
            ))}
          </div>

          {/* Masonry-style */}
          <div
            className="columns-2 gap-4 sm:columns-3 lg:columns-4"
            style={{ columnFill: "balance" }}
          >
            {filtered.map((item) => {
              const aspectClass = getAspectClass(item);
              const hasSize =
                item.width != null && item.height != null && item.width > 0 && item.height > 0;
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
                    <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-[var(--brand-dark)]/90 via-[var(--brand-dark)]/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <div className="p-4 text-white">
                        <span className="text-xs font-semibold uppercase tracking-widest text-[var(--brand-mint)]">
                          {displayCategoryLabel(item)}
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
        </>
      )}
    </div>
  );
}
