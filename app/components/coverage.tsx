import { Icon } from "~/components/icons";
import { useQuote } from "~/components/quote-modal";
import { services } from "~/data/site";

export function Coverage() {
  const { openQuote } = useQuote();

  return (
    <section className="bg-tile-1 py-16 text-white sm:py-24">
      <div className="container-site grid items-center gap-12 lg:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-body-muted">
            Complete IT coverage
          </p>
          <h2 className="display-lg mt-3 text-white">
            Most clients start with one service — and expand.
          </h2>
          <p className="mt-5 max-w-lg text-[19px] leading-[1.47] tracking-[-0.374px] text-body-muted">
            The five categories work together as one IT stack. A Microsoft 365
            rollout naturally leads to endpoint protection; a new firewall leads
            to backup and disaster recovery. Start where the pain is, and let
            one accountable partner close the gaps.
          </p>
          <ul className="mt-6 space-y-3">
            {[
              "One team accountable for the whole stack",
              "Specialists in every category, not generalists",
              "One bill, one escalation path, one SLA",
            ].map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 text-[17px] leading-[1.47] tracking-[-0.374px] text-body-muted"
              >
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-white">
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
              className={`rounded-lg bg-tile-2 p-5 ${
                index === 4 ? "col-span-2 sm:col-span-1" : ""
              }`}
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-md bg-white/10 text-white">
                <Icon name={service.icon} className="h-5 w-5" />
              </span>
              <p className="mt-3 text-sm font-semibold leading-snug text-white">
                {service.name}
              </p>
            </div>
          ))}
          <div className="col-span-2 flex items-center justify-center gap-3 rounded-lg bg-tile-2 p-5 sm:col-span-3">
            <Icon name="layers" className="h-7 w-7 text-primary-on-dark" />
            <p className="text-[17px] font-semibold tracking-[-0.374px] text-white">
              Eldama — one partner managing your whole stack
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
