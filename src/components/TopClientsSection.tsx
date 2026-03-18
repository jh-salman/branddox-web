import Link from "next/link";

export type ClientFromApi = {
  id: string;
  channelName: string;
  channelUrl: string;
  imageUrl: string;
  subscriberCount?: string;
  description?: string;
};

/** Bento grid span pattern (12-col grid). Cycles for any number of clients. */
const SPAN_PATTERN = [
  "lg:col-span-5 lg:row-span-2",
  "lg:col-span-3 lg:row-span-1",
  "lg:col-span-4 lg:row-span-1",
  "lg:col-span-4 lg:row-span-1",
  "lg:col-span-4 lg:row-span-2",
  "lg:col-span-4 lg:row-span-1",
];

type Props = {
  clients: ClientFromApi[];
};

export function TopClientsSection({ clients }: Props) {
  if (clients.length === 0) {
    return (
      <section className="relative overflow-hidden bg-[var(--brand-dark)] px-4 py-20 sm:px-6 sm:py-28">
        <div className="relative mx-auto max-w-7xl px-6 md:px-8 lg:px-12">
          <div className="mb-12 max-w-2xl">
            <p className="mb-3 text-sm uppercase tracking-[0.22em] text-white/50">
              Our Top Clients
            </p>
            <h2 className="text-4xl font-semibold tracking-tight text-white md:text-5xl">
              Trusted by creators and brands that care about how they show up.
            </h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-white/65 md:text-lg">
              From YouTube channels to emerging brands, we craft visuals that
              sharpen identity, elevate content, and make audiences stop scrolling.
            </p>
          </div>
          <div className="rounded-2xl border-2 border-dashed border-white/10 bg-white/5 py-16 text-center">
            <p className="text-white/60">No clients listed yet. Check back soon.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden bg-[var(--brand-dark)] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_35%),radial-gradient(circle_at_bottom_right,var(--brand-mint)/0.12,transparent_30%)]" />

      <div className="relative mx-auto max-w-7xl px-6 py-20 md:px-8 lg:px-12">
        <div className="mb-12 max-w-2xl">
          <p className="mb-3 text-sm uppercase tracking-[0.22em] text-white/50">
            Our Top Clients
          </p>
          <h2 className="text-4xl font-semibold tracking-tight text-white md:text-5xl">
            Trusted by creators and brands that care about how they show up.
          </h2>
          <p className="mt-4 max-w-xl text-base leading-7 text-white/65 md:text-lg">
            From YouTube channels to emerging brands, we craft visuals that
            sharpen identity, elevate content, and make audiences stop scrolling.
          </p>
        </div>

        <div className="grid auto-rows-[220px] grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-12">
          {clients.map((client, index) => {
            const span = SPAN_PATTERN[index % SPAN_PATTERN.length];
            return (
              <Link
                key={client.id}
                href={client.channelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`group relative overflow-hidden ${span} min-h-[220px]`}
              >
                <div className="absolute inset-0">
                  <img
                    src={client.imageUrl}
                    alt={client.channelName}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                  />
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-95" />
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />

                <div className="relative flex h-full flex-col justify-between p-5 md:p-6">
                  <div className="flex items-start justify-between">
                    <span className="inline-block border-b border-white/20 pb-1 text-xs uppercase tracking-[0.18em] text-white/50">
                      {index + 1 < 10 ? `0${index + 1}` : index + 1}
                    </span>
                    <span className="translate-x-2 opacity-0 transition duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                      ↗
                    </span>
                  </div>

                  <div className="max-w-md">
                    <h3 className="text-xl font-medium leading-tight md:text-2xl">
                      {client.channelName}
                    </h3>

                    {client.subscriberCount && (
                      <p className="mt-2 text-sm text-white/70">
                        {client.subscriberCount}
                      </p>
                    )}

                    {client.description && (
                      <p className="mt-3 max-w-sm text-sm leading-6 text-white/75 md:text-[15px]">
                        {client.description}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
