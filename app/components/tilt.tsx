"use client";

import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

interface TiltProps {
  children: ReactNode;
  className?: string;
  /** Max rotation in degrees as the cursor reaches the card edge. */
  max?: number;
}

/**
 * 3D perspective tilt: the child card rotates subtly toward the cursor using
 * spring-smoothed motion values, and settles back flat on leave.
 */
export function Tilt({ children, className = "", max = 7 }: TiltProps) {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const springRx = useSpring(rx, { stiffness: 150, damping: 18 });
  const springRy = useSpring(ry, { stiffness: 150, damping: 18 });

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        rotateX: springRx,
        rotateY: springRy,
        transformPerspective: 1200,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={(event) => {
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width - 0.5;
        const py = (event.clientY - rect.top) / rect.height - 0.5;
        ry.set(px * max * 2);
        rx.set(-py * max * 2);
      }}
      onMouseLeave={() => {
        rx.set(0);
        ry.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}
