"use client";

import { useEffect, useState, type ReactNode } from "react";
import { ReactLenis, useLenis } from "lenis/react";
import "lenis/dist/lenis.css";

function AnchorSmoother() {
  const lenis = useLenis();

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const anchor = target?.closest?.('a[href^="#"]');
      if (!anchor || !lenis) return;
      const hash = anchor.getAttribute("href");
      if (!hash || hash === "#") return;
      const element = document.querySelector<HTMLElement>(hash);
      if (!element) return;
      event.preventDefault();
      lenis.scrollTo(element, { offset: -96, duration: 1.2 });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [lenis]);

  return null;
}

/**
 * Buttery smooth scrolling on top of native scroll position — sticky header,
 * anchor links and motion's useScroll all keep working. Skipped entirely for
 * users who prefer reduced motion.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    );
  }, []);

  if (reduced) return <>{children}</>;

  return (
    <ReactLenis root options={{ autoRaf: true, smoothWheel: true }}>
      <AnchorSmoother />
      {children}
    </ReactLenis>
  );
}
