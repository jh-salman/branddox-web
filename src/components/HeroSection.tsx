"use client";

import Link from "next/link";
import Image from "next/image";

const PLACEHOLDER_THUMB = (i: number) =>
  `https://placehold.co/400x225/262833/38e991?text=Thumb+${i + 1}`;

type Props = {
  heroImageUrls?: string[];
};

export default function HeroSection({ heroImageUrls = [] }: Props) {
  const thumbs = [
    heroImageUrls[0] ?? PLACEHOLDER_THUMB(0),
    heroImageUrls[1] ?? PLACEHOLDER_THUMB(1),
    heroImageUrls[2] ?? PLACEHOLDER_THUMB(2),
    heroImageUrls[3] ?? PLACEHOLDER_THUMB(3),
  ];

  return (
    <section className="relative overflow-hidden bg-[#0b1020] text-white">
      <div
        className="absolute inset-0 opacity-100"
        style={{
          background:
            "radial-gradient(circle_at_75%_30%,var(--brand-mint)/0.18,transparent_22%),radial-gradient(circle_at_85%_60%,var(--brand-green)/0.12,transparent_24%),linear-gradient(180deg,#111827_0%,#0b1020_100%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(to right,#fff 1px,transparent 1px),linear-gradient(to bottom,#fff 1px,transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-16 sm:gap-14 sm:px-6 sm:py-20 md:py-24 lg:grid-cols-2 lg:gap-10 lg:px-8 lg:py-28">
        {/* Left */}
        <div className="flex flex-col justify-center">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[var(--brand-mint)]/20 bg-[var(--brand-mint)]/10 px-4 py-2 text-xs font-medium tracking-[0.18em] text-[var(--brand-mint)] uppercase">
            Branddox
            <span className="h-1 w-1 rounded-full bg-[var(--brand-mint)]" />
            Branding & Design
          </div>

          <h1 className="mt-6 max-w-xl text-4xl font-semibold leading-[0.95] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Make Your Channel
            <span className="block text-[var(--brand-mint)]">Impossible to Ignore.</span>
          </h1>

          <p className="mt-4 text-base font-medium leading-relaxed text-white/80 sm:text-lg">
            Built for clicks. Designed for trust.
          </p>

          <p className="mt-4 max-w-xl text-base leading-7 text-white/68 sm:text-lg">
            Thumbnails, channel art, logos, and digital identity built to win
            attention and make your brand look sharper, cleaner, and more trusted.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full bg-[var(--brand-mint)] px-6 py-3 text-sm font-semibold text-[var(--brand-dark)] transition hover:scale-[1.02] hover:bg-[var(--brand-green)]"
            >
              Start a project
            </Link>
            <Link
              href="#work-preview"
              className="inline-flex items-center justify-center rounded-full border border-white/15 px-6 py-3 text-sm font-medium text-white/90 transition hover:border-white/30 hover:bg-white/5"
            >
              See recent work
            </Link>
          </div>

          <p className="mt-8 text-sm font-semibold text-white/70">
            Trusted by 1M+ subscriber creators
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/55">
            <span>Fast delivery</span>
            <span className="hidden h-1 w-1 rounded-full bg-white/25 sm:inline-block" />
            <span>No outsourcing</span>
            <span className="hidden h-1 w-1 rounded-full bg-white/25 sm:inline-block" />
            <span>Direct WhatsApp</span>
          </div>
        </div>

        {/* Right: floating thumbnails with depth + motion */}
        <div className="relative flex items-center justify-center">
          {/* Blur glow behind stack */}
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-[320px] w-[85%] max-w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40 blur-[80px]"
            style={{ background: "var(--brand-mint)" }}
          />
          <div
            className="pointer-events-none absolute right-0 top-1/3 z-0 h-[200px] w-[50%] max-w-[280px] rounded-full opacity-30 blur-[60px]"
            style={{ background: "var(--brand-green)" }}
          />

          <div className="relative z-10 h-[340px] w-full max-w-[560px] sm:h-[520px]">
            {/* Top small */}
            <div className="absolute left-[2%] top-[4%] h-[130px] w-[56%] overflow-hidden rounded-[20px] border border-white/15 bg-white/5 shadow-2xl shadow-black/30 backdrop-blur-sm transition duration-500 hover:rotate-[-5deg] hover:shadow-[var(--brand-mint)]/20 sm:h-[180px] sm:w-[58%] sm:rounded-[24px] animate-float-hero">
              <Image
                src={thumbs[0]}
                alt="Featured Branddox work 1"
                fill
                priority
                sizes="(max-width: 640px) 56vw, (max-width: 1024px) 34vw, 26vw"
                className="object-cover"
              />
            </div>
            {/* Middle right */}
            <div className="absolute right-0 top-[2%] h-[150px] w-[54%] overflow-hidden rounded-[18px] border border-white/15 bg-white/5 shadow-xl shadow-black/25 backdrop-blur-sm transition duration-500 hover:rotate-[4deg] sm:h-[200px] sm:w-[55%] sm:rounded-[22px] animate-float-hero animate-float-hero-delay-1">
              <Image
                src={thumbs[1]}
                alt="Featured Branddox work 2"
                fill
                sizes="(max-width: 640px) 54vw, (max-width: 1024px) 32vw, 24vw"
                className="object-cover"
              />
            </div>
            {/* Middle left */}
            <div className="absolute bottom-[20%] left-[6%] h-[150px] w-[52%] overflow-hidden rounded-[18px] border border-white/15 bg-white/5 shadow-xl shadow-black/25 backdrop-blur-sm transition duration-500 hover:rotate-[3deg] sm:bottom-[18%] sm:h-[200px] sm:rounded-[22px] animate-float-hero animate-float-hero-delay-2">
              <Image
                src={thumbs[2]}
                alt="Featured Branddox work 3"
                fill
                sizes="(max-width: 640px) 52vw, (max-width: 1024px) 31vw, 23vw"
                className="object-cover"
              />
            </div>
            {/* Bottom big — main focus */}
            <div className="absolute bottom-0 right-[4%] h-[180px] w-[68%] overflow-hidden rounded-[20px] border-2 border-[var(--brand-mint)]/25 bg-white/5 shadow-2xl shadow-black/40 backdrop-blur-sm transition duration-500 hover:rotate-[-2deg] hover:shadow-[var(--brand-mint)]/25 sm:h-[260px] sm:rounded-[26px] animate-float-hero animate-float-hero-delay-3">
              <Image
                src={thumbs[3]}
                alt="Featured Branddox work 4"
                fill
                sizes="(max-width: 640px) 68vw, (max-width: 1024px) 40vw, 30vw"
                className="object-cover"
              />
            </div>
            <div className="absolute left-[42%] top-[38%] z-10 hidden rounded-full border border-white/10 bg-[#10182f]/95 px-4 py-3 shadow-xl backdrop-blur-md sm:block">
              <p className="text-[11px] uppercase tracking-[0.2em] text-white/45">
                Results-first
              </p>
              <p className="mt-1 text-sm font-semibold text-white">
                CTR-friendly visuals
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
