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
    <section className="bg-tile-3 py-16 text-center text-white sm:py-24">
      <div className="container-site">
        <div className="mx-auto max-w-2xl">
          <h2 className="display-lg text-white">{heading}</h2>
          <p className="mt-4 text-[19px] leading-[1.47] tracking-[-0.374px] text-body-muted">
            {body}
          </p>
          <button
            type="button"
            onClick={() => openQuote(serviceSlugs)}
            className="btn-primary mt-8"
          >
            {buttonLabel}
          </button>
        </div>
      </div>
    </section>
  );
}
