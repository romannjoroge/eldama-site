import type { Route } from "./+types/quote";

import { Icon } from "~/components/icons";
import {
  QuoteForm,
  type QuoteFormResult,
} from "~/components/quote-form";
import { formatResponseTime, getService, partnerBadges } from "~/data/site";

export function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const selected = url.searchParams
    .getAll("service")
    .filter((slug) => getService(slug))
    .map((slug) => getService(slug)!.slug);
  return { preselectedSlugs: selected };
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const selected = formData.getAll("services").map((value) => String(value));

  if (!name || !email || selected.length === 0) {
    return {
      ok: false,
      error: "Please complete your name, email, and at least one service.",
    } satisfies QuoteFormResult;
  }

  // TODO: connect real lead capture here (CRM or email service webhook).
  // The submitted payload is available in `formData` (name, company, email,
  // phone, services, need).
  const reference = `ELD-${Date.now().toString(36).toUpperCase()}`;
  return { ok: true, submittedAt: reference } satisfies QuoteFormResult;
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Get a Quote — Eldama" },
    {
      name: "description",
      content:
        "Request a tailored IT quote from Eldama. Tell us what you need and our certified specialists will respond within 24 business hours.",
    },
  ];
}

export default function QuotePage({ loaderData }: Route.ComponentProps) {
  const { preselectedSlugs } = loaderData;

  return (
    <section className="bg-surface-soft py-16 sm:py-20">
      <div className="container-site grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div className="lg:sticky lg:top-24">
          <p className="eyebrow">Get a Quote</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            A tailored quote, fast
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-body">
            Skip the procurement maze. Tell us what you need and a certified
            specialist will come back within {formatResponseTime()} with scope,
            recommendations, and pricing.
          </p>

          <ul className="mt-8 space-y-4">
            <Step
              icon="clock"
              title={`Response within ${formatResponseTime()}`}
              body="A real specialist reviews your request — not an autoresponder."
            />
            <Step
              icon="layers"
              title="Right-sized recommendations"
              body="We'll flag adjacent services that protect your investment."
            />
            <Step
              icon="lock"
              title="No obligation"
              body="Your details are only used to prepare your quote."
            />
          </ul>

          <div className="mt-10 rounded-card border border-hairline bg-white p-5">
            <p className="text-xs font-bold uppercase tracking-[0.08em] text-muted">
              Certified partner of
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {partnerBadges.slice(0, 6).map((badge) => (
                <span key={badge} className="badge-pill">
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-card border border-hairline bg-white p-6 shadow-lift sm:p-8">
          <QuoteForm
            preselectedSlugs={preselectedSlugs}
            fetcherKey="quote-page"
            idPrefix="page"
            heading="Tell us what you need"
            subheading={`Already interested in: ${
              preselectedSlugs.length > 0
                ? preselectedSlugs
                    .map((slug) => getService(slug)?.name)
                    .join(", ")
                : "all services"
            }`}
          />
        </div>
      </div>
    </section>
  );
}

function Step({
  icon,
  title,
  body,
}: {
  icon: "clock" | "layers" | "lock";
  title: string;
  body: string;
}) {
  return (
    <li className="flex items-start gap-4">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-card border border-hairline bg-white text-ink">
        <Icon name={icon} className="h-5 w-5" />
      </span>
      <div>
        <p className="font-semibold text-ink">{title}</p>
        <p className="mt-1 text-sm leading-relaxed text-body">{body}</p>
      </div>
    </li>
  );
}
