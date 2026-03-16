export function TrustStrip() {
  return (
    <section className="border-y border-[var(--brand-dark)]/10 bg-[var(--brand-white)] py-6">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-8 px-4 sm:gap-12 sm:px-6">
        <div className="stagger flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--brand-mint)]/20 text-[var(--brand-dark)]">
            <span className="text-lg font-bold">✓</span>
          </div>
          <div>
            <p className="font-bold text-[var(--brand-dark)]">Fiverr Seller</p>
            <p className="text-sm text-[var(--brand-dark)]/70">Secure & easy orders</p>
          </div>
        </div>
        <div className="stagger flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--brand-mint)]/20 text-[var(--brand-dark)]">
            <span className="text-lg font-bold">⚡</span>
          </div>
          <div>
            <p className="font-bold text-[var(--brand-dark)]">Fast delivery</p>
            <p className="text-sm text-[var(--brand-dark)]/70">No endless waiting</p>
          </div>
        </div>
        <div className="stagger flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--brand-mint)]/20 text-[var(--brand-dark)]">
            <span className="text-lg font-bold">♻</span>
          </div>
          <div>
            <p className="font-bold text-[var(--brand-dark)]">Revisions</p>
            <p className="text-sm text-[var(--brand-dark)]/70">Until you’re happy</p>
          </div>
        </div>
      </div>
    </section>
  );
}
