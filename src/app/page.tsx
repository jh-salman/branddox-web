import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { TrustStrip } from "@/components/TrustStrip";
import { Services } from "@/components/Services";
import { Reviews } from "@/components/Reviews";
import { About } from "@/components/About";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { ContactSection } from "@/components/ContactSection";

async function fetchServices() {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";
  try {
    const res = await fetch(`${base.replace(/\/$/, "")}/services`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export default async function Home() {
  const serviceItems = await fetchServices();
  const servicesForSection = serviceItems.length > 0
    ? serviceItems.map((s: { title: string; description: string; benefit: string }) => ({
        title: s.title,
        description: s.description,
        benefit: s.benefit,
      }))
    : null;
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <AnimateOnScroll>
          <TrustStrip />
        </AnimateOnScroll>
        <AnimateOnScroll>
          <Services items={servicesForSection} />
        </AnimateOnScroll>
        <AnimateOnScroll>
          <Reviews />
        </AnimateOnScroll>
        <AnimateOnScroll>
          <About />
        </AnimateOnScroll>
        <AnimateOnScroll>
          <CTA />
        </AnimateOnScroll>
        <AnimateOnScroll>
          <ContactSection />
        </AnimateOnScroll>
      </main>
      <Footer />
    </div>
  );
}
