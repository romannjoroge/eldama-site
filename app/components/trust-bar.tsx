import { clients, partnerBadges } from "~/data/site";

export function TrustBar() {
  return (
    <section className="border-y border-hairline bg-white py-10">
      <div className="container-site">
        <p className="text-center text-xs font-bold uppercase tracking-[0.14em] text-graphite">
          Certified partner of
        </p>
        <ul className="mt-4 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
          {partnerBadges.map((badge) => (
            <li
              key={badge}
              className="rounded-[8px] border border-hairline bg-cloud px-3.5 py-2 text-[14px] font-medium text-charcoal"
            >
              {badge}
            </li>
          ))}
        </ul>

        <div className="mt-8 border-t border-hairline pt-8">
          <p className="text-center text-xs font-bold uppercase tracking-[0.14em] text-graphite">
            Trusted by
          </p>
          <ul className="mt-4 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {clients.map((client) => (
              <li
                key={client.name}
                className="flex items-center gap-3"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-[4px] bg-ink text-[12px] font-bold text-white">
                  {client.name.charAt(0)}
                </span>
                <div className="text-left">
                  <span className="block text-[15px] font-semibold text-ink">
                    {client.name}
                  </span>
                  <span className="block text-[12px] text-graphite">
                    {client.proof}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
