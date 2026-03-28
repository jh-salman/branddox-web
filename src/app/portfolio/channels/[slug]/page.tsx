import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PortfolioGallery } from "@/components/PortfolioGallery";
import type { PortfolioItem } from "@/lib/portfolio-types";

export const dynamic = "force-dynamic";

type ClientRow = {
  id: string;
  slug: string;
  channelName: string;
  channelUrl: string;
  imageUrl: string;
  logoUrl?: string;
  subscriberCount?: string;
  description?: string;
};

async function fetchClient(slug: string): Promise<ClientRow | null> {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";
  try {
    const res = await fetch(
      `${base.replace(/\/$/, "")}/clients/by-slug/${encodeURIComponent(slug)}`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return null;
    return res.json() as Promise<ClientRow>;
  } catch {
    return null;
  }
}

async function fetchPortfolioForSlug(slug: string): Promise<PortfolioItem[]> {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";
  try {
    const res = await fetch(
      `${base.replace(/\/$/, "")}/portfolio?clientSlug=${encodeURIComponent(slug)}`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const client = await fetchClient(slug);
  return {
    title: client
      ? `${client.channelName} – Channel portfolio | Branddox`
      : "Channel portfolio | Branddox",
    description: client?.description || "Thumbnails, logos, and branding work for this channel.",
  };
}

export default async function ChannelPortfolioPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const client = await fetchClient(slug);
  if (!client) notFound();

  const items = await fetchPortfolioForSlug(slug);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)]">
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-[var(--brand-dark)] px-4 py-12 sm:px-6 sm:py-16">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,var(--brand-mint)/15%,transparent)]" />
          <div className="relative mx-auto max-w-4xl">
            <p className="mb-4 text-center">
              <Link
                href="/portfolio"
                className="text-sm font-semibold text-[var(--brand-mint)] hover:underline"
              >
                ← Back to portfolio
              </Link>
            </p>
            <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full bg-white/10 ring-2 ring-[var(--brand-mint)]/40">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={client.logoUrl || client.imageUrl}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--brand-mint)]">
                  Channel portfolio
                </p>
                <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  {client.channelName}
                </h1>
                {client.subscriberCount && (
                  <p className="mt-1 text-sm text-white/70">{client.subscriberCount} subscribers</p>
                )}
                {client.description && (
                  <p className="mt-3 max-w-2xl text-lg text-white/80">{client.description}</p>
                )}
                <a
                  href={client.channelUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block text-sm font-semibold text-[var(--brand-mint)] hover:underline"
                >
                  View on YouTube →
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="py-14 sm:py-20">
          <PortfolioGallery items={items} clients={[]} showChannelTabs={false} />
        </section>
      </main>
      <Footer />
    </div>
  );
}
