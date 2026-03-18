import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { About } from "@/components/About";

export const metadata = {
  title: "About – Branddox",
  description:
    "One partner for your digital presence. Founder-led graphics, Canva, YouTube services, SEO, and thumbnails. Be seen. Be trusted.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)]">
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-[var(--brand-dark)] px-4 py-20 sm:px-6 sm:py-28">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,var(--brand-mint)/15%,transparent)]" />
          <div className="relative mx-auto max-w-4xl text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--brand-mint)]">
              Why Branddox
            </p>
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
              About
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-white/80">
              One partner for your digital presence. No middleman, no generic templates.
            </p>
          </div>
        </section>
        <About />
      </main>
      <Footer />
    </div>
  );
}
