"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "motion/react";
import { useLenis } from "lenis/react";

import eldamaLogo from "~/assets/eldama-logo.png";
import { EASE } from "~/components/motion";

const IntroContext = createContext<{ ready: boolean }>({ ready: false });

/** True once the brand intro has finished (or was skipped for returning visitors). */
export function useIntro() {
  return useContext(IntroContext);
}

const INTRO_KEY = "eldama-intro-v1";

export function IntroProvider({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<"loading" | "done">("loading");
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const lenis = useLenis();

  // Play the intro once per browser session; returning visitors skip straight in.
  useEffect(() => {
    let cancelled = false;
    try {
      if (sessionStorage.getItem(INTRO_KEY)) {
        setPhase("done");
        setReady(true);
        return;
      }
    } catch {
      /* storage unavailable — just play the intro */
    }

    const duration = 1400;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      if (cancelled) return;
      const p = Math.min(1, (now - start) / duration);
      setProgress(Math.round(p * 100));
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        // Removing the overlay lets AnimatePresence play the curtain-lift exit;
        // onExitComplete then flips `ready` so the hero entrance begins.
        setPhase("done");
      }
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
  }, []);

  // Lock scrolling while the intro is on screen.
  useEffect(() => {
    if (phase === "done") return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    lenis?.stop();
    return () => {
      document.body.style.overflow = previous;
      lenis?.start();
    };
  }, [phase, lenis]);

  const handleExitComplete = useCallback(() => {
    try {
      sessionStorage.setItem(INTRO_KEY, "1");
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  return (
    <IntroContext.Provider value={{ ready }}>
      {children}
      <AnimatePresence onExitComplete={handleExitComplete}>
        {phase !== "done" && (
          <motion.div
            key="intro"
            className="fixed inset-0 z-[70] flex flex-col items-center justify-center overflow-hidden bg-ink text-white"
            exit={{ y: "-100%" }}
            transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
            aria-label="Eldama Technologies"
          >
            {/* Ambient glow */}
            <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/25 blur-[120px]" />

            {/* Expanding ring behind the logo */}
            <motion.span
              aria-hidden="true"
              className="absolute h-40 w-40 rounded-full border border-primary-bright/30"
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 2.6, opacity: 0 }}
              transition={{ duration: 1.8, ease: "easeOut" }}
            />

            <motion.img
              src={eldamaLogo}
              alt=""
              className="relative h-20 w-auto brightness-0 invert sm:h-24"
              initial={{ opacity: 0, scale: 0.82, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.9, ease: EASE }}
            />

            <p className="relative mt-5 text-[12px] font-semibold uppercase tracking-[0.35em] text-white/60">
              Your outsourced IT department
            </p>

            {/* Progress line + counter */}
            <div className="relative mt-8 flex items-center gap-4">
              <div className="h-px w-40 overflow-hidden bg-white/20 sm:w-52">
                <motion.div
                  className="h-full w-full origin-left bg-primary-bright"
                  style={{ scaleX: progress / 100 }}
                />
              </div>
              <span className="w-10 text-right font-display text-[15px] font-semibold tabular-nums text-primary-bright">
                {progress}%
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </IntroContext.Provider>
  );
}
