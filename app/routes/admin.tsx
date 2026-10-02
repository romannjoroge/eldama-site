import { useEffect, useMemo, useRef, useState } from "react";
import { Form, redirect } from "react-router";

import type { Route } from "./+types/admin";
import {
  clearAdminSessionCookie,
  createAgentSessionCookie,
  getAuthedAgent,
  isAdminRequest,
  validateAgentCredentials,
} from "~/.server/admin-auth";
import { getAdminDashboardData } from "~/.server/admin-store";
import { listChatSessions } from "~/.server/chat-service";
import type { ChatMessage, ChatSession } from "~/.server/chat-types";

export async function loader({ request }: Route.LoaderArgs) {
  const authenticated = await isAdminRequest(request);
  const agent = authenticated ? await getAuthedAgent(request) : null;
  return {
    authenticated,
    agentId: agent?.id || null,
    dashboard: authenticated ? await getAdminDashboardData() : null,
    chat: authenticated
      ? {
          open: await listChatSessions("open"),
          closed: await listChatSessions("closed"),
        }
      : { open: [], closed: [] },
  };
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const intent = String(formData.get("intent") || "login");

  if (intent === "logout") {
    return redirect("/admin", {
      headers: { "Set-Cookie": clearAdminSessionCookie() },
    });
  }

  const email = String(formData.get("email") || formData.get("username") || "");
  const password = String(formData.get("password") || "");

  const agent = await validateAgentCredentials(email.trim(), password);
  if (!agent) {
    return { ok: false, error: "Invalid admin email or password." };
  }

  return redirect("/admin", {
    headers: { "Set-Cookie": await createAgentSessionCookie(agent.id) },
  });
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Admin Dashboard - Eldama" },
    { name: "robots", content: "noindex,nofollow" },
  ];
}

export default function Admin({ loaderData, actionData }: Route.ComponentProps) {
  if (!loaderData.authenticated || !loaderData.dashboard) {
    return <LoginPanel error={actionData?.error} />;
  }

  return <Dashboard data={loaderData.dashboard} chat={loaderData.chat} agentId={loaderData.agentId} />;
}

function LoginPanel({ error }: { error?: string }) {
  return (
    <section className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_20%_0%,#ffffff_0,#e8eef8_36%,#d8deea_100%)] px-4 py-12">
      <div className="w-full max-w-md rounded-[22px] border border-white/80 bg-[#f5f7fb] p-2 shadow-[0_26px_70px_rgba(15,23,42,0.26),inset_0_1px_0_rgba(255,255,255,0.95)]">
        <div className="rounded-[17px] border border-[#c8d0dc] bg-[linear-gradient(145deg,#ffffff,#e5eaf2)] p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),inset_0_-16px_30px_rgba(15,23,42,0.06)]">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
            Eldama Admin
          </p>
          <h1 className="mt-3 text-3xl font-semibold leading-tight text-ink">
            Control room login
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-charcoal">
            Sign in to view quote responses, site engagement, scroll depth, and
            live chat activity.
          </p>

          <Form method="post" reloadDocument className="mt-7 space-y-4">
            <input type="hidden" name="intent" value="login" />
            <Field label="Email" htmlFor="admin-email">
              <input
                id="admin-email"
                name="email"
                defaultValue="agent@eldama.co.ke"
                type="email"
                autoComplete="email"
                className="input bg-white shadow-[inset_0_2px_5px_rgba(15,23,42,0.08)]"
              />
            </Field>
            <Field label="Password" htmlFor="admin-password">
              <input
                id="admin-password"
                name="password"
                type="password"
                defaultValue="1234"
                autoComplete="current-password"
                className="input bg-white shadow-[inset_0_2px_5px_rgba(15,23,42,0.08)]"
              />
            </Field>
            {error && (
              <p className="rounded-[8px] border border-error/20 bg-error/10 px-3 py-2 text-sm font-semibold text-error">
                {error}
              </p>
            )}
            <button type="submit" className="btn-primary w-full">
              Sign in
            </button>
          </Form>
        </div>
      </div>
    </section>
  );
}

