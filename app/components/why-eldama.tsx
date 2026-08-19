import { Icon } from "~/components/icons";
import { stats, whyEldama } from "~/data/site";

export function WhyEldama() {
  return (
    <section id="why-eldama" className="bg-white py-16 sm:py-20">
      <div className="container-site">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Why Eldama</p>
          <h2 className="mt-3 text-[1.75rem] font-bold tracking-tight text-ink sm:text-4xl">
            Enterprise-grade IT, without the enterprise IT budget
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-body">
            Procurement teams choose us for one reason: we remove the
            complexity of running technology, with certified expertise behind
            every service.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {whyEldama.map((item) => (
            <article key={item.title} className="card p-6">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-card bg-primary/10 text-primary">
                <Icon name={item.icon} className="h-6 w-6" />
              </span>
              <h3 className="mt-4 text-base font-semibold tracking-tight text-ink">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-body">
                {item.body}
              </p>
            </article>
          ))}
        </div>

        <dl className="mt-14 grid grid-cols-2 gap-y-8 rounded-card border border-hairline bg-white p-8 sm:p-10 lg:grid-cols-4">
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
      <dd className="text-4xl font-bold tracking-tight text-ink">{value}</dd>
      <dt className="mt-1 text-sm text-muted">{label}</dt>
    </div>
  );
}
