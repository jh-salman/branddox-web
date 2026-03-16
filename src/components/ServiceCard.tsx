const icons: Record<string, string> = {
  Graphics:
    "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
  Canva:
    "M4 4h6v6H4V4zm10 0h6v6h-6V4zM4 14h6v6H4v-6zm10 0h6v6h-6v-6z",
  YouTube:
    "M10 8v8l6-4-6-4zm12-4H2a2 2 0 00-2 2v12a2 2 0 002 2h20a2 2 0 002-2V6a2 2 0 00-2-2z",
  SEO:
    "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7",
  Thumbnail:
    "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z",
};

export function ServiceCard({
  title,
  description,
  benefit,
}: {
  title: string;
  description: string;
  benefit: string;
}) {
  const path = icons[title.split(" ")[0]] || icons.Graphics;
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-[var(--brand-dark)]/10 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[var(--brand-mint)]/50 hover:shadow-lg hover:shadow-[var(--brand-mint)]/10">
      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--brand-dark)] text-[var(--brand-mint)] transition group-hover:bg-[var(--brand-mint)] group-hover:text-[var(--brand-dark)]">
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d={path} />
        </svg>
      </div>
      <h3 className="mb-2 text-xl font-bold text-[var(--brand-dark)]">{title}</h3>
      <p className="mb-3 text-[var(--brand-dark)]/70">{description}</p>
      <p className="text-sm font-semibold text-[var(--brand-mint)]">{benefit}</p>
    </div>
  );
}
