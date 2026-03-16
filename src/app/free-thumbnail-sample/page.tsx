"use client";

import { useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";

const WEBHOOK_URL = "https://automation.branddox.com/webhook/youtube-lead";

export default function FreeThumbnailSamplePage() {
  const [submitState, setSubmitState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const channelUrl = String(formData.get("channel_url") ?? "").trim();
    const service = String(formData.get("service") ?? "").trim();

    const webhookBody = {
      lead_source: "website_free_thumbnail_sample",
      name,
      email,
      channel_url: channelUrl,
      service,
    };

    setSubmitState("loading");
    setErrorMessage("");

    try {
      await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(webhookBody),
      });
      await api.createLead({
        name: name || null,
        email,
        channelUrl,
        leadSource: "website_free_thumbnail_sample",
        service: service || null,
      });
      form.reset();
      setSubmitState("success");
    } catch (error) {
      console.error(error);
      setSubmitState("error");
      setErrorMessage(error instanceof Error ? error.message : "Something went wrong. Try WhatsApp/email.");
    }
  }

  return (
    <div className="min-h-screen bg-[var(--brand-dark)] text-white">
      <header className="border-b border-white/10 bg-[var(--brand-dark)]/95">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
          <h1 className="text-lg font-semibold tracking-tight">Free Thumbnail Sample</h1>
          <Link href="/" className="text-sm text-white/70 hover:text-[var(--brand-mint)]">
            ← Back to home
          </Link>
        </div>
      </header>

      <main className="mx-auto flex max-w-4xl flex-col gap-8 px-4 py-10 md:flex-row">
        <section className="flex-1 rounded-2xl bg-white/5 p-6 backdrop-blur">
          <h2 className="mb-2 text-2xl font-bold">Get a free thumbnail sample</h2>
          <p className="mb-6 text-sm text-white/80">
            I&apos;ll design one sample thumbnail based on your channel so you can see how Branddox style looks
            on your content.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Your name</label>
              <input
                type="text"
                name="name"
                className="w-full rounded-lg border border-white/15 bg-transparent px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-[var(--brand-mint)] focus:outline-none"
                placeholder="e.g. Sara, YouTuber"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Email</label>
              <input
                type="email"
                name="email"
                required
                className="w-full rounded-lg border border-white/15 bg-transparent px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-[var(--brand-mint)] focus:outline-none"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">YouTube channel URL</label>
              <input
                type="url"
                name="channel_url"
                required
                className="w-full rounded-lg border border-white/15 bg-transparent px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-[var(--brand-mint)] focus:outline-none"
                placeholder="https://youtube.com/@yourchannel"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Service</label>
              <select
                name="service"
                className="w-full rounded-lg border border-white/15 bg-[var(--brand-dark)] px-3 py-2 text-sm text-white focus:border-[var(--brand-mint)] focus:outline-none"
                defaultValue="Thumbnail Design"
              >
                <option>Thumbnail Design</option>
                <option>YouTube Video Editing</option>
                <option>Shorts Repurposing</option>
                <option>Channel Branding</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={submitState === "loading"}
              className="mt-2 w-full rounded-full bg-[var(--brand-mint)] px-4 py-2.5 text-sm font-semibold text-[var(--brand-dark)] transition hover:bg-[var(--brand-green)] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitState === "loading" ? "Sending…" : "Request free thumbnail sample"}
            </button>
            {submitState === "success" && (
              <p className="mt-3 text-sm font-medium text-[var(--brand-mint)]">
                ✓ Request received. We&apos;ll send your sample soon.
              </p>
            )}
            {submitState === "error" && (
              <p className="mt-3 text-sm text-red-400">
                {errorMessage}
              </p>
            )}
          </form>
        </section>

        <aside className="md:w-64 space-y-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/80">
            <h3 className="mb-2 text-sm font-semibold text-white">How it works</h3>
            <ol className="list-decimal space-y-1 pl-4">
              <li>You share your channel and service.</li>
              <li>I pick one video and design a thumbnail.</li>
              <li>You review and decide if we work together.</li>
            </ol>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-white/70">
            <p className="font-semibold text-[var(--brand-mint)] mb-1">Automation note</p>
            <p>
              This request also goes into the same n8n pipeline so your channel can be researched and scored.
            </p>
          </div>
        </aside>
      </main>
    </div>
  );
}

