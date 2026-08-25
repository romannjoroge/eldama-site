"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";

import { Icon } from "~/components/icons";
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

// A gentle curved "energy strand" from the hub to a node.
function edgePath(p: { x: number; y: number }, index: number) {
  const bend = (index % 2 === 0 ? 1 : -1) * 6;
  const mx = (CENTER + p.x) / 2;
  const my = (CENTER + p.y) / 2;
  const nx = -(p.y - CENTER);
  const ny = p.x - CENTER;
  const norm = Math.hypot(nx, ny) || 1;
  const cx = mx + (nx / norm) * bend;
  const cy = my + (ny / norm) * bend;
  return `M ${CENTER} ${CENTER} Q ${cx.toFixed(2)} ${cy.toFixed(2)} ${p.x} ${p.y}`;
}

/**
 * Organic "one partner" network: curved energy strands breathing between a
 * glowing hub and softly drifting service nodes, with slow pulses travelling
 * along every link. Desktop only — coverage falls back to a grid on mobile.
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
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Soft breathing glow behind the whole diagram */}
        <motion.div
          aria-hidden="true"
          className="absolute -inset-6 rounded-full bg-primary-bright/12 blur-3xl"
          animate={reduce ? undefined : { opacity: [0.4, 0.85, 0.4], scale: [0.96, 1.05, 0.96] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Energy strands */}
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 h-full w-full"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="orbit-edge" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4d8bff" />
              <stop offset="100%" stopColor="#1f5fe0" />
            </linearGradient>
          </defs>

          {services.map((service, i) => {
            const p = points[i];
            const d = edgePath(p, i);
            const isActive = active === i;
            return (
              <g key={service.slug}>
                {/* Base strand */}
                <motion.path
                  d={d}
                  fill="none"
                  stroke={isActive ? "rgba(122,180,255,0.9)" : "rgba(255,255,255,0.14)"}
                  strokeWidth={isActive ? 0.7 : 0.4}
                  style={{ transition: "stroke 0.3s, stroke-width 0.3s" }}
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.15 + i * 0.08 }}
                />
                {/* Soft flowing highlight */}
                <motion.path
                  d={d}
                  fill="none"
                  stroke="url(#orbit-edge)"
                  strokeWidth="0.35"
                  animate={
                    reduce
                      ? undefined
                      : { opacity: [0.25, isActive ? 0.95 : 0.7, 0.25] }
                  }
                  transition={{ duration: 3.5 + i * 0.5, repeat: Infinity, ease: "easeInOut" }}
                />
                {/* Slow energy pulses travelling the strand */}
                {!reduce && (
                  <g>
                    <circle r="1.6" fill="#9cc6ff" style={{ filter: "drop-shadow(0 0 3px rgba(122,180,255,0.9))" }}>
                      <animateMotion
                        dur={2.4 + i * 0.4}
                        repeatCount="indefinite"
                        begin={`${-i * 0.9}s`}
                      >
                        <mpath href={`#edge-${service.slug}`} />
                      </animateMotion>
                    </circle>
                    <circle r="1.3" fill="#7ab4ff" style={{ filter: "drop-shadow(0 0 2px rgba(122,180,255,0.8))" }}>
                      <animateMotion
                        dur={3.2 + i * 0.5}
                        repeatCount="indefinite"
                        begin={`${-i * 0.9 - 1.2}s`}
                      >
                        <mpath href={`#edge-rev-${service.slug}`} />
                      </animateMotion>
                    </circle>
                  </g>
                )}
              </g>
            );
          })}

          {/* Hidden reference paths so the pulses follow the same curves */}
          {services.map((service, i) => {
            const p = points[i];
            const d = edgePath(p, i);
            const reversed = `M ${p.x} ${p.y} Q ${d.split(" Q ")[1].split(" L ")[0]} ${CENTER} ${CENTER}`;
            return (
              <g key={`ref-${service.slug}`}>
                <path id={`edge-${service.slug}`} d={d} fill="none" stroke="none" />
                <path id={`edge-rev-${service.slug}`} d={reversed} fill="none" stroke="none" />
              </g>
            );
          })}
        </svg>

        {/* ===== Hub ===== */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200, damping: 18, delay: 0.2 }}
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
                  viewport={{ once: true }}
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
