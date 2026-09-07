import { motion } from "motion/react";
import { Link } from "react-router";

import { Icon } from "~/components/icons";
import { useQuote } from "~/components/quote-modal";
import { SpotlightOverlay, useSpotlight } from "~/components/spotlight";
import type { Service } from "~/data/site";

export function ServiceCard({ service }: { service: Service }) {
  const { openQuote } = useQuote();
  const { ref, onMouseMove } = useSpotlight();

  return (
    <motion.article
      ref={ref}
      onMouseMove={onMouseMove}
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 320, damping: 24 }}
      className="card group relative flex h-full flex-col overflow-hidden p-6 transition-colors duration-300 hover:border-primary/40 hover:shadow-[0_20px_48px_rgba(26,26,26,0.16)]"
    >
      <SpotlightOverlay />

      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 z-10 h-1 origin-left scale-x-0 bg-gradient-to-r from-primary to-primary-bright transition-transform duration-300 group-hover:scale-x-100"
      />

      <div className="relative z-10 flex items-start justify-between gap-4">
        <motion.span
          whileHover={{ rotate: -6, scale: 1.06 }}
          transition={{ type: "spring", stiffness: 300, damping: 18 }}
          className="flex h-12 w-12 items-center justify-center rounded-[8px] bg-ink text-white transition-colors duration-300 group-hover:bg-primary"
        >
          <Icon name={service.icon} className="h-6 w-6" />
        </motion.span>
        <span className="rounded-full border border-hairline bg-cloud px-3 py-1 text-[12px] font-semibold text-charcoal">
          {service.badge}
        </span>
      </div>

      <h3 className="h-card relative z-10 mt-5">{service.name}</h3>
      <p className="relative z-10 mt-2 text-[15px] leading-relaxed text-charcoal">
        {service.tagline}
      </p>

      <ul className="relative z-10 mt-5 flex flex-wrap gap-1.5">
        {service.tools.slice(0, 3).map((tool) => (
          <li
            key={tool.name}
            className="rounded-[4px] border border-hairline bg-cloud px-2.5 py-1 text-[13px] font-medium text-graphite"
          >
            {tool.name}
          </li>
        ))}
        {service.tools.length > 3 && (
          <li className="px-1 py-1 text-[13px] font-medium text-graphite">
            +{service.tools.length - 3} more
          </li>
        )}
      </ul>

      <div className="relative z-10 mt-6 flex items-center justify-between gap-3 border-t border-hairline pt-5">
        <Link
          to={`/services/${service.slug}`}
          className="inline-flex items-center gap-1.5 text-[15px] font-medium text-charcoal transition-colors hover:text-primary"
        >
          Learn more
          <Icon
            name="arrow"
            className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
          />
        </Link>
        <motion.button
          type="button"
          onClick={() => openQuote([service.slug])}
          whileTap={{ scale: 0.96 }}
          className="btn-primary !h-10 !px-4 text-[12.6px]"
        >
          Get a quote
        </motion.button>
      </div>
    </motion.article>
  );
}
