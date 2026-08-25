"use client";

import { motion } from "motion/react";

import { EASE, Reveal, makeStagger } from "~/components/motion";

const wordVariants = {
  hidden: { y: "115%" },
  show: { y: "0%", transition: { duration: 0.6, ease: EASE } },
};

interface RevealHeadingProps {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  as?: "h1" | "h2" | "h3";
}

/**
 * Reveals a heading word-by-word from behind a clip mask as it scrolls into
 * view — a premium alternative to a plain fade.
 */
export function RevealHeading({
  text,
  className = "",
  delay = 0,
  stagger = 0.05,
  as = "h2",
}: RevealHeadingProps) {
  const Comp = as === "h1" ? "h1" : as === "h3" ? "h3" : "h2";
  const words = text.split(" ");

  return (
    <Comp className={`text-balance ${className}`} aria-label={text}>
      <motion.span
        className="inline"
        variants={makeStagger(stagger, delay)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
      >
        {words.map((word, index) => (
          <span
            key={index}
            className="-mb-[0.12em] inline-block overflow-hidden pb-[0.12em] align-bottom"
          >
            <motion.span className="inline-block" variants={wordVariants}>
              {word}
              {index < words.length - 1 ? "\u00A0" : ""}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Comp>
  );
}

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  dark?: boolean;
  className?: string;
}

/**
 * Standardised section header: eyebrow + masked word-reveal title + optional
 * description. Keeps every section header consistent across the site.
 */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  dark = false,
  className = "",
}: SectionHeadingProps) {
  const center = align === "center";
  return (
    <div
      className={`${center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"} ${className}`}
    >
      {eyebrow && (
        <Reveal y={12}>
          <p className={dark ? "eyebrow-light" : "eyebrow"}>{eyebrow}</p>
        </Reveal>
      )}
      <RevealHeading
        text={title}
        className={`h-section mt-3 ${dark ? "text-white" : ""}`}
      />
      {description && (
        <Reveal delay={0.15}>
          <p
            className={`mt-4 text-lg leading-relaxed ${dark ? "text-steel" : "text-charcoal"}`}
          >
            {description}
          </p>
        </Reveal>
      )}
    </div>
  );
}
