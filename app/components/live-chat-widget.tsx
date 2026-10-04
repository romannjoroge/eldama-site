import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

type MessagePayload = {
  id: string;
  sessionId: string;
  senderType: "visitor" | "agent";
  agentId: string | null;
  body: string;
  createdAt: string;
  readAt: string | null;
};

type SessionInfo = {
  id: string;
  visitor_name: string | null;
  visitor_email: string | null;
  page_url: string | null;
  user_agent: string | null;
  status: "open" | "closed";
  created_at: string;
  last_message_at: string | null;
};

type ChatState = {
  sessionId: string | null;
  name: string;
  email: string;
  status: "prechat" | "connecting" | "ready" | "offline";
  messages: MessagePayload[];
  agentsOnline: boolean;
};

const SESSION_KEY = "eldama_chat_session";
const PROFILE_KEY = "eldama_chat_profile";

const WS_DEFAULT = import.meta.env.VITE_CHAT_WS_URL || "ws://127.0.0.1:8787";

function readJson<T>(key: string): T | null {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function writeJson(key: string, value: unknown) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

function getStoredSession(): string | null {
  return readJson<{ id: string }>(SESSION_KEY)?.id || null;
}

function appendUnique(current: MessagePayload[], next: MessagePayload) {
  return current.some((m) => m.id === next.id) ? current : [...current, next];
}

export function LiveChatWidget() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(() => getStoredSession());
  const [messages, setMessages] = useState<MessagePayload[]>([]);
  const [status, setStatus] = useState<ChatState["status"]>("prechat");
  const [agentsOnline, setAgentsOnline] = useState(false);
  const [text, setText] = useState("");
  const [rateLimited, setRateLimited] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);
  const pageUrl = useMemo(() => (typeof window === "undefined" ? "" : window.location.href), []);
  const userAgent = useMemo(() => (typeof window === "undefined" ? "" : window.navigator.userAgent), []);

  // Restore profile from a previous visit.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const profile = readJson<{ name: string; email: string }>(PROFILE_KEY);
    if (profile) {
      setName(profile.name);
      setEmail(profile.email);
    }
  }, []);

  async function ensureSession(): Promise<string> {
    if (sessionId) return sessionId;
    const res = await fetch("/api/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        pageUrl,
        userAgent,
        // Honeypot: bots fill this hidden field.
        website: honeypot,
      }),
    });
    const data = (await res.json()) as { ok: boolean; session?: SessionInfo };
    if (!data.ok || !data.session) throw new Error("create session failed");
    writeJson(SESSION_KEY, { id: data.session.id });
    setSessionId(data.session.id);
    return data.session.id;
  }

  useEffect(() => {
    if (typeof window === "undefined") return;

    const base = WS_DEFAULT;
    let reconnectTimer: number | undefined;
    let closedByCleanup = false;
    let attempt = 0;

    const loadHistory = async (sid: string) => {
      try {
        const res = await fetch(`/api/sessions/${sid}/messages`);
        const data = (await res.json()) as { ok: boolean; messages?: MessagePayload[] };
        if (data.ok && data.messages) setMessages(data.messages);
      } catch {
        // history load is best-effort
      }
    };

    if (sessionId) void loadHistory(sessionId);

    const connect = () => {
      const socketPath = sessionId
        ? `/ws/chat/${encodeURIComponent(sessionId)}`
        : "/ws/presence";
      const socket = new WebSocket(`${base}${socketPath}`);
      socketRef.current = socket;

      socket.addEventListener("open", (event) => {
        attempt = 0;
        setStatus("ready");
      });

      socket.addEventListener("close", () => {
        setStatus("offline");
        if (!closedByCleanup) {
          const backoff = Math.min(1000 * Math.pow(2, attempt), 15000);
          attempt += 1;
          reconnectTimer = window.setTimeout(connect, backoff);
        }
      });

      socket.addEventListener("message", (event) => {
        const payload = JSON.parse(event.data) as {
          type: string;
          message?: MessagePayload;
          sessionId?: string;
          agentsOnline?: number | boolean;
        };
        if (payload.type === "message" && payload.message) {
          setMessages((current) => appendUnique(current, payload.message!));
        } else if (payload.type === "session" && payload.sessionId) {
          writeJson(SESSION_KEY, { id: payload.sessionId });
          setSessionId(payload.sessionId);
        } else if (payload.type === "presence" && typeof payload.agentsOnline === "number") {
          setAgentsOnline(payload.agentsOnline > 0);
        } else if (payload.type === "presence" && typeof payload.agentsOnline === "boolean") {
          setAgentsOnline(payload.agentsOnline);
        }
      });
    };

    connect();

    return () => {
      closedByCleanup = true;
      if (reconnectTimer) window.clearTimeout(reconnectTimer);
      socketRef.current?.close();
    };
  }, [sessionId]);

  async function send() {
    const trimmed = text.trim();
    if (!trimmed || rateLimited) return;

    const sid = await ensureSession().catch(() => null);
    if (!sid) {
      toast.error("Could not start the chat. Please try again.");
      return;
    }

    const message: MessagePayload = {
      id: crypto.randomUUID(),
      sessionId: sid,
      senderType: "visitor",
      agentId: null,
      body: trimmed,
      createdAt: new Date().toISOString(),
      readAt: null,
    };
    setMessages((current) => appendUnique(current, message));
    setText("");
    setRateLimited(true);
    window.setTimeout(() => setRateLimited(false), 2000);

    try {
      const response = await fetch(`/api/sessions/${sid}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: message.id, body: trimmed }),
      });
      const result = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
        message?: MessagePayload;
        session?: SessionInfo;
      };
      if (!response.ok || !result.ok || !result.message) {
        throw new Error(result.error || "Message could not be sent.");
      }
      setMessages((current) => [...current.filter((item) => item.id !== message.id), result.message!]);
      if (result.session) {
        writeJson(SESSION_KEY, { id: result.session.id });
        setSessionId(result.session.id);
      }
    } catch (error) {
      setMessages((current) => current.filter((item) => item.id !== message.id));
      setText(trimmed);
      setRateLimited(false);
      toast.error(error instanceof Error ? error.message : "Message could not be sent.");
    }
  }

  function startChat() {
    setName(name.trim());
    setEmail(email.trim());
    if (!name.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return;
    // Honeypot: bots fill this hidden field; silently reject.
    if (honeypot) return;
    writeJson(PROFILE_KEY, { name: name.trim(), email: email.trim() });
    setStatus("connecting");
    void ensureSession().catch(() => toast.error("Could not start the chat. Please try again."));
  }

  return (
    <div className="fixed bottom-20 right-4 z-50 md:bottom-6">
      {open && (
        <section className="mb-3 w-[min(360px,calc(100vw-2rem))] overflow-hidden rounded-[14px] border border-white/70 bg-[#f7f7f7] shadow-[0_22px_60px_rgba(15,23,42,0.28),inset_0_1px_0_rgba(255,255,255,0.9)]">
          <header className="border-b border-white/70 bg-gradient-to-b from-white to-fog px-4 py-3 shadow-[inset_0_-1px_0_rgba(0,0,0,0.05)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[13px] font-bold uppercase tracking-[0.12em] text-primary">
                  Eldama Live
                </p>
                <h2 className="text-lg font-semibold text-ink">Chat with support</h2>
              </div>
              <span className="rounded-full border border-hairline bg-white px-2.5 py-1 text-[12px] font-semibold text-charcoal">
                {agentsOnline ? "Online" : "Offline"}
              </span>
            </div>
          </header>

          <div
            data-lenis-prevent
            className="h-72 space-y-3 overflow-y-auto overscroll-contain bg-[linear-gradient(145deg,#ffffff,#eef2f7)] p-4"
          >
            {/* Pre-chat form */}
            {!sessionId && (
              <form
                className="space-y-2"
                onSubmit={(event) => {
                  event.preventDefault();
                  startChat();
                }}
              >
                <p className="text-sm text-charcoal">
                  Tell us how to reach you, then send us a message.
                </p>
                <input
                  aria-label="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="input !h-10 w-full"
                />
                <input
                  aria-label="Your email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="input !h-10 w-full"
                />
                {/* Honeypot field — hidden from humans */}
                <input
                  aria-hidden="true"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  className="hidden"
                />
                <button type="submit" className="btn-primary !h-10 w-full">
                  Start chat
                </button>
              </form>
            )}

            {/* Offline notice */}
            {sessionId && !agentsOnline && messages.length === 0 && (
              <p className="rounded-[10px] border border-white bg-white/80 p-3 text-sm text-charcoal shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
                We're not online right now — leave a message and we'll get back to
                you by email.
              </p>
            )}

            {sessionId && messages.length === 0 && agentsOnline && (
              <p className="rounded-[10px] border border-white bg-white/80 p-3 text-sm text-charcoal shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
                Send us a message and an Eldama team member can reply from the
                admin panel.
              </p>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`max-w-[85%] rounded-[12px] px-3 py-2 text-sm shadow-[0_2px_8px_rgba(15,23,42,0.12)] ${
                  message.senderType === "visitor"
                    ? "ml-auto bg-primary text-white"
                    : "bg-white text-ink"
                }`}
              >
                <p className="text-[11px] font-semibold opacity-75">
                  {message.senderType === "visitor" ? "You" : "Support"}
                </p>
                <p>{message.body}</p>
              </div>
            ))}
          </div>

          {sessionId && (
            <form
              className="flex gap-2 border-t border-hairline bg-white p-3"
              onSubmit={(event) => {
                event.preventDefault();
                void send();
              }}
            >
              <input
                value={text}
                onChange={(event) => setText(event.target.value)}
                className="input !h-10 flex-1"
                placeholder="Type your message..."
              />
              <button
                type="submit"
                className="btn-primary !h-10 !px-4"
                disabled={rateLimited}
              >
                {rateLimited ? "Please wait..." : "Send"}
              </button>
            </form>
          )}
        </section>
      )}

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="ml-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-[0_14px_30px_rgba(2,74,216,0.35),inset_0_1px_0_rgba(255,255,255,0.35)] transition-transform hover:-translate-y-0.5"
        aria-label={open ? "Close live chat" : "Open live chat"}
      >
        {open ? (
          <span className="text-xl font-bold leading-none">x</span>
        ) : (
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="h-7 w-7"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          >
            <path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5Z" />
            <path d="M8 10h8" />
            <path d="M8 14h5" />
          </svg>
        )}
      </button>
    </div>
  );
}
