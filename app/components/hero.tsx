import { Link } from "react-router";

import { Icon } from "~/components/icons";
import { useQuote } from "~/components/quote-modal";
import { services } from "~/data/site";

export function Hero() {
  const { openQuote } = useQuote();

  return (
    <section className="bg-canvas">
      <div className="container-site pt-16 text-center sm:pt-24 lg:pt-28">
        <p className="eyebrow">Certified across every service we offer</p>
        <h1 className="hero-display mx-auto mt-4 max-w-4xl text-ink">
          Your outsourced IT department,{" "}
          <span className="text-primary">without the headcount.</span>
        </h1>
        <p className="lead mx-auto mt-5 max-w-2xl text-ink-muted-80">
          Eldama is one certified partner for Microsoft 365, networking,
          security, cloud, and email — so growing businesses get
          enterprise-grade IT without building an in-house team or juggling
          five vendors.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button type="button" onClick={() => openQuote()} className="btn-primary">
            Get a Quote
          </button>
          <a href="#services" className="btn-secondary">
            See our services
          </a>
        </div>
      </div>

      {/* Five disciplines — instant scan of what Eldama covers */}
      <div className="container-site pb-16 sm:pb-20 lg:pb-24">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {services.map((service) => (
            <Link
              key={service.slug}
              to={`/services/${service.slug}`}
              className="group rounded-lg border border-hairline bg-white p-5 transition-colors duration-150 hover:border-primary/40"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-parchment text-ink transition-colors duration-150 group-hover:text-primary">
                <Icon name={service.icon} className="h-5 w-5" />
              </span>
              <p className="mt-4 text-[17px] font-semibold leading-[1.24] tracking-[-0.374px] text-ink">
                {service.name}
              </p>
              <span className="text-link-sm mt-3">
                Learn more
                <Icon name="arrow" className="h-3.5 w-3.5" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
