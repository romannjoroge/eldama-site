import { ServiceCard } from "~/components/service-card";
import { services } from "~/data/site";

export function ServicesGrid() {
  return (
    <section id="services" className="bg-canvas py-16 sm:py-24">
      <div className="container-site">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">What we do</p>
          <h2 className="display-lg mt-3 text-ink">
            Find the service your business needs
          </h2>
          <p className="lead mt-4 text-ink-muted-80">
            Five core service areas, one certified partner. Start with a single
            category — most clients add more as they grow.
          </p>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <ServiceCard key={service.slug} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
}
