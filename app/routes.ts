import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("admin", "routes/admin.tsx"),
  route("api/track", "routes/api.track.tsx"),
  route("api/sessions", "routes/api/sessions.tsx"),
  route("services/:slug", "routes/services/$slug.tsx"),
  route("quote", "routes/quote.tsx"),
  route("*", "routes/catchall.tsx"),
] satisfies RouteConfig;
