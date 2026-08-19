import { Link } from "react-router";

import { Logo } from "~/components/logo";
import { company, partnerBadges, services } from "~/data/site";

export function Footer() {
  return (
    <footer className="border-t border-hairline bg-canvas pb-24 pt-12 md:pb-14">
      <div className="container-site">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-body">
              {company.description}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {partnerBadges.map((badge) => (
                <span key={badge} className="chip">
                  {badge}
                </span>
              ))}
            </div>
          </div>

          <nav aria-label="Services">
            <h3 className="text-xs font-bold uppercase tracking-[0.08em] text-body">
              Services
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {services.map((service) => (
                <li key={service.slug}>
                  <Link
                    to={`/services/${service.slug}`}
                    className="text-mute transition-colors hover:text-ink"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Company">
            <h3 className="text-xs font-bold uppercase tracking-[0.08em] text-body">
              Company
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <a
                  href="/#why-eldama"
                  className="text-mute transition-colors hover:text-ink"
                >
                  Why {company.name}
                </a>
              </li>
              <li>
                <a
                  href="/#clients"
                  className="text-mute transition-colors hover:text-ink"
                >
                  Our clients
                </a>
              </li>
              <li>
                <Link
                  to="/quote"
                  className="text-mute transition-colors hover:text-ink"
                >
                  Get a Quote
                </Link>
              </li>
            </ul>
          </nav>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.08em] text-body">
              Contact
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-mute">
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
            <Link to="/quote" className="btn-primary btn-pill mt-5">
              Get a Quote
            </Link>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-hairline-soft pt-6 text-xs text-mute sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {company.legalName}. All rights reserved.
          </p>
          <p>Certified partners across Microsoft, security, networking & cloud.</p>
        </div>
      </div>
    </footer>
  );
}
