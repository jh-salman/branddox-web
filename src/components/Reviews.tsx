"use client";

import { reviews, reviewStats } from "@/data/reviews";
import type { Review } from "@/data/reviews";

/** Option 4: Chat-style testimonial — WhatsApp bubble look, green accent, ✔ Delivered / Happy client */
function ChatBubble({ review }: { review: Review }) {
  return (
    <div className="flex gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--brand-mint)]/25 text-sm font-bold text-[var(--brand-dark)]">
        {review.name.replace(".", "")}
      </div>
      <div className="min-w-0 flex-1">
        <div className="rounded-2xl rounded-tl-md border border-[var(--brand-mint)]/20 bg-[var(--brand-mint)]/5 px-4 py-3 shadow-sm">
          <p className="text-[var(--brand-dark)]/90">&ldquo;{review.text}&rdquo;</p>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[var(--brand-dark)]/60">
          <span className="flex items-center gap-1 font-medium text-[var(--brand-mint)]">
            <span aria-hidden>✔</span> Delivered
          </span>
          <span className="flex items-center gap-1 font-medium text-[var(--brand-mint)]">
            <span aria-hidden>✔</span> Happy client
          </span>
          <span>{review.context}</span>
        </div>
      </div>
    </div>
  );
}

export function Reviews() {
  const items = reviews.slice(0, 6);

  return (
    <section
      id="reviews"
      className="relative overflow-hidden px-4 py-24 sm:px-6 sm:py-32"
      style={{
        background:
          "linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(56,233,145,0.06) 50%, rgba(255,255,255,1) 100%)",
      }}
    >
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[300px] w-[70%] max-w-xl -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.07] blur-[80px]"
        style={{ background: "var(--brand-mint)" }}
      />

      <div className="relative mx-auto max-w-3xl">
        <p className="mb-3 text-center text-xs font-bold uppercase tracking-[0.3em] text-[var(--brand-mint)]">
          Fiverr reviews
        </p>
        <h2 className="mb-3 text-center text-3xl font-bold tracking-tight text-[var(--brand-dark)] sm:text-4xl md:text-5xl">
          What buyers say about Branddox
        </h2>
        <p className="mx-auto mb-4 max-w-lg text-center text-base text-[var(--brand-dark)]/70">
          Real feedback — the kind of messages we get after delivery.
        </p>

        {/* Chat-style label */}
        <p className="mb-8 flex items-center justify-center gap-2 text-sm font-semibold text-[var(--brand-dark)]/70">
          <span aria-hidden>💬</span> Client messages
        </p>

        {/* Stats — compact */}
        <div className="mb-12 flex justify-center gap-8">
          <span className="text-sm text-[var(--brand-dark)]/60">
            <strong className="text-[var(--brand-mint)]">{reviewStats.completedOrders}+</strong> orders
          </span>
          <span className="text-sm text-[var(--brand-dark)]/60">
            <strong className="text-[var(--brand-dark)]">{reviewStats.starred}</strong> starred
          </span>
        </div>

        {/* Chat bubbles */}
        <div className="space-y-6">
          {items.map((review) => (
            <ChatBubble key={review.id} review={review} />
          ))}
        </div>

        <p className="mt-12 text-center text-sm text-[var(--brand-dark)]/45">
          All from Fiverr completed orders. Names shortened for privacy.
        </p>
      </div>
    </section>
  );
}
