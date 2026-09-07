"use client";

import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";

import { Icon } from "~/components/icons";

const StackOrbit = lazy(() =>
  import("~/components/stack-orbit").then((m) => ({ default: m.StackOrbit })),
);

/**
 * Lazy desktop diagram for the coverage section. SSR renders a same-sized
 * placeholder (the labels already exist elsewhere on the page), and the heavy
 * orbit + canvas only loads on the client once the section nears the viewport —
 * keeping it out of the initial route chunk.
 */
export function LazyOrbit() {
  const ref = useRef<HTMLDivElement>(null);
  const [mount, setMount] = useState(false);
  const inView = useInView(ref, { once: true, margin: "600px 0px" });

  useEffect(() => {
    if (inView) setMount(true);
  }, [inView]);

  return (
    <div ref={ref} className="mx-auto aspect-square w-full max-w-[560px]">
      {mount ? (
        <Suspense
          fallback={
            <div className="flex h-full w-full items-center justify-center text-white/30">
              <Icon name="layers" className="h-10 w-10 animate-pulse" />
            </div>
          }
        >
          <StackOrbit />
        </Suspense>
      ) : (
        <div className="flex h-full w-full items-center justify-center text-white/20">
          <Icon name="layers" className="h-10 w-10 animate-pulse" />
        </div>
      )}
    </div>
  );
}
