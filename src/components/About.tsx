export function About() {
  return (
    <section id="about" className="bg-[var(--brand-dark)] px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-4xl">
        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-[var(--brand-mint)]">
          Why Branddox
        </p>
        <h2 className="mb-10 text-3xl font-bold text-white sm:text-4xl">
          One partner for your digital presence
        </h2>
        <p className="mb-10 text-lg leading-relaxed text-white/90">
          I’m the founder and the one doing the work—graphics, Canva, YouTube services, SEO, and
          thumbnails. No middleman, no generic templates. You talk directly to me on WhatsApp or
          email and we shape your brand together.
        </p>
        <ul className="mb-10 space-y-3 text-white/90">
          {[
            "Fast, clear communication — no agency layers",
            "Fast delivery — no endless back-and-forth",
            "Revisions included — we get it right",
          ].map((item, i) => (
            <li key={i} className="flex items-center gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--brand-mint)]/20 text-sm font-bold text-[var(--brand-mint)]">
                ✓
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
