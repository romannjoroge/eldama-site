import { Link } from "react-router";
import type { Route } from "./+types/catchall";

import { Icon } from "~/components/icons";

export function loader() {
  throw new Response("Page not found", { status: 404 });
}

export function meta({}: Route.MetaArgs) {
  return [{ title: "Page not found — Eldama" }];
}

export default function Catchall() {
  return (
    <section className="bg-surface-soft py-24 sm:py-32">
      <div className="container-site max-w-xl">
        <div className="rounded-card border border-hairline bg-white p-8 text-center shadow-lift sm:p-12">
          <p className="eyebrow">404</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-ink">
            This page went offline
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-body">
            The page you're looking for doesn't exist. Try one of our service
            pages, or get a quote directly.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link to="/" className="btn-secondary">
              Back to home
            </Link>
            <Link to="/quote" className="btn-primary">
              Get a Quote
              <Icon name="arrow" className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
