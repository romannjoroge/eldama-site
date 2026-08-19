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
      <section className="bg-tile-1 py-16 text-white sm:py-20">
        <div className="container-site">
          <nav
            aria-label="Breadcrumb"
            className="text-xs tracking-[-0.12px] text-body-muted"
          >
            <Link to="/" className="transition-colors hover:text-white">
              Home
            </Link>
            <span className="mx-1.5" aria-hidden="true">
              /
            </span>
            <span className="text-white/80">Services</span>
          </nav>

          <div className="mt-8 flex flex-wrap gap-2">
            {service.badges.map((badge) => (
              <span
                key={badge}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs tracking-[-0.12px] text-white"
              >
                <Icon
                  name="certificate"
                  className="h-3.5 w-3.5 text-primary-on-dark"
                />
                {badge}
              </span>
            ))}
          </div>

          <div className="mt-6 flex items-center gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-white/10 text-white">
              <Icon name={service.icon} className="h-7 w-7" />
            </span>
            <h1 className="display-lg text-white">
              {service.name}
            </h1>
          </div>

          <p className="lead mt-6 max-w-2xl text-body-muted">
            {service.intro}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => openQuote([service.slug])}
              className="btn-primary"
            >
              Get a Quote for {service.name}
            </button>
            <a href="/#services" className="btn-secondary-dark">
              See all services
            </a>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="bg-canvas py-16 sm:py-20">
        <div className="container-site grid gap-12 lg:grid-cols-[1fr_320px]">
          <div>
            <p className="text-[19px] leading-[1.47] tracking-[-0.374px] text-ink-muted-80">
              {service.description}
            </p>

            <h2 className="display-md mt-14 text-ink">
              What we deliver
            </h2>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2">
              {service.tools.map((tool) => (
                <li
                  key={tool.name}
                  className="rounded-lg border border-hairline bg-white p-5"
                >
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-parchment text-primary">
                      <Icon name="check" className="h-4 w-4" />
                    </span>
                    <div>
                      <h3 className="text-[17px] font-semibold leading-[1.24] tracking-[-0.374px] text-ink">
                        {tool.name}
                      </h3>
                      <p className="mt-1.5 text-sm leading-[1.47] tracking-[-0.224px] text-ink-muted-80">
                        {tool.description}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            {/* Client proof */}
            <h2 className="display-md mt-14 text-ink">
              Who uses this service
            </h2>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2">
              {service.clientProof.map((proof) => (
                <li
                  key={proof.client}
                  className="flex items-center gap-4 rounded-lg border border-hairline bg-white p-5"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-ink text-[17px] font-semibold text-white">
                    {proof.client.charAt(0)}
                  </span>
                  <div>
                    <p className="text-[17px] font-semibold leading-[1.24] tracking-[-0.374px] text-ink">
                      {proof.client}
                    </p>
                    <p className="mt-0.5 text-sm tracking-[-0.224px] text-ink-muted-80">
                      {proof.line}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Sticky CTA sidebar */}
          <aside className="lg:pt-2">
            <div className="sticky top-32 rounded-lg border border-hairline bg-white p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-parchment text-primary">
                <Icon name="quote" className="h-6 w-6" />
              </span>
              <h3 className="mt-4 text-[19px] font-semibold leading-[1.24] tracking-[-0.374px] text-ink">
                Get a tailored quote
              </h3>
              <p className="mt-2 text-sm leading-[1.47] tracking-[-0.224px] text-ink-muted-80">
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
              <p className="mt-4 text-xs leading-[1.3] tracking-[-0.12px] text-ink-muted-48">
                Certified partner for {service.badge}. No obligation.
              </p>
            </div>
          </aside>
        </div>
      </section>

      {/* Cross-sell */}
      <section className="bg-parchment py-16 sm:py-20">
        <div className="container-site">
          <p className="eyebrow">Complete IT coverage</p>
          <h2 className="display-md mt-3 text-ink">
            Businesses using {service.name} often also need…
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {crossSell.map((item) => (
              <article
                key={item.slug}
                className="flex flex-col rounded-lg border border-hairline bg-white p-6"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-parchment text-ink">
                  <Icon name={item.icon} className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-[17px] font-semibold leading-[1.24] tracking-[-0.374px] text-ink">
                  {item.name}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-[1.47] tracking-[-0.224px] text-ink-muted-80">
                  {item.tagline}
                </p>
                <Link
                  to={`/services/${item.slug}`}
                  className="text-link-sm mt-5"
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
