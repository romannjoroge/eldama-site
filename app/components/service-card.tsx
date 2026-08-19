import { Link } from "react-router";

import { Icon } from "~/components/icons";
import { useQuote } from "~/components/quote-modal";
import type { Service } from "~/data/site";

export function ServiceCard({ service }: { service: Service }) {
  const { openQuote } = useQuote();

  return (
    <article className="flex flex-col rounded-lg border border-hairline bg-white p-6 transition-colors duration-150 hover:border-primary/40">
      <div className="flex items-start justify-between gap-4">
        <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-parchment text-ink">
          <Icon name={service.icon} className="h-6 w-6" />
        </span>
        <span className="rounded-full bg-parchment px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.04em] text-ink-muted-48">
          {service.badge}
        </span>
      </div>

      <h3 className="mt-5 text-[19px] font-semibold leading-[1.24] tracking-[-0.374px] text-ink">
        {service.name}
      </h3>
      <p className="mt-2 text-[15px] leading-[1.47] tracking-[-0.224px] text-ink-muted-80">
        {service.tagline}
      </p>

      <ul className="mt-4 flex flex-wrap gap-1.5">
        {service.tools.slice(0, 3).map((tool) => (
          <li
            key={tool.name}
            className="rounded-full bg-parchment px-2.5 py-1 text-xs tracking-[-0.12px] text-ink-muted-48"
          >
            {tool.name}
          </li>
        ))}
        {service.tools.length > 3 && (
          <li className="px-1 py-1 text-xs tracking-[-0.12px] text-ink-muted-48">
            +{service.tools.length - 3} more
          </li>
        )}
      </ul>

      <div className="mt-auto pt-6">
        <div className="flex items-center justify-between gap-3 border-t border-hairline pt-4">
          <Link to={`/services/${service.slug}`} className="text-link-sm">
            Learn more
            <Icon name="arrow" className="h-4 w-4" />
          </Link>
          <button
            type="button"
            onClick={() => openQuote([service.slug])}
            className="text-link-sm"
          >
            Get a quote for this
          </button>
        </div>
      </div>
    </article>
  );
}
