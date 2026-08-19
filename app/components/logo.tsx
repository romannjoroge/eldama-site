import { Link } from "react-router";

import { company } from "~/data/site";

/**
 * Placeholder wordmark. The real logo asset lives in `app/assets` and the
 * light variant is produced with a monochrome filter so the mark stays
 * legible on dark slabs. Swap the asset / remove the filter when the final
 * brand kit arrives.
 */

import eldamaLogo from "../assets/eldama-logo.png";

export function Logo({
  variant = "dark",
  className = "",
}: {
  variant?: "dark" | "light";
  className?: string;
}) {
  return (
    <Link
      to="/"
      aria-label={`${company.name} — home`}
      className={`inline-flex items-center ${className}`}
    >
      <img
        src={eldamaLogo}
        alt={`${company.name} logo`}
        className={`h-10 w-auto ${
          variant === "light" ? "brightness-0 invert" : ""
        }`}
      />
    </Link>
  );
}
