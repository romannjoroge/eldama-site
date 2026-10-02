# Support Chat Widget — MVP Spec

## 1. Overview

Build a minimal live-chat support widget for a marketing/support website. Visitors can open a
floating chat bubble, send messages, and get replies from a human support agent. Agents work
from a separate internal console to view and respond to conversations.

This is an MVP: favor the simplest implementation that works correctly over
configurability, scalability, or polish. Cut anything not explicitly listed under
"In scope."

## 2. Tech stack

- **Runtime:** Bun
- **Database:** SQLite (use `bun:sqlite`, Bun's built-in driver — no separate DB server needed;
  no ORM unless it meaningfully speeds up development; if using one, Drizzle is preferred over
  Prisma for Bun/SQLite compatibility)
- **Web framework:** React Router (v7, "framework mode" / full-stack, i.e. what used to be
  Remix) for both the public site page hosting the widget and the internal agent console
- **Real-time transport:** WebSockets (Bun has native `Bun.serve({ websocket: ... })` support —
  use that directly, no Socket.io needed)
- **Styling:** plain CSS or Tailwind, whichever is faster to work with — no design system needed
- **Auth (agent console only):** simple email+password session auth. No OAuth, no SSO, no
  multi-tenant orgs.

## 3. In scope (MVP)

1. **Floating chat widget** embedded on the public site (bottom-right corner bubble that
   expands into a chat panel).
2. **Pre-chat form**: before the first message, ask for name and email. Store this on the
   session. Not required if a returning session token already has this info.
3. **Visitor session identity**: server-issued UUID session token, stored in the visitor's
   `localStorage`. Reconnecting with the same token re-loads the full message history for that
   session.
4. **Real-time two-way messaging** over WebSockets between the visitor widget and the agent
   console. Messages persist to SQLite; the WebSocket is for live delivery, not the source of
   truth.
5. **Agent console** (`/admin` routes, behind login):
   - List of conversations (open / closed), newest activity first
   - Conversation view: full message history + a reply box
   - Sending a reply pushes it live to the visitor over WebSocket if they're connected, and
     persists it either way
   - Mark a conversation as "closed"
6. **Basic visitor context panel** in the agent console showing: name, email (from pre-chat
   form), first-seen timestamp, current page URL the widget was loaded from, user agent.
7. **Offline fallback**: if no agent is connected (see "online" definition below), the widget
   shows a message like "We're not online right now — leave a message and we'll get back to you
   by email," and the visitor can still submit a message.
