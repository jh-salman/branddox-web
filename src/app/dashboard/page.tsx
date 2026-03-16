"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api, type Lead } from "@/lib/api";

export default function DashboardPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<{ total: number; replied: number; notReplied: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      setError(null);
      const [listRes, statsRes] = await Promise.all([api.getLeads(), api.getLeadStats()]);
      setLeads(Array.isArray(listRes.items) ? listRes.items : []);
      setStats({
        total: statsRes.total,
        replied: statsRes.replied,
        notReplied: statsRes.notReplied,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const totalLeads = stats?.total ?? leads.length;
  const repliedCount = stats?.replied ?? leads.filter((l) => l.emailRepliedAt != null).length;
  const notRepliedCount = stats?.notReplied ?? leads.length - repliedCount;
  const websiteLeads = leads.filter((l) => l.leadSource.startsWith("website_")).length;
  const sampleLeads = leads.filter((l) => l.leadSource === "website_free_thumbnail_sample").length;

  async function markReplied(leadId: string) {
    try {
      const updated = await api.updateLead(leadId, {
        emailRepliedAt: new Date().toISOString(),
      });
      setLeads((prev) => prev.map((l) => (l.id === leadId ? updated : l)));
      if (stats)
        setStats((s) =>
          s ? { ...s, replied: s.replied + 1, notReplied: Math.max(0, s.notReplied - 1) } : s
        );
    } catch {
      setError("Could not mark as replied. Is the backend running?");
    }
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <header className="sticky top-0 z-10 border-b border-[var(--brand-dark)]/10 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-[var(--brand-dark)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-white">
              Branddox Dashboard
            </span>
            <span className="text-sm text-[var(--brand-dark)]/70 hidden sm:inline">
              Quick overview of your brand performance
            </span>
          </div>
          <Link
            href="/"
            className="rounded-lg bg-[var(--brand-dark)]/90 px-3 py-1.5 text-sm font-medium text-white hover:bg-[var(--brand-dark)]"
          >
            ← Back to site
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 space-y-8">
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-[var(--brand-dark)]/10 bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand-dark)]/60">
              Total leads
            </p>
            <p className="mt-3 text-3xl font-bold text-[var(--brand-dark)]">
              {loading ? "…" : totalLeads}
            </p>
            <p className="mt-1 text-xs text-[var(--brand-dark)]/60">
              Stored in backend.
            </p>
          </div>
          <div className="rounded-2xl border border-[var(--brand-green)]/30 bg-[var(--brand-green)]/5 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand-green)]">
              Replied
            </p>
            <p className="mt-3 text-3xl font-bold text-[var(--brand-dark)]">
              {loading ? "…" : repliedCount}
            </p>
            <p className="mt-1 text-xs text-[var(--brand-dark)]/60">
              Email reply দিয়েছ
            </p>
          </div>
          <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
              Not replied
            </p>
            <p className="mt-3 text-3xl font-bold text-[var(--brand-dark)]">
              {loading ? "…" : notRepliedCount}
            </p>
            <p className="mt-1 text-xs text-[var(--brand-dark)]/60">
              এখনো reply দেই নাই
            </p>
          </div>
          <div className="rounded-2xl border border-[var(--brand-dark)]/10 bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand-dark)]/60">
              Website / sample
            </p>
            <p className="mt-3 text-3xl font-bold text-[var(--brand-dark)]">
              {loading ? "…" : websiteLeads}
            </p>
            <p className="mt-1 text-xs text-[var(--brand-dark)]/60">
              Audit + sample forms.
            </p>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-[minmax(0,1.6fr)_minmax(0,1.2fr)]">
          <div className="rounded-2xl border border-[var(--brand-dark)]/10 bg-white p-6">
            <h2 className="mb-2 text-lg font-semibold text-[var(--brand-dark)]">Website leads</h2>
            {error && (
              <p className="mb-3 text-sm text-red-600">
                {error} – check that the backend is running and NEXT_PUBLIC_API_BASE_URL is set.
              </p>
            )}
            <div className="overflow-hidden rounded-xl border border-[var(--brand-dark)]/10">
              <table className="min-w-full divide-y divide-[var(--brand-dark)]/10 text-sm">
                <thead className="bg-[var(--brand-dark)]/3">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand-dark)]/70">
                      Name
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand-dark)]/70">
                      Email
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand-dark)]/70">
                      Channel
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand-dark)]/70">
                      Replied
                    </th>
                    <th className="px-3 py-2 text-right text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand-dark)]/70">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--brand-dark)]/10 bg-white">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="px-3 py-3 text-center text-[var(--brand-dark)]/60">
                        Loading leads…
                      </td>
                    </tr>
                  ) : leads.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-3 py-3 text-center text-[var(--brand-dark)]/60">
                        No leads captured yet. Share your audit or sample links.
                      </td>
                    </tr>
                  ) : (
                    leads.map((lead) => (
                      <tr key={lead.id}>
                        <td className="px-3 py-2 text-[var(--brand-dark)]/80">
                          {lead.name || "—"}
                        </td>
                        <td className="px-3 py-2 text-[var(--brand-dark)]/80">
                          <a
                            href={`mailto:${lead.email}`}
                            className="text-[var(--brand-mint)] hover:underline"
                          >
                            {lead.email}
                          </a>
                        </td>
                        <td className="px-3 py-2 text-[var(--brand-dark)]/60">
                          <a
                            href={lead.channelUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[var(--brand-mint)] hover:underline"
                          >
                            Channel
                          </a>
                        </td>
                        <td className="px-3 py-2">
                          {lead.emailRepliedAt ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-[var(--brand-green)]/20 px-2 py-0.5 text-xs font-medium text-[var(--brand-green)]">
                              ✓ Replied
                            </span>
                          ) : (
                            <span className="inline-flex rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                              Not replied
                            </span>
                          )}
                        </td>
                        <td className="px-3 py-2 text-right">
                          {!lead.emailRepliedAt && (
                            <button
                              type="button"
                              onClick={() => markReplied(lead.id)}
                              className="rounded-lg bg-[var(--brand-mint)] px-2 py-1 text-xs font-semibold text-[var(--brand-dark)] hover:bg-[var(--brand-green)]"
                            >
                              Mark replied
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-[var(--brand-dark)]/10 bg-white p-6">
              <h3 className="mb-2 text-sm font-semibold text-[var(--brand-dark)]">
                Quick links
              </h3>
              <ul className="space-y-2 text-sm text-[var(--brand-dark)]/80">
                <li>
                  <Link href="/admin" className="hover:text-[var(--brand-mint)]">
                    → Portfolio admin
                  </Link>
                </li>
                <li>
                  <Link href="/portfolio" className="hover:text-[var(--brand-mint)]">
                    → Public portfolio
                  </Link>
                </li>
                <li>
                  <Link href="#contact" className="hover:text-[var(--brand-mint)]">
                    → Contact form on homepage
                  </Link>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-[var(--brand-green)]/30 bg-[var(--brand-green)]/5 p-6 text-sm text-[var(--brand-dark)]/80">
              <h3 className="mb-2 text-sm font-semibold text-[var(--brand-dark)]">
                ✓ Connected
              </h3>
              <p>
                This dashboard is wired to your Express + Prisma backend. Leads from the free audit and
                thumbnail sample forms show up here automatically. Use &quot;Mark replied&quot; when you&apos;ve
                emailed a lead.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

