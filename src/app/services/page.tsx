import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ServiceCard } from "@/components/ServiceCard";

const SERVICES = [
  {
    title: "YouTube Video Editing",
    description: "End-to-end editing for long-form videos with pacing, cuts, b-roll, and hooks.",
    benefit: "→ Keep viewers watching longer",
  },
  {
    title: "Thumbnail Design",
    description: "High-CTR thumbnail systems that match your niche and audience psychology.",
    benefit: "→ More clicks from the same impressions",
  },
  {
    title: "Shorts Repurposing",
    description: "Turn long-form content into shorts optimized for YouTube, Reels, and TikTok.",
    benefit: "→ Post more without burning out",
  },
  {
    title: "Channel Branding",
    description: "Logo, banner, overlays, and full visual identity for your channel.",
    benefit: "→ Look like a top-tier creator",
  },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)]">
      <Header />
      <main className="flex-1 py-12 sm:py-16">
        <section className="mx-auto max-w-5xl px-4 sm:px-6">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--brand-mint)]">
            Services
          </p>
          <h1 className="mb-4 text-3xl font-bold text-[var(--brand-dark)] sm:text-4xl md:text-5xl">
            One partner for your YouTube growth.
          </h1>
          <p className="mb-8 max-w-2xl text-[var(--brand-dark)]/80">
            Pick what you need today. As we work together, I help you build a system – not just one-off
            designs – so your channel keeps growing every month.
          </p>
        </section>

        <section className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="grid gap-6 sm:grid-cols-2">
            {SERVICES.map((s) => (
              <ServiceCard
                key={s.title}
                title={s.title}
                description={s.description}
                benefit={s.benefit}
              />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