function Dashboard({
  data,
  chat,
  agentId,
}: {
  data: NonNullable<Route.ComponentProps["loaderData"]["dashboard"]>;
  chat: { open: ChatSession[]; closed: ChatSession[] };
  agentId: string | null;
}) {
  const maxViews = Math.max(1, ...data.pageViews.map((item) => item.count));

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#f6f7fa,#dce3ee)] text-ink">
      <header className="sticky top-0 z-30 border-b border-white/70 bg-white/70 shadow-[0_8px_24px_rgba(15,23,42,0.12)] backdrop-blur">
        <div className="container-site flex h-16 items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary">
              Eldama Command Panel
            </p>
            <h1 className="text-xl font-semibold">Dashboard</h1>
          </div>
          <Form method="post">
            <input type="hidden" name="intent" value="logout" />
            <button className="btn-outline-ink !h-9 !px-4 !text-[12px]" type="submit">
              Log out
            </button>
          </Form>
        </div>
      </header>

      <div className="container-site py-8">
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <MetricCard label="Visits" value={data.totals.visits} tone="blue" />
          <MetricCard label="Sessions" value={data.totals.sessions} tone="slate" />
          <MetricCard label="Quote clicks" value={data.totals.quoteClicks} tone="blue" />
          <MetricCard label="Responses" value={data.totals.responses} tone="green" />
          <MetricCard label="Avg. scroll" value={`${data.totals.avgDepth}%`} tone="amber" />
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <Panel title="Scroll depth and conversion journeys">
            <div className="space-y-4">
              {data.journeys.length === 0 && <EmptyState text="No visitor sessions recorded yet." />}
              {data.journeys.map((journey) => (
                <div
                  key={journey.sessionId}
                  className="rounded-[14px] border border-white/80 bg-[linear-gradient(145deg,#ffffff,#edf2f8)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_8px_18px_rgba(15,23,42,0.08)]"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-ink">
                        Visitor {journey.sessionId.slice(0, 8)}
                      </p>
                      <p className="text-xs text-graphite">
                        {formatDate(journey.firstSeen)} - {journey.pages.join(" -> ")}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Badge active={journey.quoteClicked}>Quote clicked</Badge>
                      <Badge active={journey.quoteSubmitted}>Message sent</Badge>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="relative h-8 overflow-hidden rounded-full border border-[#b9c4d2] bg-[#dce3ed] shadow-[inset_0_2px_6px_rgba(15,23,42,0.18)]">
                      <div
                        className="h-full rounded-full bg-[linear-gradient(90deg,#024ad8,#35a9ff)] shadow-[inset_0_1px_0_rgba(255,255,255,0.45)]"
                        style={{ width: `${journey.maxDepth}%` }}
                      />
                      <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-ink">
                        {journey.maxDepth}% scrolled
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Conversion instrument">
            <FunnelGraphic
              visits={data.totals.visits}
              clicks={data.totals.quoteClicks}
              responses={data.totals.responses}
            />
          </Panel>
        </section>

        <section className="mt-6">
          <Panel title="GA4-style path exploration">
            <PathExploration
              paths={data.pathExploration}
              pageViews={data.pageViews}
              quoteClicks={data.totals.quoteClicks}
              responses={data.totals.responses}
            />
          </Panel>
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <Panel title="Page access and click monitoring">
            <div className="space-y-3">
              {data.pageViews.length === 0 && <EmptyState text="Page activity will appear here." />}
              {data.pageViews.map((item) => (
                <div key={item.path}>
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="font-semibold">{item.path}</span>
                    <span className="text-graphite">
                      {item.count} visits / {item.clicks} clicks
                    </span>
                  </div>
                  <div className="mt-1 h-3 rounded-full bg-[#d7dee9] shadow-[inset_0_1px_3px_rgba(15,23,42,0.15)]">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${Math.max(5, (item.count / maxViews) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Quote responses">
            <div className="grid gap-3">
              {data.quotes.length === 0 && <EmptyState text="Submitted quote requests will appear here." />}
              {data.quotes.map((quote) => (
                <article
                  key={quote.id}
                  className="rounded-[12px] border border-white bg-white/80 p-4 shadow-[0_7px_18px_rgba(15,23,42,0.08)]"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold">{quote.name}</h3>
                      <p className="text-sm text-charcoal">
                        {quote.company || "No company"} - {quote.email}
                      </p>
                    </div>
                    <span className="rounded-full bg-primary-soft px-3 py-1 text-xs font-bold text-primary">
                      {quote.id}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-charcoal">{quote.need || "No brief provided."}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {quote.services.map((service) => (
                      <span
                        key={service}
                        className="rounded-full border border-hairline bg-cloud px-2.5 py-1 text-xs font-semibold"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </Panel>
        </section>

        <section className="mt-6">
          <Panel title="Live chat console">
            <AgentChat open={chat.open} closed={chat.closed} agentId={agentId} />
          </Panel>
        </section>
      </div>
    </div>
  );
}

function PathExploration({
  paths,
  pageViews,
  quoteClicks,
  responses,
}: {
  paths: { from: string; to: string; count: number }[];
  pageViews: { path: string; count: number; clicks: number }[];
  quoteClicks: number;
  responses: number;
}) {
  const entries = pageViews.slice(0, 4);
  const max = Math.max(1, ...pageViews.map((page) => page.count), ...paths.map((path) => path.count));
  const quoteIntent = quoteClicks > 0 ? [{ from: "Any page", to: "Get a Quote click", count: quoteClicks }] : [];
  const responseIntent = responses > 0 ? [{ from: "Get a Quote click", to: "Response submitted", count: responses }] : [];
  const flows = [...paths.slice(0, 8), ...quoteIntent, ...responseIntent];

  return (
    <div className="overflow-hidden rounded-[16px] border border-[#c7d1dd] bg-[linear-gradient(145deg,#f9fbff,#e1e8f1)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.95)]">
      <div className="grid gap-4 lg:grid-cols-[220px_1fr_220px]">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-graphite">
            Starting point
          </p>
          <div className="mt-3 space-y-2">
            {entries.length === 0 && <EmptyState text="Entry paths will appear after visits." />}
            {entries.map((entry) => (
              <PathNode
                key={entry.path}
                label={entry.path}
                meta={`${entry.count} starts`}
                width={(entry.count / max) * 100}
                tone="blue"
              />
            ))}
          </div>
        </div>

        <div className="relative min-h-[280px] rounded-[14px] border border-white/80 bg-white/55 p-4 shadow-[inset_0_2px_10px_rgba(15,23,42,0.08)]">
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 640 300" preserveAspectRatio="none" aria-hidden="true">
            {flows.length === 0 ? (
              <path d="M80 150 C220 80 420 220 560 150" fill="none" stroke="#c4cedb" strokeWidth="5" strokeLinecap="round" strokeDasharray="10 10" />
            ) : (
              flows.map((flow, index) => {
                const y = 36 + index * (228 / Math.max(1, flows.length - 1));
                const width = 2 + Math.min(18, (flow.count / max) * 18);
                return (
                  <path
                    key={`${flow.from}-${flow.to}-${index}`}
                    d={`M20 ${y} C190 ${Math.max(20, y - 50)} 430 ${Math.min(280, y + 50)} 620 ${y}`}
                    fill="none"
                    stroke={flow.to.includes("Quote") || flow.to.includes("Response") ? "#024ad8" : "#1a1a1a"}
                    strokeOpacity={0.18 + Math.min(0.55, flow.count / max)}
                    strokeWidth={width}
                    strokeLinecap="round"
                  />
                );
              })
            )}
          </svg>
          <div className="relative grid h-full content-between gap-3">
            {flows.length === 0 ? (
              <div className="flex h-[250px] items-center justify-center">
                <EmptyState text="Path transitions need at least two page visits from the same session." />
              </div>
            ) : (
              flows.map((flow, index) => (
                <div
                  key={`${flow.from}-${flow.to}-${index}`}
                  className="mx-auto flex w-full max-w-xl items-center justify-between gap-3 rounded-[12px] border border-white/80 bg-white/80 px-3 py-2 text-xs shadow-[0_6px_16px_rgba(15,23,42,0.08)]"
                >
                  <span className="truncate font-semibold text-charcoal">{flow.from}</span>
                  <span className="shrink-0 rounded-full bg-primary-soft px-2 py-0.5 font-bold text-primary">
                    {flow.count}
                  </span>
                  <span className="truncate text-right font-semibold text-ink">{flow.to}</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-graphite">
            Next action
          </p>
          <div className="mt-3 space-y-2">
            {flows.slice(0, 5).map((flow, index) => (
              <PathNode
                key={`${flow.to}-${index}`}
                label={flow.to}
                meta={`${flow.count} users`}
                width={(flow.count / max) * 100}
                tone={flow.to.includes("Quote") || flow.to.includes("Response") ? "green" : "slate"}
              />
            ))}
            {flows.length === 0 && <EmptyState text="Next actions will appear here." />}
          </div>
        </div>
      </div>
    </div>
  );
}

function PathNode({
  label,
  meta,
  width,
  tone,
}: {
  label: string;
  meta: string;
  width: number;
  tone: "blue" | "green" | "slate";
}) {
  const color = {
    blue: "bg-primary",
    green: "bg-[#1b8f4d]",
    slate: "bg-ink",
  }[tone];

  return (
    <div className="rounded-[12px] border border-white/80 bg-white/80 p-3 shadow-[0_6px_14px_rgba(15,23,42,0.08)]">
      <div className="flex items-start justify-between gap-3">
        <p className="min-w-0 truncate text-sm font-semibold">{label}</p>
        <span className="shrink-0 text-xs font-bold text-graphite">{meta}</span>
      </div>
      <div className="mt-2 h-2 rounded-full bg-[#d7dee9] shadow-[inset_0_1px_3px_rgba(15,23,42,0.15)]">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${Math.max(8, width)}%` }} />
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: number | string;
  tone: "blue" | "green" | "amber" | "slate";
}) {
  const tones = {
    blue: "from-[#e8f0ff] to-[#cfdcff] text-primary",
    green: "from-[#e7f8ef] to-[#c4ecd5] text-[#16743b]",
    amber: "from-[#fff5dd] to-[#ffe1a8] text-[#9b6500]",
    slate: "from-[#f8fafc] to-[#d9e1ec] text-ink",
  };

  return (
    <div className="rounded-[18px] border border-white/80 bg-[#eef2f7] p-1 shadow-[0_16px_34px_rgba(15,23,42,0.14),inset_0_1px_0_rgba(255,255,255,0.9)]">
      <div className={`rounded-[14px] bg-gradient-to-br ${tones[tone]} p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.95)]`}>
        <p className="text-xs font-bold uppercase tracking-[0.16em] opacity-75">{label}</p>
        <p className="mt-3 font-display text-4xl font-semibold">{value}</p>
      </div>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-[20px] border border-white/80 bg-[#edf2f7] p-2 shadow-[0_18px_45px_rgba(15,23,42,0.16),inset_0_1px_0_rgba(255,255,255,0.95)]">
      <div className="rounded-[16px] border border-[#c7d1dd] bg-[linear-gradient(145deg,#ffffff,#e6ebf3)] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),inset_0_-18px_35px_rgba(15,23,42,0.04)]">
        <h2 className="mb-4 text-lg font-semibold">{title}</h2>
        {children}
      </div>
    </section>
  );
}

function Badge({ active, children }: { active: boolean; children: React.ReactNode }) {
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-bold ${
        active ? "bg-primary text-white" : "bg-[#d6deea] text-graphite"
      }`}
    >
      {children}
    </span>
  );
}

function FunnelGraphic({
  visits,
  clicks,
  responses,
}: {
  visits: number;
  clicks: number;
  responses: number;
}) {
  const max = Math.max(1, visits);
  const clickWidth = Math.max(18, (clicks / max) * 100);
  const responseWidth = Math.max(12, (responses / max) * 100);

  return (
    <div>
      <svg viewBox="0 0 520 260" className="h-auto w-full drop-shadow">
        <defs>
          <linearGradient id="admin-funnel" x1="0" x2="1">
            <stop offset="0%" stopColor="#024ad8" />
            <stop offset="100%" stopColor="#35a9ff" />
          </linearGradient>
        </defs>
        <rect x="25" y="25" width="470" height="62" rx="14" fill="url(#admin-funnel)" />
        <rect x={260 - (clickWidth * 3.2) / 2} y="105" width={clickWidth * 3.2} height="58" rx="14" fill="#1a1a1a" />
        <rect x={260 - (responseWidth * 2.4) / 2} y="181" width={responseWidth * 2.4} height="54" rx="14" fill="#1b8f4d" />
        <text x="260" y="64" textAnchor="middle" fill="white" fontSize="18" fontWeight="700">
          Visits: {visits}
        </text>
        <text x="260" y="140" textAnchor="middle" fill="white" fontSize="17" fontWeight="700">
          Quote clicks: {clicks}
        </text>
        <text x="260" y="215" textAnchor="middle" fill="white" fontSize="17" fontWeight="700">
          Responses: {responses}
        </text>
      </svg>
      <p className="mt-3 text-sm leading-relaxed text-charcoal">
        The bars narrow as visitors move from browsing, to quote intent, to a
        submitted response.
      </p>
    </div>
  );
}

function appendUnique(messages: ChatMessage[], next: ChatMessage) {
  return messages.some((m) => m.id === next.id) ? messages : [...messages, next].slice(-200);
}

function AgentChat({
  open: initialOpen,
  closed: initialClosed,
  agentId,
}: {
  open: ChatSession[];
  closed: ChatSession[];
  agentId: string | null;
}) {
  const [tab, setTab] = useState<"open" | "closed">("open");
  const [openRooms, setOpenRooms] = useState<ChatSession[]>(initialOpen);
  const [closedRooms, setClosedRooms] = useState<ChatSession[]>(initialClosed);
  const [activeId, setActiveId] = useState<string | null>(initialOpen[0]?.id || null);
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [context, setContext] = useState<ChatSession | null>(null);
  const [text, setText] = useState("");
  const [connected, setConnected] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);
  const activeIdRef = useRef<string | null>(activeId);

  useEffect(() => {
    activeIdRef.current = activeId;
  });

  useEffect(() => {
    const base = import.meta.env.VITE_CHAT_WS_URL || "ws://127.0.0.1:8787";
    let reconnectTimer: number | undefined;
    let closedByCleanup = false;
    let attempt = 0;

    const connect = () => {
      const socket = new WebSocket(`${base}/ws/agent${agentId ? `?agentId=${agentId}` : ""}`);
      socketRef.current = socket;
      socket.addEventListener("open", () => {
        attempt = 0;
        setConnected(true);
      });
      socket.addEventListener("close", () => {
        setConnected(false);
        if (!closedByCleanup) {
          const backoff = Math.min(1000 * Math.pow(2, attempt), 15000);
          attempt += 1;
          reconnectTimer = window.setTimeout(connect, backoff);
        }
      });
      socket.addEventListener("message", (event) => {
        const payload = JSON.parse(event.data) as {
          type: string;
          message?: ChatMessage;
          agentsOnline?: boolean;
        };
        if (payload.type === "presence") return;
        if (payload.type === "welcome") return;
        if (payload.type === "message" && payload.message) {
          const msg = payload.message!;
          if (msg.sessionId === activeIdRef.current) {
            setHistory((cur) => appendUnique(cur, msg));
          }
          // Bump unread/ordering for the room list (only if this is a visitor msg to another conversation).
          const bump = (rooms: ChatSession[]) => {
            const existing = rooms.find((s) => s.id === msg.sessionId);
            if (!existing) return rooms;
            const updated: ChatSession = {
              ...existing,
              last_message_at: msg.createdAt,
              last_message_preview: msg.body.slice(0, 60),
              unread_count:
                msg.sessionId === activeIdRef.current
                  ? existing.unread_count
                  : existing.unread_count + (msg.senderType === "visitor" ? 1 : 0),
            };
            return [updated, ...rooms.filter((s) => s.id !== msg.sessionId)].sort(
              (a, b) => (b.last_message_at || b.created_at).localeCompare(a.last_message_at || a.created_at),
            );
          };
          setOpenRooms((rooms) => bump(rooms));
          setClosedRooms((rooms) => bump(rooms));
        }
      });
    };

    connect();
    return () => {
      closedByCleanup = true;
      if (reconnectTimer) window.clearTimeout(reconnectTimer);
      socketRef.current?.close();
    };
  }, []);

  async function loadConversation(id: string) {
    setActiveId(id);
    activeIdRef.current = id;
    try {
      const res = await fetch(`/api/sessions/${id}/messages`);
      const data = (await res.json()) as { ok: boolean; session: ChatSession; messages: ChatMessage[] };
      if (data.ok) {
        setHistory(data.messages);
        setContext(data.session);
        // Reading the thread clears its unread badge locally.
        setOpenRooms((rooms) =>
          rooms.map((s) => (s.id === id ? { ...s, unread_count: 0 } : s)),
        );
        setClosedRooms((rooms) =>
          rooms.map((s) => (s.id === id ? { ...s, unread_count: 0 } : s)),
        );
      }
    } catch {
      // keep current state
    }
  }

  function selectTab(next: "open" | "closed") {
    setTab(next);
    const list = next === "open" ? openRooms : closedRooms;
    if (list.length > 0) void loadConversation(list[0].id);
    else {
      setActiveId(null);
      activeIdRef.current = null;
      setHistory([]);
      setContext(null);
    }
  }

  async function reply() {
    const trimmed = text.trim();
    if (!trimmed || !activeId) return;
    const sessionId = activeId;
    const body = trimmed;
    setText("");
    const messageId = crypto.randomUUID();
    const optimistic: ChatMessage = {
      id: messageId,
      sessionId,
      senderType: "agent",
      agentId: null,
      body,
      createdAt: new Date().toISOString(),
      readAt: new Date().toISOString(),
    };
    setHistory((cur) => appendUnique(cur, optimistic));
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ type: "message", id: messageId, sessionId, body }));
    } else {
      try {
        await fetch(`/api/sessions/${sessionId}/messages`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: messageId, body, senderType: "agent", agentId }),
        });
      } catch {
        // Keep the optimistic message visible; the next history load can reconcile it.
      }
    }
  }

  async function closeConversation() {
    if (!activeId) return;
    try {
      await fetch(`/api/sessions/${activeId}/close`, { method: "POST" });
      setTab("closed");
    } catch {
      // ignore refresh errors for MVP
    }
  }

  const list = tab === "open" ? openRooms : closedRooms;
  const active = list.find((s) => s.id === activeId);

  return (
    <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
      {/* Conversation list */}
      <aside className="rounded-[14px] border border-white bg-white/70 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
        <div className="mb-3 flex items-center justify-between gap-2">
          <p className="text-sm font-bold">Conversations</p>
          <span className={"text-xs font-semibold text-graphite " + (connected ? "text-primary" : "text-error")}>
            {connected ? "Connected" : "Offline"}
          </span>
        </div>
        <div className="mb-3 flex gap-1 rounded-[8px] bg-cloud p-1">
          <button
            type="button"
            onClick={() => selectTab("open")}
            className={"flex-1 rounded-md px-2 py-1 text-xs font-semibold " + (tab === "open" ? "bg-primary text-white" : "text-ink")}
          >
            Open
          </button>
          <button
            type="button"
            onClick={() => selectTab("closed")}
            className={"flex-1 rounded-md px-2 py-1 text-xs font-semibold " + (tab === "closed" ? "bg-primary text-white" : "text-ink")}
          >
            Closed
          </button>
        </div>
        <div className="space-y-2">
          {list.length === 0 && <EmptyState text={"No " + tab + " conversations."} />}
          {list.map((session) => (
            <button
              key={session.id}
              type="button"
              onClick={() => void loadConversation(session.id)}
              className={"w-full rounded-[10px] px-3 py-2 text-left text-sm font-semibold " + (session.id === activeId ? "bg-primary text-white" : "bg-cloud text-ink")}
            >
              <span className="block truncate">
                {session.visitor_name || session.visitor_email || "Visitor"}
              </span>
              <span className="block truncate text-[11px] opacity-75">
                {session.last_message_preview || "No messages"}
              </span>
              <span className="flex items-center justify-between text-[11px] opacity-75">
                <span>{formatDate(session.last_message_at || session.created_at)}</span>
                {session.unread_count > 0 && (
                  <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-white">
                    {session.unread_count}
                  </span>
                )}
              </span>
            </button>
          ))}
        </div>
      </aside>

      {/* Conversation detail */}
      <div className="overflow-hidden rounded-[14px] border border-white bg-white/80 shadow-[0_8px_18px_rgba(15,23,42,0.08)]">
        {!active && (
          <div className="p-8">
            <EmptyState text="Select a conversation to view its history." />
          </div>
        )}

        {active && (
          <>
            {/* Visitor context panel */}
            <div className="mb-3 rounded-[12px] border border-white bg-white/80 px-4 py-3 text-xs shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
              <p className="font-bold uppercase tracking-[0.12em] text-graphite">Visitor</p>
              <div className="mt-1.5 grid gap-x-6 gap-y-1.5 sm:grid-cols-2">
                <span><b>Name:</b> {context?.visitor_name || "—"}</span>
                <span><b>Email:</b> {context?.visitor_email || "—"}</span>
                <span><b>First seen:</b> {formatDate(context?.created_at)}</span>
                <span><b>Status:</b> {active.status}</span>
                <span className="sm:col-span-2"><b>Page:</b> <span className="break-all">{context?.page_url || "—"}</span></span>
                <span className="sm:col-span-2"><b>User agent:</b> <span className="break-all">{context?.user_agent || "—"}</span></span>
              </div>
            </div>

            {/* Messages */}
            <div className="h-72 space-y-3 overflow-y-auto bg-[linear-gradient(145deg,#ffffff,#eef3f8)] p-4">
              {history.length === 0 && <EmptyState text="No messages in this conversation yet." />}
              {history.map((message) => (
                <div
                  key={message.id}
                  className={"max-w-[78%] rounded-[12px] px-3 py-2 text-sm " + (message.senderType === "agent" ? "ml-auto bg-primary text-white" : "bg-white text-ink shadow-[0_4px_12px_rgba(15,23,42,0.1)]")}
                >
                  <p className="text-[11px] font-bold opacity-70">
                    {message.senderType === "agent" ? "You" : context?.visitor_name || "Visitor"}
                  </p>
                  <p>{message.body}</p>
                </div>
              ))}
            </div>

            {/* Reply + close */}
            <div className="flex flex-wrap items-center gap-2 border-t border-hairline bg-white p-3">
              <input
                className="input !h-10 min-w-0 flex-1"
                value={text}
                onChange={(event) => setText(event.target.value)}
                placeholder={"Reply to " + (context?.visitor_name || "visitor") + "..."}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    void reply();
                  }
                }}
              />
              <button type="button" className="btn-primary !h-10" onClick={() => void reply()}>
                Reply
              </button>
              {active.status === "open" && (
                <button type="button" className="btn-outline-ink !h-9 !px-3 !text-[12px]" onClick={() => void closeConversation()}>
                  Close
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="field-label" htmlFor={htmlFor}>
        {label}
      </label>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <p className="rounded-[10px] border border-dashed border-[#b9c4d2] bg-white/55 p-3 text-sm text-graphite">
      {text}
    </p>
  );
}

function formatDate(value?: string | null) {
  if (!value) return "Unknown time";
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}
