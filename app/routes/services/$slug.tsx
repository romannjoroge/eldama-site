import { motion } from "motion/react";
import { Link } from "react-router";
import type { Route } from "./+types/$slug";

import { CtaBanner } from "~/components/cta-banner";
import { Icon } from "~/components/icons";
import {
  Reveal,
  Stagger,
  StaggerItem,
  scaleItem,
} from "~/components/motion";
import { useQuote } from "~/components/quote-modal";
import { RevealHeading, SectionHeading } from "~/components/section-heading";
import { SpotlightOverlay, useSpotlight } from "~/components/spotlight";
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
          <Reveal y={12}>
            <nav aria-label="Breadcrumb" className="text-[13px] text-graphite">
              <Link to="/" className="transition-colors hover:text-ink">
                Home
              </Link>
              <span className="mx-1.5" aria-hidden="true">
                /
              </span>
              <span className="text-charcoal">Services</span>
            </nav>
          </Reveal>

          <Stagger
            stagger={0.07}
            delayChildren={0.1}
            className="mt-6 flex flex-wrap gap-2"
          >
            {service.badges.map((badge) => (
              <StaggerItem key={badge}>
                <span className="badge-outline">
                  <Icon name="certificate" className="h-4 w-4 text-graphite" />
                  {badge}
                </span>
              </StaggerItem>
            ))}
          </Stagger>

          <Reveal delay={0.15} y={16}>
            <div className="mt-5 flex items-center gap-4">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[8px] bg-ink text-white">
                <Icon name={service.icon} className="h-7 w-7" />
              </span>
              <h1 className="text-[clamp(2rem,4vw,3.4rem)] font-medium leading-[1.02] tracking-normal text-ink">
                {service.name}
              </h1>
            </div>
          </Reveal>

          <Reveal delay={0.25}>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-charcoal">
              {service.intro}
            </p>
          </Reveal>

          <Reveal delay={0.35}>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <motion.button
                type="button"
                onClick={() => openQuote([service.slug])}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="btn-primary group"
              >
                Get a Quote for {service.name}
                <Icon
                  name="arrow"
                  className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                />
              </motion.button>
              <a href="/#services" className="btn-outline-ink">
                See all services
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Body */}
      <section className="cv-section bg-white py-16 sm:py-20">
        <div className="container-site grid gap-12 lg:grid-cols-[1fr_320px]">
          <div>
            <Reveal>
              <p className="text-lg leading-relaxed text-charcoal">
                {service.description}
              </p>
            </Reveal>

            <Reveal y={16}>
              <RevealHeading
                text="What we deliver"
                className="mt-12 text-2xl font-semibold tracking-tight text-ink"
                as="h2"
              />
            </Reveal>
            <Stagger
              stagger={0.07}
              className="mt-6 grid gap-4 sm:grid-cols-2"
            >
              {service.tools.map((tool) => (
                <StaggerItem key={tool.name} variants={scaleItem} className="h-full">
                  <motion.div
                    whileHover={{ y: -3 }}
                    transition={{ type: "spring", stiffness: 320, damping: 24 }}
                    className="card group flex h-full items-start gap-3 p-5 transition-colors duration-300 hover:border-primary/30 hover:shadow-[0_12px_32px_rgba(26,26,26,0.12)]"
                  >
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-[4px] bg-primary-soft text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
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
                  </motion.div>
                </StaggerItem>
              ))}
            </Stagger>

            {/* Client proof (only when a service has reference clients) */}
            {service.clientProof.length > 0 && (
              <>
                <Reveal y={16}>
                  <RevealHeading
                    text="Who uses this service"
                    className="mt-14 text-2xl font-semibold tracking-tight text-ink"
                    as="h2"
                  />
                </Reveal>
                <Stagger
                  stagger={0.1}
                  className="mt-6 grid gap-4 sm:grid-cols-2"
                >
                  {service.clientProof.map((proof) => (
                    <StaggerItem key={proof.client} variants={scaleItem} className="h-full">
                      <motion.div
                        whileHover={{ y: -3 }}
                        transition={{ type: "spring", stiffness: 320, damping: 24 }}
                        className="card flex h-full items-center gap-4 p-5 transition-colors duration-300 hover:border-primary/30"
                      >
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[4px] bg-ink text-base font-bold text-white">
                          {proof.client.charAt(0)}
                        </span>
                        <div>
                          <p className="font-semibold text-ink">
                            {proof.client}
                          </p>
                          <p className="mt-0.5 text-[14px] text-charcoal">{proof.line}</p>
                        </div>
                      </motion.div>
                    </StaggerItem>
                  ))}
                </Stagger>
              </>
            )}
          </div>

          {/* Sticky CTA sidebar */}
          <aside className="lg:pt-1">
            <Reveal y={32} delay={0.1}>
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
                <motion.button
                  type="button"
                  onClick={() => openQuote([service.slug])}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  className="btn-primary group mt-5 w-full"
                >
                  Get a Quote for {service.shortName}
                </motion.button>
                <p className="mt-4 text-[12px] leading-relaxed text-graphite">
                  Certified partner for {service.badge}. No obligation.
                </p>
              </div>
            </Reveal>
          </aside>
        </div>
      </section>

      {/* Cross-sell */}
      <section className="cv-section bg-cloud section-pad">
        <div className="container-site">
          <SectionHeading
            eyebrow="Complete IT coverage"
            title={`Businesses using ${service.name} often also need…`}
          />
          <Stagger
            stagger={0.1}
            className="mt-8 grid gap-6 md:grid-cols-3"
          >
            {crossSell.map((item) => (
              <StaggerItem key={item.slug} variants={scaleItem} className="h-full">
                <CrossSellCard item={item} />
              </StaggerItem>
            ))}
          </Stagger>
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

function CrossSellCard({ item }: { item: (typeof services)[number] }) {
  const { ref, onMouseMove } = useSpotlight();

  return (
    <motion.article
      ref={ref}
      onMouseMove={onMouseMove}
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 320, damping: 24 }}
      className="card group relative flex h-full flex-col overflow-hidden p-6 transition-colors duration-300 hover:border-primary/40 hover:shadow-[0_16px_40px_rgba(26,26,26,0.14)]"
    >
      <SpotlightOverlay />
      <span className="relative z-10 flex h-10 w-10 items-center justify-center rounded-[8px] bg-ink text-white transition-colors duration-300 group-hover:bg-primary">
        <Icon name={item.icon} className="h-5 w-5" />
      </span>
      <h3 className="h-card relative z-10 mt-4">{item.name}</h3>
      <p className="relative z-10 mt-2 flex-1 text-[15px] leading-relaxed text-charcoal">
        {item.tagline}
      </p>
      <Link to={`/services/${item.slug}`} className="link-arrow relative z-10 mt-4">
        Learn more
        <Icon
          name="arrow"
          className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
        />
      </Link>
    </motion.article>
  );
}
