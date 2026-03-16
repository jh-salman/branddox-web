"use client";

import Link from "next/link";

const CALENDLY_URL = "https://calendly.com/branddox/strategy-call";

export default function BookCallPage() {
  return (
    <div className="min-h-screen bg-[var(--brand-dark)] text-white">
      <header className="border-b border-white/10 bg-[var(--brand-dark)]/95">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
          <h1 className="text-lg font-semibold tracking-tight">Book a strategy call</h1>
          <Link href="/" className="text-sm text-white/70 hover:text-[var(--brand-mint)]">
            ← Back to home
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10 space-y-6">
        <section className="rounded-2xl bg-white/5 p-6 backdrop-blur">
          <h2 className="mb-2 text-2xl font-bold">Let&apos;s talk about your channel</h2>
          <p className="mb-4 text-sm text-white/80">
            Choose a time that works for you. We&apos;ll review your channel goals, bottlenecks, and what a
            done-for-you system with Branddox could look like.
          </p>
          <div className="mt-4 h-[600px] w-full overflow-hidden rounded-2xl border border-white/10 bg-black/20">
            <iframe
              src={CALENDLY_URL}
              className="h-full w-full"
              title="Branddox strategy call booking"
              frameBorder={0}
            />
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-white/70">
          <p className="font-semibold text-[var(--brand-mint)] mb-1">Prefer chat only?</p>
          <p>
            You can also start with a WhatsApp or email conversation from the homepage contact section. Calls
            are best for creators ready to move fast.
          </p>
        </section>
      </main>
    </div>
  );
}

