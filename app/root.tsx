import { MotionConfig } from "motion/react";
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import { Footer } from "./components/footer";
import { Header } from "./components/header";
import { Icon } from "./components/icons";
import { IntroProvider } from "./components/intro";
import { QuoteProvider, useQuote } from "./components/quote-modal";
import { ScrollProgress } from "./components/scroll-progress";
import { SmoothScroll } from "./components/smooth-scroll";
import "./app.css";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;600;700&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <QuoteProvider>
        <SmoothScroll>
          <IntroProvider>
            <div className="flex min-h-screen flex-col">
              <ScrollProgress />
              <Header />
              <main className="flex-1">
                <Outlet />
              </main>
              <Footer />
              <MobileQuoteBar />
            </div>
            <div className="grain" aria-hidden="true" />
          </IntroProvider>
        </SmoothScroll>
      </QuoteProvider>
    </MotionConfig>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-cloud px-4 py-20">
      <div className="w-full max-w-md rounded-[16px] border border-hairline bg-white p-8 text-center shadow-[0_2px_8px_rgba(26,26,26,0.08)]">
        <h1 className="text-4xl font-medium leading-[1.05] text-ink">{message}</h1>
        <p className="mt-3 text-charcoal">{details}</p>
        {stack && (
          <pre className="mt-4 overflow-x-auto rounded-[8px] bg-cloud p-4 text-left text-xs text-charcoal">
            <code>{stack}</code>
          </pre>
        )}
      </div>
    </main>
  );
}

function MobileQuoteBar() {
  const { openQuote } = useQuote();
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-hairline bg-white/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur md:hidden">
      <button
        type="button"
        onClick={() => openQuote()}
        className="btn-primary w-full"
      >
        Get a Quote
        <Icon name="arrow" className="h-4 w-4" />
      </button>
    </div>
  );
}
