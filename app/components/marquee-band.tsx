import type { CSSProperties } from "react";

import { Icon } from "~/components/icons";
import { services } from "~/data/site";

/**
 * Full-width band of oversized, partially outlined service names scrolling in a
 * slow marquee. A bold, editorial divider between the hero and the services grid.
 */
export function MarqueeBand() {
  return (
    <section aria-hidden="true" className="overflow-hidden border-y border-hairline bg-cloud py-7">
      <div className="-rotate-1 scale-[1.03]">
        <div className="marquee-group marquee-mask overflow-hidden">
          <div
            className="marquee-track"
            style={{ "--marquee-speed": "30s" } as CSSProperties}
          >
            {[0, 1].map((copy) => (
              <ul key={copy} className="flex shrink-0 items-center" aria-hidden={copy === 1}>
                {services.map((service, index) => (
                  <li key={service.slug} className="mr-10 flex items-center gap-10">
                    <span
                      className={`font-display text-[clamp(2.4rem,5.5vw,4.5rem)] font-semibold leading-none tracking-tight ${
                        index % 2 === 0 ? "text-ink" : "text-stroke-ink"
                      }`}
                    >
                      {service.name.toUpperCase()}
                    </span>
                    <Icon name="spark" className="h-8 w-8 shrink-0 text-primary" />
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
