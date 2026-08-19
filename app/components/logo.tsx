import { Link } from "react-router";

import { company } from "~/data/site";
import eldamaLogo from "../assets/eldama-logo.png";

/**
 * Placeholder wordmark. Swap `eldama-logo.png` for the real brand asset when
 * provided. The current mark is a dark wordmark on transparency, so on dark
 * surfaces (`variant="light"`) it is presented inside a white chip.
 */
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
      {variant === "light" ? (
        <span className="inline-flex h-8 items-center rounded-full bg-white px-3">
          <img src={eldamaLogo} alt={company.name} className="h-5 w-auto" />
        </span>
      ) : (
        <img src={eldamaLogo} alt={company.name} className="h-8 w-auto" />
      )}
    </Link>
  );
}
