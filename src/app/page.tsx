import { Header } from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ClientMarquee from "@/components/ClientMarquee";
import WorkPreviewSection from "@/components/WorkPreviewSection";
import { Services } from "@/components/Services";
import { Reviews } from "@/components/Reviews";
import { About } from "@/components/About";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { ContactSection } from "@/components/ContactSection";

const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000").replace(/\/$/, "");

async function fetchServices() {
  try {
    const res = await fetch(`${API_BASE}/services`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

async function fetchPortfolio() {
  try {
    const res = await fetch(`${API_BASE}/portfolio`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

async function fetchClients() {
  try {
    const res = await fetch(`${API_BASE}/clients`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export default async function Home() {
  const [serviceItems, portfolioItems, clientItems] = await Promise.all([
    fetchServices(),
    fetchPortfolio(),
    fetchClients(),
  ]);

  const servicesForSection =
    serviceItems.length > 0
      ? serviceItems.map((s: { title: string; description: string; benefit: string }) => ({
          title: s.title,
          description: s.description,
          benefit: s.benefit,
        }))
      : null;

  const heroImageUrls = [
    "/portfolio/1.png",
    "/portfolio/2.png",
    "/portfolio/3.png",
    "/portfolio/4.png",
  ];

  const marqueeClients = clientItems.map(
    (c: { channelName: string; channelUrl: string }) => ({
      name: c.channelName,
      url: c.channelUrl || "/our-clients",
    })
  );

  const workPreviewItems = portfolioItems.slice(0, 6).map(
    (p: { id: string; imageUrl: string; category: string; title?: string | null }) => ({
      id: p.id,
      imageUrl: p.imageUrl,
      category: p.category,
      title: p.title ?? undefined,
    })
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection heroImageUrls={heroImageUrls} />
        <ClientMarquee clients={marqueeClients} />
        <WorkPreviewSection items={workPreviewItems} />

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
