import { getAuthedAgent, isAdminRequest } from "~/.server/admin-auth";
import {
  addChatMessage,
  ChatServiceError,
  closeChatSession,
  createChatSession,
  getChatSession,
  getChatSessionMessages,
} from "~/.server/chat-service";
import { notifyFirstMessage } from "~/.server/email";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

// Spam guard (in-memory for MVP): max 1 message per 2s per session.
const lastSentAt = new Map<string, number>();
const MIN_SEND_INTERVAL_MS = 2000;

function rateLimited(sessionId: string): boolean {
  const now = Date.now();
  const last = lastSentAt.get(sessionId) ?? 0;
  if (now - last < MIN_SEND_INTERVAL_MS) return true;
  lastSentAt.set(sessionId, now);
  return false;
}

function serviceError(error: unknown) {
  if (error instanceof ChatServiceError) return json({ ok: false, error: error.message }, error.status);
  console.error("[chat-api] service request failed:", error);
  return json({ ok: false, error: "chat service unavailable" }, 503);
}

export async function loader({ request }: { request: Request }) {
  const parts = new URL(request.url).pathname.split("/").filter(Boolean);
  if (parts.length === 4 && parts[0] === "api" && parts[1] === "sessions" && parts[3] === "messages") {
    try {
      const result = await getChatSessionMessages(decodeURIComponent(parts[2]));
      return json({ ok: true, ...result });
    } catch (error) {
      return serviceError(error);
    }
  }
  return json({ ok: false, error: "not found" }, 404);
}

export async function action({ request }: { request: Request }) {
  const parts = new URL(request.url).pathname.split("/").filter(Boolean);
  const raw = await request.json().catch(() => null);

  try {
    if (parts.length === 2 && request.method === "POST") {
      if (raw?.website) return json({ ok: false, error: "bot" }, 400);
      const session = await createChatSession({
        name: String(raw?.name || ""),
        email: String(raw?.email || ""),
        pageUrl: String(raw?.pageUrl || ""),
        userAgent: String(raw?.userAgent || ""),
      });
      return json({ ok: true, session });
    }

    if (parts.length === 4 && parts[0] === "api" && parts[1] === "sessions" && parts[3] === "messages") {
      const sessionId = decodeURIComponent(parts[2]);
      const session = await getChatSession(sessionId);
      if (!session) return json({ ok: false, error: "unknown session" }, 404);

      const senderType = raw?.senderType === "agent" ? "agent" : "visitor";
      const authenticated = senderType === "agent" ? await isAdminRequest(request) : false;
      if (senderType === "agent" && !authenticated) {
        return json({ ok: false, error: "unauthorized" }, 401);
      }
      const agent = senderType === "agent" ? await getAuthedAgent(request) : null;
      if (senderType === "visitor" && rateLimited(sessionId)) {
        return json({ ok: false, error: "slow down" }, 429);
      }

      const body = String(raw?.body || "").replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim().slice(0, 2000);
      if (!body) return json({ ok: false, error: "empty message" }, 400);
      const isFirstVisitorMessage = senderType === "visitor" && session.last_message_at === null;
      const message = await addChatMessage({
        sessionId,
        senderType,
        agentId: agent?.id || null,
        body,
        markReadBy: senderType,
      });
      if (message && isFirstVisitorMessage) void notifyFirstMessage(message, session);
      return message ? json({ ok: true, message }) : json({ ok: false, error: "send failed" }, 500);
    }

    if (parts.length === 4 && parts[0] === "api" && parts[1] === "sessions" && parts[3] === "close") {
      if (!(await isAdminRequest(request))) return json({ ok: false, error: "unauthorized" }, 401);
      const closed = await closeChatSession(decodeURIComponent(parts[2]));
      return closed ? json({ ok: true }) : json({ ok: false, error: "unknown session" }, 404);
    }

    return json({ ok: false, error: "not found" }, 404);
  } catch (error) {
    return serviceError(error);
  }
}
