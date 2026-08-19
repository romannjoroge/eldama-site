import { Link } from "react-router";

import { Icon } from "~/components/icons";
import { clients, services } from "~/data/site";

export function ClientProof() {
  return (
    <section id="clients" className="bg-canvas py-16 sm:py-20">
      <div className="container-site">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Client proof</p>
          <h2 className="h-section mt-3">
            Trusted by organisations that can't afford downtime
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-body">
            From construction groups to hospitals to retail, we run the IT that
            keeps their people productive and their operations secure.
          </p>
        </div>

        <ul className="mt-10 grid gap-5 md:grid-cols-3">
          {clients.map((client) => {
            const related = services.find((service) =>
              service.clientProof.some((proof) => proof.client === client.name),
            );
            return (
              <li key={client.name} className="card p-6">
                <div className="flex items-center gap-3">
                  <span className="icon-tile h-11 w-11 text-lg font-extrabold">
                    {client.name.charAt(0)}
                  </span>
                  <div>
                    <p className="font-bold tracking-tight text-ink">
                      {client.name}
                    </p>
                    <p className="text-xs text-mute">Client</p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-body">
                  {client.proof}
                </p>
                {related && (
                  <Link
                    to={`/services/${related.slug}`}
                    className="link-arrow mt-4"
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
