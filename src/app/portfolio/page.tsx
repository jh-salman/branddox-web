import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PortfolioGallery } from "@/components/PortfolioGallery";
import { portfolioItems } from "@/data/portfolio";
import { getPortfolioItems } from "@/lib/portfolio-store";
import type { PortfolioItem } from "@/lib/portfolio-types";

export const metadata = {
  title: "Portfolio – Branddox",
  description:
    "Graphics design, Canva, thumbnails, and branding work by Branddox. Be seen. Be trusted.",
};

export const dynamic = "force-dynamic";

async function fetchPortfolioFromApi(): Promise<PortfolioItem[]> {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";
  try {
    const res = await fetch(`${base.replace(/\/$/, "")}/portfolio`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export default async function PortfolioPage() {
  const fromApi = await fetchPortfolioFromApi();
  const stored = await getPortfolioItems();
  const items =
    fromApi.length > 0 ? fromApi : stored.length > 0 ? stored : portfolioItems;

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)]">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden bg-[var(--brand-dark)] px-4 py-20 sm:px-6 sm:py-28">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,var(--brand-mint)/15%,transparent)]" />
          <div className="relative mx-auto max-w-4xl text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--brand-mint)]">
              Our work
            </p>
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
              Portfolio
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-white/80">
              Thumbnails, channel art, logos, and branding for YouTube and beyond.
              All uploads use our API and Cloudinary.
            </p>
          </div>
        </section>

        {/* Gallery */}
        <section className="py-14 sm:py-20">
          <PortfolioGallery items={items} />
        </section>
      </main>
      <Footer />
    </div>
  );
}
