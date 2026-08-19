import { ServiceCard } from "~/components/service-card";
import { services } from "~/data/site";

export function ServicesGrid() {
  return (
    <section id="services" className="bg-white py-16 sm:py-20">
      <div className="container-site">
        <div className="max-w-2xl">
          <p className="eyebrow">What we do</p>
          <h2 className="mt-3 text-[1.75rem] font-bold tracking-tight text-ink sm:text-4xl">
            Find the service your business needs
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-body">
            Five core service areas, one certified partner. Start with a single
            category — most clients add more as they grow.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <ServiceCard key={service.slug} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
}
