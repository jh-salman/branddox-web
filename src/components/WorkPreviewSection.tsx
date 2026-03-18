import Link from "next/link";

export type WorkItem = {
  id: string;
  imageUrl: string;
  category: string;
  title?: string | null;
};

const RESULT_BADGES = [
  "+Higher CTR",
  "+Better branding",
  "+More clicks",
  "+Stronger recognition",
  "+Faster consistency",
  "+Premium look",
];

const FALLBACK_WORKS: WorkItem[] = [
  { id: "1", imageUrl: "https://placehold.co/600x360/262833/38e991?text=Thumbnails", category: "YouTube Thumbnails", title: "Gaming thumbnail system" },
  { id: "2", imageUrl: "https://placehold.co/600x360/262833/38e991?text=Channel+Art", category: "Channel Art", title: "Creator channel rebrand" },
  { id: "3", imageUrl: "https://placehold.co/600x360/262833/38e991?text=Branding", category: "Branding", title: "Podcast identity pack" },
  { id: "4", imageUrl: "https://placehold.co/600x360/262833/38e991?text=Thumbnail+Design", category: "Thumbnail Design", title: "Business YouTube redesign" },
  { id: "5", imageUrl: "https://placehold.co/600x360/262833/38e991?text=YouTube+Package", category: "YouTube Package", title: "Tech creator visuals" },
  { id: "6", imageUrl: "https://placehold.co/600x360/262833/38e991?text=Content+Design", category: "Content Design", title: "Shorts / reels thumb pack" },
];

type Props = {
  items?: WorkItem[];
};

export default function WorkPreviewSection({ items = [] }: Props) {
  const works = items.length > 0 ? items.slice(0, 6) : FALLBACK_WORKS;
  const featured = works[0];
  const rest = works.slice(1, 6);

  return (
    <section
      id="work-preview"
      className="bg-white py-24 text-[var(--brand-dark)] sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--brand-mint)]">
              Work Preview
            </p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
              Real work that makes brands look sharper.
            </h2>
            <p className="mt-4 text-base leading-7 text-[var(--brand-dark)]/65">
              A quick look at thumbnails, branding, and creator assets designed
              to help channels and businesses stand out fast.
            </p>
          </div>

          <Link
            href="/contact"
            className="inline-flex w-fit items-center rounded-full border border-[var(--brand-dark)]/10 px-5 py-3 text-sm font-medium transition hover:scale-[1.02] hover:border-[var(--brand-dark)]/20 hover:bg-[var(--brand-dark)]/[0.03]"
          >
            Request your design
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-5">
          {/* Featured big item — spans 2 cols, 2 rows on lg */}
          {featured && (
            <Link
              href="/portfolio"
              className="group relative overflow-hidden rounded-[28px] border border-black/6 bg-[#f8faf9] sm:col-span-2 lg:row-span-2"
            >
              <div className="relative aspect-[16/10] overflow-hidden sm:aspect-auto sm:h-full sm:min-h-[280px] lg:min-h-[360px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={featured.imageUrl}
                  alt={featured.title || featured.category}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                <div className="absolute inset-0 bg-black/0 transition duration-300 group-hover:bg-black/40" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <span className="inline-block rounded-full bg-[var(--brand-mint)]/90 px-3 py-1 text-xs font-semibold text-[var(--brand-dark)]">
                    {RESULT_BADGES[0]}
                  </span>
                  <p className="mt-3 text-[11px] font-medium uppercase tracking-[0.18em] text-white/65">
                    {featured.category}
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
                    {featured.title || featured.category}
                  </h3>
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 transition duration-300 group-hover:opacity-100">
                  <span className="rounded-full bg-white/95 px-5 py-2.5 text-sm font-semibold text-[var(--brand-dark)]">
                    View project →
                  </span>
                </div>
              </div>
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px w-0 bg-gradient-to-r from-transparent via-[var(--brand-mint)] to-transparent transition-all duration-500 group-hover:w-full" />
            </Link>
          )}

          {/* Smaller tiles */}
          {rest.map((item, idx) => (
            <Link
              key={item.id}
              href="/portfolio"
              className="group relative overflow-hidden rounded-[28px] border border-black/6 bg-[#f8faf9]"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.imageUrl}
                  alt={item.title || item.category}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
                <div className="absolute inset-0 bg-black/0 transition duration-300 group-hover:bg-black/50" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <span className="inline-block rounded-full bg-[var(--brand-mint)]/90 px-2.5 py-0.5 text-[10px] font-semibold text-[var(--brand-dark)]">
                    {RESULT_BADGES[(idx + 1) % RESULT_BADGES.length]}
                  </span>
                  <p className="mt-2 text-[11px] font-medium uppercase tracking-[0.18em] text-white/65">
                    {item.category}
                  </p>
                  <h3 className="mt-1.5 text-lg font-semibold text-white">
                    {item.title || item.category}
                  </h3>
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 transition duration-300 group-hover:opacity-100">
                  <span className="rounded-full bg-white/95 px-4 py-2 text-sm font-semibold text-[var(--brand-dark)]">
                    View project →
                  </span>
                </div>
              </div>

              <div className="relative px-5 py-4">
                <div className="absolute left-5 right-5 top-0 h-px bg-black/6" />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--brand-dark)]/60">
                    View project
                  </span>
                  <span className="translate-x-0 text-[var(--brand-dark)]/40 transition group-hover:translate-x-1 group-hover:text-[var(--brand-dark)]">
                    ↗
                  </span>
                </div>
              </div>

              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px w-0 bg-gradient-to-r from-transparent via-[var(--brand-mint)] to-transparent transition-all duration-500 group-hover:w-full" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
