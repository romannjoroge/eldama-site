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
          {/* Fixed-height band so a growing tile never shifts the section below */}
          <div className="marquee-group marquee-mask flex h-20 items-center overflow-hidden">
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
                      className="group relative mr-3 flex h-16 w-48 shrink-0 items-center justify-center rounded-[14px] border border-hairline bg-white transition-[width,height,border-color,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:h-20 hover:w-64 hover:border-fog hover:shadow-[0_16px_36px_rgba(26,26,26,0.14)] sm:w-56 sm:hover:w-72"
                    >
                      {/* Equal-size tile — object-contain fits every logo into the
                          same footprint, so narrow logos look just as big. */}
                      <img
                        src={partner.src}
                        alt={`${partner.name} partner`}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-contain p-2.5"
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
