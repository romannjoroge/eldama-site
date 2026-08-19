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

import { Icon } from "~/components/icons";
import { QuoteForm } from "~/components/quote-form";
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
      {open && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-label="Get a quote"
        >
          <div
            className="fixed inset-0 bg-void/70 backdrop-blur-sm"
            onClick={closeQuote}
            aria-hidden="true"
          />
          <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
            <div
              ref={panelRef}
              tabIndex={-1}
              className="relative w-full max-w-xl rounded-lg border border-hairline bg-white p-6 outline-none sm:p-8"
            >
              <button
                type="button"
                onClick={closeQuote}
                aria-label="Close quote form"
                className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-ink-muted-48 transition-colors hover:bg-parchment hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-focus"
              >
                <Icon name="close" className="h-5 w-5" />
              </button>
              {/* key ensures a fresh form (and fresh confirmation state) per open */}
              <QuoteForm
                key={openCount}
                preselectedSlugs={slugs}
                fetcherKey="quote-modal"
                idPrefix="modal"
              />
            </div>
          </div>
        </div>
      )}
    </QuoteContext.Provider>
  );
}
