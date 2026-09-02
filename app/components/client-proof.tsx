import { motion } from "motion/react";
import { Link } from "react-router";

import { Icon } from "~/components/icons";
import { Stagger, StaggerItem, scaleItem } from "~/components/motion";
import { SectionHeading } from "~/components/section-heading";
import { SpotlightOverlay, useSpotlight } from "~/components/spotlight";
import { clients, services } from "~/data/site";

export function ClientProof() {
  return (
    <section id="clients" className="cv-section section-pad scroll-mt-24 bg-cloud">
      <div className="container-site">
        <SectionHeading
          eyebrow="Client proof"
          title="Trusted by organisations that can't afford downtime"
          description="From construction groups to hospitals to retail, we run the IT that keeps their people productive and their operations secure."
          align="center"
        />

        <Stagger stagger={0.12} className="mt-12 grid gap-5 md:grid-cols-3">
          {clients.map((client) => {
            const related = services.find((service) =>
              service.clientProof.some((proof) => proof.client === client.name),
            );
            return (
              <StaggerItem key={client.name} variants={scaleItem} className="h-full">
                <ClientCard
                  name={client.name}
                  proof={client.proof}
                  relatedSlug={related?.slug}
                />
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}

function ClientCard({
  name,
  proof,
  relatedSlug,
}: {
  name: string;
  proof: string;
  relatedSlug?: string;
}) {
  const { ref, onMouseMove } = useSpotlight();

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMouseMove}
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 320, damping: 24 }}
      className="card group relative flex h-full flex-col overflow-hidden p-6 transition-colors duration-300 hover:border-primary/40 hover:shadow-[0_16px_40px_rgba(26,26,26,0.14)]"
    >
      <SpotlightOverlay />
      <div className="relative z-10 flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-[4px] bg-ink text-lg font-bold text-white transition-colors duration-300 group-hover:bg-primary">
          {name.charAt(0)}
        </span>
        <div>
          <p className="text-[16px] font-semibold text-ink">{name}</p>
          <p className="text-[12px] text-graphite">Client</p>
        </div>
      </div>
      <p className="relative z-10 mt-4 text-[15px] leading-relaxed text-charcoal">
        {proof}
      </p>
      {relatedSlug && (
        <Link to={`/services/${relatedSlug}`} className="link-arrow relative z-10 mt-5">
          See how
          <Icon
            name="arrow"
            className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
          />
        </Link>
      )}
    </motion.div>
  );
}
