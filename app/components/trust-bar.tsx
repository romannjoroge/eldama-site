import { clients, partnerBadges } from "~/data/site";

export function TrustBar() {
  return (
    <section className="border-y border-hairline-soft bg-white py-10">
      <div className="container-site">
        <p className="text-center text-xs font-bold uppercase tracking-[0.08em] text-muted">
          Certified partner of
        </p>
        <ul className="mt-5 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
          {partnerBadges.map((badge) => (
            <li
              key={badge}
              className="rounded-full border border-navy-100 bg-navy-50 px-4 py-2 text-sm font-medium text-navy-800"
            >
              {badge}
            </li>
          ))}
        </ul>

        <div className="mt-10 border-t border-hairline-soft pt-8">
          <p className="text-center text-xs font-bold uppercase tracking-[0.08em] text-muted">
            Trusted by
          </p>
          <ul className="mt-5 flex flex-wrap items-center justify-center gap-x-12 gap-y-5">
            {clients.map((client) => (
              <li key={client.name} className="text-center">
                <p className="text-base font-semibold text-ink">
                  {client.name}
                </p>
                <p className="mt-0.5 text-xs text-muted">{client.proof}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
