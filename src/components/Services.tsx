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
    <section id="services" className="bg-[var(--background)] px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mb-4 inline-block rounded-full bg-[var(--brand-mint)]/15 px-4 py-1.5 text-sm font-semibold text-[var(--brand-dark)]">
          What I do
        </div>
        <h2 className="mb-3 text-3xl font-bold text-[var(--brand-dark)] sm:text-4xl md:text-5xl">
          Services that get you
          <span className="text-[var(--brand-mint)]"> seen & trusted</span>
        </h2>
        <p className="mb-14 max-w-2xl text-lg text-[var(--brand-dark)]/80">
          One place for your branding, graphics, YouTube, and SEO—so you look pro and grow faster.
        </p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <div key={s.title} className="stagger">
              <ServiceCard title={s.title} description={s.description} benefit={s.benefit} />
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap items-center gap-3">
          <Link
            href="/services"
            className="rounded-full border border-[var(--brand-dark)]/20 px-4 py-2 text-sm font-semibold text-[var(--brand-dark)] hover:border-[var(--brand-mint)] hover:text-[var(--brand-mint)]"
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
