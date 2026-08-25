"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";

import { Icon } from "~/components/icons";
import { OrganicFlow } from "~/components/organic-flow";
import { Tilt } from "~/components/tilt";
import { services } from "~/data/site";

const CENTER = 50;
const RADIUS = 38;

// Slightly irregular angles + radii so the ring feels hand-placed, not plotted.
const ANGLE_JITTER = [0, 5, -4, 6, -3];
const RADIUS_JITTER = [0, 2, -3, 3, -2];
const DRIFT = [
  [0, -5],
  [4, 3],
  [-4, 4],
  [5, -3],
  [-3, -4],
];

function nodePosition(index: number) {
  const angle = (-90 + index * 72 + ANGLE_JITTER[index]) * (Math.PI / 180);
  const radius = RADIUS + RADIUS_JITTER[index];
  return {
    x: CENTER + radius * Math.cos(angle),
    y: CENTER + radius * Math.sin(angle),
  };
}

/**
 * Organic "one partner" network: a glowing hub ringed by service nodes, with
 * particles flowing along undulating energy strands and ripples radiating
 * outward — a living piece rather than a plotted diagram.
 */
export function StackOrbit() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState<number | null>(null);
  const points = services.map((_, i) => nodePosition(i));

  return (
    <Tilt max={5} className="mx-auto aspect-square w-full max-w-[560px]">
      <motion.div
        className="relative h-full w-full"
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Organic energy field */}
        <OrganicFlow positions={points} active={active} className="absolute inset-0 h-full w-full" />

        {/* Soft breathing glow behind the hub */}
        <motion.div
          aria-hidden="true"
          className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-bright/12 blur-3xl"
          animate={reduce ? undefined : { opacity: [0.4, 0.85, 0.4], scale: [0.96, 1.06, 0.96] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* ===== Hub ===== */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ type: "spring", stiffness: 200, damping: 18, delay: 0.15 }}
            className="relative flex h-28 w-28 items-center justify-center"
          >
            <motion.span
              aria-hidden="true"
              className="absolute inset-0 rounded-full border border-primary-bright/50"
              animate={{ scale: [1, 1.5, 1], opacity: [0.7, 0, 0.7] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
            />
            <motion.span
              aria-hidden="true"
              className="absolute inset-0 rounded-full border border-primary-bright/40"
              animate={{ scale: [1, 1.22, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut", delay: 0.5 }}
            />
            <motion.span
              aria-hidden="true"
              className="absolute -inset-2 rounded-full border border-primary-bright/25"
              animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.2, 0.5] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="relative flex h-24 w-24 flex-col items-center justify-center rounded-full border border-primary-bright/60 text-center shadow-[0_0_70px_rgba(41,110,249,0.55)]">
              <span
                className="absolute inset-0 rounded-full"
                style={{
                  background:
                    "radial-gradient(circle at 38% 30%, #1d3b63, #0a1224 72%)",
                }}
              />
              <span
                className="absolute inset-0 rounded-full"
                style={{ background: "radial-gradient(circle at 35% 28%, rgba(255,255,255,0.18), transparent 55%)" }}
              />
              <span className="relative flex h-7 w-7 items-center justify-center rounded-full bg-primary-bright/20">
                <Icon name="layers" className="h-5 w-5 text-primary-bright" />
              </span>
              <p className="relative mt-1 text-[12px] font-bold uppercase tracking-[0.22em] text-white">
                Eldama
              </p>
            </div>
            <p className="absolute top-full mt-2 w-max text-center text-[11px] uppercase tracking-[0.18em] text-steel">
              One partner
            </p>
          </motion.div>
        </div>

        {/* ===== Satellite service nodes ===== */}
        {services.map((service, i) => {
          const p = points[i];
          const drift = DRIFT[i];
          return (
            <div
              key={service.slug}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${p.x}%`, top: `${p.y}%` }}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
            >
              <motion.div
                animate={
                  reduce
                    ? undefined
                    : { x: [0, drift[0], 0], y: [0, drift[1], 0] }
                }
                transition={{
                  duration: 4.5 + i * 0.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    type: "spring",
                    stiffness: 220,
                    damping: 16,
                    delay: 0.3 + i * 0.09,
                  }}
                >
                  <div
                    className={`flex w-max max-w-[160px] items-center gap-2 rounded-full border px-3.5 py-2 backdrop-blur-md transition-colors duration-300 ${
                      active === i
                        ? "border-primary-bright/80 bg-primary-bright/15 shadow-[0_0_24px_rgba(41,110,249,0.35)]"
                        : "border-white/15 bg-[#0d1424]/80"
                    }`}
                  >
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-[4px] transition-colors duration-300 ${
                        active === i ? "bg-primary-bright text-ink" : "bg-white/10 text-primary-bright"
                      }`}
                    >
                      <Icon name={service.icon} className="h-3.5 w-3.5" />
                    </span>
                    <span className="text-[12px] font-semibold leading-tight text-white">
                      {service.shortName}
                    </span>
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-bright opacity-75" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary-bright" />
                    </span>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          );
        })}
      </motion.div>
    </Tilt>
  );
}
