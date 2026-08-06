import { Icon } from "~/components/icons";
import { useQuote } from "~/components/quote-modal";
import { services } from "~/data/site";

export function Hero() {
  const { openQuote } = useQuote();

  return (
    <section className="relative overflow-hidden bg-navy-950 text-white">
      {/* subtle grid + glow, all CSS so it can be swapped later */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-[size:44px_44px]"
      />
      <div
        aria-hidden="true"
        className="absolute -top-32 right-0 h-[480px] w-[480px] rounded-full bg-accent-500/15 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-40 -left-24 h-[420px] w-[420px] rounded-full bg-navy-500/25 blur-3xl"
      />

      <div className="container-site relative grid gap-12 py-20 sm:py-24 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:py-28">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-navy-100">
            <Icon name="certificate" className="h-4 w-4 text-accent-400" />
            Certified across every service we offer
          </p>
          <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-[3.4rem]">
            Your outsourced IT department,{" "}
            <span className="text-accent-400">without the headcount.</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-navy-200">
            Eldama is one certified partner for Microsoft 365, networking,
            security, cloud, and email — so growing businesses get enterprise-grade
            IT without building an in-house team or juggling five vendors.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button type="button" onClick={() => openQuote()} className="btn-primary">
              Get a Quote
              <Icon name="arrow" className="h-4 w-4" />
            </button>
            <a href="#services" className="btn-secondary">
              See our services
            </a>
          </div>
          <dl className="mt-10 grid max-w-md grid-cols-3 gap-4 border-t border-white/10 pt-6">
            <Stat value="15+" label="Years in business" />
            <Stat value="12" label="Certifications held" />
            <Stat value="200+" label="Clients served" />
          </dl>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent-400">
            One partner. Five disciplines.
          </p>
          <ul className="mt-5 space-y-2.5">
            {services.map((service) => (
              <li
                key={service.slug}
                className="flex items-center gap-3 rounded-xl border border-white/10 bg-navy-900/50 px-4 py-3"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-500/15 text-accent-400">
                  <Icon name={service.icon} className="h-5 w-5" />
                </span>
                <span className="text-sm font-semibold text-white">
                  {service.name}
                </span>
                <Icon name="check" className="ml-auto h-4 w-4 text-emerald-400" />
              </li>
            ))}
          </ul>
          <p className="mt-5 text-sm leading-relaxed text-navy-300">
            One team designs, deploys, secures, and supports the whole stack —
            and one team answers when something breaks.
          </p>
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <dt className="sr-only">{label}</dt>
      <dd className="text-2xl font-extrabold text-white">{value}</dd>
      <dd className="mt-0.5 text-xs text-navy-300">{label}</dd>
    </div>
  );
}
