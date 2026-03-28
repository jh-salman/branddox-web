"use client";

import Link from "next/link";
import Image from "next/image";

export type ClientFromApi = {
  id: string;
  channelName: string;
  channelUrl: string;
  imageUrl: string;
  logoUrl?: string;
  subscriberCount?: string;
  description?: string;
};

type DisplayClient = {
  id: string;
  name: string;
  url: string;
  image: string;
  logo: string;
  subscribers?: string;
  description?: string;
  type?: string;
  size: "lg" | "md" | "sm";
};

const SIZE_SPAN: Record<DisplayClient["size"], string> = {
  lg: "lg:col-span-5 lg:row-span-2",
  md: "lg:col-span-4 lg:row-span-1",
  sm: "lg:col-span-3 lg:row-span-1",
};

const SIZE_BY_INDEX: DisplayClient["size"][] = ["lg", "sm", "md", "sm", "md", "sm"];

function mapApiToDisplay(clients: ClientFromApi[]): DisplayClient[] {
  return clients.map((c, i) => ({
    id: c.id,
    name: c.channelName,
    url: c.channelUrl,
    image: c.imageUrl,
    logo: c.logoUrl || c.imageUrl,
    subscribers: c.subscriberCount?.trim()
      ? c.subscriberCount.includes("subscriber")
        ? c.subscriberCount
        : `${c.subscriberCount} subscribers`
      : undefined,
    description: c.description ?? undefined,
    type: "YouTube Channel",
    size: SIZE_BY_INDEX[i % SIZE_BY_INDEX.length],
  }));
}

function ClientTile({
  client,
  index,
}: {
  client: DisplayClient;
  index: number;
}) {
  return (
    <Link
      href={client.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`group relative min-h-[220px] overflow-hidden border border-white/10 bg-white/[0.03] ${SIZE_SPAN[client.size]}`}
    >
      <div className="absolute inset-0">
        <Image
          src={client.image}
          alt={client.name}
          fill
          sizes="(max-width: 768px) 86vw, (max-width: 1280px) 40vw, 28vw"
          className="object-cover transition duration-700 group-hover:scale-105"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.10),transparent_30%),linear-gradient(to_bottom_right,var(--brand-mint)/0.08,transparent_45%,var(--brand-green)/0.08)]" />

      {/* subtle top line */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/10" />
      {/* hover glow line */}
      <div className="pointer-events-none absolute bottom-0 left-0 h-px w-0 bg-gradient-to-r from-[var(--brand-mint)]/0 via-[var(--brand-mint)]/90 to-[var(--brand-green)]/0 transition-all duration-500 group-hover:w-full" />

      <div className="relative flex h-full flex-col justify-between p-5 sm:p-6">
        <div className="flex items-start justify-between">
          <span className="inline-flex border-b border-white/20 pb-1 text-[11px] uppercase tracking-[0.22em] text-white/50">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="translate-x-2 text-white/70 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
            ↗
          </span>
        </div>

        <div className="max-w-[88%]">
          {client.type && (
            <p className="mb-2 text-[11px] uppercase tracking-[0.18em] text-white/45">
              {client.type}
            </p>
          )}
          <h3 className="text-2xl font-semibold leading-tight sm:text-3xl">
            {client.name}
          </h3>
          {client.subscribers && (
            <p className="mt-3 text-sm text-white/80">{client.subscribers}</p>
          )}
          {client.description && (
            <p className="mt-3 max-w-sm text-sm leading-6 text-white/72">
              {client.description}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}

type Props = {
  clients: ClientFromApi[];
};

export default function TopClientsShowcase({ clients }: Props) {
  const displayClients = mapApiToDisplay(clients);
  const marqueeClients = [...displayClients, ...displayClients];
  const featuredClients = displayClients;

  return (
    <section className="relative overflow-hidden bg-[var(--brand-dark)] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-8%] top-[-12%] h-[360px] w-[360px] rounded-full bg-[var(--brand-mint)]/10 blur-3xl" />
        <div className="absolute bottom-[-15%] right-[-10%] h-[420px] w-[420px] rounded-full bg-[var(--brand-green)]/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_30%)]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        {/* Heading */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.25em] text-white/45">
            Our Top Clients
          </p>
          <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Trusted by creators and brands that care about how they show up.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/60 sm:text-base">
            From YouTube channels to emerging brands, we design visuals that
            sharpen identity, increase recognition, and elevate content.
          </p>
        </div>

        {displayClients.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.02] py-16 text-center">
            <p className="text-white/60">No clients listed yet. Check back soon.</p>
          </div>
        ) : (
          <>
            {/* Auto-scrolling marquee */}
            <div className="mt-10 overflow-hidden border-y border-white/10 bg-white/[0.02]">
              <div className="marquee-clients flex min-w-max items-center gap-12 py-5">
                {marqueeClients.map((client, i) => (
                  <Link
                    key={`${client.id}-${i}`}
                    href={client.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex shrink-0 items-center gap-3 text-white/70 transition hover:text-white"
                  >
                    <div className="relative h-7 w-7 shrink-0 overflow-hidden rounded-full border border-white/10">
                      <Image
                        src={client.logo}
                        alt={`${client.name} logo`}
                        fill
                        sizes="28px"
                        className="object-cover"
                      />
                    </div>
                    <span className="whitespace-nowrap text-sm font-medium sm:text-base">
                      {client.name}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Desktop mosaic */}
            <div className="mt-10 hidden auto-rows-[220px] grid-cols-1 gap-4 md:grid lg:grid-cols-12">
              {featuredClients.map((client, index) => (
                <ClientTile key={client.id} client={client} index={index} />
              ))}
            </div>

            {/* Mobile swipe layout */}
            <div className="mt-8 md:hidden">
              <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-3">
                {featuredClients.map((client, index) => (
                  <div key={client.id} className="w-[86%] shrink-0 snap-center">
                    <ClientTile client={client} index={index} />
                  </div>
                ))}
              </div>
              <div className="mt-3 flex justify-center gap-2">
                {featuredClients.map((client) => (
                  <span
                    key={client.id}
                    className="h-1.5 w-1.5 rounded-full bg-white/25"
                    aria-hidden
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
