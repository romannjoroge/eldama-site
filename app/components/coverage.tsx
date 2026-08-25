import { motion } from "motion/react";

import { Icon } from "~/components/icons";
import { Stagger, StaggerItem, scaleItem } from "~/components/motion";
import { useQuote } from "~/components/quote-modal";
import { SectionHeading } from "~/components/section-heading";
import { StackOrbit } from "~/components/stack-orbit";
import { services } from "~/data/site";

export function Coverage() {
  const { openQuote } = useQuote();

  return (
    <section data-dark className="bg-ink section-pad text-white">
      <div className="container-site">
        <SectionHeading
          eyebrow="Complete IT coverage"
          title="Most clients start with one service — and expand."
          description="The five categories work together as one IT stack. A Microsoft 365 rollout naturally leads to endpoint protection; a new firewall leads to backup and disaster recovery. Start where the pain is, and let one accountable partner close the gaps."
          align="center"
          dark
        />

        <div className="mt-12 grid items-center gap-12 lg:mt-16 lg:grid-cols-[0.95fr_1.05fr]">
          {/* Copy + checklist */}
          <div>
            <Stagger
              stagger={0.08}
              delayChildren={0.1}
              className="space-y-3 text-[15px] text-steel"
            >
              {[
                "One team accountable for the whole stack",
                "Specialists in every category, not generalists",
                "One bill, one escalation path, one SLA",
              ].map((item) => (
                <StaggerItem key={item}>
                  <div className="flex items-start gap-3 rounded-[8px] border border-white/10 bg-white/5 px-4 py-3 transition-colors hover:border-primary-bright/40">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-[4px] bg-primary-bright/25 text-primary-bright">
                      <Icon name="check" className="h-3.5 w-3.5" />
                    </span>
                    {item}
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
            <motion.button
              type="button"
              onClick={() => openQuote()}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="btn-bright mt-8"
            >
              Get a Quote
            </motion.button>
          </div>

          {/* Desktop: radial network diagram */}
          <div className="hidden lg:block">
            <StackOrbit />
          </div>

          {/* Mobile: compact grid fallback */}
          <Stagger
            stagger={0.08}
            className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:hidden"
            aria-label="How the five service categories connect"
          >
            {services.map((service, index) => (
              <StaggerItem
                key={service.slug}
                variants={scaleItem}
                className={index === 4 ? "col-span-2 sm:col-span-1" : undefined}
              >
                <div className="h-full rounded-[16px] border border-white/10 bg-white/5 p-5">
                  <span className="flex h-10 w-10 items-center justify-center rounded-[4px] bg-white/10 text-primary-bright">
                    <Icon name={service.icon} className="h-5 w-5" />
                  </span>
                  <p className="mt-3 text-[14px] font-semibold leading-snug">
                    {service.name}
                  </p>
                </div>
              </StaggerItem>
            ))}
            <StaggerItem
              variants={scaleItem}
              className="col-span-2 sm:col-span-3"
            >
              <div className="flex items-center justify-center gap-3 rounded-[16px] border border-primary-bright/40 bg-primary-bright/10 p-4">
                <Icon name="layers" className="h-6 w-6 text-primary-bright" />
                <p className="text-[14px] font-semibold">
                  Eldama — one partner managing your whole stack
                </p>
              </div>
            </StaggerItem>
          </Stagger>
        </div>
      </div>
    </section>
  );
}
