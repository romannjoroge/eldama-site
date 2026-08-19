import { Link } from "react-router";

import { Logo } from "~/components/logo";
import { useQuote } from "~/components/quote-modal";
import { company, partnerBadges, services } from "~/data/site";

export function Footer() {
  const { openQuote } = useQuote();

  return (
    <footer className="bg-parchment pb-28 pt-16 text-ink-muted-80 md:pb-16">
      <div className="container-site">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr_1.2fr]">
          <div>
            <Logo />
            <p className="mt-5 max-w-sm text-[17px] leading-[1.47] tracking-[-0.374px] text-ink-muted-80">
              {company.description}
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {partnerBadges.map((badge) => (
                <span
                  key={badge}
                  className="rounded-full border border-hairline bg-white px-3 py-1 text-xs tracking-[-0.12px] text-ink-muted-80"
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>

          <nav aria-label="Services">
            <h3 className="caption-strong text-ink">Services</h3>
            <ul className="dense-link mt-2">
              {services.map((service) => (
                <li key={service.slug}>
                  <Link
                    to={`/services/${service.slug}`}
                    className="text-ink-muted-80 transition-colors hover:text-ink"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Company">
            <h3 className="caption-strong text-ink">Company</h3>
            <ul className="dense-link mt-2">
              <li>
                <a
                  href="/#why-eldama"
                  className="text-ink-muted-80 transition-colors hover:text-ink"
                >
                  Why {company.name}
                </a>
              </li>
              <li>
                <a
                  href="/#clients"
                  className="text-ink-muted-80 transition-colors hover:text-ink"
                >
                  Our clients
                </a>
              </li>
              <li>
                <Link
                  to="/quote"
                  className="text-ink-muted-80 transition-colors hover:text-ink"
                >
                  Get a Quote
                </Link>
              </li>
            </ul>
          </nav>

          <div>
            <h3 className="caption-strong text-ink">Contact</h3>
            <ul className="dense-link mt-2">
              <li>
                <a
                  href={`mailto:${company.email}`}
                  className="transition-colors hover:text-ink"
                >
                  {company.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${company.phone.replace(/\s/g, "")}`}
                  className="transition-colors hover:text-ink"
                >
                  {company.phone}
                </a>
              </li>
              <li>{company.address}</li>
            </ul>
            <button
              type="button"
              onClick={() => openQuote()}
              className="btn-primary mt-6"
            >
              Get a Quote
            </button>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-hairline pt-6 text-xs tracking-[-0.12px] text-ink-muted-48 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {company.legalName}. All rights reserved.
          </p>
          <p>Certified partners across Microsoft, security, networking & cloud.</p>
        </div>
      </div>
    </footer>
  );
}
