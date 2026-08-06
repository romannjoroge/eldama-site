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
      <section className="relative overflow-hidden bg-navy-950 text-white">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-[size:44px_44px]"
        />
        <div
          aria-hidden="true"
          className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-accent-500/15 blur-3xl"
        />
        <div className="container-site relative py-16 sm:py-20">
          <nav aria-label="Breadcrumb" className="text-xs text-navy-300">
            <Link to="/" className="transition-colors hover:text-white">
              Home
            </Link>
            <span className="mx-1.5" aria-hidden="true">
              /
            </span>
            <span className="text-navy-100">Services</span>
          </nav>

          <div className="mt-6 flex flex-wrap gap-2">
            {service.badges.map((badge) => (
              <span
                key={badge}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-navy-100"
              >
                <Icon name="certificate" className="h-3.5 w-3.5 text-accent-400" />
                {badge}
              </span>
            ))}
          </div>

          <div className="mt-5 flex items-center gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-accent-500/15 text-accent-400">
              <Icon name={service.icon} className="h-7 w-7" />
            </span>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
              {service.name}
            </h1>
          </div>

          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-navy-200">
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
      <section className="bg-white py-16 sm:py-20">
        <div className="container-site grid gap-12 lg:grid-cols-[1fr_320px]">
          <div>
            <p className="text-lg leading-relaxed text-navy-700">
              {service.description}
            </p>

            <h2 className="mt-12 text-2xl font-extrabold tracking-tight text-navy-900">
              What we deliver
            </h2>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2">
              {service.tools.map((tool) => (
                <li
                  key={tool.name}
                  className="card p-5"
                >
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-500/15 text-accent-600">
                      <Icon name="check" className="h-4 w-4" />
                    </span>
                    <div>
                      <h3 className="text-sm font-bold tracking-tight text-navy-900">
                        {tool.name}
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-navy-600">
                        {tool.description}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            {/* Client proof */}
            <h2 className="mt-14 text-2xl font-extrabold tracking-tight text-navy-900">
              Who uses this service
            </h2>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2">
              {service.clientProof.map((proof) => (
                <li key={proof.client} className="card flex items-center gap-4 p-5">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-navy-900 text-base font-extrabold text-white">
                    {proof.client.charAt(0)}
                  </span>
                  <div>
                    <p className="font-bold tracking-tight text-navy-900">
                      {proof.client}
                    </p>
                    <p className="mt-0.5 text-sm text-navy-600">{proof.line}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Sticky CTA sidebar */}
          <aside className="lg:pt-1">
            <div className="card sticky top-24 p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-navy-900 text-accent-400">
                <Icon name="quote" className="h-6 w-6" />
              </span>
              <h3 className="mt-4 text-lg font-bold tracking-tight text-navy-900">
                Get a tailored quote
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-navy-600">
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
              <p className="mt-4 text-xs leading-relaxed text-navy-500">
                Certified partner for {service.badge}. No obligation.
              </p>
            </div>
          </aside>
        </div>
      </section>

      {/* Cross-sell */}
      <section className="bg-navy-50/60 py-16 sm:py-20">
        <div className="container-site">
          <p className="eyebrow">Complete IT coverage</p>
          <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-navy-900 sm:text-3xl">
            Businesses using {service.name} often also need…
          </h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {crossSell.map((item) => (
              <article key={item.slug} className="card flex flex-col p-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-navy-900 text-accent-400">
                  <Icon name={item.icon} className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-base font-bold tracking-tight text-navy-900">
                  {item.name}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-navy-600">
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
