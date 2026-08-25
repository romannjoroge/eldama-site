import { Icon } from "~/components/icons";
import { useQuote } from "~/components/quote-modal";
import { services } from "~/data/site";

export function Coverage() {
  const { openQuote } = useQuote();

  return (
    <section className="bg-ink section-pad text-white">
      <div className="container-site grid items-center gap-12 lg:grid-cols-2">
        <div>
          <p className="eyebrow-light">Complete IT coverage</p>
          <h2 className="mt-3 text-[clamp(1.85rem,3.4vw,2.75rem)] font-medium leading-[1.05] tracking-normal">
            Most clients start with one service — and expand.
          </h2>
          <p className="mt-4 max-w-lg text-lg leading-relaxed text-steel">
            The five categories work together as one IT stack. A Microsoft 365
            rollout naturally leads to endpoint protection; a new firewall leads
            to backup and disaster recovery. Start where the pain is, and let
            one accountable partner close the gaps.
          </p>
          <ul className="mt-6 space-y-3 text-[15px] text-steel">
            {[
              "One team accountable for the whole stack",
              "Specialists in every category, not generalists",
              "One bill, one escalation path, one SLA",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-[4px] bg-primary-bright/25 text-primary-bright">
                  <Icon name="check" className="h-3.5 w-3.5" />
                </span>
                {item}
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => openQuote()}
            className="btn-bright mt-8"
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
              className={`rounded-[16px] border border-white/10 bg-white/5 p-5 ${
                index === 4 ? "col-span-2 sm:col-span-1" : ""
              }`}
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-[4px] bg-white/10 text-primary-bright">
                <Icon name={service.icon} className="h-5 w-5" />
              </span>
              <p className="mt-3 text-[14px] font-semibold leading-snug">
                {service.name}
              </p>
            </div>
          ))}
          <div className="col-span-2 flex items-center justify-center gap-3 rounded-[16px] border border-primary-bright/40 bg-primary-bright/10 p-4 sm:col-span-3">
            <Icon name="layers" className="h-7 w-7 text-primary-bright" />
            <p className="text-[15px] font-semibold">
              Eldama — one partner managing your whole stack
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
