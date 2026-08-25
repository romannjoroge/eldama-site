"use client";

import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

interface MagneticProps {
  children: ReactNode;
  className?: string;
  /** How strongly the element is attracted to the cursor (0–1). */
  strength?: number;
}

/**
 * Wrapper that pulls its child toward the cursor while hovered and springs
 * back on leave — the classic "magnetic button" micro-interaction.
 */
export function Magnetic({
  children,
  className = "",
  strength = 0.35,
}: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 180, damping: 14, mass: 0.1 });
  const springY = useSpring(y, { stiffness: 180, damping: 14, mass: 0.1 });

  return (
    <motion.div
      ref={ref}
      className={`inline-block ${className}`}
      style={{ x: springX, y: springY }}
      onMouseMove={(event) => {
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        x.set((event.clientX - (rect.left + rect.width / 2)) * strength);
        y.set((event.clientY - (rect.top + rect.height / 2)) * strength);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}
