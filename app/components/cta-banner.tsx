import { motion } from "motion/react";
import { Link } from "react-router";

import { Icon } from "~/components/icons";
import { Magnetic } from "~/components/magnetic";
import { Reveal, Stagger, StaggerItem } from "~/components/motion";
import { useQuote } from "~/components/quote-modal";
import { services } from "~/data/site";

export function CtaBanner({
  heading = "Ready to solve your IT problem?",
  body = "Tell us what you need and get a tailored quote — our team responds within 24 business hours.",
  buttonLabel = "Get a tailored quote",
  serviceSlugs,
}: {
  heading?: string;
  body?: string;
  buttonLabel?: string;
  serviceSlugs?: Parameters<ReturnType<typeof useQuote>["openQuote"]>[0];
}) {
  const { openQuote } = useQuote();

  return (
    <section data-dark className="relative overflow-hidden bg-ink section-pad text-white">
      {/* Aurora backdrop */}
      <div aria-hidden="true" className="absolute inset-0">
        <div className="animate-aurora-slow absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full bg-primary/30 blur-[130px]" />
        <div className="animate-aurora-slower absolute -bottom-40 -right-24 h-[480px] w-[480px] rounded-full bg-primary-bright/25 blur-[130px]" />
        <div className="bg-grid absolute inset-0 opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-ink/40" />
      </div>

      <div className="container-site relative z-10">
        <div className="text-center">
          <Reveal blur>
            <h2 className="mx-auto max-w-3xl text-[clamp(1.9rem,3.6vw,2.9rem)] font-semibold leading-[1.05] tracking-[-0.01em]">
              {heading}
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-steel">
              {body}
            </p>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="relative mx-auto mt-9 w-fit">
              <motion.span
                aria-hidden="true"
                className="absolute -inset-2 rounded-[6px] bg-primary-bright/40 blur-lg"
                animate={{ opacity: [0.4, 0.9, 0.4], scale: [1, 1.05, 1] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              />
              <Magnetic>
                <motion.button
                  type="button"
                  onClick={() => openQuote(serviceSlugs)}
                  whileTap={{ scale: 0.97 }}
                  className="btn-bright group relative !h-12 !px-8 !text-[15px]"
                >
                  {buttonLabel}
                  <Icon
                    name="arrow"
                    className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                  />
                </motion.button>
              </Magnetic>
            </div>
          </Reveal>

          <Stagger
            stagger={0.05}
            delayChildren={0.3}
            className="mx-auto mt-9 flex max-w-3xl flex-wrap items-center justify-center gap-2.5"
          >
            {services.map((service) => (
              <StaggerItem key={service.slug}>
                <Link
                  to={`/services/${service.slug}`}
                  className="pill-outline-light transition-colors hover:bg-white/15"
                >
                  {service.name}
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}
