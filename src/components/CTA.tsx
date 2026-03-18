import { WHATSAPP_NUMBER, CONTACT_EMAIL } from "@/lib/site-config";
import Link from "next/link";

export function CTA() {
  return (
    <section className="relative overflow-hidden bg-[var(--brand-dark)] px-4 py-24 sm:px-6 sm:py-32">
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          background: "radial-gradient(ellipse 80% 70% at 50% 50%, var(--brand-mint), transparent 60%)",
        }}
      />
      <div className="relative mx-auto max-w-3xl text-center">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--brand-mint)]">
          Ready to stand out?
        </p>
        <h2 className="mb-4 text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl">
          Let&apos;s make your brand
          <span className="block text-[var(--brand-mint)]">look like it belongs at the top.</span>
        </h2>
        <p className="mb-10 text-xl text-white/90">
          Be seen. Be trusted. Tell me what you need and I&apos;ll reply personally.
        </p>
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <a
            href={
              WHATSAPP_NUMBER
                ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                    "Hi Branddox, I want to order a design. Please share details.",
                  )}`
                : "#"
            }
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border-2 border-[var(--brand-mint)]/40 bg-[var(--brand-mint)] px-8 py-4 text-base font-bold text-[var(--brand-dark)] shadow-lg shadow-[var(--brand-mint)]/30 transition hover:scale-[1.02] hover:bg-[var(--brand-green)] hover:shadow-[var(--brand-mint)]/50"
          >
            Message on WhatsApp
            <span aria-hidden>→</span>
          </a>
          {CONTACT_EMAIL && (
            <a
              href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
                "Branddox design order",
              )}&body=${encodeURIComponent("Hi Branddox,\n\nI want to order a design for ...")}`}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--brand-mint)] px-8 py-3 text-base font-semibold text-white transition hover:bg-[var(--brand-mint)] hover:text-[var(--brand-dark)]"
            >
              Email your brief
            </a>
          )}
          <Link
            href="/free-youtube-audit"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 px-8 py-3 text-base font-semibold text-white/90 transition hover:border-[var(--brand-mint)] hover:text-[var(--brand-mint)]"
          >
            Get free channel audit
          </Link>
        </div>
      </div>
    </section>
  );
}
