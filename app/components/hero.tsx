import { Icon } from "~/components/icons";
import { useQuote } from "~/components/quote-modal";
import { services } from "~/data/site";

export function Hero() {
  const { openQuote } = useQuote();

  return (
    <section className="border-b border-hairline-soft bg-canvas">
      <div className="container-site grid gap-12 py-16 sm:py-20 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:py-24">
        <div>
          <p className="chip">
            <Icon name="certificate" className="h-4 w-4 text-primary" />
            Certified across every service we offer
          </p>
          <h1 className="h-display mt-6">
            Your outsourced IT department,{" "}
            <span className="text-primary">without the headcount.</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-body">
            Eldama is one certified partner for Microsoft 365, networking,
            security, cloud, and email — so growing businesses get enterprise-grade
            IT without building an in-house team or juggling five vendors.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button type="button" onClick={() => openQuote()} className="btn-primary">
              Get a Quote
              <Icon name="arrow" className="h-4 w-4" />
            </button>
            <a href="#services" className="btn-secondary">
              See our services
            </a>
          </div>
          <dl className="mt-10 grid max-w-md grid-cols-3 gap-4 border-t border-hairline-soft pt-6">
            <Stat value="15+" label="Years in business" />
            <Stat value="12" label="Certifications held" />
            <Stat value="200+" label="Clients served" />
          </dl>
        </div>

        <div className="rounded-md border border-hairline bg-surface-card p-6 sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.08em] text-primary">
            One partner. Five disciplines.
          </p>
          <ul className="mt-5 space-y-2.5">
            {services.map((service) => (
              <li
                key={service.slug}
                className="flex items-center gap-3 rounded-md border border-hairline-soft bg-white px-4 py-3"
              >
                <span className="icon-tile h-9 w-9">
                  <Icon name={service.icon} className="h-5 w-5" />
                </span>
                <span className="text-sm font-semibold text-ink">
                  {service.name}
                </span>
                <Icon name="check" className="ml-auto h-4 w-4 text-primary" />
              </li>
            ))}
          </ul>
          <p className="mt-5 text-sm leading-relaxed text-mute">
            One team designs, deploys, secures, and supports the whole stack —
            and one team answers when something breaks.
          </p>
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <dt className="sr-only">{label}</dt>
      <dd className="text-2xl font-extrabold text-ink">{value}</dd>
      <dd className="mt-0.5 text-xs text-mute">{label}</dd>
    </div>
  );
}
