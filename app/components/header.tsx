import { useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { NavLink } from "react-router";

import { Icon } from "~/components/icons";
import { Logo } from "~/components/logo";
import { EASE } from "~/components/motion";
import { useQuote } from "~/components/quote-modal";
import { company, navLinks } from "~/data/site";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { openQuote } = useQuote();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 8);
  });

  return (
    <>
      {/* Utility strip */}
      <div className="bg-ink text-white">
        <div className="container-site flex h-9 items-center justify-between gap-4 text-[13px]">
          <p className="truncate font-medium tracking-[0.02em]">
            Certified Microsoft Gold Partner · Security, cloud & networking
          </p>
          <div className="flex shrink-0 items-center gap-4">
            <a
              href={`tel:${company.phone.replace(/\s/g, "")}`}
              className="hidden items-center gap-1.5 text-steel transition-colors hover:text-white sm:flex"
            >
              <Icon name="phone" className="h-3.5 w-3.5" />
              {company.phone}
            </a>
            <a
              href={`mailto:${company.email}`}
              className="flex items-center gap-1.5 text-steel transition-colors hover:text-white"
            >
              <Icon name="envelope" className="h-3.5 w-3.5" />
              {company.email}
            </a>
          </div>
        </div>
      </div>

      <motion.header
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.45, ease: EASE }}
        className={`sticky top-0 z-40 border-b bg-white/90 backdrop-blur-md transition-shadow duration-300 ${
          scrolled
            ? "border-hairline shadow-[0_4px_24px_rgba(26,26,26,0.08)]"
            : "border-transparent"
        }`}
      >
        <div className="container-site flex h-16 items-center justify-between gap-4">
          <Logo />

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <NavLink
                    to={link.href}
                    className={({ isActive }) =>
                      `relative inline-flex h-16 items-center px-3 text-[15px] font-medium transition-colors ${
                        isActive ? "text-ink" : "text-charcoal hover:text-ink"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {link.label}
                        {isActive && (
                          <motion.span
                            layoutId="nav-underline"
                            className="absolute inset-x-3 bottom-0 h-[2px] bg-primary"
                            transition={{
                              type: "spring",
                              stiffness: 380,
                              damping: 30,
                            }}
                          />
                        )}
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => openQuote()}
              className="btn-primary hidden sm:inline-flex"
            >
              Get a Quote
            </button>
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="flex h-11 w-11 items-center justify-center rounded-[4px] text-ink transition-colors hover:bg-cloud lg:hidden"
            >
              <motion.span
                key={menuOpen ? "close" : "menu"}
                initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                transition={{ duration: 0.25, ease: EASE }}
                className="flex"
              >
                <Icon name={menuOpen ? "close" : "menu"} className="h-6 w-6" />
              </motion.span>
            </button>
          </div>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.nav
              key="mobile-menu"
              id="mobile-menu"
              aria-label="Mobile"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.28, ease: EASE }}
              className="overflow-hidden border-t border-hairline bg-white lg:hidden"
            >
              <ul className="container-site space-y-1 py-3">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <NavLink
                      to={link.href}
                      onClick={() => setMenuOpen(false)}
                      className={({ isActive }) =>
                        `block px-3 py-3 text-[17px] font-medium ${
                          isActive ? "text-primary" : "text-ink hover:text-primary"
                        }`
                      }
                    >
                      {link.label}
                    </NavLink>
                  </li>
                ))}
                <li className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      openQuote();
                    }}
                    className="btn-primary w-full"
                  >
                    Get a Quote
                  </button>
                </li>
              </ul>
            </motion.nav>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
}
