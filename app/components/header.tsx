import { useState } from "react";
import { NavLink } from "react-router";

import { Icon } from "~/components/icons";
import { Logo } from "~/components/logo";
import { useQuote } from "~/components/quote-modal";
import { company, navLinks } from "~/data/site";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { openQuote } = useQuote();

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

      <header className="sticky top-0 z-40 border-b border-hairline bg-white">
        <div className="container-site flex h-16 items-center justify-between gap-4">
          <Logo />

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <NavLink
                    to={link.href}
                    className={({ isActive }) =>
                      `inline-flex h-16 items-center px-3 text-[15px] font-medium transition-colors ${
                        isActive
                          ? "text-ink shadow-[inset_0_-2px_0_0_#024ad8]"
                          : "text-charcoal hover:text-ink"
                      }`
                    }
                  >
                    {link.label}
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
              <Icon name={menuOpen ? "close" : "menu"} className="h-6 w-6" />
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav
            id="mobile-menu"
            aria-label="Mobile"
            className="border-t border-hairline bg-white lg:hidden"
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
          </nav>
        )}
      </header>
    </>
  );
}
