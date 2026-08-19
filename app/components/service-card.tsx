import { Link } from "react-router";

import { Icon } from "~/components/icons";
import { useQuote } from "~/components/quote-modal";
import type { Service } from "~/data/site";

export function ServiceCard({ service }: { service: Service }) {
  const { openQuote } = useQuote();

  return (
    <article className="card flex flex-col p-6">
      <div className="flex items-start justify-between gap-4">
        <span className="icon-tile h-11 w-11">
          <Icon name={service.icon} className="h-6 w-6" />
        </span>
        <span className="rounded-full bg-surface-soft px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-body">
          {service.badge}
        </span>
      </div>

      <h3 className="mt-4 text-lg font-bold tracking-tight text-ink">
        {service.name}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-body">
        {service.tagline}
      </p>

      <ul className="mt-4 flex flex-wrap gap-1.5">
        {service.tools.slice(0, 3).map((tool) => (
          <li
            key={tool.name}
            className="rounded-sm bg-surface-soft px-2 py-1 text-xs font-medium text-body"
          >
            {tool.name}
          </li>
        ))}
        {service.tools.length > 3 && (
          <li className="px-1 py-1 text-xs font-medium text-mute">
            +{service.tools.length - 3} more
          </li>
        )}
      </ul>

      <div className="mt-6 flex items-center justify-between gap-3 border-t border-hairline-soft pt-4">
        <Link to={`/services/${service.slug}`} className="link-arrow">
          Learn more
          <Icon name="arrow" className="h-4 w-4" />
        </Link>
        <button
          type="button"
          onClick={() => openQuote([service.slug])}
          className="text-sm font-bold text-primary underline-offset-4 hover:text-primary-pressed hover:underline"
        >
          Get a quote for this
        </button>
      </div>
    </article>
  );
}
