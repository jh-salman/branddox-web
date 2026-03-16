export function Testimonials() {
  const quotes = [
    {
      text: "My channel finally looks professional. Thumbnails and banner are exactly what I wanted.",
      role: "YouTube creator",
    },
    {
      text: "Fast, clear communication and designs that get attention. Will order again.",
      role: "Business owner",
    },
  ];

  return (
    <section className="border-t border-[var(--brand-dark)]/10 bg-[var(--brand-white)] px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-5xl">
        <p className="mb-2 text-center text-sm font-semibold uppercase tracking-widest text-[var(--brand-mint)]">
          What clients say
        </p>
        <h2 className="mb-12 text-center text-2xl font-bold text-[var(--brand-dark)] sm:text-3xl">
          Trusted by professionals
        </h2>
        <div className="grid gap-8 sm:grid-cols-2">
          {quotes.map((q, i) => (
            <blockquote
              key={i}
              className="rounded-2xl border border-[var(--brand-dark)]/10 bg-white p-6 shadow-sm"
            >
              <p className="mb-4 text-[var(--brand-dark)]/90">&ldquo;{q.text}&rdquo;</p>
              <footer className="text-sm font-medium text-[var(--brand-dark)]/70">— {q.role}</footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
