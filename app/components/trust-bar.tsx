import type { CSSProperties } from "react";

import { Reveal, Stagger, StaggerItem } from "~/components/motion";
import { clients, partnerBadges } from "~/data/site";

export function TrustBar() {
  return (
    <section className="border-y border-hairline bg-white py-12">
      <div className="container-site">
        <Reveal y={12}>
          <p className="text-center text-xs font-bold uppercase tracking-[0.14em] text-graphite">
            Certified partner of
          </p>
        </Reveal>

        <Reveal y={12} delay={0.1} className="mt-5">
          <div className="marquee-group marquee-mask overflow-hidden">
            <div
              className="marquee-track"
              style={{ "--marquee-speed": "38s" } as CSSProperties}
            >
              {[0, 1].map((copy) => (
                <ul
                  key={copy}
                  aria-hidden={copy === 1}
                  className="flex shrink-0 items-center"
                >
                  {partnerBadges.map((badge) => (
                    <li
                      key={badge}
                      className="mr-3 whitespace-nowrap rounded-[8px] border border-hairline bg-cloud px-4 py-2 text-[14px] font-medium text-charcoal transition-colors hover:border-primary/40 hover:bg-primary-soft"
                    >
                      {badge}
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </div>
        </Reveal>

        <div className="mt-10 border-t border-hairline pt-8">
          <Reveal y={12}>
            <p className="text-center text-xs font-bold uppercase tracking-[0.14em] text-graphite">
              Trusted by
            </p>
          </Reveal>
          <Stagger
            stagger={0.12}
            delayChildren={0.1}
            className="mt-5 flex flex-wrap items-center justify-center gap-x-12 gap-y-5"
          >
            {clients.map((client) => (
              <StaggerItem key={client.name}>
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-[4px] bg-ink text-[12px] font-bold text-white">
                    {client.name.charAt(0)}
                  </span>
                  <div className="text-left">
                    <span className="block text-[15px] font-semibold text-ink">
                      {client.name}
                    </span>
                    <span className="block text-[12px] text-graphite">
                      {client.proof}
                    </span>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}
