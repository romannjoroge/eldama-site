# Eldama Website

Corporate B2B marketing and lead-generation site for **Eldama Technologies Ltd**, an outsourced IT department for growing businesses across Kenya, East Africa, and West Africa.

The site is built to help procurement and decision-making visitors confirm services quickly, trust Eldama's technical competence, and request a tailored quote.

## Goals

- **Primary:** maximize quote requests.
- **Secondary:** cross-sell adjacent services during the discovery and quote journey.
- **Tertiary:** establish credibility through partner badges, client proof, service breadth, and clear technical competency.

## Positioning

Eldama is presented as one accountable technology partner instead of an in-house IT team or several separate vendors. The tone should stay clear, confident, procurement-friendly, and enterprise-ready.

The current service taxonomy in the app is:

- IT Outsourcing
- Cloud Services
- Cybersecurity
- Software Development & DevOps
- Microsoft 365

Legacy routes for `endpoint-security` and `email-security` redirect to the broader `cybersecurity` service page.

## Tech Stack

| Layer | Choice |
| --- | --- |
| Framework | React Router v8 in framework mode with SSR |
| UI | React 19 |
| Styling | Tailwind CSS v4 with `@theme` tokens in `app/app.css` |
| Animation | Motion, Lenis |
| Language | TypeScript |
| Build | Vite 8 |
| Runtime | Node 24 with `react-router-serve` |

## Getting Started

```bash
npm install
npm run dev
```

The dev server runs at `http://localhost:5173` with hot module replacement.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the local development server |
| `npm run build` | Create a production build in `build/` |
| `npm run realtime` | Start the Bun WebSocket server for live chat |
| `npm run start` | Serve the production build |
| `npm run typecheck` | Generate React Router route types and run `tsc` |

## Project Structure

```text
app/
  app.css                 Tailwind import and design tokens
  root.tsx                App shell, layout, header, footer, quote modal
  routes.ts               Route manifest
  routes/
    admin.tsx             Admin login, metrics dashboard, chat console
    api.track.tsx         Analytics ingestion endpoint
    home.tsx              Home page
    quote.tsx             Dedicated quote request page
    services/$slug.tsx    Dynamic service detail pages
    catchall.tsx          404 handling
  data/site.ts            Main content and configuration source
  components/             Reusable sections and UI components
  assets/                 Logo and partner badge assets
public/
  fonts/                  Self-hosted fonts
build/
  client/                 Static production assets
  server/                 Server-side production bundle
realtime/
  server.js               Bun WebSocket server for live chat
```

## Routes

- `/` - Home page
- `/admin` - Admin login and dashboard
- `/api/track` - Analytics event ingestion endpoint
- `/services/:slug` - Service detail pages
- `/quote` - Quote request form
- `*` - 404 route

Current service slugs:

- `it-outsourcing`
- `cloud-services`
- `cybersecurity`
- `software-development`
- `microsoft-365`

Legacy service slugs:

- `endpoint-security` -> `cybersecurity`
- `email-security` -> `cybersecurity`

The redirect mapping lives in `legacyServiceSlugs` inside `app/data/site.ts`.

## Content Model

Most site copy and editable business data lives in `app/data/site.ts`:

- Company details
- Service names, descriptions, tools, badges, and cross-sell links
- Partner badges
- Client proof
- Stats
- Navigation links
- Quote response time

Prefer updating `app/data/site.ts` for content changes instead of hardcoding copy inside components.

## Page Strategy

### Home

The home page is the main conversion surface. It should quickly communicate that Eldama can act as a full outsourced IT department, then make quote requests obvious and low-friction.

Key sections:

- Hero with primary "Get a Quote" CTA and secondary services CTA
- Trust bar with partner and client proof
- Scannable services grid
- Complete IT coverage / cross-sell section
- Why Eldama value props
- Client proof teaser
- Repeat quote CTA
- Footer

### Service Pages

Each service page is designed for deeper evaluation, SEO, and ad/search landing traffic.

Each page should include:

- Service name, description, and partner badges near the top
- Supported tools/products with short explanations
- Prominent "Get a Quote" CTA
- Cross-sell block for adjacent services
- Relevant client proof
- Closing quote CTA

### Quote Flow

The quote flow is intentionally short. It appears as a dedicated `/quote` page and as a modal triggered by sitewide CTAs.

Fields:

- Name
- Company name
- Email
- Phone
- Services interested in
- Brief description of need

