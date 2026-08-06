import { Icon } from "~/components/icons";
import { useQuote } from "~/components/quote-modal";
import { services } from "~/data/site";

export function Coverage() {
  const { openQuote } = useQuote();

  return (
    <section className="overflow-hidden bg-navy-950 py-20 text-white sm:py-24">
      <div className="container-site grid items-center gap-12 lg:grid-cols-2">
        <div>
          <p className="eyebrow">Complete IT coverage</p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Most clients start with one service — and expand.
          </h2>
          <p className="mt-4 max-w-lg text-lg leading-relaxed text-navy-200">
            The five categories work together as one IT stack. A Microsoft 365
            rollout naturally leads to endpoint protection; a new firewall leads
            to backup and disaster recovery. Start where the pain is, and let
            one accountable partner close the gaps.
          </p>
          <ul className="mt-6 space-y-3 text-sm text-navy-200">
            {[
              "One team accountable for the whole stack",
              "Specialists in every category, not generalists",
              "One bill, one escalation path, one SLA",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-500/20 text-accent-400">
                  <Icon name="check" className="h-3.5 w-3.5" />
                </span>
                {item}
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => openQuote()}
            className="btn-primary mt-8"
          >
            Get a Quote
          </button>
        </div>

        <div
          aria-label="How the five service categories connect"
          className="grid grid-cols-2 gap-3 sm:grid-cols-3"
        >
          {services.map((service, index) => (
            <div
              key={service.slug}
              className={`rounded-xl border border-white/10 bg-white/5 p-4 ${
                index === 4 ? "col-span-2 sm:col-span-1" : ""
              }`}
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-500/15 text-accent-400">
                <Icon name={service.icon} className="h-5 w-5" />
              </span>
              <p className="mt-3 text-sm font-semibold leading-snug">
                {service.name}
              </p>
            </div>
          ))}
          <div className="col-span-2 flex items-center justify-center gap-3 rounded-xl border border-accent-500/40 bg-accent-500/10 p-4 sm:col-span-3">
            <Icon name="layers" className="h-7 w-7 text-accent-400" />
            <p className="text-sm font-bold">
              Eldama — one partner managing your whole stack
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
