const WHY_ITEMS = [
  { title: "No outsourcing", desc: "I do the work. No agency layers or generic templates." },
  { title: "Fast delivery", desc: "No endless back-and-forth. Clear timelines." },
  { title: "Revisions included", desc: "We get it right. Revisions are part of the deal." },
  { title: "Direct WhatsApp", desc: "Talk to me directly. Fast, clear communication." },
];

export function About() {
  return (
    <section id="about" className="bg-[var(--brand-dark)] px-4 py-24 sm:px-6 sm:py-32">
      <div className="mx-auto max-w-4xl">
        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-[var(--brand-mint)]">
          Why Branddox
        </p>
        <h2 className="mb-6 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          One partner for your digital presence
        </h2>
        <p className="mb-12 text-lg leading-relaxed text-white/90">
          I’m the founder and the one doing the work—graphics, Canva, YouTube services, SEO, and
          thumbnails. You talk directly to me on WhatsApp or email and we shape your brand together.
        </p>

        <div className="grid gap-6 sm:grid-cols-2">
          {WHY_ITEMS.map((item, i) => (
            <div key={i} className="flex gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:scale-[1.02] hover:border-[var(--brand-mint)]/20">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--brand-mint)]/20 text-lg font-bold text-[var(--brand-mint)]">
                ✓
              </span>
              <div>
                <h3 className="font-semibold text-white">{item.title}</h3>
                <p className="mt-1 text-sm text-white/80">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Personal brand block */}
        <div className="mt-14 rounded-2xl border border-[var(--brand-mint)]/20 bg-[var(--brand-mint)]/10 p-6 sm:p-8">
          <h3 className="text-lg font-bold text-white sm:text-xl">
            Work directly with Branddox
          </h3>
          <p className="mt-2 text-white/90">
            No agency. No middleman. You talk directly to me.
          </p>
        </div>
      </div>
    </section>
  );
}
