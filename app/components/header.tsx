import { useState } from "react";
import { NavLink } from "react-router";

import { Icon } from "~/components/icons";
import { Logo } from "~/components/logo";
import { useQuote } from "~/components/quote-modal";
import { company, navLinks } from "~/data/site";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { openQuote } = useQuote();

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `nav-link transition-colors duration-150 ${
      isActive ? "text-white" : "text-white/70 hover:text-white"
    }`;

  return (
    <header className="sticky top-0 z-40">
      {/* Global nav — slim black utility bar */}
      <div className="bg-void text-white">
        <div className="container-site flex h-11 items-center justify-between gap-6">
          <Logo variant="light" />

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-5">
              <li>
                <NavLink to="/" end className={navLinkClass}>
                  Home
                </NavLink>
              </li>
              {navLinks.map((link) => (
                <li key={link.href}>
                  <NavLink to={link.href} className={navLinkClass}>
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={`tel:${company.phone.replace(/\s/g, "")}`}
              className="nav-link hidden text-white/70 transition-colors hover:text-white lg:block"
            >
              {company.phone}
            </a>
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="flex h-10 w-10 items-center justify-center rounded-sm text-white transition-colors hover:bg-white/10 lg:hidden"
            >
              <Icon name={menuOpen ? "close" : "menu"} className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Sub-nav — frosted parchment bar with the persistent primary CTA */}
      <div className="border-b border-hairline bg-parchment/80 backdrop-blur-xl">
        <div className="container-site flex h-[52px] items-center justify-between gap-4">
          <p className="tagline hidden text-ink sm:block">{company.tagline}</p>
          <p className="tagline text-ink sm:hidden">Services</p>
          <button
            type="button"
            onClick={() => openQuote()}
            className="btn-primary-sm"
          >
            Get a Quote
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav
          id="mobile-menu"
          aria-label="Mobile"
          className="border-t border-white/10 bg-void text-white lg:hidden"
        >
          <ul className="container-site space-y-1 py-3">
            <li>
              <NavLink
                to="/"
                end
                onClick={() => setMenuOpen(false)}
                className="block px-2 py-2.5 text-sm text-white/80 transition-colors hover:text-white"
              >
                Home
              </NavLink>
            </li>
            {navLinks.map((link) => (
              <li key={link.href}>
                <NavLink
                  to={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `block px-2 py-2.5 text-sm transition-colors ${
                      isActive
                        ? "text-white"
                        : "text-white/80 hover:text-white"
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
