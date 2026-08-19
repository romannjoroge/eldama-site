import { Link } from "react-router";

import { Logo } from "~/components/logo";
import { company, partnerBadges, services } from "~/data/site";

export function Footer() {
  return (
    <footer className="border-t border-hairline-soft bg-white pb-28 pt-12 md:pb-12">
      <div className="container-site">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.2fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-body">
              {company.description}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {partnerBadges.map((badge) => (
                <span key={badge} className="badge-pill">
                  {badge}
                </span>
              ))}
            </div>
          </div>

          <nav aria-label="Services">
            <h3 className="text-base font-medium text-ink">Services</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {services.map((service) => (
                <li key={service.slug}>
                  <Link
                    to={`/services/${service.slug}`}
                    className="text-body transition-colors underline-offset-4 hover:text-primary hover:underline"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Company">
            <h3 className="text-base font-medium text-ink">Company</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <a
                  href="/#why-eldama"
                  className="text-body transition-colors underline-offset-4 hover:text-primary hover:underline"
                >
                  Why {company.name}
                </a>
              </li>
              <li>
                <a
                  href="/#clients"
                  className="text-body transition-colors underline-offset-4 hover:text-primary hover:underline"
                >
                  Our clients
                </a>
              </li>
              <li>
                <Link
                  to="/quote"
                  className="text-body transition-colors underline-offset-4 hover:text-primary hover:underline"
                >
                  Get a Quote
                </Link>
              </li>
            </ul>
          </nav>

          <div>
            <h3 className="text-base font-medium text-ink">Contact</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-body">
              <li>
                <a
                  href={`mailto:${company.email}`}
                  className="transition-colors underline-offset-4 hover:text-primary hover:underline"
                >
                  {company.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${company.phone.replace(/\s/g, "")}`}
                  className="transition-colors underline-offset-4 hover:text-primary hover:underline"
                >
                  {company.phone}
                </a>
              </li>
              <li>{company.address}</li>
            </ul>
            <Link to="/quote" className="btn-primary mt-5">
              Get a Quote
            </Link>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-hairline-soft pt-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {company.legalName}. All rights
            reserved.
          </p>
          <p>
            Certified partners across Microsoft, security, networking & cloud.
          </p>
        </div>
      </div>
    </footer>
  );
}
