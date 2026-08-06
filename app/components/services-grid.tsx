import { ServiceCard } from "~/components/service-card";
import { services } from "~/data/site";

export function ServicesGrid() {
  return (
    <section id="services" className="bg-white py-20 sm:py-24">
      <div className="container-site">
        <div className="max-w-2xl">
          <p className="eyebrow">What we do</p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl">
            Find the service your business needs
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-navy-600">
            Five core service areas, one certified partner. Start with a single
            category — most clients add more as they grow.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <ServiceCard key={service.slug} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
}
