import { motion } from "motion/react";

import { Icon } from "~/components/icons";
import { CountUp, Reveal, Stagger, StaggerItem, scaleItem } from "~/components/motion";
import { SectionHeading } from "~/components/section-heading";
import { SpotlightOverlay, useSpotlight } from "~/components/spotlight";
import { stats, whyEldama } from "~/data/site";

export function WhyEldama() {
  return (
    <section id="why-eldama" className="section-pad scroll-mt-24 bg-white">
      <div className="container-site">
        <SectionHeading
          eyebrow="Why Eldama"
          title="Enterprise-grade IT, without the enterprise IT budget"
          description="Procurement teams choose us for one reason: we remove the complexity of running technology, with certified expertise behind every service."
          align="center"
        />

        <Stagger
          stagger={0.1}
          className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {whyEldama.map((item) => (
            <StaggerItem key={item.title} variants={scaleItem} className="h-full">
              <WhyCard icon={item.icon} title={item.title} body={item.body} />
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal delay={0.1}>
          <dl className="mt-14 grid grid-cols-2 gap-8 rounded-[16px] border border-hairline bg-white p-8 sm:p-10 lg:grid-cols-4">
            <Stat
              value={<CountUp to={stats.yearsInBusiness} suffix="+" />}
              label="Years in business"
            />
            <Stat
              value={<CountUp to={stats.certificationsHeld} />}
              label="Certifications held"
            />
            <Stat
              value={<CountUp to={stats.clientsServed} suffix="+" />}
              label="Clients served"
            />
            <Stat
              value={<CountUp to={stats.uptimeSla} suffix="%" />}
              label="Managed uptime SLA"
            />
          </dl>
        </Reveal>
      </div>
    </section>
  );
}

function WhyCard({
  icon,
  title,
  body,
}: {
  icon: (typeof whyEldama)[number]["icon"];
  title: string;
  body: string;
}) {
  const { ref, onMouseMove } = useSpotlight();

  return (
    <motion.article
      ref={ref}
      onMouseMove={onMouseMove}
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 320, damping: 24 }}
      className="card group relative h-full overflow-hidden p-6 transition-colors duration-300 hover:border-primary/40 hover:shadow-[0_16px_40px_rgba(26,26,26,0.14)]"
    >
      <SpotlightOverlay />
      <span className="relative z-10 flex h-12 w-12 items-center justify-center rounded-[8px] bg-ink text-white transition-colors duration-300 group-hover:bg-primary">
        <Icon name={icon} className="h-6 w-6" />
      </span>
      <h3 className="relative z-10 mt-5 text-[17px] font-semibold leading-snug text-ink">
        {title}
      </h3>
      <p className="relative z-10 mt-2 text-[15px] leading-relaxed text-charcoal">
        {body}
      </p>
    </motion.article>
  );
}

function Stat({ value, label }: { value: React.ReactNode; label: string }) {
  return (
    <div className="text-center">
      <dd className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
        {value}
      </dd>
      <dt className="mt-1 text-[14px] text-graphite">{label}</dt>
    </div>
  );
}
