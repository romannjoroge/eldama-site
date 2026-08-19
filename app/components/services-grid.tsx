import { ServiceCard } from "~/components/service-card";
import { services } from "~/data/site";

export function ServicesGrid() {
  return (
    <section id="services" className="bg-canvas py-16 sm:py-20">
      <div className="container-site">
        <div className="max-w-2xl">
          <p className="eyebrow">What we do</p>
          <h2 className="h-section mt-3">
            Find the service your business needs
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-body">
            Five core service areas, one certified partner. Start with a single
            category — most clients add more as they grow.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <ServiceCard key={service.slug} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
}
