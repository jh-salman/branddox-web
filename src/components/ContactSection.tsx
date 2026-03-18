 "use client";

import { WHATSAPP_NUMBER, CONTACT_EMAIL } from "@/lib/site-config";
import { useState } from "react";

export function ContactSection() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [service, setService] = useState("YouTube thumbnails");
  const [message, setMessage] = useState("");

  const baseMessage = `Hi Branddox, my name is ${name || "..."}. I want to order: ${service}.

Details:
${message || "..."}

You can reply to me at: ${email || "..."}.`;

  const whatsappUrl = WHATSAPP_NUMBER
    ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(baseMessage)}`
    : "#";

  const mailtoUrl = CONTACT_EMAIL
    ? `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
        "New Branddox order",
      )}&body=${encodeURIComponent(baseMessage)}`
    : "#";

  return (
    <section id="contact" className="bg-[var(--brand-dark)] px-4 py-24 text-white sm:px-6 sm:py-28">
      <div className="mx-auto max-w-4xl">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--brand-mint)]">
          Start your project
        </p>
        <h2 className="mb-2 text-3xl font-bold tracking-tight sm:text-4xl">Tell me what you need.</h2>
        <p className="mb-8 text-white/80">
          Fill this quick brief and send it directly to my WhatsApp or email. No Fiverr needed.
        </p>

        <div className="grid gap-8 md:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)]">
          <form
            onSubmit={(e) => e.preventDefault()}
            className="space-y-5 rounded-2xl bg-white/5 p-6 backdrop-blur"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-white/80">Your name</label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/40" aria-hidden>👤</span>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-transparent py-2.5 pl-9 pr-3 text-sm text-white placeholder:text-white/40 focus:border-[var(--brand-mint)] focus:outline-none"
                    placeholder="e.g. Dr. Ahmed, YouTuber..."
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-white/80">Email</label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/40" aria-hidden>✉️</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-transparent py-2.5 pl-9 pr-3 text-sm text-white placeholder:text-white/40 focus:border-[var(--brand-mint)] focus:outline-none"
                    placeholder="you@example.com"
                  />
                </div>
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-white/80">What do you need?</label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/40" aria-hidden>📋</span>
                <select
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-[var(--brand-dark)] py-2.5 pl-9 pr-3 text-sm text-white focus:border-[var(--brand-mint)] focus:outline-none"
                >
                  <option>YouTube thumbnails</option>
                  <option>Channel branding / banner</option>
                  <option>Logo & brand identity</option>
                  <option>Instagram / social media posts</option>
                  <option>Custom design project</option>
                </select>
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-white/80">Project details</label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-4 text-white/40" aria-hidden>💬</span>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="min-h-[120px] w-full rounded-lg border border-white/10 bg-transparent py-2.5 pl-9 pr-3 text-sm text-white placeholder:text-white/40 focus:border-[var(--brand-mint)] focus:outline-none"
                  placeholder="Share links to your channel, what style you like, deadlines, quantity, etc."
                />
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border-2 border-[var(--brand-mint)]/40 bg-[var(--brand-mint)] px-6 py-4 text-base font-bold text-[var(--brand-dark)] shadow-lg shadow-[var(--brand-mint)]/30 transition hover:scale-[1.02] hover:bg-[var(--brand-green)] hover:shadow-[var(--brand-mint)]/50"
              >
                Send on WhatsApp
              </a>
              <a
                href={mailtoUrl}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-[var(--brand-mint)] px-6 py-4 text-sm font-semibold text-white transition hover:bg-[var(--brand-mint)] hover:text-[var(--brand-dark)]"
              >
                Send as email
              </a>
            </div>
            <p className="text-xs text-white/55">
              <span className="font-medium text-[var(--brand-mint)]">Response time: under 2 hours.</span> For urgent projects, WhatsApp is faster.
            </p>
          </form>

          <div className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-white/80">
            <h3 className="text-base font-semibold text-white">How it works</h3>
            <ol className="list-decimal space-y-2 pl-4">
              <li>Share your project details and references.</li>
              <li>We confirm scope, price, and delivery time.</li>
              <li>You approve, then I start designing.</li>
              <li>Get high-quality files ready to publish.</li>
            </ol>
            <div className="mt-4 rounded-xl border border-[var(--brand-mint)]/20 bg-[var(--brand-mint)]/10 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand-mint)]">
                Preferred contact
              </p>
              <p className="mt-2 text-sm">
                <span className="font-bold text-white">WhatsApp</span> — fast back-and-forth, best for quick questions.
              </p>
              <p className="mt-1 text-sm">
                <span className="font-bold text-white">Email</span> — for detailed project briefs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

