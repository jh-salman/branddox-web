"use client";

import { useState, useEffect, useCallback } from "react";
import { reviews, reviewStats } from "@/data/reviews";
import type { Review } from "@/data/reviews";

function Stars({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return (
    <div className="flex gap-1" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: full }).map((_, i) => (
        <span
          key={`f-${i}`}
          className="text-[var(--brand-mint)] drop-shadow-sm"
          style={{ animationDelay: `${i * 50}ms` }}
        >
          ★
        </span>
      ))}
      {half ? <span className="text-[var(--brand-mint)]">★</span> : null}
      {Array.from({ length: empty }).map((_, i) => (
        <span key={`e-${i}`} className="text-[var(--brand-dark)]/20">★</span>
      ))}
    </div>
  );
}

function ReviewCard({ review, isActive }: { review: Review; isActive: boolean }) {
  return (
    <blockquote
      className={`flex h-full flex-col rounded-3xl border border-[var(--brand-dark)]/[0.06] bg-white p-8 shadow-xl shadow-[var(--brand-dark)]/[0.06] transition-all duration-500 sm:p-10 ${
        isActive
          ? "review-card-enter ring-2 ring-[var(--brand-mint)]/30"
          : "opacity-90"
      } hover:shadow-2xl hover:shadow-[var(--brand-mint)]/[0.08] hover:ring-[var(--brand-mint)]/40`}
    >
      <div className="flex items-start justify-between gap-4">
        <Stars rating={review.rating} />
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[var(--brand-mint)]/20 to-[var(--brand-green)]/20 text-lg font-bold text-[var(--brand-dark)] ring-2 ring-[var(--brand-mint)]/20"
          aria-hidden
        >
          {review.name.replace(".", "")}
        </div>
      </div>
      <p className="mt-5 flex-1 text-lg leading-relaxed text-[var(--brand-dark)]/95 sm:text-xl">
        &ldquo;{review.text}&rdquo;
      </p>
      <footer className="mt-6 flex items-center justify-between gap-4 border-t border-[var(--brand-dark)]/[0.06] pt-5">
        <span className="font-bold text-[var(--brand-dark)]">{review.name}</span>
        <span className="text-right text-sm text-[var(--brand-dark)]/55">
          {review.context}
        </span>
      </footer>
    </blockquote>
  );
}

const SLIDE_DURATION_MS = 5500;

