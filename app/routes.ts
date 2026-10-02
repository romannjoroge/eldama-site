import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("admin", "routes/admin.tsx"),
  route("api/track", "routes/api.track.tsx"),
  route("api/sessions", "routes/api/sessions.tsx"),
  route("api/sessions/:sessionId/messages", "routes/api/session-messages.tsx"),
  route("api/sessions/:sessionId/close", "routes/api/session-close.tsx"),
  route("services/:slug", "routes/services/$slug.tsx"),
  route("quote", "routes/quote.tsx"),
  route("*", "routes/catchall.tsx"),
] satisfies RouteConfig;
