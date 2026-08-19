import { useState } from "react";
import { NavLink } from "react-router";

import { Icon } from "~/components/icons";
import { Logo } from "~/components/logo";
import { useQuote } from "~/components/quote-modal";
import { navLinks } from "~/data/site";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { openQuote } = useQuote();

  return (
    <header className="sticky top-0 z-40 border-b border-hairline-soft bg-white">
      <div className="container-site flex h-20 items-center justify-between gap-4">
        <Logo />

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-6">
            {navLinks.map((link) => (
              <li key={link.href}>
                <NavLink
                  to={link.href}
                  className={({ isActive }) =>
                    `border-b-2 pb-1 text-sm font-semibold transition-colors ${
                      isActive
                        ? "border-primary text-primary"
                        : "border-transparent text-muted hover:border-hairline hover:text-ink"
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
            className="flex h-10 w-10 items-center justify-center rounded-full border border-hairline bg-white text-ink transition-colors hover:bg-surface-soft lg:hidden"
          >
            <Icon name={menuOpen ? "close" : "menu"} className="h-5 w-5" />
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav
          id="mobile-menu"
          aria-label="Mobile"
          className="border-t border-hairline-soft bg-white lg:hidden"
        >
          <ul className="container-site space-y-1 py-3">
            {navLinks.map((link) => (
              <li key={link.href}>
                <NavLink
                  to={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-surface-soft text-ink"
                        : "text-body hover:bg-surface-soft hover:text-ink"
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
  );
}
