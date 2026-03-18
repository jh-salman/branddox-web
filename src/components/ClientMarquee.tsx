"use client";

import Link from "next/link";

const FALLBACK_CLIENTS = [
  { name: "Creator One", url: "/our-clients" },
  { name: "VisionCraft", url: "/our-clients" },
  { name: "GameVerse", url: "/our-clients" },
  { name: "Studio Four", url: "/our-clients" },
  { name: "Alpha Creator", url: "/our-clients" },
  { name: "UrbanBlend", url: "/our-clients" },
  { name: "Channel Three", url: "/our-clients" },
  { name: "Brand Six", url: "/our-clients" },
];

type Client = { name: string; url: string };

type Props = {
  /** From API: { channelName, channelUrl } mapped to { name, url }. If empty, uses fallback. */
  clients?: Client[];
};

export default function ClientMarquee({ clients = [] }: Props) {
  const list = clients.length > 0 ? clients : FALLBACK_CLIENTS;
  const looped = [...list, ...list];

  return (
    <section className="overflow-hidden border-y border-black/5 bg-[#f6f8f7]">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <p className="mb-4 text-center text-xs font-semibold uppercase tracking-[0.22em] text-[var(--brand-dark)]/45">
          Trusted by growing creators & brands
        </p>

        <div className="overflow-hidden">
          <div className="marquee-brand flex min-w-max items-center gap-10">
            {looped.map((client, i) => (
              <Link
                key={`${client.name}-${i}`}
                href={client.url}
                className="group flex shrink-0 items-center gap-3 text-[var(--brand-dark)]/60 transition hover:text-[var(--brand-dark)]"
              >
                <span className="h-2 w-2 rounded-full bg-[var(--brand-mint)] transition group-hover:scale-110" />
                <span className="whitespace-nowrap text-sm font-medium sm:text-base">
                  {client.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
