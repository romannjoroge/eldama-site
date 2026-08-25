import { Icon } from "~/components/icons";
import { useQuote } from "~/components/quote-modal";
import { services } from "~/data/site";

export function Hero() {
  const { openQuote } = useQuote();

  return (
    <section className="bg-white">
      <div className="container-site py-12 sm:py-16 lg:py-20">
        <div className="relative">
          {/* Angular blue chevrons — hero-only brand motif (vanish on mobile) */}
          <span
            aria-hidden="true"
            className="absolute -left-4 top-0 hidden h-full w-8 bg-primary md:block lg:-left-10 lg:w-16"
            style={{ clipPath: "polygon(0 0, 100% 12%, 100% 100%, 0 88%)" }}
          />
          <span
            aria-hidden="true"
            className="absolute -right-4 top-0 hidden h-full w-8 bg-primary md:block lg:-right-10 lg:w-16"
            style={{ clipPath: "polygon(0 12%, 100% 0, 100% 88%, 0 100%)" }}
          />

          <div className="card grid overflow-hidden lg:grid-cols-[1fr_1.05fr]">
            {/* Left: placeholder visual — swap for brand photography */}
            <div className="relative bg-ink p-7 text-white sm:p-10">
              <p className="eyebrow-light">One partner. Five disciplines.</p>
              <ul className="mt-6 space-y-2">
                {services.map((service) => (
                  <li
                    key={service.slug}
                    className="flex items-center gap-3 rounded-[8px] border border-white/10 bg-white/5 px-4 py-3"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[4px] bg-white/10 text-primary-bright">
                      <Icon name={service.icon} className="h-5 w-5" />
                    </span>
                    <span className="text-[15px] font-medium text-white">
                      {service.name}
                    </span>
                    <Icon name="check" className="ml-auto h-4 w-4 text-white/60" />
                  </li>
                ))}
              </ul>
              <p className="mt-6 flex items-start gap-3 text-sm leading-relaxed text-steel">
                <Icon
                  name="layers"
                  className="mt-0.5 h-5 w-5 shrink-0 text-primary-bright"
                />
                One team designs, deploys, secures, and supports the whole
                stack — and one team answers when something breaks.
              </p>
            </div>

            {/* Right: copy block */}
            <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-12">
              <p className="badge-ink w-fit">
                <Icon name="certificate" className="h-4 w-4" />
                Certified across every service we offer
              </p>
              <h1 className="h-display mt-6">
                Your outsourced IT department,{" "}
                <span className="text-charcoal">without the headcount.</span>
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-charcoal">
                Eldama is one certified partner for Microsoft 365, networking,
                security, cloud, and email — so growing businesses get
                enterprise-grade IT without building an in-house team or
                juggling five vendors.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => openQuote()}
                  className="btn-primary"
                >
                  Get a Quote
                  <Icon name="arrow" className="h-4 w-4" />
                </button>
                <a href="#services" className="btn-outline-ink">
                  See our services
                </a>
              </div>
              <dl className="mt-10 grid max-w-md grid-cols-3 gap-6 border-t border-hairline pt-6">
                <Stat value="15+" label="Years in business" />
                <Stat value="12" label="Certifications held" />
                <Stat value="200+" label="Clients served" />
              </dl>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <dt className="sr-only">{label}</dt>
      <dd className="text-2xl font-medium text-ink">{value}</dd>
      <dd className="mt-0.5 text-[13px] text-graphite">{label}</dd>
    </div>
  );
}
