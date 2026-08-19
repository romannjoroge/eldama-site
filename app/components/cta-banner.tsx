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
    <section className="bg-canvas py-16 sm:py-20">
      <div className="container-site">
        <div className="rounded-md border border-hairline bg-surface-soft px-6 py-12 text-center sm:px-12 sm:py-16">
          <h2 className="h-section mx-auto max-w-2xl">{heading}</h2>
          <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-body">
            {body}
          </p>
          <button
            type="button"
            onClick={() => openQuote(serviceSlugs)}
            className="btn-primary mt-8"
          >
            {buttonLabel}
            <Icon name="arrow" className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
