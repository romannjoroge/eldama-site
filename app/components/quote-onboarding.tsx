"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, type Variants } from "motion/react";
import { useFetcher } from "react-router";

import { Icon } from "~/components/icons";
import type { QuoteFormResult } from "~/components/quote-form";
import { EASE, fadeUpItem, makeStagger } from "~/components/motion";
import { iconForTool, shortToolName } from "~/components/tech";
import { formatResponseTime, services, type ServiceSlug } from "~/data/site";

const TOTAL_STEPS = 5;

const STEP_LABELS = [
  "Welcome",
  "What you need",
  "Technologies",
  "Your details",
  "Your message",
];

const stepPanel: Variants = {
  initial: { opacity: 0, x: 28 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.35, ease: EASE } },
  exit: { opacity: 0, x: -28, transition: { duration: 0.22, ease: EASE } },
};

interface QuoteOnboardingProps {
  preselectedSlugs?: ServiceSlug[];
  fetcherKey?: string;
  onClose?: () => void;
}

/**
 * Modal-only quote flow: a paced, multi-step onboarding (welcome → services →
 * technologies → contact → message → confirmation). The technologies step lets
 * sophisticated buyers dial in exactly which products they need.
 */
export function QuoteOnboarding({
  preselectedSlugs = [],
  fetcherKey = "quote-onboarding",
  onClose,
}: QuoteOnboardingProps) {
  const fetcher = useFetcher<QuoteFormResult>({ key: fetcherKey });

  const [step, setStep] = useState(1);
  const [selected, setSelected] = useState<ServiceSlug[]>(preselectedSlugs);
  const [techs, setTechs] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [need, setNeed] = useState("");
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollMore, setCanScrollMore] = useState(false);

  const submitted = fetcher.data?.ok ? fetcher.data : undefined;
  const pending = fetcher.state !== "idle";

  const updateScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollMore(el.scrollHeight - el.scrollTop - el.clientHeight > 24);
  }, []);

  // Keep the scroll cue accurate as steps change height and on scroll/resize.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScroll();
    const content = el.firstElementChild;
    const ro = new ResizeObserver(updateScroll);
    if (content) ro.observe(content);
    window.addEventListener("resize", updateScroll);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", updateScroll);
    };
  }, [updateScroll]);

  const selectedServices = services.filter((s) => selected.includes(s.slug));

  const toggleService = (slug: ServiceSlug) => {
    setError(null);
    setSelected((prev) => {
      if (prev.includes(slug)) {
        // Drop any techs belonging to a deselected service.
        const svc = services.find((s) => s.slug === slug);
        if (svc) {
          setTechs((t) => t.filter((name) => !svc.tools.some((tool) => tool.name === name)));
        }
        return prev.filter((s) => s !== slug);
      }
      return [...prev, slug];
    });
  };

  const toggleTech = (name: string) => {
    setError(null);
    setTechs((prev) =>
      prev.includes(name) ? prev.filter((t) => t !== name) : [...prev, name],
    );
  };

  const selectAllTechs = () => {
    setTechs((prev) => {
      const all = selectedServices.flatMap((s) => s.tools.map((t) => t.name));
      const set = new Set([...prev, ...all]);
      return Array.from(set);
    });
  };

  const clearTechs = () => setTechs([]);

  const next = () => {
    setError(null);
    if (step === 2 && selected.length === 0) {
      setError("Select at least one service to continue.");
      return;
    }
    if (step === 4) {
      if (name.trim() === "" || email.trim() === "") {
        setError("Please enter your name and work email.");
        return;
      }
      if (!email.includes("@")) {
        setError("Please enter a valid work email.");
        return;
      }
    }
    setStep((s) => Math.min(TOTAL_STEPS, s + 1));
  };

  const back = () => {
    setError(null);
    setStep((s) => Math.max(1, s - 1));
  };

  const submit = () => {
    setError(null);
    if (selected.length === 0) {
      setStep(2);
      setError("Select at least one service.");
      return;
    }
    if (name.trim() === "" || email.trim() === "") {
      setStep(4);
      setError("Please enter your name and work email.");
      return;
    }
    const formData = new FormData();
    formData.append("name", name);
    formData.append("company", company);
    formData.append("email", email);
    formData.append("phone", phone);
    selected.forEach((slug) => formData.append("services", slug));
    techs.forEach((t) => formData.append("techs", t));
    formData.append("need", need);
    fetcher.submit(formData, { method: "post", action: "/quote" });
  };

  const canContinue =
    step === 2
      ? selected.length > 0
      : step === 4
        ? name.trim() !== "" && email.includes("@")
        : true;

  return (
    <>
      {/* Scrollable step body — a DIRECT flex child of the panel so it shrinks
          to fit and scrolls (no nested flex-basis/% height chain). */}
      <div
        ref={scrollRef}
        onScroll={updateScroll}
        data-lenis-prevent
        className="relative min-h-0 overflow-y-auto overscroll-contain scroll-modal"
      >
        <div className="p-6 sm:p-8">
          {/* Progress header */}
          <div className="mb-6 pr-12">
            <div className="flex items-center justify-between text-[12px] text-graphite">
              <span className="font-medium uppercase tracking-[0.1em]">
                Step {Math.min(step, TOTAL_STEPS)} of {TOTAL_STEPS}
              </span>
              <span className="font-semibold text-ink">
                {STEP_LABELS[Math.min(step, TOTAL_STEPS) - 1] ?? ""}
              </span>
            </div>
            <div className="mt-2.5 flex gap-1.5" aria-hidden="true">
              {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
                <div key={i} className="h-1 flex-1 overflow-hidden rounded-full bg-fog">
                  <motion.div
                    className="h-full rounded-full bg-primary-bright"
                    style={{ transformOrigin: "left" }}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: step > i ? 1 : 0 }}
                    transition={{ duration: 0.45, ease: EASE, delay: 0.05 }}
                  />
                </div>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait" initial={false}>
            {submitted ? (
              <motion.div key="confirmation" {...stepPanel}>
                <Confirmation
                  submittedAt={submitted.submittedAt ?? ""}
                  onClose={onClose}
                />
              </motion.div>
            ) : (
              <motion.div key={step} {...stepPanel}>
                {step === 1 && <WelcomeStep onStart={next} />}
                {step === 2 && (
                  <ServicesStep selected={selected} onToggle={toggleService} />
                )}
                {step === 3 && (
                  <TechnologiesStep
                    services={selectedServices}
                    techs={techs}
                    onToggle={toggleTech}
                    onSelectAll={selectAllTechs}
                    onClear={clearTechs}
                  />
                )}
                {step === 4 && (
                  <ContactStep
                    name={name}
                    setName={setName}
                    company={company}
                    setCompany={setCompany}
                    email={email}
                    setEmail={setEmail}
                    phone={phone}
                    setPhone={setPhone}
                  />
                )}
                {step === 5 && (
                  <ScopeStep
                    need={need}
                    setNeed={setNeed}
                    selectedServices={selectedServices}
                    techs={techs}
                    goBackToServices={() => setStep(2)}
                    goBackToTechs={() => setStep(3)}
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {error && !submitted && (
            <motion.p
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              role="alert"
              className="mt-4 rounded-[8px] bg-error/10 px-3 py-2 text-[14px] font-medium text-error"
            >
              {error}
            </motion.p>
          )}
        </div>

        {/* Scroll cue — only when there's more content to scroll */}
        {canScrollMore && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex items-end justify-center"
          >
            <div className="h-14 w-full bg-gradient-to-t from-white via-white/70 to-transparent" />
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white shadow-md"
            >
              <Icon name="arrow" className="h-3.5 w-3.5 rotate-90" />
            </motion.div>
          </div>
        )}
      </div>

      {/* Pinned footer bar — always visible, never pushed off-screen */}
      {!submitted && step > 1 && (
        <div className="shrink-0 border-t border-hairline bg-white px-6 py-4 sm:px-8 sm:py-5">
          <div className="flex items-center justify-between gap-3">
            <button type="button" onClick={back} className="btn-outline-ink !h-11">
              <Icon name="arrow" className="h-4 w-4 rotate-180" />
              Back
            </button>

            {step < TOTAL_STEPS ? (
              <motion.button
                type="button"
                onClick={next}
                disabled={!canContinue}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="btn-primary group !h-11 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Continue
                <Icon
                  name="arrow"
                  className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                />
              </motion.button>
            ) : (
              <motion.button
                type="button"
                onClick={submit}
                disabled={pending}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="btn-primary group !h-11 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {pending ? "Sending…" : "Request my quote"}
                {!pending && (
                  <Icon
                    name="arrow"
                    className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                  />
                )}
              </motion.button>
            )}
          </div>
        </div>
      )}
    </>
  );
}

/* ============================== Steps ============================== */

function StepTitle({ title, sub }: { title: string; sub?: string }) {
  return (
    <motion.div
      variants={makeStagger(0.07)}
      initial="hidden"
      animate="show"
    >
      <motion.h3
        variants={fadeUpItem}
        className="text-[24px] font-semibold leading-tight tracking-tight text-ink"
      >
        {title}
      </motion.h3>
      {sub && (
        <motion.p variants={fadeUpItem} className="mt-1.5 text-[14px] leading-relaxed text-charcoal">
          {sub}
        </motion.p>
      )}
    </motion.div>
  );
}

function WelcomeStep({ onStart }: { onStart: () => void }) {
  return (
    <motion.div variants={makeStagger(0.09)} initial="hidden" animate="show">
      <motion.p variants={fadeUpItem} className="eyebrow">
        Free tailored quote
      </motion.p>
      <motion.h3
        variants={fadeUpItem}
        className="mt-2 text-[26px] font-semibold leading-tight tracking-tight text-ink"
      >
        Let's fix your IT —{" "}
        <span className="text-primary">properly.</span>
      </motion.h3>
      <motion.p variants={fadeUpItem} className="mt-3 text-[15px] leading-relaxed text-charcoal">
        Five quick steps. A certified specialist — not a sales agent — reviews
        your request and comes back within{" "}
        <span className="font-semibold text-ink">{formatResponseTime()}</span>{" "}
        with scope, recommendations, and pricing.
      </motion.p>
      <motion.ul variants={makeStagger(0.08, 0.2)} className="mt-5 space-y-2.5">
        {[
          "Under a minute to complete",
          "Pinpoint the exact technologies you need",
          "No obligation — details used only for your quote",
        ].map((line) => (
          <motion.li
            key={line}
            variants={fadeUpItem}
            className="flex items-start gap-2.5 text-[14px] text-charcoal"
          >
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-[4px] bg-primary-soft text-primary">
              <Icon name="check" className="h-3.5 w-3.5" />
            </span>
            {line}
          </motion.li>
        ))}
      </motion.ul>
      <motion.button
        variants={fadeUpItem}
        type="button"
        onClick={onStart}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.97 }}
        className="btn-primary group mt-7 w-full !h-12"
      >
        Start my quote
        <Icon
          name="arrow"
          className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
        />
      </motion.button>
    </motion.div>
  );
}