export function Reviews() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [key, setKey] = useState(0);
  const items = reviews.slice(0, 8);
  const total = items.length;

  const go = useCallback(
    (dir: -1 | 1) => {
      setIndex((i) => (i + dir + total) % total);
      setKey((k) => k + 1);
    },
    [total]
  );

  useEffect(() => {
    if (paused || total === 0) return;
    const id = setInterval(() => go(1), SLIDE_DURATION_MS);
    return () => clearInterval(id);
  }, [paused, go, total]);

  const progress = total > 0 ? ((index + 1) / total) * 100 : 0;

  return (
    <section
      id="reviews"
      className="relative overflow-hidden px-4 py-20 sm:px-6 sm:py-28"
      style={{
        background:
          "linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(56,233,145,0.04) 50%, rgba(255,255,255,1) 100%)",
      }}
    >
      {/* Subtle grid pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(var(--brand-dark) 1px, transparent 1px),
            linear-gradient(90deg, var(--brand-dark) 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative mx-auto max-w-5xl">
        <p className="mb-3 text-center text-xs font-bold uppercase tracking-[0.3em] text-[var(--brand-mint)]">
          Fiverr reviews
        </p>
        <h2 className="mb-3 text-center text-3xl font-bold tracking-tight text-[var(--brand-dark)] sm:text-4xl md:text-5xl">
          What buyers say about Branddox
        </h2>
        <p className="mx-auto mb-14 max-w-xl text-center text-base text-[var(--brand-dark)]/75">
          Real feedback from completed orders — YouTube channel create, design, and optimization.
        </p>

        {/* Stats — glass style */}
        <div className="mb-14 grid grid-cols-2 gap-4 sm:flex sm:justify-center sm:gap-6">
          <div className="stagger group rounded-2xl border border-[var(--brand-dark)]/[0.06] bg-white/80 px-6 py-5 shadow-lg shadow-[var(--brand-dark)]/[0.04] backdrop-blur-sm transition-all duration-300 hover:scale-[1.03] hover:shadow-xl hover:shadow-[var(--brand-mint)]/[0.08] hover:border-[var(--brand-mint)]/20">
            <p className="text-3xl font-bold text-[var(--brand-mint)] sm:text-4xl">
              {reviewStats.completedOrders}+
            </p>
            <p className="mt-1 text-sm font-medium text-[var(--brand-dark)]/60">
              Completed orders
            </p>
          </div>
          <div className="stagger group rounded-2xl border border-[var(--brand-dark)]/[0.06] bg-white/80 px-6 py-5 shadow-lg shadow-[var(--brand-dark)]/[0.04] backdrop-blur-sm transition-all duration-300 hover:scale-[1.03] hover:shadow-xl hover:shadow-[var(--brand-dark)]/[0.06]">
            <p className="text-3xl font-bold text-[var(--brand-dark)] sm:text-4xl">
              {reviewStats.starred}
            </p>
            <p className="mt-1 text-sm font-medium text-[var(--brand-dark)]/60">
              Starred
            </p>
          </div>
        </div>

        {/* Slider */}
        <div
          className="relative"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          <div className="overflow-hidden rounded-3xl">
            <div
              className="flex transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
              style={{ transform: `translateX(-${index * 100}%)` }}
            >
              {items.map((r, i) => (
                <div key={`${r.id}-${key}`} className="min-w-full shrink-0 px-1 sm:px-3">
                  <div className="mx-auto max-w-2xl">
                    <ReviewCard
                      review={r}
                      isActive={i === index}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Arrows — minimal pill */}
          <button
            type="button"
            onClick={() => go(-1)}
            className="absolute left-2 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-xl shadow-[var(--brand-dark)]/10 backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-[var(--brand-mint)] hover:text-[var(--brand-dark)] hover:shadow-[var(--brand-mint)]/30 focus:outline-none focus:ring-2 focus:ring-[var(--brand-mint)] focus:ring-offset-2 sm:left-0 sm:h-14 sm:w-14"
            aria-label="Previous review"
          >
            <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            className="absolute right-2 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-xl shadow-[var(--brand-dark)]/10 backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-[var(--brand-mint)] hover:text-[var(--brand-dark)] hover:shadow-[var(--brand-mint)]/30 focus:outline-none focus:ring-2 focus:ring-[var(--brand-mint)] focus:ring-offset-2 sm:right-0 sm:h-14 sm:w-14"
            aria-label="Next review"
          >
            <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Progress bar */}
          <div className="mt-8 overflow-hidden rounded-full bg-[var(--brand-dark)]/[0.08]">
            <div
              className="h-1.5 rounded-full bg-gradient-to-r from-[var(--brand-mint)] to-[var(--brand-green)] transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Dots */}
          <div className="mt-5 flex justify-center gap-2">
            {items.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setIndex(i);
                  setKey((k) => k + 1);
                }}
                className="group flex h-2.5 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--brand-mint)] focus:ring-offset-2"
                style={{
                  width: i === index ? 28 : 10,
                  backgroundColor: i === index ? "var(--brand-mint)" : "var(--brand-dark)",
                  opacity: i === index ? 1 : 0.2,
                }}
                aria-label={`Go to review ${i + 1}`}
              />
            ))}
          </div>
        </div>

        <p className="mt-10 text-center text-sm text-[var(--brand-dark)]/50">
          All reviews from Fiverr completed orders. Names shortened for privacy.
        </p>
      </div>
    </section>
  );
}
