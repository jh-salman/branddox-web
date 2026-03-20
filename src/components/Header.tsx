 "use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { WHATSAPP_NUMBER } from "@/lib/site-config";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { href: "/services", label: "Services" },
    { href: "/about", label: "About" },
    { href: "/portfolio", label: "Portfolio" },
    { href: "/our-clients", label: "Our Clients" },
    { href: "/contact", label: "Contact" },
    { href: "/reviews", label: "Reviews" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[var(--brand-dark)]">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/brand/branddox-logo-inverted.png"
            alt="Branddox"
            width={140}
            height={32}
            className="h-8 w-auto"
            priority
          />
          <span className="hidden text-sm font-normal uppercase tracking-[0.2em] text-[var(--brand-mint)] sm:inline">
            Branding Design
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 text-sm font-medium lg:flex">
          {links.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-white/90 transition hover:text-[var(--brand-mint)]"
            >
              {item.label}
            </Link>
          ))}
          <a
            href={WHATSAPP_NUMBER ? `https://wa.me/${WHATSAPP_NUMBER}` : "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-[var(--brand-mint)] px-4 py-2 font-semibold text-[var(--brand-dark)] transition hover:bg-[var(--brand-green)] disabled:opacity-60"
          >
            Chat on WhatsApp
          </a>
        </nav>

        {/* Mobile menu trigger */}
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
          className="inline-flex items-center justify-center rounded-md border border-white/15 p-2 text-white lg:hidden"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            {mobileOpen ? (
              <path d="M6 6l12 12M6 18L18 6" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu panel */}
      {mobileOpen && (
        <div className="border-t border-white/10 bg-[var(--brand-dark)] px-4 py-4 lg:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col gap-3 text-sm font-medium">
            {links.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-md px-2 py-2 text-white/90 transition hover:bg-white/5 hover:text-[var(--brand-mint)]"
              >
                {item.label}
              </Link>
            ))}
            <a
              href={WHATSAPP_NUMBER ? `https://wa.me/${WHATSAPP_NUMBER}` : "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-flex w-full items-center justify-center rounded-full bg-[var(--brand-mint)] px-4 py-2.5 font-semibold text-[var(--brand-dark)] transition hover:bg-[var(--brand-green)]"
            >
              Chat on WhatsApp
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
