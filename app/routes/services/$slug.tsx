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
      <section className="border-b border-hairline-soft bg-canvas">
        <div className="container-site py-14 sm:py-16">
          <nav aria-label="Breadcrumb" className="text-xs text-mute">
            <Link to="/" className="transition-colors hover:text-ink">
              Home
            </Link>
            <span className="mx-1.5" aria-hidden="true">
              /
            </span>
            <span className="text-body">Services</span>
          </nav>

          <div className="mt-6 flex flex-wrap gap-2">
            {service.badges.map((badge) => (
              <span key={badge} className="chip px-3 py-1.5">
                <Icon name="certificate" className="h-3.5 w-3.5 text-primary" />
                {badge}
              </span>
            ))}
          </div>

          <div className="mt-5 flex items-center gap-4">
            <span className="icon-tile h-14 w-14">
              <Icon name={service.icon} className="h-7 w-7" />
            </span>
            <h1 className="h-display">{service.name}</h1>
          </div>

          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-body">
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
            <a href="/#services" className="btn-secondary">
              See all services
            </a>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="bg-canvas py-16 sm:py-20">
        <div className="container-site grid gap-12 lg:grid-cols-[1fr_320px]">
          <div>
            <p className="text-lg leading-relaxed text-body">
              {service.description}
            </p>

            <h2 className="h-section mt-12">What we deliver</h2>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2">
              {service.tools.map((tool) => (
                <li key={tool.name} className="card p-5">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-surface-soft text-primary">
                      <Icon name="check" className="h-4 w-4" />
                    </span>
                    <div>
                      <h3 className="text-sm font-bold tracking-tight text-ink">
                        {tool.name}
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-body">
                        {tool.description}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            {/* Client proof */}
            <h2 className="h-section mt-14">Who uses this service</h2>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2">
              {service.clientProof.map((proof) => (
                <li
                  key={proof.client}
                  className="card flex items-center gap-4 p-5"
                >
                  <span className="icon-tile h-11 w-11 text-base font-extrabold">
                    {proof.client.charAt(0)}
                  </span>
                  <div>
                    <p className="font-bold tracking-tight text-ink">
                      {proof.client}
                    </p>
                    <p className="mt-0.5 text-sm text-body">{proof.line}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Sticky CTA sidebar */}
          <aside className="lg:pt-1">
            <div className="card sticky top-24 p-6">
              <span className="icon-tile h-11 w-11">
                <Icon name="quote" className="h-6 w-6" />
              </span>
              <h3 className="mt-4 text-lg font-bold tracking-tight text-ink">
                Get a tailored quote
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-body">
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
              <p className="mt-4 text-xs leading-relaxed text-mute">
                Certified partner for {service.badge}. No obligation.
              </p>
            </div>
          </aside>
        </div>
      </section>

      {/* Cross-sell */}
      <section className="border-t border-hairline-soft bg-canvas py-16 sm:py-20">
        <div className="container-site">
          <p className="eyebrow">Complete IT coverage</p>
          <h2 className="h-section mt-3">
            Businesses using {service.name} often also need…
          </h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {crossSell.map((item) => (
              <article key={item.slug} className="card flex flex-col p-6">
                <span className="icon-tile h-10 w-10">
                  <Icon name={item.icon} className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-base font-bold tracking-tight text-ink">
                  {item.name}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-body">
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
