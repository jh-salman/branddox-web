import Link from "next/link";
import { MegaphoneIcon } from "./MegaphoneIcon";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[var(--brand-dark)] px-4 py-12 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-8 sm:flex-row">
        <Link href="/" className="flex items-center gap-2">
          <MegaphoneIcon className="h-8 w-8" accent="mint" />
          <span className="text-lg font-bold text-white">Branddox</span>
          <span className="text-sm font-normal uppercase tracking-widest text-[var(--brand-mint)]">
            Branding Design
          </span>
        </Link>
        <nav className="flex flex-wrap items-center justify-center gap-6 text-sm text-white/80">
          <Link href="#services" className="hover:text-[var(--brand-mint)]">
            Services
          </Link>
          <Link href="#about" className="hover:text-[var(--brand-mint)]">
            About
          </Link>
          <Link href="/portfolio" className="hover:text-[var(--brand-mint)]">
            Portfolio
          </Link>
          <Link href="#contact" className="hover:text-[var(--brand-mint)]">
            Contact
          </Link>
          <Link
            href="/admin"
            className="text-white/50 hover:text-[var(--brand-mint)]"
            title="Admin"
          >
            Admin
          </Link>
        </nav>
      </div>
      <p className="mt-8 text-center text-sm text-white/60">
        © {new Date().getFullYear()} Branddox. All rights reserved.
      </p>
    </footer>
  );
}
