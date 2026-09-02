import { Stagger, StaggerItem, scaleItem } from "~/components/motion";
import { SectionHeading } from "~/components/section-heading";
import { ServiceCard } from "~/components/service-card";
import { services } from "~/data/site";

export function ServicesGrid() {
  return (
    <section id="services" className="section-pad scroll-mt-24 bg-cloud">
      <div className="container-site">
        <SectionHeading
          eyebrow="What we do"
          title="Find the service your business needs"
          description="Six core service areas, one certified partner. Start with a single category — most clients add more as they grow."
        />

        <Stagger
          stagger={0.08}
          className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {services.map((service) => (
            <StaggerItem key={service.slug} variants={scaleItem} className="h-full">
              <ServiceCard service={service} />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
