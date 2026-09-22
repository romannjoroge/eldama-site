import { useEffect, useRef } from "react";
import { useLocation } from "react-router";

function getSessionId() {
  const key = "eldama_session_id";
  const existing = window.localStorage.getItem(key);
  if (existing) return existing;
  const value = crypto.randomUUID();
  window.localStorage.setItem(key, value);
  return value;
}

function sendEvent(payload: Record<string, unknown>) {
  const body = JSON.stringify(payload);
  if (navigator.sendBeacon) {
    navigator.sendBeacon("/api/track", new Blob([body], { type: "application/json" }));
    return;
  }

  void fetch("/api/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  });
}

export function AnalyticsTracker() {
  const location = useLocation();
  const maxDepth = useRef(0);

  useEffect(() => {
    const sessionId = getSessionId();
    maxDepth.current = 0;

    sendEvent({
      type: "visit",
      sessionId,
      path: location.pathname,
      title: document.title,
      depth: 0,
    });

    const onScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const depth = scrollable <= 0 ? 100 : Math.round((window.scrollY / scrollable) * 100);
      const milestone = Math.min(100, Math.floor(depth / 10) * 10);
      if (milestone >= maxDepth.current + 10 || milestone === 100) {
        maxDepth.current = milestone;
        sendEvent({
          type: "scroll",
          sessionId,
          path: location.pathname,
          depth: milestone,
        });
      }
    };

    const onClick = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target : null;
      const clickable = target?.closest("a,button");
      if (!clickable) return;

      const label = (clickable.textContent || "").replace(/\s+/g, " ").trim();
      const href = clickable instanceof HTMLAnchorElement ? clickable.href : "";
      const isQuote =
        /quote/i.test(label) ||
        href.includes("/quote") ||
        clickable.getAttribute("data-track") === "quote";

      sendEvent({
        type: isQuote ? "quote_click" : "page_click",
        sessionId,
        path: location.pathname,
        target: label || href || clickable.tagName.toLowerCase(),
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("click", onClick);
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("click", onClick);
    };
  }, [location.pathname]);

  return null;
}
