import { Link } from "react-router";
import type { Route } from "./+types/catchall";

import { Icon } from "~/components/icons";
import { Reveal } from "~/components/motion";

export function loader() {
  throw new Response("Page not found", { status: 404 });
}

export function meta({}: Route.MetaArgs) {
  return [{ title: "Page not found — Eldama" }];
}

export default function Catchall() {
  return (
    <section className="bg-cloud py-24 sm:py-32">
      <div className="container-site max-w-xl text-center">
        <Reveal className="mx-auto">
          <p className="eyebrow">404</p>
          <h1 className="h-section mt-3">
            This page went offline
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-charcoal">
            The page you're looking for doesn't exist. Try one of our service
            pages, or get a quote directly.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link to="/" className="btn-ink">
              Back to home
            </Link>
            <Link to="/quote" className="btn-primary">
              Get a Quote
              <Icon name="arrow" className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
