"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { AnimatePresence, motion } from "motion/react";
import { useLenis } from "lenis/react";

import { Icon } from "~/components/icons";
import { QuoteOnboarding } from "~/components/quote-onboarding";
import type { ServiceSlug } from "~/data/site";

interface QuoteContextValue {
  openQuote: (slugs?: ServiceSlug[]) => void;
  closeQuote: () => void;
}

const QuoteContext = createContext<QuoteContextValue | null>(null);

export function useQuote() {
  const ctx = useContext(QuoteContext);
  if (!ctx) throw new Error("useQuote must be used within <QuoteProvider>");
  return ctx;
}

export function QuoteProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [slugs, setSlugs] = useState<ServiceSlug[]>([]);
  const [openCount, setOpenCount] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  const lenis = useLenis();

  const openQuote = useCallback((serviceSlugs?: ServiceSlug[]) => {
    restoreFocusRef.current = document.activeElement as HTMLElement | null;
    setSlugs(serviceSlugs ?? []);
    setOpenCount((count) => count + 1);
    setOpen(true);
  }, []);

  const closeQuote = useCallback(() => {
    setOpen(false);
  }, []);

  // Lock body scroll while the modal is open.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  // Stop Lenis while the modal is open so wheel/touch scroll the modal itself,
  // never the page behind it.
  useEffect(() => {
    if (!open) return;
    lenis?.stop();
    return () => {
      lenis?.start();
    };
  }, [open, lenis]);

  // Move focus into the dialog and restore it on close.
  useEffect(() => {
    if (!open) return;
    panelRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
      } else if (event.key === "Tab" && panelRef.current) {
        // Keep focus inside the dialog while it is open.
        const focusable = panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      restoreFocusRef.current?.focus();
    };
  }, [open, openCount]);

  return (
    <QuoteContext.Provider value={{ openQuote, closeQuote }}>
      {children}
      <AnimatePresence>
        {open && (
          <motion.div
            key="quote-dialog"
            className="fixed inset-0 z-50 overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-label="Get a quote"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <motion.div
              className="fixed inset-0 bg-ink/70 backdrop-blur-[2px]"
              onClick={closeQuote}
              aria-hidden="true"
            />
            <div className="flex min-h-full items-center justify-center p-4 py-6 sm:p-6">
              <motion.div
                ref={panelRef}
                tabIndex={-1}
                initial={{ opacity: 0, scale: 0.95, y: 24 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 12 }}
                transition={{ type: "spring", stiffness: 320, damping: 28 }}
                className="relative flex max-h-[calc(100dvh-3rem)] w-full max-w-xl flex-col overflow-hidden rounded-[16px] border border-hairline bg-white shadow-[0_24px_64px_rgba(26,26,26,0.28)] outline-none"
              >
                {/* Brand accent bar */}
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 z-30 h-[3px] bg-gradient-to-r from-primary via-primary-bright to-primary"
                />
                {/* Ambient glow */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-20 -top-20 z-0 h-48 w-48 rounded-full bg-primary-soft/60 blur-3xl"
                />
                <button
                  type="button"
                  onClick={closeQuote}
                  aria-label="Close quote form"
                  className="absolute right-4 top-4 z-40 flex h-9 w-9 items-center justify-center rounded-[4px] text-graphite transition-colors hover:bg-cloud hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <Icon name="close" className="h-5 w-5" />
                </button>
                {/* key ensures a fresh journey (and fresh confirmation state) per open.
                    The onboarding owns its scrollable body + pinned footer bar. */}
                <QuoteOnboarding
                  key={openCount}
                  preselectedSlugs={slugs}
                  fetcherKey="quote-modal"
                  onClose={closeQuote}
                />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </QuoteContext.Provider>
  );
}
