import { Icon } from "~/components/icons";
import { useQuote } from "~/components/quote-modal";

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
    <section className="bg-white py-16 sm:py-20">
      <div className="container-site">
        <div className="relative overflow-hidden rounded-card bg-navy-950 px-6 py-14 text-center text-white sm:px-12 sm:py-16">
          <div
            aria-hidden="true"
            className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/5"
          />
          <div
            aria-hidden="true"
            className="absolute -bottom-20 -left-16 h-64 w-64 rounded-full bg-white/5"
          />
          <div className="relative">
            <h2 className="mx-auto max-w-2xl text-[1.75rem] font-bold tracking-tight sm:text-4xl">
              {heading}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-white/70">
              {body}
            </p>
            <button
              type="button"
              onClick={() => openQuote(serviceSlugs)}
              className="btn-pill-light mt-8"
            >
              {buttonLabel}
              <Icon name="arrow" className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
