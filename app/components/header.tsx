import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, type Variants } from "motion/react";
import { NavLink } from "react-router";

import { Icon } from "~/components/icons";
import { Logo } from "~/components/logo";
import { Magnetic } from "~/components/magnetic";
import { EASE } from "~/components/motion";
import { useQuote } from "~/components/quote-modal";
import { company, navLinks } from "~/data/site";

const menuContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};

const menuItem: Variants = {
  hidden: { opacity: 0, x: -14 },
  show: { opacity: 1, x: 0, transition: { duration: 0.35, ease: EASE } },
};

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [overDark, setOverDark] = useState(false);
  const { openQuote } = useQuote();
  const { scrollY } = useScroll();
  const rafRef = useRef<number>(0);

  // Sample the element sitting behind the nav; if it lives inside a section
  // marked data-dark (hero, coverage, CTA, footer) we switch to light chrome.
  const detectDark = useCallback(() => {
    if (typeof window === "undefined") return;
    const stack = document.elementsFromPoint(window.innerWidth / 2, 44);
    const behind = stack.find((el) => !el.closest("header"));
    setOverDark(Boolean(behind && behind.closest("[data-dark]")));
  }, []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 8);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(detectDark);
  });

  useLayoutEffect(() => {
    detectDark();
    const onResize = () => detectDark();
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [detectDark]);

  return (
    <>
      {/* Utility strip */}
      <div className="bg-[#0c1324] text-white">
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

      {/* Floating frosted-glass nav */}
      <motion.header
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.45, ease: EASE }}
        className={`glass-nav sticky top-0 z-40 border-b transition-[box-shadow,border-color] duration-300 ${
          scrolled
            ? "border-white/60 shadow-[0_12px_40px_rgba(15,23,42,0.14)]"
            : "border-white/50"
        }`}
      >
        {/* Specular top highlight */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent"
        />

        <div className="container-site relative flex h-16 items-center justify-between gap-4">
          <Logo variant={overDark ? "light" : "dark"} />

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <NavLink
                    to={link.href}
                    className={({ isActive }) =>
                      `group relative inline-flex h-16 items-center px-3 text-[15px] font-medium transition-colors duration-300 ${
                        isActive
                          ? overDark
                            ? "text-white"
                            : "text-ink"
                          : overDark
                            ? "text-white/75 hover:text-white"
                            : "text-charcoal hover:text-ink"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {link.label}
                        <span
                          aria-hidden="true"
                          className={`absolute inset-x-3 bottom-0 h-[2px] origin-left scale-x-0 rounded-full transition-transform duration-300 group-hover:scale-x-100 ${
                            overDark ? "bg-primary-bright/60" : "bg-primary/50"
                          }`}
                        />
                        {isActive && (
                          <motion.span
                            layoutId="nav-underline"
                            className={`absolute inset-x-3 bottom-0 h-[2px] rounded-full ${
                              overDark ? "bg-primary-bright" : "bg-primary"
                            }`}
                            transition={{ type: "spring", stiffness: 380, damping: 30 }}
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
            {/* CTA hidden on mobile — the fixed bottom bar handles that viewport */}
            <div className="hidden md:block">
              <Magnetic strength={0.25}>
                <motion.button
                  type="button"
                  onClick={() => openQuote()}
                  whileTap={{ scale: 0.96 }}
                  className="btn-primary group relative !h-9 overflow-hidden !px-4 !text-[13px]"
                >
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full"
                  />
                  <span className="relative">Get a Quote</span>
                  <Icon
                    name="arrow"
                    className="relative h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1"
                  />
                </motion.button>
              </Magnetic>
            </div>

            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className={`flex h-11 w-11 items-center justify-center rounded-[4px] transition-colors duration-300 ${
                overDark ? "text-white hover:bg-white/10" : "text-ink hover:bg-cloud"
              }`}
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

        {/* Mobile menu */}
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
              className="overflow-hidden border-t border-hairline bg-white/90 backdrop-blur-2xl lg:hidden"
            >
              <motion.ul
                variants={menuContainer}
                initial="hidden"
                animate="show"
                className="container-site space-y-1 py-3"
              >
                {navLinks.map((link) => (
                  <motion.li key={link.href} variants={menuItem}>
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
                  </motion.li>
                ))}
                <motion.li variants={menuItem} className="pt-2">
                  <a
                    href="#services"
                    onClick={() => setMenuOpen(false)}
                    className="block px-3 py-3 text-[17px] font-medium text-ink hover:text-primary"
                  >
                    See our services
                  </a>
                </motion.li>
              </motion.ul>
            </motion.nav>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
}
