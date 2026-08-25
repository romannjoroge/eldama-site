import { Icon } from "~/components/icons";
import { stats, whyEldama } from "~/data/site";

export function WhyEldama() {
  return (
    <section id="why-eldama" className="bg-white section-pad">
      <div className="container-site">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Why Eldama</p>
          <h2 className="h-section mt-3">
            Enterprise-grade IT, without the enterprise IT budget
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-charcoal">
            Procurement teams choose us for one reason: we remove the complexity
            of running technology, with certified expertise behind every
            service.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {whyEldama.map((item) => (
            <article key={item.title} className="card p-6">
              <span className="flex h-12 w-12 items-center justify-center rounded-[8px] bg-ink text-white">
                <Icon name={item.icon} className="h-6 w-6" />
              </span>
              <h3 className="mt-5 text-[17px] font-semibold leading-snug text-ink">
                {item.title}
              </h3>
              <p className="mt-2 text-[15px] leading-relaxed text-charcoal">
                {item.body}
              </p>
            </article>
          ))}
        </div>

        <dl className="mt-14 grid grid-cols-2 gap-8 rounded-[16px] border border-hairline bg-white p-8 sm:p-10 lg:grid-cols-4">
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
    <div className="text-center">
      <dd className="text-3xl font-medium tracking-normal text-ink sm:text-4xl">
        {value}
      </dd>
      <dt className="mt-1 text-[14px] text-graphite">{label}</dt>
    </div>
  );
}