8. **Email notification to a fixed support address** when a new conversation's first message
   arrives (use a transactional email API — Resend or similar; stub/log it if no API key is
   configured, don't block on getting real email working first).
9. **Basic spam guard**: rate-limit message sends per session (e.g. max 1 message per 2 seconds,
   reject with a friendly error beyond that) and a honeypot field on the pre-chat form.
10. **Message content sanitization**: messages are stored and rendered as plain text only (no
    HTML rendering of message bodies) to avoid stored XSS. This alone is sufficient for MVP —
    no rich text needed.

## 4. Explicitly out of scope (do not build)

- File/image attachments
- Typing indicators, read receipts
- Multiple agents / assignment / transfer / internal notes
- Canned responses / macros
- CSAT / post-chat ratings
- Business-hours scheduling
- Embeddable widget for *other* companies' sites (iframe isolation, postMessage bridging) — this
  widget only needs to run on our own site
- Analytics/reporting dashboards
- Multi-language support
- Push notifications / sound alerts in the agent console (a simple unread-count badge in the
  conversation list is enough)
- GDPR tooling (data export/erasure endpoints) — just design the schema so this is possible
  later, don't build the UI now

## 5. Data model

Four tables. Keep it this small — don't add fields "just in case."

SQLite has no native `uuid` or `timestamptz` types — use `text` for UUIDs (generate with
`crypto.randomUUID()` in application code) and `text` for timestamps (store as ISO 8601 strings,
e.g. `new Date().toISOString()`). This keeps values human-readable and sortable as strings.

```sql
sessions
  id              text primary key   -- uuid
  visitor_name    text
  visitor_email   text
  page_url        text          -- URL the widget was opened from
  user_agent      text
  status          text          -- 'open' | 'closed'
  created_at      text          -- ISO 8601
  last_message_at text          -- ISO 8601

messages
  id              text primary key   -- uuid
  session_id      text references sessions(id)
  sender_type     text          -- 'visitor' | 'agent'
  agent_id        text null references agents(id)  -- null if sender_type = 'visitor'
  body            text
  created_at      text          -- ISO 8601
  read_at         text null     -- ISO 8601, null = unread by the other party

agents
  id              text primary key   -- uuid
  email           text unique
  password_hash   text
  name            text
  created_at      text          -- ISO 8601

agent_sessions   -- login sessions for the console, not chat sessions
  id              text primary key   -- uuid
  agent_id        text references agents(id)
  expires_at      text          -- ISO 8601
```

## 6. API / route surface

Keep REST endpoints minimal and colocate with React Router route modules where sensible
(loaders/actions) rather than building a separate API layer, except for the WebSocket endpoint
which needs to be a raw Bun handler.

**Public (visitor-facing):**
- `POST /api/sessions` — create a new chat session, returns `{ sessionId }`
- `GET /api/sessions/:id/messages` — fetch message history for reconnect
- `POST /api/sessions/:id/messages` — send a message (used as WebSocket fallback if the socket
  isn't connected, and for the pre-chat first message)
- `WS /ws/chat/:sessionId` — visitor's live connection

**Agent console (auth required):**
- `POST /login`, `POST /logout`
- `GET /admin` — conversation list (open/closed tabs)
- `GET /admin/conversations/:id` — conversation detail + visitor context panel
- `POST /admin/conversations/:id/messages` — agent sends a reply
- `POST /admin/conversations/:id/close`
- `WS /ws/agent` — agent console's live connection (receives new-message events across all
  conversations, used to update the list in real time and push replies to the open thread)

## 7. "Online" agent detection

Simplest possible approach for MVP: an agent is considered "online" if there is at least one
live `/ws/agent` WebSocket connection to the server. No presence table, no manual toggle needed
for v1. If this turns out to be unreliable in testing, fall back to a manual "I'm online" toggle
in the console instead — flag this as a decision point for the agent to raise if it hits issues.

## 8. Widget embedding

The widget is a single React Router route/component mounted on the public site (not a separate
embeddable script for this MVP, since it's only used on our own site — see "out of scope"). It
should be a fixed-position component that can be dropped into the site's root layout.

## 9. Non-functional requirements

- Local dev should run with a single `bun run dev` — no external services to start. SQLite is a
  file on disk (e.g. `./data/db.sqlite`), so there's no `docker-compose.yml` or DB server needed.
  Add the data file/directory to `.gitignore`.
- Include a basic migrations setup (plain SQL migration files run via a small script is fine —
  no need for a heavyweight migration framework). Enable `PRAGMA foreign_keys = ON` and use
  WAL mode (`PRAGMA journal_mode = WAL`) for better concurrent read/write behavior under the
  WebSocket + HTTP traffic mix.
- Seed script to create one test agent account for local login.
- No test suite required for MVP, but keep functions small enough to be testable later.

## 10. Acceptance criteria (what "done" looks like)

- [ ] A visitor can open the widget, fill the pre-chat form, and send a message
- [ ] That message appears in real time in the agent console if an agent is logged in and
      viewing the conversation list
- [ ] An agent can open the conversation and reply, and the reply appears in the visitor's
      widget in real time without a page refresh
- [ ] Closing and reopening the browser tab (same browser, storage intact) reconnects to the
      same session and shows prior history
- [ ] Clearing localStorage and reopening starts a fresh session
- [ ] If no agent is online, the visitor sees the offline message and can still leave a message
- [ ] A notification email is sent (or logged, if email isn't configured) on a new
      conversation's first message
- [ ] An agent can log in, log out, and only sees `/admin` routes when authenticated
- [ ] Sending messages faster than the rate limit is rejected gracefully

## 11. Open questions for whoever's building this

Flag these back rather than guessing silently:
- Should closed conversations be reopenable by the visitor sending a new message, or does that
  always start a new session?
- What's the actual "from" email address / support inbox for notifications?
- Any existing design system/branding to match, or is default styling fine for MVP?