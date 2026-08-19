import { Link } from "react-router";

import { Icon } from "~/components/icons";
import { useQuote } from "~/components/quote-modal";
import type { Service } from "~/data/site";

export function ServiceCard({ service }: { service: Service }) {
  const { openQuote } = useQuote();

  return (
    <article className="card flex flex-col p-6">
      <div className="flex items-start justify-between gap-4">
        <span className="flex h-12 w-12 items-center justify-center rounded-[8px] bg-ink text-white">
          <Icon name={service.icon} className="h-6 w-6" />
        </span>
        <span className="rounded-full border border-hairline bg-cloud px-3 py-1 text-[12px] font-semibold text-charcoal">
          {service.badge}
        </span>
      </div>

      <h3 className="h-card mt-5">{service.name}</h3>
      <p className="mt-2 text-[15px] leading-relaxed text-charcoal">
        {service.tagline}
      </p>

      <ul className="mt-5 flex flex-wrap gap-1.5">
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

      <div className="mt-6 flex items-center justify-between gap-3 border-t border-hairline pt-5">
        <Link
          to={`/services/${service.slug}`}
          className="inline-flex items-center gap-1.5 text-[15px] font-medium text-charcoal transition-colors hover:text-primary"
        >
          Learn more
          <Icon name="arrow" className="h-4 w-4" />
        </Link>
        <button
          type="button"
          onClick={() => openQuote([service.slug])}
          className="btn-primary !h-10 !px-4 text-[12.6px]"
        >
          Get a quote
        </button>
      </div>
    </article>
  );
}
