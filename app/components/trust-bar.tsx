import { clients, partnerBadges } from "~/data/site";

export function TrustBar() {
  return (
    <section className="border-y border-hairline bg-parchment py-10">
      <div className="container-site">
        <p className="caption-strong text-center text-ink-muted-48">
          Certified partner of
        </p>
        <ul className="mt-4 flex flex-wrap items-center justify-center gap-2">
          {partnerBadges.map((badge) => (
            <li
              key={badge}
              className="rounded-full border border-hairline bg-white px-3.5 py-1.5 text-xs tracking-[-0.12px] text-ink-muted-80"
            >
              {badge}
            </li>
          ))}
        </ul>

        <div className="mt-8 border-t border-hairline pt-8">
          <p className="caption-strong text-center text-ink-muted-48">Trusted by</p>
          <ul className="mt-4 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {clients.map((client) => (
              <li key={client.name} className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-md bg-ink text-sm font-semibold text-white">
                  {client.name.charAt(0)}
                </span>
                <span className="text-[17px] font-semibold tracking-[-0.374px] text-ink">
                  {client.name}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
