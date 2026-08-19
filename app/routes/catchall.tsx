import { Link } from "react-router";
import type { Route } from "./+types/catchall";

export function loader() {
  throw new Response("Page not found", { status: 404 });
}

export function meta({}: Route.MetaArgs) {
  return [{ title: "Page not found — Eldama" }];
}

export default function Catchall() {
  return (
    <section className="bg-parchment py-24 sm:py-32">
      <div className="container-site max-w-xl text-center">
        <p className="eyebrow">404</p>
        <h1 className="display-lg mt-3 text-ink">
          This page went offline
        </h1>
        <p className="lead mt-4 text-ink-muted-80">
          The page you're looking for doesn't exist. Try one of our service
          pages, or get a quote directly.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link to="/" className="btn-utility">
            Back to home
          </Link>
          <Link to="/quote" className="btn-primary">
            Get a Quote
          </Link>
        </div>
      </div>
    </section>
  );
}
