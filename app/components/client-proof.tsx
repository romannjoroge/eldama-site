import { Link } from "react-router";

import { Icon } from "~/components/icons";
import { clients, services } from "~/data/site";

export function ClientProof() {
  return (
    <section id="clients" className="bg-canvas py-16 sm:py-24">
      <div className="container-site">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Client proof</p>
          <h2 className="display-lg mt-3 text-ink">
            Trusted by organisations that can't afford downtime
          </h2>
          <p className="lead mt-4 text-ink-muted-80">
            From construction groups to hospitals to retail, we run the IT that
            keeps their people productive and their operations secure.
          </p>
        </div>

        <ul className="mt-12 grid gap-4 md:grid-cols-3">
          {clients.map((client) => {
            const related = services.find((service) =>
              service.clientProof.some((proof) => proof.client === client.name),
            );
            return (
              <li
                key={client.name}
                className="flex flex-col rounded-lg border border-hairline bg-white p-6"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-md bg-ink text-[17px] font-semibold text-white">
                    {client.name.charAt(0)}
                  </span>
                  <div>
                    <p className="text-[17px] font-semibold leading-[1.24] tracking-[-0.374px] text-ink">
                      {client.name}
                    </p>
                    <p className="text-xs tracking-[-0.12px] text-ink-muted-48">
                      Client
                    </p>
                  </div>
                </div>
                <p className="mt-4 flex-1 text-[15px] leading-[1.47] tracking-[-0.224px] text-ink-muted-80">
                  {client.proof}
                </p>
                {related && (
                  <Link
                    to={`/services/${related.slug}`}
                    className="text-link-sm mt-5"
                  >
                    See how
                    <Icon name="arrow" className="h-4 w-4" />
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
