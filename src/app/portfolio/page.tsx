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
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-[var(--background)] py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6">
          <h1 className="mb-3 text-4xl font-bold text-[var(--brand-dark)] sm:text-5xl">
            Portfolio
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-[var(--brand-dark)]/80">
            A selection of branding, graphics, thumbnails, and design work for YouTube, social
            media, and professional brands.
          </p>
        </div>
        <div className="mt-10">
          <PortfolioGallery items={items} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