function ServicesStep({
  selected,
  onToggle,
}: {
  selected: ServiceSlug[];
  onToggle: (slug: ServiceSlug) => void;
}) {
  return (
    <div>
      <StepTitle
        title="What does your business need?"
        sub="Pick any that apply — most clients start with one service and expand."
      />
      <motion.div
        variants={makeStagger(0.06, 0.1)}
        initial="hidden"
        animate="show"
        className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3"
      >
        {services.map((service) => {
          const active = selected.includes(service.slug);
          return (
            <motion.button
              key={service.slug}
              variants={fadeUpItem}
              type="button"
              onClick={() => onToggle(service.slug)}
              whileTap={{ scale: 0.96 }}
              className={`group relative flex flex-col items-start gap-2.5 rounded-[10px] border p-3.5 text-left transition-colors duration-200 ${
                active
                  ? "border-primary bg-primary-soft"
                  : "border-hairline bg-white hover:border-steel"
              }`}
            >
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-[6px] transition-colors duration-200 ${
                  active ? "bg-primary text-white" : "bg-cloud text-ink"
                }`}
              >
                <Icon name={service.icon} className="h-5 w-5" />
              </span>
              <span className="text-[13px] font-semibold leading-tight text-ink">
                {service.shortName}
              </span>
              <AnimatePresence>
                {active && (
                  <motion.span
                    initial={{ scale: 0, rotate: -90 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 90 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white"
                  >
                    <Icon name="check" className="h-3 w-3" />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </motion.div>
      <p className="mt-3 text-[12px] text-graphite">
        {selected.length === 0
          ? "Select at least one to continue"
          : `${selected.length} service${selected.length === 1 ? "" : "s"} selected`}
      </p>
    </div>
  );
}

function TechnologiesStep({
  services: svcs,
  techs,
  onToggle,
  onSelectAll,
  onClear,
}: {
  services: (typeof services)[number][];
  techs: string[];
  onToggle: (name: string) => void;
  onSelectAll: () => void;
  onClear: () => void;
}) {
  return (
    <div>
      <StepTitle
        title="Which technologies do you need?"
        sub="Optional — dial in the exact products so your quote is scoped precisely."
      />
      <motion.div
        variants={makeStagger(0.06, 0.1)}
        initial="hidden"
        animate="show"
        className="mt-5"
      >
        <motion.div variants={fadeUpItem} className="mb-3 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onSelectAll}
            className="text-[13px] font-medium text-primary underline-offset-2 hover:underline"
          >
            Select all
          </button>
          <button
            type="button"
            onClick={onClear}
            className="text-[13px] font-medium text-graphite underline-offset-2 hover:text-ink hover:underline"
          >
            Clear
          </button>
        </motion.div>

        {svcs.map((service) => (
          <motion.div key={service.slug} variants={fadeUpItem} className="mb-4 last:mb-0">
            <div className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.1em] text-graphite">
              <span className="flex h-5 w-5 items-center justify-center rounded-[4px] bg-ink text-white">
                <Icon name={service.icon} className="h-3 w-3" />
              </span>
              {service.name}
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {service.tools.map((tool) => {
                const active = techs.includes(tool.name);
                return (
                  <button
                    key={tool.name}
                    type="button"
                    onClick={() => onToggle(tool.name)}
                    className={`inline-flex items-center gap-1.5 rounded-[6px] border px-2.5 py-1.5 text-[12px] font-medium transition-colors duration-150 ${
                      active
                        ? "border-primary bg-primary-soft text-ink"
                        : "border-hairline bg-white text-charcoal hover:border-steel"
                    }`}
                  >
                    <Icon
                      name={iconForTool(tool.name)}
                      className={`h-3.5 w-3.5 ${active ? "text-primary" : "text-graphite"}`}
                    />
                    {shortToolName(tool.name)}
                    {active && <Icon name="check" className="h-3 w-3 text-primary" />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        ))}
      </motion.div>
      <p className="mt-3 text-[12px] text-graphite">
        {techs.length === 0
          ? "No specific products selected — we'll recommend the right ones"
          : `${techs.length} technologie${techs.length === 1 ? "y" : "s"} selected`}
      </p>
    </div>
  );
}

function ContactStep({
  name,
  setName,
  company,
  setCompany,
  email,
  setEmail,
  phone,
  setPhone,
}: {
  name: string;
  setName: (v: string) => void;
  company: string;
  setCompany: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  phone: string;
  setPhone: (v: string) => void;
}) {
  return (
    <div>
      <StepTitle
        title="Where do we send the quote?"
        sub="A specialist uses these details to prepare a tailored response."
      />
      <motion.div
        variants={makeStagger(0.06, 0.1)}
        initial="hidden"
        animate="show"
        className="mt-5 grid gap-3.5 sm:grid-cols-2"
      >
        <motion.div variants={fadeUpItem}>
          <Field label="Full name" required htmlFor="onb-name" />
          <input
            id="onb-name"
            name="name"
            type="text"
            autoComplete="name"
            className="input mt-1.5"
            placeholder="Jane Wanjiku"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </motion.div>
        <motion.div variants={fadeUpItem}>
          <Field label="Company name" htmlFor="onb-company" />
          <input
            id="onb-company"
            name="company"
            type="text"
            autoComplete="organization"
            className="input mt-1.5"
            placeholder="Acme Ltd"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
        </motion.div>
        <motion.div variants={fadeUpItem}>
          <Field label="Work email" required htmlFor="onb-email" />
          <input
            id="onb-email"
            name="email"
            type="email"
            autoComplete="email"
            className="input mt-1.5"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </motion.div>
        <motion.div variants={fadeUpItem}>
          <Field label="Phone" htmlFor="onb-phone" />
          <input
            id="onb-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            className="input mt-1.5"
            placeholder="+254 7XX XXX XXX"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}

function ScopeStep({
  need,
  setNeed,
  selectedServices,
  techs,
  goBackToServices,
  goBackToTechs,
}: {
  need: string;
  setNeed: (v: string) => void;
  selectedServices: (typeof services)[number][];
  techs: string[];
  goBackToServices: () => void;
  goBackToTechs: () => void;
}) {
  return (
    <div>
      <StepTitle
        title="Anything else we should know?"
        sub="Optional — context helps us scope your quote accurately."
      />
      <motion.div
        variants={makeStagger(0.08, 0.1)}
        initial="hidden"
        animate="show"
        className="mt-5"
      >
        <motion.div variants={fadeUpItem}>
          <Field label="Your request in your own words" htmlFor="onb-need" />
          <textarea
            id="onb-need"
            name="need"
            rows={3}
            className="input mt-1.5 resize-y"
            placeholder="e.g. We have 40 staff, need a Microsoft 365 migration and better email security…"
            value={need}
            onChange={(e) => setNeed(e.target.value)}
          />
        </motion.div>

        <motion.div variants={fadeUpItem} className="mt-4">
          <p className="text-[12px] font-semibold uppercase tracking-[0.1em] text-graphite">
            Selected services
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {selectedServices.map((s) => (
              <span
                key={s.slug}
                className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary-soft px-3 py-1.5 text-[13px] font-medium text-ink"
              >
                <Icon name={s.icon} className="h-3.5 w-3.5 text-primary" />
                {s.name}
              </span>
            ))}
            <button
              type="button"
              onClick={goBackToServices}
              className="text-[13px] font-medium text-primary underline-offset-2 hover:underline"
            >
              Edit
            </button>
          </div>
        </motion.div>

        {techs.length > 0 && (
          <motion.div variants={fadeUpItem} className="mt-3">
            <p className="text-[12px] font-semibold uppercase tracking-[0.1em] text-graphite">
              Selected technologies
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              {techs.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1 rounded-[6px] border border-hairline bg-white px-2 py-1 text-[12px] font-medium text-charcoal"
                >
                  <Icon name={iconForTool(t)} className="h-3.5 w-3.5 text-primary" />
                  {shortToolName(t)}
                </span>
              ))}
              <button
                type="button"
                onClick={goBackToTechs}
                className="text-[13px] font-medium text-primary underline-offset-2 hover:underline"
              >
                Edit
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

function Confirmation({
  submittedAt,
  onClose,
}: {
  submittedAt: string;
  onClose?: () => void;
}) {
  return (
    <motion.div
      variants={makeStagger(0.12)}
      initial="hidden"
      animate="show"
      className="py-2 text-center"
      role="status"
    >
      <motion.svg
        viewBox="0 0 52 52"
        className="mx-auto h-16 w-16"
        aria-hidden="true"
      >
        <motion.circle
          cx="26"
          cy="26"
          r="24"
          fill="none"
          stroke="#024ad8"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
        <motion.path
          fill="none"
          stroke="#024ad8"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16 27l7 7 13-14"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.55, ease: "easeOut" }}
        />
      </motion.svg>

      <motion.h3 variants={fadeUpItem} className="mt-4 text-2xl font-semibold tracking-tight text-ink">
        Request received
      </motion.h3>
      <motion.p variants={fadeUpItem} className="mt-1.5 text-[14px] text-graphite">
        Reference{" "}
        <span className="font-semibold text-ink">{submittedAt}</span>
      </motion.p>
      <motion.p variants={fadeUpItem} className="mx-auto mt-3 max-w-sm text-[15px] leading-relaxed text-charcoal">
        A certified specialist will respond within{" "}
        <span className="font-semibold text-ink">{formatResponseTime()}</span>{" "}
        with scope, recommendations, and a tailored quote.
      </motion.p>

      <motion.ul variants={makeStagger(0.1, 0.4)} className="mx-auto mt-6 max-w-sm space-y-2 text-left">
        {[
          ["1", "Specialist reviews your request & technologies"],
          ["2", "Recommendations & scope confirmation"],
          ["3", "Tailored quote, no obligation"],
        ].map(([n, label]) => (
          <motion.li
            key={n}
            variants={fadeUpItem}
            className="flex items-center gap-3 rounded-[8px] border border-hairline bg-cloud px-3.5 py-2.5"
          >
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-[12px] font-bold text-white">
              {n}
            </span>
            <span className="text-[14px] font-medium text-ink">{label}</span>
          </motion.li>
        ))}
      </motion.ul>

      {onClose && (
        <motion.button
          variants={fadeUpItem}
          type="button"
          onClick={onClose}
          className="btn-primary mt-7 w-full !h-12"
        >
          Done
        </motion.button>
      )}
    </motion.div>
  );
}

function Field({
  label,
  htmlFor,
  required,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
}) {
  return (
    <label htmlFor={htmlFor} className="field-label">
      {label}
      {required && <span className="ml-0.5 text-primary">*</span>}
    </label>
  );
}
