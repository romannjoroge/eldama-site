import { Link } from "react-router";

import { company } from "~/data/site";

import eldamaLogo from "../assets/eldama-logo.png";

/**
 * Placeholder wordmark. Swap `mark` for the real logo asset when provided.
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
      aria-label={`${company.name} - home`}
      className={`inline-flex items-center gap-2.5 ${className}`}
    >
      <img src={eldamaLogo} alt="Eldama Logo" className="h-12 w-auto md:h-14" />
    </Link>
  );
}
