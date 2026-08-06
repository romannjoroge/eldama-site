import { clients, partnerBadges } from "~/data/site";

export function TrustBar() {
  return (
    <section className="border-b border-navy-100 bg-white py-10">
      <div className="container-site">
        <p className="text-center text-xs font-bold uppercase tracking-[0.18em] text-navy-400">
          Certified partner of
        </p>
        <ul className="mt-4 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
          {partnerBadges.map((badge) => (
            <li
              key={badge}
              className="rounded-lg border border-navy-100 bg-navy-50/60 px-3.5 py-2 text-sm font-semibold text-navy-700"
            >
              {badge}
            </li>
          ))}
        </ul>

        <div className="mt-8 border-t border-navy-100 pt-8">
          <p className="text-center text-xs font-bold uppercase tracking-[0.18em] text-navy-400">
            Trusted by
          </p>
          <ul className="mt-4 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {clients.map((client) => (
              <li
                key={client.name}
                className="flex items-center gap-2 text-navy-500"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-navy-900 text-[11px] font-extrabold text-white">
                  {client.name.charAt(0)}
                </span>
                <span className="text-base font-bold tracking-tight text-navy-800">
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
