import { Icon } from "~/components/icons";
import { useQuote } from "~/components/quote-modal";
import { services } from "~/data/site";

export function Coverage() {
  const { openQuote } = useQuote();

  return (
    <section className="bg-surface-soft py-16 sm:py-20">
      <div className="container-site grid items-center gap-12 lg:grid-cols-2">
        <div>
          <p className="eyebrow">Complete IT coverage</p>
          <h2 className="mt-3 text-[1.75rem] font-bold tracking-tight text-ink sm:text-4xl">
            Most clients start with one service — and expand.
          </h2>
          <p className="mt-4 max-w-lg text-lg leading-relaxed text-body">
            The five categories work together as one IT stack. A Microsoft 365
            rollout naturally leads to endpoint protection; a new firewall
            leads to backup and disaster recovery. Start where the pain is, and
            let one accountable partner close the gaps.
          </p>
          <ul className="mt-6 space-y-3 text-sm text-body">
            {[
              "One team accountable for the whole stack",
              "Specialists in every category, not generalists",
              "One bill, one escalation path, one SLA",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-surface-strong text-ink">
                  <Icon name="check" className="h-3.5 w-3.5" />
                </span>
                {item}
              </li>
            ))}
          </ul>
          <button type="button" onClick={() => openQuote()} className="btn-primary mt-8">
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
              className={`rounded-card border border-hairline-soft bg-white p-4 ${
                index === 4 ? "col-span-2 sm:col-span-1" : ""
              }`}
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-soft text-ink">
                <Icon name={service.icon} className="h-5 w-5" />
              </span>
              <p className="mt-3 text-sm font-semibold leading-snug text-ink">
                {service.name}
              </p>
            </div>
          ))}
          <div className="col-span-2 flex items-center justify-between gap-3 rounded-card border border-hairline-soft bg-white p-4 sm:col-span-3">
            <span className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon name="layers" className="h-5 w-5" />
              </span>
              <p className="text-sm font-semibold text-ink">
                Eldama — one partner managing your whole stack
              </p>
            </span>
            <button
              type="button"
              onClick={() => openQuote()}
              className="link-brand shrink-0"
            >
              Get a quote
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
