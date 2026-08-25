"use client";

import { motion } from "motion/react";

import { Icon } from "~/components/icons";
import { services } from "~/data/site";

const RADIUS = 38;
const CENTER = 50;

function nodePosition(index: number) {
  const angle = (-90 + index * 72) * (Math.PI / 180);
  return {
    x: CENTER + RADIUS * Math.cos(angle),
    y: CENTER + RADIUS * Math.sin(angle),
  };
}

/**
 * Radial "one partner" network diagram: the five service areas orbit the
 * Eldama hub while connector lines draw themselves in and data pulses flow
 * along them. Desktop only — the coverage section falls back to a simple grid.
 */
export function StackOrbit() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[560px]">
      {/* Connector lines */}
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="orbit-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#296ef9" />
            <stop offset="100%" stopColor="#024ad8" />
          </linearGradient>
        </defs>
        {services.map((service, i) => {
          const p = nodePosition(i);
          const d = `M ${CENTER} ${CENTER} L ${p.x} ${p.y}`;
          return (
            <g key={service.slug}>
              <motion.path
                d={d}
                fill="none"
                stroke="rgba(255,255,255,0.15)"
                strokeWidth="0.5"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, delay: 0.2 + i * 0.08 }}
              />
              <path
                d={d}
                fill="none"
                stroke="url(#orbit-grad)"
                strokeWidth="0.4"
                strokeDasharray="2 4"
                className="dash-flow"
                style={{ animationDelay: `${1.1 + i * 0.08}s` }}
              />
            </g>
          );
        })}
      </svg>

      {/* Hub */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          <div className="relative flex h-28 w-28 flex-col items-center justify-center rounded-full border border-primary-bright/50 bg-ink/90 text-center shadow-[0_0_60px_rgba(41,110,249,0.45)]">
            <motion.span
              aria-hidden="true"
              className="absolute inset-0 rounded-full border border-primary-bright/40"
              animate={{ scale: [1, 1.5, 1], opacity: [0.7, 0, 0.7] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
            />
            <Icon name="layers" className="h-7 w-7 text-primary-bright" />
            <p className="mt-1 text-[12px] font-semibold uppercase tracking-widest text-white">
              Eldama
            </p>
          </div>
        </motion.div>
      </div>

      {/* Satellite service nodes */}
      {services.map((service, i) => {
        const p = nodePosition(i);
        return (
          <div
            key={service.slug}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.6 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{
                type: "spring",
                stiffness: 220,
                damping: 18,
                delay: 0.3 + i * 0.08,
              }}
            >
              <div className="flex w-max max-w-[150px] items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-2 backdrop-blur transition-colors hover:border-primary-bright/60">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-[4px] bg-white/10 text-primary-bright">
                  <Icon name={service.icon} className="h-3.5 w-3.5" />
                </span>
                <span className="text-[12px] font-semibold leading-tight text-white">
                  {service.shortName}
                </span>
              </div>
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}
