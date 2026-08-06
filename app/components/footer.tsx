import { Link } from "react-router";

import { Logo } from "~/components/logo";
import { company, partnerBadges, services } from "~/data/site";

export function Footer() {
  return (
    <footer className="bg-navy-950 pb-24 pt-14 text-navy-200 md:pb-14">
      <div className="container-site">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <Logo variant="light" />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-navy-300">
              {company.name} is the outsourced IT department for growing
              businesses — one certified partner for Microsoft 365, networking,
              security, cloud, and email.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {partnerBadges.map((badge) => (
                <span
                  key={badge}
                  className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-medium text-navy-200"
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>

          <nav aria-label="Services">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Services
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {services.map((service) => (
                <li key={service.slug}>
                  <Link
                    to={`/services/${service.slug}`}
                    className="text-navy-300 transition-colors hover:text-white"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Company">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Company
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <a href="/#why-eldama" className="text-navy-300 transition-colors hover:text-white">
                  Why {company.name}
                </a>
              </li>
              <li>
                <a href="/#clients" className="text-navy-300 transition-colors hover:text-white">
                  Our clients
                </a>
              </li>
              <li>
                <Link to="/quote" className="text-navy-300 transition-colors hover:text-white">
                  Get a Quote
                </Link>
              </li>
            </ul>
          </nav>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Contact
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-navy-300">
              <li>
                <a
                  href={`mailto:${company.email}`}
                  className="transition-colors hover:text-white"
                >
                  {company.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${company.phone.replace(/\s/g, "")}`}
                  className="transition-colors hover:text-white"
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

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-navy-400 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {company.name}. All rights reserved.
          </p>
          <p>Certified partners across Microsoft, security, networking & cloud.</p>
        </div>
      </div>
    </footer>
  );
}
