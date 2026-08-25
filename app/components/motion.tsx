import {
  animate,
  motion,
  useInView,
  useReducedMotion,
  type Variants,
} from "motion/react";
import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

/** Shared, brand-consistent easing curve. */
export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function makeStagger(stagger = 0.08, delayChildren = 0): Variants {
  return {
    hidden: {},
    show: { transition: { staggerChildren: stagger, delayChildren } },
  };
}

export const staggerContainer: Variants = makeStagger(0.08);

export const fadeUpItem: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};

export const scaleItem: Variants = {
  hidden: { opacity: 0, scale: 0.94, y: 16 },
  show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

/**
 * Robust in-view reveal. Uses IntersectionObserver with a positive threshold,
 * and as a safety net also polls the element's geometry so content can never
 * stay hidden (covers client-side navigation + Lenis edge cases).
 */
export function useReveal(amount = 0.12) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ref = useRef<any>(null);
  const [shown, setShown] = useState(false);
  const inView = useInView(ref, { once: true, amount });

  useEffect(() => {
    if (inView) {
      setShown(true);
      return;
    }
    const id = window.setInterval(() => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < window.innerHeight * 0.92) {
        setShown(true);
        window.clearInterval(id);
      }
    }, 900);
    return () => window.clearInterval(id);
  }, [inView, amount]);

  return { ref, shown };
}

interface StaggerProps {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delayChildren?: number;
  once?: boolean;
  margin?: string;
}

/**
 * Parent container that staggers its <StaggerItem> children into view.
 * Uses `hidden`/`show` variant labels; children inherit variant propagation.
 */
export function Stagger({
  children,
  className,
  stagger = 0.08,
  delayChildren = 0,
  once = true,
  margin = "-80px",
}: StaggerProps) {
  const reduce = useReducedMotion();
  const { ref, shown } = useReveal();
  void once;
  void margin;
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={reduce ? "show" : "hidden"}
      animate={shown ? "show" : "hidden"}
      variants={makeStagger(stagger, delayChildren)}
    >
      {children}
    </motion.div>
  );
}

interface StaggerItemProps {
  children: ReactNode;
  className?: string;
  variants?: Variants;
}

export function StaggerItem({
  children,
  className,
  variants = fadeUpItem,
}: StaggerItemProps) {
  return (
    <motion.div className={className} variants={variants}>
      {children}
    </motion.div>
  );
}

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  x?: number;
  duration?: number;
  blur?: boolean;
  once?: boolean;
  margin?: string;
}

/** Fade-and-rise a single block into view when it scrolls into the viewport. */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 24,
  x = 0,
  duration = 0.6,
  blur = false,
  once = true,
  margin = "-80px",
}: RevealProps) {
  const reduce = useReducedMotion();
  const { ref, shown } = useReveal();
  void once;
  void margin;
  const hidden = { opacity: 0, y, x, ...(blur ? { filter: "blur(8px)" } : {}) };
  const visible = { opacity: 1, y: 0, x: 0, filter: "blur(0px)" };
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={reduce ? visible : hidden}
      animate={reduce ? visible : shown ? visible : hidden}
      transition={{ duration, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

interface CountUpProps {
  to: number;
  suffix?: string;
  duration?: number;
  className?: string;
}

/** Animated number that counts up to `to` once it scrolls into view. */
export function CountUp({
  to,
  suffix = "",
  duration = 1.8,
  className,
}: CountUpProps) {
  const reduce = useReducedMotion();
  const { ref, shown } = useReveal(0.3);
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (!shown) return;
    if (reduce) {
      setDisplay(String(to));
      return;
    }
    const controls = animate(0, to, {
      duration,
      ease: "easeOut",
      onUpdate: (value) => setDisplay(Math.round(value).toLocaleString()),
    });
    return () => controls.stop();
  }, [shown, to, duration, reduce]);

  return (
    <span ref={ref} className={className}>
      {display}
      {suffix}
    </span>
  );
}

interface AnimatedWordsProps {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  /** Gate the animation — words hold hidden until `animate` turns true. */
  animate?: boolean;
}

/** Reveals a headline word-by-word (rise + blur-unblur) on mount. */
export function AnimatedWords({
  text,
  className = "",
  delay = 0,
  stagger = 0.05,
  animate = true,
}: AnimatedWordsProps) {
  const reduce = useReducedMotion();
  const words = text.split(" ");
  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: stagger, delayChildren: delay } },
  };
  const word: Variants = {
    hidden: { opacity: 0, y: 14, filter: "blur(6px)" },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.45, ease: EASE },
    },
  };

  return (
    <motion.span
      className={`inline ${className}`}
      variants={container}
      initial={reduce ? "show" : "hidden"}
      animate={animate || reduce ? "show" : "hidden"}
    >
      {words.map((wordText, index) => (
        <motion.span
          key={`${wordText}-${index}`}
          className="inline-block whitespace-pre"
          variants={word}
        >
          {wordText}
          {index < words.length - 1 ? " " : ""}
        </motion.span>
      ))}
    </motion.span>
  );
}
