"use client";

import { useCallback, useRef, type MouseEvent } from "react";

/**
 * Cursor-tracking spotlight for cards. Call `useSpotlight()` and spread
 * `{ ref, onMouseMove }` onto the card, then render <SpotlightOverlay /> inside
 * it. The overlay follows the cursor with a soft radial glow.
 */
export function useSpotlight() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ref = useRef<any>(null);

  const onMouseMove = useCallback((event: MouseEvent<HTMLElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--sx", `${event.clientX - rect.left}px`);
    el.style.setProperty("--sy", `${event.clientY - rect.top}px`);
  }, []);

  return { ref, onMouseMove };
}

export function SpotlightOverlay({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${className}`}
      style={{
        background:
          "radial-gradient(340px circle at var(--sx, 50%) var(--sy, 50%), rgba(41,110,249,0.16), transparent 70%)",
      }}
    />
  );
}
