# Eldama Website

Marketing and lead-generation site for **Eldama Technologies** — an all-in-one outsourced IT department for growing businesses. The site's primary goal is to convert procurement-minded visitors into **quote requests**, while cross-selling adjacent service categories.

Built with [React Router](https://reactrouter.com/) (v8) in framework mode with server-side rendering, React 19, Tailwind CSS v4, and Motion.

## Tech Stack

| Layer      | Choice                                              |
| ---------- | --------------------------------------------------- |
| Framework  | React Router v8 (SSR)                               |
| UI         | React 19                                            |
| Styling    | Tailwind CSS v4 (`@theme` tokens in `app/app.css`)  |
| Animation  | Motion, Lenis (smooth scroll)                       |
| Language   | TypeScript                                          |
| Build      | Vite 8                                              |
| Runtime    | Node 24 (`react-router-serve`)                      |

## Getting Started

```bash
npm install
npm run dev
```

The dev server runs at `http://localhost:5173` with HMR.

## Scripts

| Command            | Description                                      |
| ------------------ | ------------------------------------------------ |
| `npm run dev`      | Start the dev server with HMR                    |
| `npm run build`    | Production build into `build/`                   |
| `npm run start`    | Serve the production build                      |
| `npm run typecheck`| Generate route types and run `tsc`               |

## Project Structure

```
app/
  app.css                 Tailwind import + @theme design tokens
  root.tsx                Layout, header/footer, quote modal & providers
  routes.ts               Route manifest
  routes/
    home.tsx              Home page (hero, services grid, cross-sell, CTA)
    quote.tsx             Dedicated /quote page
    services/$slug.tsx    Dynamic service category pages
    catchall.tsx          404 handling
  data/site.ts            All site content & config (services, clients, stats, company)
  components/             Reusable sections and UI (header, footer, quote form, etc.)
  assets/                 Logo and partner badge images
public/
  fonts/                  Self-hosted Manrope & Space Grotesk
```

### Routes

- `/` — Home
- `/services/:slug` — One page per service category (`it-outsourcing`, `cloud-services`, `cybersecurity`, `software-development`, `microsoft-365`)
- `/quote` — Quote request form
- `*` — 404

Legacy slugs `endpoint-security` and `email-security` redirect to `cybersecurity` (see `legacyServiceSlugs` in `app/data/site.ts`).

## Editing Content

Almost all copy, services, tools, client proof, partner badges, stats, and contact details live in **`app/data/site.ts`**. Update that file rather than editing components for content changes.

## Theming

Brand colors, fonts, and surface tokens are defined once in the `@theme` block of `app/app.css`. Components reference them through token-based utility classes (e.g. `bg-primary`, `text-ink`), so swapping the palette or fonts is a matter of editing that block. Placeholder assets live in `app/assets/` and `public/`.

## Deployment

### Docker

```bash
docker build -t eldama-site .
docker run -p 3000:3000 eldama-site
```

The image builds the app and serves it with `react-router-serve`. It can be deployed to any Docker host (AWS ECS, Google Cloud Run, Azure Container Apps, Fly.io, Railway, etc.).

### Manual

```bash
npm run build
npm run start
```

Deploy the output of `npm run build`:

```
├── package.json
├── package-lock.json
└── build/
    ├── client/    # Static assets
    └── server/    # Server-side code
```

## Conventions

See [`AGENTS.md`](./AGENTS.md) for project goals, page structure, and content/tone guidelines, and [`DESIGN-hp.md`](./DESIGN-hp.md) for the visual design system.
