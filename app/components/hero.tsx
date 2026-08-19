import { Icon } from "~/components/icons";
import { useQuote } from "~/components/quote-modal";
import { services } from "~/data/site";

export function Hero() {
  const { openQuote } = useQuote();

  return (
    <section className="bg-white">
      <div className="container-site grid gap-12 py-16 sm:py-20 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:py-24">
        <div>
          <p className="badge-pill">
            <Icon name="certificate" className="h-4 w-4 text-primary" />
            Certified across every service we offer
          </p>
          <h1 className="mt-6 text-4xl font-bold leading-[1.12] tracking-tight text-ink sm:text-5xl lg:text-[3.25rem]">
            Your outsourced IT department, without the headcount.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-body">
            Eldama is one certified partner for Microsoft 365, networking,
            security, cloud, and email — so growing businesses get
            enterprise-grade IT without building an in-house team or juggling
            five vendors.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => openQuote()}
              className="btn-primary"
            >
              Get a Quote
              <Icon name="arrow" className="h-4 w-4" />
            </button>
            <a href="#services" className="btn-secondary">
              See our services
            </a>
          </div>

          {/* Service finder pill — opens the quote flow from anywhere */}
          <button
            type="button"
            onClick={() => openQuote()}
            className="mt-10 flex h-16 w-full max-w-xl items-center gap-3 rounded-full border border-hairline bg-white pl-5 pr-2 text-left shadow-lift transition-shadow duration-150 hover:border-border-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
          >
            <span className="min-w-0 flex-1">
              <span className="block text-xs font-semibold uppercase tracking-[0.08em] text-muted">
                What does your business need?
              </span>
              <span className="block truncate text-sm text-muted-soft">
                Microsoft 365, firewall, backup, email security…
              </span>
            </span>
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-white">
              <Icon name="arrow" className="h-5 w-5" />
            </span>
          </button>

          <dl className="mt-10 grid max-w-md grid-cols-3 divide-x divide-hairline-soft">
            <Stat value="15+" label="Years in business" />
            <Stat value="12" label="Certifications held" />
            <Stat value="200+" label="Clients served" />
          </dl>
        </div>

        <div className="rounded-card border border-hairline-soft bg-white p-6 shadow-lift sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.08em] text-muted">
            One partner. Five disciplines.
          </p>
          <ul className="mt-5 space-y-2">
            {services.map((service) => (
              <li
                key={service.slug}
                className="flex items-center gap-3 rounded-card border border-hairline-soft bg-surface-soft/60 px-4 py-3"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-ink">
                  <Icon name={service.icon} className="h-5 w-5" />
                </span>
                <span className="text-sm font-semibold text-ink">
                  {service.name}
                </span>
                <Icon name="check" className="ml-auto h-4 w-4 text-muted" />
              </li>
            ))}
          </ul>
          <p className="mt-5 text-sm leading-relaxed text-body">
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
    <div className="px-4 first:pl-0 last:pr-0">
      <dt className="sr-only">{label}</dt>
      <dd className="text-2xl font-bold text-ink">{value}</dd>
      <dd className="mt-0.5 text-xs text-muted">{label}</dd>
    </div>
  );
}
