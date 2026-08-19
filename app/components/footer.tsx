import { Link } from "react-router";

import { Logo } from "~/components/logo";
import { company, partnerBadges, services } from "~/data/site";

export function Footer() {
  return (
    <footer className="bg-ink pb-24 pt-16 text-steel md:pb-12">
      <div className="container-site">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <Logo variant="light" />
            <p className="mt-4 max-w-sm text-[14px] leading-relaxed text-steel">
              {company.description}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {partnerBadges.map((badge) => (
                <span
                  key={badge}
                  className="rounded-[8px] border border-white/15 bg-white/5 px-2.5 py-1 text-[12px] font-medium text-white/80"
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>

          <nav aria-label="Services">
            <h3 className="text-[16px] font-semibold text-white">Services</h3>
            <ul className="mt-4 space-y-2.5 text-[14px]">
              {services.map((service) => (
                <li key={service.slug}>
                  <Link
                    to={`/services/${service.slug}`}
                    className="text-steel transition-colors hover:text-white"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Company">
            <h3 className="text-[16px] font-semibold text-white">Company</h3>
            <ul className="mt-4 space-y-2.5 text-[14px]">
              <li>
                <a href="/#why-eldama" className="text-steel transition-colors hover:text-white">
                  Why {company.name}
                </a>
              </li>
              <li>
                <a href="/#clients" className="text-steel transition-colors hover:text-white">
                  Our clients
                </a>
              </li>
              <li>
                <Link to="/quote" className="text-steel transition-colors hover:text-white">
                  Get a Quote
                </Link>
              </li>
            </ul>
          </nav>

          <div>
            <h3 className="text-[16px] font-semibold text-white">Contact</h3>
            <ul className="mt-4 space-y-2.5 text-[14px] text-steel">
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
            <Link to="/quote" className="btn-bright mt-5">
              Get a Quote
            </Link>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-[12px] text-steel/80 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {company.legalName}. All rights reserved.
          </p>
          <p>Certified partners across Microsoft, security, networking & cloud.</p>
        </div>
      </div>
    </footer>
  );
}
