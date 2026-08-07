import { Link } from "react-router";

import { company } from "~/data/site";

/**
 * Placeholder wordmark. Swap `mark` for the real logo asset when provided;
 * the text colour adapts via the `variant` prop.
 */

import eldamaLogo from "../assets/eldama-logo.png";

export function Logo({
  variant = "dark",
  className = "",
}: {
  variant?: "dark" | "light";
  className?: string;
}) {
  // const textClass = variant === "light" ? "text-white" : "text-navy-900";
  // return (
  //   <Link
  //     to="/"
  //     aria-label={`${company.name} — home`}
  //     className={`inline-flex items-center gap-2.5 ${className}`}
  //   >
  //     <span
  //       aria-hidden="true"
  //       className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy-900"
  //     >
  //       <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
  //         <path
  //           d="M12 3.2 19 6v5.1c0 4.3-2.9 7.8-7 9.7-4.1-1.9-7-5.4-7-9.7V6l7-2.8Z"
  //           fill="currentColor"
  //           className="text-accent-500"
  //         />
  //         <path
  //           d="M8.8 8h6.4M8.8 12h6.4M8.8 16h3.6"
  //           stroke="white"
  //           strokeWidth="1.8"
  //           strokeLinecap="round"
  //         />
  //       </svg>
  //     </span>
  //     <span className={`text-xl font-extrabold tracking-tight ${textClass}`}>
  //       {company.name}
  //       <span className="text-accent-500">.</span>
  //     </span>
  //   </Link>
  // );

  return (
    <Link to="/" aria-label={`${company.name} — home`} className={`inline-flex items-center gap-2.5 ${className}`}>
      <img src={eldamaLogo} alt="Eldama Logo" className="h-16 w-fill"/>
    </Link>
    
  )
}
