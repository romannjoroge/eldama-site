import { Icon } from "~/components/icons";
import { stats, whyEldama } from "~/data/site";

export function WhyEldama() {
  return (
    <section id="why-eldama" className="bg-navy-50/60 py-20 sm:py-24">
      <div className="container-site">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Why Eldama</p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl">
            Enterprise-grade IT, without the enterprise IT budget
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-navy-600">
            Procurement teams choose us for one reason: we remove the complexity
            of running technology, with certified expertise behind every
            service.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {whyEldama.map((item) => (
            <article key={item.title} className="card p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-navy-900 text-accent-400">
                <Icon name={item.icon} className="h-6 w-6" />
              </span>
              <h3 className="mt-4 text-base font-bold tracking-tight text-navy-900">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-navy-600">
                {item.body}
              </p>
            </article>
          ))}
        </div>

        <dl className="mt-14 grid grid-cols-2 gap-6 rounded-2xl border border-navy-100 bg-white p-8 sm:p-10 lg:grid-cols-4">
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
      <dd className="text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl">
        {value}
      </dd>
      <dt className="mt-1 text-sm text-navy-500">{label}</dt>
    </div>
  );
}
