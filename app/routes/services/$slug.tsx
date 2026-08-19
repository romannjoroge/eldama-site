import { Link } from "react-router";
import type { Route } from "./+types/$slug";

import { CtaBanner } from "~/components/cta-banner";
import { Icon } from "~/components/icons";
import { useQuote } from "~/components/quote-modal";
import { formatResponseTime, getService, services } from "~/data/site";

export function loader({ params }: Route.LoaderArgs) {
  const service = getService(params.slug);
  if (!service) {
    throw new Response("Service not found", { status: 404 });
  }
  return { service };
}

export function meta({ loaderData }: Route.MetaArgs) {
  const service = loaderData.service;
  return [
    { title: `${service.name} Services — Eldama` },
    {
      name: "description",
      content: `${service.description} Get a tailored quote for ${service.name} from Eldama.`,
    },
  ];
}

export default function ServicePage({ loaderData }: Route.ComponentProps) {
  const { service } = loaderData;
  const { openQuote } = useQuote();
  const crossSell = services.filter((item) =>
    service.crossSell.includes(item.slug),
  );

  return (
    <>
      {/* Header */}
      <section className="border-b border-hairline bg-white">
        <div className="container-site py-12 sm:py-16">
          <nav aria-label="Breadcrumb" className="text-[13px] text-graphite">
            <Link to="/" className="transition-colors hover:text-ink">
              Home
            </Link>
            <span className="mx-1.5" aria-hidden="true">
              /
            </span>
            <span className="text-charcoal">Services</span>
          </nav>

          <div className="mt-6 flex flex-wrap gap-2">
            {service.badges.map((badge) => (
              <span
                key={badge}
                className="badge-outline"
              >
                <Icon name="certificate" className="h-4 w-4 text-graphite" />
                {badge}
              </span>
            ))}
          </div>

          <div className="mt-5 flex items-center gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[8px] bg-ink text-white">
              <Icon name={service.icon} className="h-7 w-7" />
            </span>
            <h1 className="text-[clamp(2rem,4vw,3.4rem)] font-medium leading-[1.02] tracking-normal text-ink">
              {service.name}
            </h1>
          </div>

          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-charcoal">
            {service.intro}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => openQuote([service.slug])}
              className="btn-primary"
            >
              Get a Quote for {service.name}
              <Icon name="arrow" className="h-4 w-4" />
            </button>
            <a href="/#services" className="btn-outline-ink">
              See all services
            </a>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="bg-white py-16 sm:py-20">
        <div className="container-site grid gap-12 lg:grid-cols-[1fr_320px]">
          <div>
            <p className="text-lg leading-relaxed text-charcoal">
              {service.description}
            </p>

            <h2 className="mt-12 text-2xl font-medium tracking-normal text-ink">
              What we deliver
            </h2>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2">
              {service.tools.map((tool) => (
                <li key={tool.name} className="card p-5">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-[4px] bg-primary-soft text-primary">
                      <Icon name="check" className="h-4 w-4" />
                    </span>
                    <div>
                      <h3 className="text-[15px] font-semibold text-ink">
                        {tool.name}
                      </h3>
                      <p className="mt-1.5 text-[14px] leading-relaxed text-charcoal">
                        {tool.description}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            {/* Client proof */}
            <h2 className="mt-14 text-2xl font-medium tracking-normal text-ink">
              Who uses this service
            </h2>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2">
              {service.clientProof.map((proof) => (
                <li key={proof.client} className="card flex items-center gap-4 p-5">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[4px] bg-ink text-base font-bold text-white">
                    {proof.client.charAt(0)}
                  </span>
                  <div>
                    <p className="font-semibold text-ink">
                      {proof.client}
                    </p>
                    <p className="mt-0.5 text-[14px] text-charcoal">{proof.line}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Sticky CTA sidebar */}
          <aside className="lg:pt-1">
            <div className="card sticky top-24 p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-[8px] bg-ink text-white">
                <Icon name="quote" className="h-6 w-6" />
              </span>
              <h3 className="h-card mt-4">
                Get a tailored quote
              </h3>
              <p className="mt-2 text-[14px] leading-relaxed text-charcoal">
                Tell us about your environment and a specialist will respond
                within {formatResponseTime()} with scope and pricing.
              </p>
              <button
                type="button"
                onClick={() => openQuote([service.slug])}
                className="btn-primary mt-5 w-full"
              >
                Get a Quote for {service.shortName}
              </button>
              <p className="mt-4 text-[12px] leading-relaxed text-graphite">
                Certified partner for {service.badge}. No obligation.
              </p>
            </div>
          </aside>
        </div>
      </section>

      {/* Cross-sell */}
      <section className="bg-cloud section-pad">
        <div className="container-site">
          <p className="eyebrow">Complete IT coverage</p>
          <h2 className="h-section mt-3">
            Businesses using {service.name} often also need…
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {crossSell.map((item) => (
              <article key={item.slug} className="card flex flex-col p-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-ink text-white">
                  <Icon name={item.icon} className="h-5 w-5" />
                </span>
                <h3 className="h-card mt-4">
                  {item.name}
                </h3>
                <p className="mt-2 flex-1 text-[15px] leading-relaxed text-charcoal">
                  {item.tagline}
                </p>
                <Link
                  to={`/services/${item.slug}`}
                  className="link-arrow mt-4"
                >
                  Learn more
                  <Icon name="arrow" className="h-4 w-4" />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner
        heading={`Get a Quote for ${service.name}`}
        body={`Tell us what you need and a ${service.shortName} specialist will respond within ${formatResponseTime()}.`}
        buttonLabel="Get a tailored quote"
        serviceSlugs={[service.slug]}
      />
    </>
  );
}