Quote CTAs can preselect one or more services before opening the form.

## Admin Panel

Sign in at `/admin`. Reports are at `/admin/reports`, live chat at `/admin/chat`, and all signed-in
agents can update their own name, email, and password at `/admin/profile`. Only the admin account
can open `/admin/users` to create, edit, or remove agents.

Configure the initial admin credentials in the backend `.env` read by Bun:

```bash
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=use-a-long-random-password
ADMIN_NAME=Eldama Administrator
ADMIN_SESSION_SECRET=change-me-before-production
VITE_CHAT_WS_URL=ws://127.0.0.1:8787
```

The admin is provisioned in SQLite by the Bun service. These values are never exposed to the
browser. Once provisioned, profile changes persist in the database; password changes revoke the
agent's other sessions. Agent bearer sessions expire after 24 hours.

The dashboard includes:

- Visits, sessions, quote clicks, submitted responses, live chat rooms, and average scroll depth
- Per-session scroll-depth bars with quote-click and response markers
- GA4-style path exploration showing page-to-page movement and conversion steps
- Page access and click monitoring
- Quote response cards
- Live chat operator console

Analytics and quote/chat data are stored locally in `.eldama-admin/store.json`. That directory is ignored by Git.

## Live Chat

Visitor chat appears sitewide as a floating widget. Admin replies are managed from `/admin/chat`.

Run the React Router app and Bun chat service in separate terminals during development:

```bash
npm run dev
```

```bash
npm run realtime
```

Before starting Bun, initialize the database and optionally seed a regular agent:

```bash
npm run db:migrate
npm run db:seed -- agent@eldama.co.ke password123
```

The Bun service owns `data/chat.sqlite` and serves both WebSockets and the private HTTP API used by
the React Router app. It binds to `127.0.0.1:8787` by default; visitors connect at
`/ws/chat/:sessionId` and the admin console at `/ws/agent`. Set `REALTIME_PORT` or
`VITE_CHAT_WS_URL` if the port or public WebSocket host changes. The app uses
`CHAT_SERVICE_URL` and `CHAT_SERVICE_TOKEN` for visitor-side and login-bootstrap server requests;
use the same long, random token in both processes. After login, admin API and WebSocket requests
use a per-agent bearer token tied to the agent session; it expires after 24 hours and is rejected
if the agent is soft-deleted. For a separately hosted service, set `REALTIME_HOST=0.0.0.0`,
configure `CHAT_SERVICE_URL` to its private address, and provide an explicit token. The service
refuses non-local or production startup without that token. Set `CHAT_DB_PATH` on the Bun service
and migration command to use a different SQLite file.

Email notifications for new conversations use [Resend](https://resend.com). Configure
`RESEND_API_KEY` and `SUPPORT_EMAIL` in `.env`; when unset, notifications are logged to stdout.

## Design Direction

The visual direction is corporate, trustworthy, and professional. This is an IT services vendor site for procurement teams, not a consumer startup page.

Core design rules:

- Use navy/blue as the primary signal color, with high-contrast quote CTAs.
- Keep layouts scannable and direct.
- Prefer neutral backgrounds, strong headings, and readable body text.
- Keep partner badges and client proof visible.
- Avoid playful illustrations, casual copy, and consumer-app styling.
- Keep cards restrained and businesslike.

The detailed visual system lives in `DESIGN-hp.md`. Theme colors, fonts, and surface tokens are centralized in the `@theme` block of `app/app.css`.

## Assets And Branding

Real brand assets can be swapped in later without changing component structure.

Useful places to update:

- Logo and partner assets: `app/assets/`
- Public files and fonts: `public/`
- Theme tokens: `app/app.css`
- Company and content data: `app/data/site.ts`

## Development Notes

- Keep quote CTAs prominent on desktop and mobile.
- Keep the services grid fast to scan.
- Preserve accessibility for forms, nav, buttons, and modals.
- Keep copy benefit-focused and light on jargon.
- Define acronyms when they appear in user-facing copy.
- Do not duplicate business content in components if it belongs in `app/data/site.ts`.

## Deployment

### Docker

```bash
docker build -t eldama-site .
docker run -p 3000:3000 eldama-site
```

The image builds the app and serves it with `react-router-serve`.

### Manual

```bash
npm run build
npm run start
```

Deploy the production build with:

```text
package.json
package-lock.json
build/
  client/
  server/
```

## Related Docs

- `DESIGN-hp.md` - detailed design-system direction and visual notes
