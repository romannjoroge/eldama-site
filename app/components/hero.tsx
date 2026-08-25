import { useState } from "react";
import { AnimatePresence, motion, type Variants } from "motion/react";

import { Icon } from "~/components/icons";
import { useIntro } from "~/components/intro";
import { Magnetic } from "~/components/magnetic";
import {
  AnimatedWords,
  CountUp,
  EASE,
  staggerContainer,
  fadeUpItem,
} from "~/components/motion";
import { ParticleField } from "~/components/particle-field";
import { useQuote } from "~/components/quote-modal";
import { iconForTool, shortToolName } from "~/components/tech";
import { Tilt } from "~/components/tilt";
import { formatResponseTime, services, stats } from "~/data/site";

const consoleStagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.5 } },
};

const consoleRow: Variants = {
  hidden: { opacity: 0, x: 24 },
  show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: EASE } },
};

export function Hero() {
  const { ready } = useIntro();
  const { openQuote } = useQuote();
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <section data-dark className="relative overflow-hidden bg-ink text-white">
      {/* ===== Backdrop: aurora + live particle network + ambient occlusion ===== */}
      <div className="absolute inset-0" aria-hidden="true">
        <div className="animate-aurora-slow absolute -left-32 -top-32 h-[520px] w-[520px] rounded-full bg-primary/40 blur-[130px]" />
        <div className="animate-aurora-slower absolute -right-24 top-1/4 h-[440px] w-[440px] rounded-full bg-primary-bright/30 blur-[140px]" />
        <ParticleField className="absolute inset-0 h-full w-full opacity-80" density={60} />
        {/* Center glow pulls the eye to the copy */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_55%_at_50%_42%,rgba(41,110,249,0.12),transparent_65%)]" />
        {/* Ambient occlusion vignette — edges fall into darkness, network stays contained */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(8,11,20,0.6)_100%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/30 via-transparent to-ink" />
      </div>

      <div className="container-site relative z-10 py-16 lg:py-24">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={ready ? "show" : "hidden"}
        >
          {/* Top row: certification badge + eyebrow */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <motion.p
              variants={fadeUpItem}
              className="inline-flex w-fit items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-[13px] font-semibold text-white backdrop-blur"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-bright opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary-bright" />
              </span>
              <Icon name="certificate" className="h-4 w-4" />
              Certified across every service we offer
            </motion.p>
            <motion.p variants={fadeUpItem} className="eyebrow-light">
              One partner. Five disciplines.
            </motion.p>
          </div>

          <div className="mt-10 grid items-center gap-12 lg:mt-14 lg:grid-cols-[1.08fr_0.92fr]">
            {/* ===== Left: copy ===== */}
            <div>
              <motion.h1
                variants={fadeUpItem}
                className="text-[clamp(2.6rem,6vw,5rem)] font-semibold leading-[1.02] tracking-[-0.02em]"
                aria-label="Your outsourced IT department, without the headcount."
              >
                <AnimatedWords text="Your outsourced IT department," animate={ready} />
                {/* Transform animates the wrapper; the gradient stays clipped to an
                    untransformed leaf so Chromium paints it reliably. */}
                <motion.span
                  className="inline-block"
                  initial={{ opacity: 0, y: 18 }}
                  animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
                  transition={{ duration: 0.5, ease: EASE, delay: 0.35 }}
                >
                  <span className="bg-gradient-to-r from-primary-bright via-primary-soft to-primary-bright bg-clip-text text-transparent">
                    without the headcount.
                  </span>
                </motion.span>
              </motion.h1>

              <motion.p
                variants={fadeUpItem}
                className="mt-6 max-w-xl text-lg leading-relaxed text-steel"
              >
                Eldama is one certified partner for Microsoft 365, networking,
                security, cloud, and email — so growing businesses get
                enterprise-grade IT without building an in-house team or
                juggling five vendors.
              </motion.p>

              <motion.div
                variants={fadeUpItem}
                className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
              >
                <Magnetic>
                  <motion.button
                    type="button"
                    onClick={() => openQuote()}
                    whileTap={{ scale: 0.97 }}
                    className="btn-primary group !h-12 !px-7 !text-[15px] shadow-[0_10px_30px_rgba(2,74,216,0.45)]"
                  >
                    Get a Quote
                    <Icon
                      name="arrow"
                      className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                    />
                  </motion.button>
                </Magnetic>
                <a
                  href="#services"
                  className="btn-outline-light !h-12 !px-7 !text-[15px]"
                >
                  See our services
                </a>
              </motion.div>

              <motion.p
                variants={fadeUpItem}
                className="mt-4 flex items-center gap-2 text-[13px] text-steel"
              >
                <Icon name="clock" className="h-4 w-4 text-primary-bright" />
                Response within {formatResponseTime()} · No obligation
              </motion.p>

              <motion.p
                variants={fadeUpItem}
                className="mt-6 flex max-w-md items-start gap-3 border-t border-white/10 pt-6 text-sm leading-relaxed text-steel"
              >
                <Icon
                  name="layers"
                  className="mt-0.5 h-5 w-5 shrink-0 text-primary-bright"
                />
                One team designs, deploys, secures, and supports the whole
                stack — and one team answers when something breaks.
              </motion.p>
            </div>

            {/* ===== Right: live stack console ===== */}
            <motion.div variants={fadeUpItem}>
              <div className="relative">
                <div
                  aria-hidden="true"
                  className="animate-aurora-slow absolute -inset-6 rounded-[24px] bg-primary/20 blur-2xl"
                />

                <Tilt max={6} className="relative">
                  <div className="rounded-[16px] border border-white/15 bg-white/5 p-6 backdrop-blur-xl">
                    {/* Console header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="relative flex h-2.5 w-2.5">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-bright opacity-75" />
                          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary-bright" />
                        </span>
                        <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-white/80">
                          Live stack
                        </p>
                      </div>
                      <p className="text-[12px] text-steel">
                        {services.length} services · tap to expand
                      </p>
                    </div>

                    {/* Service rows — expandable to reveal the tech under each */}
                    <motion.ul
                      variants={consoleStagger}
                      initial="hidden"
                      animate={ready ? "show" : "hidden"}
                      className="mt-5 space-y-2"
                    >
                      {services.map((service, index) => {
                        const open = expanded === index;
                        return (
                          <motion.li
                            key={service.slug}
                            variants={consoleRow}
                            className={`overflow-hidden rounded-[8px] border bg-white/5 transition-colors duration-200 ${
                              open
                                ? "border-primary-bright/60 bg-white/10"
                                : "border-white/10 hover:border-primary-bright/50 hover:bg-white/10"
                            }`}
                          >
                            <button
                              type="button"
                              onClick={() => setExpanded(open ? null : index)}
                              aria-expanded={open}
                              className="flex w-full items-center gap-3 px-4 py-3 text-left"
                            >
                              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[6px] bg-white/10 text-primary-bright transition-colors duration-200">
                                <Icon name={service.icon} className="h-5 w-5" />
                              </span>
                              <span className="flex-1 text-[15px] font-medium text-white">
                                {service.name}
                              </span>
                              <span className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-white/50">
                                <span className="h-1.5 w-1.5 rounded-full bg-primary-bright" />
                                Online
                              </span>
                              <Icon
                                name="arrow"
                                className={`h-3.5 w-3.5 shrink-0 text-white/50 transition-transform duration-300 ${
                                  open ? "rotate-90" : ""
                                }`}
                              />
                            </button>

                            <AnimatePresence initial={false}>
                              {open && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.28, ease: EASE }}
                                  className="overflow-hidden"
                                >
                                  <div className="border-t border-white/10 px-4 py-3">
                                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/40">
                                      {service.name} stack
                                    </p>
                                    <div className="mt-2 flex flex-wrap gap-1">
                                      {service.tools.slice(0, 6).map((tool) => (
                                        <span
                                          key={tool.name}
                                          className="inline-flex items-center gap-1 rounded-[4px] border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] font-medium text-white/80"
                                        >
                                          <Icon
                                            name={iconForTool(tool.name)}
                                            className="h-3 w-3 text-primary-bright"
                                          />
                                          {shortToolName(tool.name)}
                                        </span>
                                      ))}
                                      {service.tools.length > 6 && (
                                        <span className="self-center px-1 text-[10px] text-white/40">
                                          +{service.tools.length - 6} more
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.li>
                        );
                      })}
                    </motion.ul>

                    {/* Terminal footer */}
                    <div className="mt-4 rounded-[6px] border border-white/10 bg-ink/70 px-3 py-2 font-mono text-[12px] text-primary-bright">
                      <span className="text-white/40">$</span> eldama
                      --stack-status: {services.length}/{services.length}{" "}
                      services operational
                    </div>
                  </div>
                </Tilt>

                {/* Floating chips */}
                <motion.div
                  className="absolute -right-3 -top-5 hidden rounded-[8px] border border-primary-bright/40 bg-ink/90 px-3 py-2 text-[12px] font-semibold text-primary-bright shadow-lg backdrop-blur sm:block"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  {stats.uptimeSla}% uptime SLA
                </motion.div>
                <motion.div
                  className="absolute -bottom-5 -left-3 hidden rounded-[8px] border border-white/15 bg-ink/90 px-3 py-2 text-[12px] font-semibold text-white/80 shadow-lg backdrop-blur sm:block"
                  animate={{ y: [0, 8, 0] }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5,
                  }}
                >
                  <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-primary-bright" />
                  24/7 monitoring
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* ===== Stats ===== */}
          <motion.dl
            variants={fadeUpItem}
            className="mt-16 grid grid-cols-3 gap-6 border-t border-white/10 pt-8 sm:mt-20"
          >
            <Stat value={<CountUp to={stats.yearsInBusiness} suffix="+" />} label="Years in business" />
            <Stat value={<CountUp to={stats.certificationsHeld} />} label="Certifications held" />
            <Stat value={<CountUp to={stats.clientsServed} suffix="+" />} label="Clients served" />
          </motion.dl>
        </motion.div>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: React.ReactNode; label: string }) {
  return (
    <div>
      <dt className="sr-only">{label}</dt>
      <dd className="font-display text-2xl font-semibold tracking-tight text-white sm:text-4xl">
        {value}
      </dd>
      <dd className="mt-1 text-[13px] text-steel">{label}</dd>
    </div>
  );
}
