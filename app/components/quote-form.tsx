import { useEffect, useRef, useState } from "react";
import { useFetcher } from "react-router";

import { Icon } from "~/components/icons";
import { formatResponseTime, services, type ServiceSlug } from "~/data/site";

export type QuoteFormResult = {
  ok: boolean;
  error?: string;
  submittedAt?: string;
};

export function QuoteForm({
  preselectedSlugs = [],
  fetcherKey = "quote",
  idPrefix = "quote",
  heading = "Get a tailored quote",
  subheading = "Tell us what you need — we'll respond within " +
    formatResponseTime() +
    ".",
}: {
  preselectedSlugs?: ServiceSlug[];
  fetcherKey?: string;
  idPrefix?: string;
  heading?: string;
  subheading?: string;
}) {
  const fetcher = useFetcher<QuoteFormResult>({ key: fetcherKey });
  const [serviceError, setServiceError] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const submittedData = fetcher.data?.ok ? fetcher.data : undefined;
  const pending = fetcher.state !== "idle";

  // Reset the transient validation error once the user picks a service.
  useEffect(() => {
    if (!serviceError) return;
    const form = formRef.current;
    if (!form) return;
    const onChange = () => {
      const checked = form.querySelectorAll<HTMLInputElement>(
        'input[name="services"]:checked',
      );
      if (checked.length > 0) setServiceError(false);
    };
    form.addEventListener("change", onChange);
    return () => form.removeEventListener("change", onChange);
  }, [serviceError]);

  if (submittedData) {
    return (
      <div className="py-4 text-center" role="status">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <Icon name="check" className="h-7 w-7" />
        </span>
        <h3 className="mt-4 text-2xl font-bold tracking-tight text-navy-900">
          Thanks — request received
        </h3>
        <p className="mx-auto mt-2 max-w-md text-navy-600">
          Our team will respond within {formatResponseTime()}. A specialist will
          confirm scope, recommend the right services, and prepare your tailored
          quote.
        </p>
        <p className="mt-4 text-sm text-navy-500">
          Reference:{" "}
          <span className="font-semibold text-navy-700">
            {submittedData.submittedAt}
          </span>
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight text-navy-900">
          {heading}
        </h2>
        <p className="mt-1.5 text-sm text-navy-600">{subheading}</p>
      </div>

      <fetcher.Form
        ref={formRef}
        method="post"
        action="/quote"
        className="space-y-4"
        noValidate
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full name" htmlFor={`${idPrefix}-name`} required>
            <input
              id={`${idPrefix}-name`}
              name="name"
              type="text"
              autoComplete="name"
              required
              className="input"
              placeholder="Jane Wanjiku"
            />
          </Field>
          <Field label="Company name" htmlFor={`${idPrefix}-company`}>
            <input
              id={`${idPrefix}-company`}
              name="company"
              type="text"
              autoComplete="organization"
              className="input"
              placeholder="Acme Ltd"
            />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Work email" htmlFor={`${idPrefix}-email`} required>
            <input
              id={`${idPrefix}-email`}
              name="email"
              type="email"
              autoComplete="email"
              required
              className="input"
              placeholder="you@company.com"
            />
          </Field>
          <Field label="Phone" htmlFor={`${idPrefix}-phone`}>
            <input
              id={`${idPrefix}-phone`}
              name="phone"
              type="tel"
              autoComplete="tel"
              className="input"
              placeholder="+254 7XX XXX XXX"
            />
          </Field>
        </div>

        <fieldset>
          <legend className="text-sm font-semibold text-navy-900">
            Services you're interested in
            <span className="ml-1 text-accent-600">*</span>
          </legend>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {services.map((service) => {
              const checked = preselectedSlugs.includes(service.slug);
              return (
                <label
                  key={service.slug}
                  className="flex cursor-pointer items-start gap-2.5 rounded-lg border border-navy-100 bg-navy-50/50 px-3 py-2.5 transition-colors hover:border-navy-200 has-[:checked]:border-accent-400 has-[:checked]:bg-accent-50"
                >
                  <input
                    type="checkbox"
                    name="services"
                    value={service.slug}
                    defaultChecked={checked}
                    className="mt-0.5 h-4 w-4 rounded border-navy-300 accent-accent-500"
                  />
                  <span className="text-sm font-medium text-navy-800">
                    {service.name}
                  </span>
                </label>
              );
            })}
          </div>
          {serviceError && (
            <p className="mt-2 text-sm font-medium text-red-600" role="alert">
              Please select at least one service.
            </p>
          )}
        </fieldset>

        <Field
          label="Brief description of what you need"
          htmlFor={`${idPrefix}-need`}
        >
          <textarea
            id={`${idPrefix}-need`}
            name="need"
            rows={3}
            className="input resize-y"
            placeholder="e.g. We have 40 staff, need Microsoft 365 migration and better email security…"
          />
        </Field>

        {fetcher.data?.error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700" role="alert">
            {fetcher.data.error}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          onClick={(event) => {
            const form = event.currentTarget.form;
            if (!form) return;
            const checked = form.querySelectorAll<HTMLInputElement>(
              'input[name="services"]:checked',
            );
            if (checked.length === 0) {
              event.preventDefault();
              setServiceError(true);
            }
          }}
          className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-70"
        >
          {pending ? "Sending…" : "Request my quote"}
          {!pending && <Icon name="arrow" className="h-4 w-4" />}
        </button>

        <p className="text-center text-xs text-navy-500">
          No obligation — we only use your details to prepare your quote.
        </p>
      </fetcher.Form>
    </div>
  );
}

function Field({
  label,
  htmlFor,
  required,
  children,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="text-sm font-semibold text-navy-900">
        {label}
        {required && <span className="ml-0.5 text-accent-600">*</span>}
      </label>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}
