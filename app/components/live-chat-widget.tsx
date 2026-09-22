import { useEffect, useMemo, useRef, useState } from "react";

type ChatMessage = {
  id: string;
  roomId: string;
  sender: "visitor" | "admin" | "system";
  name: string;
  text: string;
  createdAt: string;
};

function getVisitorId() {
  const key = "eldama_chat_visitor";
  const existing = window.localStorage.getItem(key);
  if (existing) return existing;
  const value = crypto.randomUUID();
  window.localStorage.setItem(key, value);
  return value;
}

function appendUniqueMessages(current: ChatMessage[], next: ChatMessage) {
  if (current.some((message) => message.id === next.id)) return current;
  return [...current, next].slice(-50);
}

export function LiveChatWidget() {
  const [open, setOpen] = useState(false);
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");
  const socketRef = useRef<WebSocket | null>(null);
  const pendingRef = useRef<string[]>([]);
  const visitorId = useMemo(
    () => (typeof window === "undefined" ? "" : getVisitorId()),
    [],
  );

  useEffect(() => {
    if (!visitorId) return;

    const base = import.meta.env.VITE_CHAT_WS_URL || "ws://localhost:8787/ws/chat";
    let reconnectTimer: number | undefined;
    let closedByCleanup = false;

    const connect = () => {
      const socket = new WebSocket(`${base}?role=visitor&room=${visitorId}`);
      socketRef.current = socket;

      socket.addEventListener("open", () => {
        setConnected(true);
        const pending = pendingRef.current.splice(0);
        for (const item of pending) {
          socket.send(item);
        }
      });

      socket.addEventListener("close", () => {
        setConnected(false);
        if (!closedByCleanup) {
          reconnectTimer = window.setTimeout(connect, 1200);
        }
      });

      socket.addEventListener("message", (event) => {
        const payload = JSON.parse(event.data) as { type: string; message?: ChatMessage };
        if (payload.type === "message" && payload.message) {
          setMessages((current) => appendUniqueMessages(current, payload.message!));
        }
      });
    };

    connect();

    return () => {
      closedByCleanup = true;
      if (reconnectTimer) window.clearTimeout(reconnectTimer);
      socketRef.current?.close();
    };
  }, [visitorId]);

  const send = () => {
    const trimmed = text.trim();
    if (!trimmed || socketRef.current?.readyState !== WebSocket.OPEN) return;
    const message: ChatMessage = {
      id: crypto.randomUUID(),
      roomId: visitorId,
      sender: "visitor",
      name: "Website visitor",
      text: trimmed,
      createdAt: new Date().toISOString(),
    };
    setMessages((current) => appendUniqueMessages(current, message));
    const payload = JSON.stringify({
      type: "message",
      id: message.id,
      text: trimmed,
      name: "Website visitor",
    });

    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(payload);
    } else {
      pendingRef.current.push(payload);
      setMessages((current) =>
        appendUniqueMessages(current, {
          id: crypto.randomUUID(),
          roomId: visitorId,
          sender: "system",
          name: "System",
          text: "Connecting to live chat. Your message will send automatically.",
          createdAt: new Date().toISOString(),
        }),
      );
    }

    setText("");
  };

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
                {connected ? "Online" : "Connecting"}
              </span>
            </div>
          </header>
          <div className="h-72 space-y-3 overflow-y-auto bg-[linear-gradient(145deg,#ffffff,#eef2f7)] p-4">
            {messages.length === 0 && (
              <p className="rounded-[10px] border border-white bg-white/80 p-3 text-sm text-charcoal shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
                Send us a message and an Eldama team member can reply from the
                admin panel.
              </p>
            )}
            {messages.map((message) => (
              <div
                key={message.id}
                className={`max-w-[85%] rounded-[12px] px-3 py-2 text-sm shadow-[0_2px_8px_rgba(15,23,42,0.12)] ${
                  message.sender === "visitor"
                    ? "ml-auto bg-primary text-white"
                    : message.sender === "system"
                      ? "mx-auto bg-[#d6deea] text-graphite"
                    : "bg-white text-ink"
                }`}
              >
                <p className="text-[11px] font-semibold opacity-75">{message.name}</p>
                <p>{message.text}</p>
              </div>
            ))}
          </div>
          <form
            className="flex gap-2 border-t border-hairline bg-white p-3"
            onSubmit={(event) => {
              event.preventDefault();
              send();
            }}
          >
            <input
              value={text}
              onChange={(event) => setText(event.target.value)}
              className="input !h-10 flex-1"
              placeholder="Type your message..."
            />
            <button type="submit" className="btn-primary !h-10 !px-4">
              Send
            </button>
          </form>
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
