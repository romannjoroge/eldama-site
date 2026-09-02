import type { CSSProperties } from "react";

import { Reveal, Stagger, StaggerItem } from "~/components/motion";
import { partnerLogos } from "~/components/partner-logos";
import { clients } from "~/data/site";

export function TrustBar() {
  return (
    <section className="border-y border-hairline bg-white pt-12 pb-14 sm:pb-16">
      <div className="container-site">
        <Reveal y={12}>
          <p className="text-center text-xs font-bold uppercase tracking-[0.14em] text-graphite">
            Certified partner of
          </p>
        </Reveal>

        <Reveal y={12} delay={0.1} className="mt-6">
          <div className="marquee-group marquee-mask overflow-hidden py-1">
            <div
              className="marquee-track"
              style={{ "--marquee-speed": "42s" } as CSSProperties}
            >
              {[0, 1].map((copy) => (
                <ul
                  key={copy}
                  aria-hidden={copy === 1}
                  className="flex shrink-0 items-center"
                >
                  {partnerLogos.map((partner) => (
                    <li
                      key={partner.name}
                      className="mr-3 flex shrink-0 items-center rounded-[10px] border border-hairline bg-white px-5 py-3.5 shadow-[0_1px_2px_rgba(26,26,26,0.05)]"
                    >
                      <img
                        src={partner.src}
                        alt={`${partner.name} partner`}
                        loading="lazy"
                        className="block h-6 w-auto max-w-[150px] leading-none object-contain opacity-70 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0 sm:h-7"
                      />
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
