import { Icon } from "~/components/icons";
import { useQuote } from "~/components/quote-modal";
import { services } from "~/data/site";
import { Link } from "react-router";

export function CtaBanner({
  heading = "Ready to solve your IT problem?",
  body = "Tell us what you need and get a tailored quote — our team responds within 24 business hours.",
  buttonLabel = "Get a tailored quote",
  serviceSlugs,
}: {
  heading?: string;
  body?: string;
  buttonLabel?: string;
  serviceSlugs?: Parameters<ReturnType<typeof useQuote>["openQuote"]>[0];
}) {
  const { openQuote } = useQuote();

  return (
    <section className="bg-ink section-pad text-white">
      <div className="container-site">
        <div className="text-center">
          <h2 className="mx-auto max-w-3xl text-[clamp(1.85rem,3.4vw,2.75rem)] font-medium leading-[1.05] tracking-normal">
            {heading}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-steel">
            {body}
          </p>
          <div className="mt-8">
            <button
              type="button"
              onClick={() => openQuote(serviceSlugs)}
              className="btn-bright"
            >
              {buttonLabel}
              <Icon name="arrow" className="h-4 w-4" />
            </button>
          </div>
          <ul className="mt-8 flex flex-wrap items-center justify-center gap-2.5">
            {services.map((service) => (
              <li key={service.slug}>
                <Link
                  to={`/services/${service.slug}`}
                  className="pill-outline-light transition-colors hover:bg-white/15"
                >
                  {service.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
