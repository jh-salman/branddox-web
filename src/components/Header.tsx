import Link from "next/link";
import { MegaphoneIcon } from "./MegaphoneIcon";
import { WHATSAPP_NUMBER } from "@/lib/site-config";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[var(--brand-dark)]">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <MegaphoneIcon className="h-8 w-8" accent="mint" />
          <span className="text-xl font-bold tracking-tight text-white">
            Branddox
          </span>
          <span className="hidden text-sm font-normal uppercase tracking-[0.2em] text-[var(--brand-mint)] sm:inline">
            Branding Design
          </span>
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link href="/services" className="text-white/90 transition hover:text-[var(--brand-mint)]">
            Services
          </Link>
          <Link href="/about" className="text-white/90 transition hover:text-[var(--brand-mint)]">
            About
          </Link>
          <Link href="/portfolio" className="text-white/90 transition hover:text-[var(--brand-mint)]">
            Portfolio
          </Link>
          <Link href="/our-clients" className="text-white/90 transition hover:text-[var(--brand-mint)]">
            Our Clients
          </Link>
          <Link href="/contact" className="text-white/90 transition hover:text-[var(--brand-mint)]">
            Contact
          </Link>
          <Link href="/reviews" className="text-white/90 transition hover:text-[var(--brand-mint)]">
            Reviews
          </Link>
          <a
            href={WHATSAPP_NUMBER ? `https://wa.me/${WHATSAPP_NUMBER}` : "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-[var(--brand-mint)] px-4 py-2 font-semibold text-[var(--brand-dark)] transition hover:bg-[var(--brand-green)] disabled:opacity-60"
          >
            Chat on WhatsApp
          </a>
        </nav>
      </div>
    </header>
  );
}
