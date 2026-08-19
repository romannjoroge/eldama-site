import { clients, partnerBadges } from "~/data/site";

export function TrustBar() {
  return (
    <section className="bg-canvas py-10">
      <div className="container-site">
        <p className="text-center text-xs font-bold uppercase tracking-[0.08em] text-mute">
          Certified partner of
        </p>
        <ul className="mt-4 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
          {partnerBadges.map((badge) => (
            <li
              key={badge}
              className="chip px-3.5 py-2 text-sm font-semibold text-body"
            >
              {badge}
            </li>
          ))}
        </ul>

        <div className="mt-8 border-t border-hairline-soft pt-8">
          <p className="text-center text-xs font-bold uppercase tracking-[0.08em] text-mute">
            Trusted by
          </p>
          <ul className="mt-4 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {clients.map((client) => (
              <li
                key={client.name}
                className="flex items-center gap-2.5 text-body"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-md bg-surface-soft text-sm font-extrabold text-ink">
                  {client.name.charAt(0)}
                </span>
                <span className="text-base font-bold tracking-tight text-ink">
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
