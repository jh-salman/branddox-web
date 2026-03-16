import Link from "next/link";
import { MegaphoneIcon } from "./MegaphoneIcon";

export function Hero() {
  return (
    <section className="relative min-h-[90vh] overflow-hidden bg-[var(--brand-dark)] px-4 pt-16 pb-24 sm:px-6 sm:pt-20 sm:pb-32">
      {/* Background gradient + subtle glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -20%, var(--brand-mint), transparent 60%), radial-gradient(ellipse 60% 40% at 100% 50%, rgba(56, 233, 145, 0.15), transparent 50%)",
        }}
      />
      <div
        className="animate-glow pointer-events-none absolute right-0 top-1/4 h-96 w-96 rounded-full bg-[var(--brand-mint)] blur-[120px]"
        aria-hidden
      />

      <div className="relative mx-auto max-w-4xl text-center">
        <div
          className="animate-fade-in-up mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--brand-mint)]/40 bg-[var(--brand-mint)]/10 px-4 py-2 text-sm font-medium text-[var(--brand-mint)]"
          style={{ animationDelay: "0.1s", animationFillMode: "both" }}
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--brand-mint)] opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--brand-mint)]" />
          </span>
          Direct orders · WhatsApp & email
        </div>

        <h1
          className="animate-fade-in-up mb-5 text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
          style={{ animationDelay: "0.2s", animationFillMode: "both" }}
        >
          Elevate Your
          <span className="block text-[var(--brand-mint)]">Professional Presence</span>
        </h1>

        <p
          className="animate-fade-in-up mx-auto mb-4 max-w-2xl text-lg text-white/90 sm:text-xl"
          style={{ animationDelay: "0.3s", animationFillMode: "both" }}
        >
          Doctors, dentists, engineers, lawyers—we help you stand out online with
          thumbnails, graphics, and branding that get you seen and trusted.
        </p>

        <p
          className="animate-fade-in-up mb-10 text-base font-semibold uppercase tracking-widest text-[var(--brand-mint)]"
          style={{ animationDelay: "0.35s", animationFillMode: "both" }}
        >
          Be seen. Be trusted.
        </p>

        <div
          className="animate-fade-in-up flex flex-col items-center justify-center gap-4 sm:flex-row"
          style={{ animationDelay: "0.4s", animationFillMode: "both" }}
        >
          <Link
            href="#contact"
            className="group inline-flex w-full max-w-xs items-center justify-center gap-2 rounded-full bg-[var(--brand-mint)] px-8 py-4 text-lg font-bold text-[var(--brand-dark)] shadow-lg shadow-[var(--brand-mint)]/25 transition hover:scale-[1.02] hover:bg-[var(--brand-green)] hover:shadow-[var(--brand-mint)]/40 sm:w-auto"
          >
            Start a project
            <span className="transition group-hover:translate-x-0.5" aria-hidden>
              →
            </span>
          </Link>
          <Link
            href="#services"
            className="inline-flex w-full max-w-xs items-center justify-center rounded-full border-2 border-white/40 bg-white/5 px-8 py-4 text-lg font-semibold text-white backdrop-blur-sm transition hover:border-[var(--brand-mint)] hover:bg-[var(--brand-mint)]/10 hover:text-[var(--brand-mint)] sm:w-auto"
          >
            See what I offer
          </Link>
        </div>

        <div className="animate-fade-in-up mt-14 flex justify-center" style={{ animationDelay: "0.6s", animationFillMode: "both" }}>
          <div className="animate-float flex flex-col items-center gap-2 text-white/50">
            <MegaphoneIcon className="h-6 w-6" accent="white" />
            <span className="text-xs uppercase tracking-widest">Scroll</span>
          </div>
        </div>
      </div>
    </section>
  );
}
