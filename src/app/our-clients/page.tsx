import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import TopClientsShowcase from "@/components/TopClientsShowcase";

export const metadata = {
  title: "Our Top Clients – Branddox",
  description:
    "YouTube channels and brands we've worked with. Thumbnails, channel art, and design by Branddox.",
};

export const dynamic = "force-dynamic";

async function fetchClients() {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";
  try {
    const res = await fetch(`${base.replace(/\/$/, "")}/clients`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export default async function OurClientsPage() {
  const clients = await fetchClients();

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)]">
      <Header />
      <main className="flex-1">
        <TopClientsShowcase clients={clients} />
      </main>
      <Footer />
    </div>
  );
}
