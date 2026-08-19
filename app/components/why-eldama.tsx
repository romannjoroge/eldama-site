import { Icon } from "~/components/icons";
import { stats, whyEldama } from "~/data/site";

export function WhyEldama() {
  return (
    <section id="why-eldama" className="bg-parchment py-16 sm:py-24">
      <div className="container-site">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Why Eldama</p>
          <h2 className="display-lg mt-3 text-ink">
            Enterprise-grade IT, without the enterprise IT budget
          </h2>
          <p className="lead mt-4 text-ink-muted-80">
            Procurement teams choose us for one reason: we remove the complexity
            of running technology, with certified expertise behind every
            service.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {whyEldama.map((item) => (
            <article
              key={item.title}
              className="rounded-lg border border-hairline bg-white p-6"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-parchment text-ink">
                <Icon name={item.icon} className="h-6 w-6" />
              </span>
              <h3 className="mt-4 text-[17px] font-semibold leading-[1.24] tracking-[-0.374px] text-ink">
                {item.title}
              </h3>
              <p className="mt-2 text-[15px] leading-[1.47] tracking-[-0.224px] text-ink-muted-80">
                {item.body}
              </p>
            </article>
          ))}
        </div>

        <dl className="mt-14 grid grid-cols-2 gap-x-4 gap-y-8 border-t border-hairline pt-10 text-center lg:grid-cols-4">
          <Stat value={`${stats.yearsInBusiness}+`} label="Years in business" />
          <Stat
            value={`${stats.certificationsHeld}`}
            label="Certifications held"
          />
          <Stat value={`${stats.clientsServed}+`} label="Clients served" />
          <Stat value={`${stats.uptimeSla}%`} label="Managed uptime SLA" />
        </dl>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <dd className="font-display text-[30px] font-semibold leading-[1.1] tracking-[-0.28px] text-ink sm:text-[40px]">
        {value}
      </dd>
      <dt className="mt-1 text-xs tracking-[-0.12px] text-ink-muted-48">
        {label}
      </dt>
    </div>
  );
}
