import { ServiceCard } from "./ServiceCard";
import Link from "next/link";

const DEFAULT_SERVICES = [
  { title: "Graphics Design", description: "Logos, social assets, and marketing visuals that look pro.", benefit: "→ Stand out in feeds and inboxes" },
  { title: "Canva Design", description: "Templates and designs for social, presentations, and more.", benefit: "→ Save time, keep consistency" },
  { title: "YouTube Services", description: "Channel art, intros, thumbnails, and growth-focused strategy.", benefit: "→ More clicks, more subscribers" },
  { title: "SEO", description: "Content and visibility so your audience can find you.", benefit: "→ Show up when they search" },
  { title: "Thumbnail Design", description: "Click-worthy thumbnails that boost CTR and views.", benefit: "→ Higher views, faster growth" },
];

export type ServiceEntry = {
  title: string;
  description: string;
  benefit: string;
};

export function Services({ items }: { items?: ServiceEntry[] | null }) {
  const services = (items && items.length > 0) ? items : DEFAULT_SERVICES;
  return (
    <section
      id="services"
      className="relative overflow-hidden bg-[#0b1020] px-4 py-24 text-white sm:px-6 sm:py-32"
    >
      {/* Hero-style gradient overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-100"
        style={{
          background:
            "radial-gradient(circle_at_20%_20%,var(--brand-mint)/0.1,transparent_28%),radial-gradient(circle_at_80%_80%,var(--brand-green)/0.08,transparent_28%),linear-gradient(180deg,#111827_0%,#0b1020_100%)",
        }}
      />
      <div className="relative mx-auto max-w-6xl">
        <div className="mb-4 inline-block rounded-full bg-[var(--brand-mint)]/20 px-4 py-1.5 text-sm font-semibold text-[var(--brand-mint)]">
          What I do
        </div>
        <h2 className="mb-3 text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
          Services that get you
          <span className="text-[var(--brand-mint)]"> seen & trusted</span>
        </h2>
        <p className="mb-16 max-w-2xl text-lg text-white/75">
          One place for your branding, graphics, YouTube, and SEO—so you look pro and grow faster.
        </p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {services.map((s, i) => (
            <div
              key={s.title}
              className="stagger"
              style={i % 2 === 1 ? { marginTop: "0.5rem" } : undefined}
            >
              <ServiceCard title={s.title} description={s.description} benefit={s.benefit} variant="dark" />
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap items-center gap-3">
          <Link
            href="/services"
            className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:border-[var(--brand-mint)] hover:text-[var(--brand-mint)]"
          >
            View full services
          </Link>
          <Link
            href="/free-thumbnail-sample"
            className="rounded-full bg-[var(--brand-mint)] px-4 py-2 text-sm font-semibold text-[var(--brand-dark)] hover:bg-[var(--brand-green)]"
          >
            Get a free thumbnail sample
          </Link>
        </div>
      </div>
    </section>
  );
}
