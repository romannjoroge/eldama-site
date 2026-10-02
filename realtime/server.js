/** @format */
/**
 * Eldama realtime live-chat server.
 *
 * Bun-owned chat service. Provides:
 *   GET  /health
 *   HTTP /internal/*         - authenticated app-to-service API
 *   GET/POST /api/sessions/:sessionId/messages - authenticated message API
 *   WS   /ws/agent              - agent console live channel
 *   WS   /ws/chat/:sessionId    - visitor live channel
 *
 * Messages persist to SQLite (data/chat.sqlite) via bun:sqlite.
 * Fan-out uses Bun native pub/sub (server.publish + ws.subscribe).
 */
import {
  addMessage,
  closeSession,
  createAgentSession,
  createSession,
  db,
  getAgentBySession,
  getSession,
  getSessionMessages,
  listSessions,
  normalizeMessageId,
  sanitizeText,
  validateAgentCredentials,
} from "./chat-store.js";
import { timingSafeEqual } from "node:crypto";

const port = Number(process.env.REALTIME_PORT || 8787);
const hostname = process.env.REALTIME_HOST || "127.0.0.1";
const serviceToken = process.env.CHAT_SERVICE_TOKEN || "local-dev-chat-service-token";
if (
  !process.env.CHAT_SERVICE_TOKEN &&
  (process.env.NODE_ENV === "production" || !["127.0.0.1", "localhost", "::1"].includes(hostname))
) {
  throw new Error("Set CHAT_SERVICE_TOKEN when the chat service is exposed beyond localhost or runs in production.");
}

// Track how many agent consoles are connected right now. An agent is
// considered "online" while at least one /ws/agent socket is open.
const agentSockets = new Set();

function sendToSession(sessionId, payload) {
  const encoded = JSON.stringify(payload);
  server.publish(`room:${sessionId}`, encoded);
  server.publish("agents", encoded);
}

function cors() {
  return {
    "Access-Control-Allow-Origin": process.env.CORS_ORIGIN || "*",
    "Access-Control-Allow-Methods": "GET,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

function authorized(req) {
  const supplied = Buffer.from(req.headers.get("Authorization") || "");
  const expected = Buffer.from(`Bearer ${serviceToken}`);
  return supplied.length === expected.length && timingSafeEqual(supplied, expected);
}

async function readJson(req) {
  try {
    return await req.json();
  } catch {
    return null;
  }
}

function json(body, status = 200) {
  return Response.json(body, { status });
}

async function handleInternalRequest(req, url) {
  const sessionMatch = url.pathname.match(/^\/internal\/sessions\/([^/]+)(?:\/(messages|close))?$/);
  if (req.method === "POST" && url.pathname === "/internal/sessions") {
    const body = await readJson(req);
    if (!body || typeof body !== "object") return json({ error: "invalid request" }, 400);
    return json({ session: createSession(body) });
  }

  if (sessionMatch) {
    const sessionId = decodeURIComponent(sessionMatch[1]);
    const operation = sessionMatch[2];
    const session = getSession(sessionId);
    if (!session) return json({ error: "unknown session" }, 404);

    if (req.method === "GET" && operation === undefined) return json({ session });
    if (req.method === "GET" && operation === "messages") {
      return json({ session, messages: getSessionMessages(sessionId) });
    }
    if (req.method === "POST" && operation === "messages") {
      const body = await readJson(req);
      if (!body || !["visitor", "agent"].includes(body.senderType) || !String(body.body || "").trim()) {
        return json({ error: "invalid message" }, 400);
      }
      const message = addMessage({ ...body, sessionId });
      return json({ message });
    }
    if (req.method === "POST" && operation === "close") {
      return json({ closed: closeSession(sessionId) });
    }
  }

  if (req.method === "GET" && url.pathname === "/internal/admin/sessions") {
    const status = url.searchParams.get("status");
    if (status !== "open" && status !== "closed") return json({ error: "invalid status" }, 400);
    return json({ sessions: listSessions(status) });
  }

  if (req.method === "POST" && url.pathname === "/internal/admin/agents/validate") {
    const body = await readJson(req);
    if (!body) return json({ error: "invalid request" }, 400);
    return json({ agent: validateAgentCredentials(String(body.email || ""), String(body.password || "")) });
  }

  if (req.method === "POST" && url.pathname === "/internal/admin/agent-sessions") {
    const body = await readJson(req);
    if (!body?.agentId || !body?.expiresAt) return json({ error: "invalid request" }, 400);
    return json({ sessionId: createAgentSession(String(body.agentId), String(body.expiresAt)) });
  }

  const agentSessionMatch = url.pathname.match(/^\/internal\/admin\/agent-sessions\/([^/]+)$/);
  if (req.method === "GET" && agentSessionMatch) {
    return json({ agent: getAgentBySession(decodeURIComponent(agentSessionMatch[1])) });
  }

  return json({ error: "not found" }, 404);
}

async function handleSessionMessagesRequest(req, sessionId) {
  const session = getSession(sessionId);
  if (!session) return json({ ok: false, error: "unknown session" }, 404);

  if (req.method === "GET") {
    return json({ ok: true, session, messages: getSessionMessages(sessionId) });
  }

  if (req.method === "POST") {
    const body = await readJson(req);
    if (!body || !["visitor", "agent"].includes(body.senderType) || !String(body.body || "").trim()) {
      return json({ ok: false, error: "invalid message" }, 400);
    }
    const message = addMessage({ ...body, sessionId });
    if (!message) return json({ ok: false, error: "send failed" }, 500);
    sendToSession(sessionId, { type: "message", message });
    return json({ ok: true, message });
  }

  return json({ ok: false, error: "method not allowed" }, 405);
}

const server = Bun.serve({
  hostname,
  port,
  async fetch(req, serverInstance) {
    const url = new URL(req.url);

    if (req.method === "OPTIONS") {
      return new Response(null, { headers: cors() });
    }

    if (url.pathname === "/health") {
      return Response.json({
        ok: true,
        pendingWebSockets: serverInstance.pendingWebSockets,
        agentsOnline: agentSockets.size,
      });
    }

    if (url.pathname.startsWith("/internal/")) {
      if (!authorized(req)) return json({ error: "unauthorized" }, 401);
      try {
        return await handleInternalRequest(req, url);
      } catch (error) {
        console.error("[chat-api] request failed:", error);
        return json({ error: "chat service error" }, 500);
      }
    }

    const sessionMessagesMatch = url.pathname.match(/^\/api\/sessions\/([^/]+)\/messages$/);
    if (sessionMessagesMatch && ["GET", "POST"].includes(req.method)) {
      if (!authorized(req)) return json({ ok: false, error: "unauthorized" }, 401);
      try {
        return await handleSessionMessagesRequest(req, decodeURIComponent(sessionMessagesMatch[1]));
      } catch (error) {
        console.error("[chat-api] message request failed:", error);
        return json({ ok: false, error: "chat service error" }, 500);
      }
    }

    if (url.pathname === "/ws/presence") {
      const upgraded = serverInstance.upgrade(req, { data: { kind: "presence" } });
      return upgraded ? undefined : new Response("WebSocket upgrade failed", { status: 400, headers: cors() });
    }

    if (url.pathname === "/ws/agent") {
      const upgraded = serverInstance.upgrade(req, {
        data: { kind: "agent", agentId: url.searchParams.get("agentId") || null },
      });
      return upgraded ? undefined : new Response("WebSocket upgrade failed", { status: 400, headers: cors() });
    }

    const match = url.pathname.match(/^\/ws\/chat\/([^/]+)$/);
    if (match) {
      const sessionId = decodeURIComponent(match[1]);
      const session = db.query("SELECT id, status FROM sessions WHERE id = ?").get(sessionId);
      if (!session) {
        return new Response('{"error":"unknown session"}', { status: 404, headers: cors() });
      }
      const upgraded = serverInstance.upgrade(req, {
        data: { kind: "visitor", sessionId, connectedAt: Date.now() },
      });
      return upgraded ? undefined : new Response("WebSocket upgrade failed", { status: 400, headers: cors() });
    }

    return new Response("Not found", { status: 404, headers: cors() });
  },
  websocket: {
    open(ws) {
      if (ws.data.kind === "agent") {
        agentSockets.add(ws);
        ws.subscribe("agents");
        server.publish("agents", JSON.stringify({ type: "presence", agentsOnline: agentSockets.size }));
        server.publish("visitors-presence", JSON.stringify({ type: "presence", agentsOnline: agentSockets.size }));
        ws.send(JSON.stringify({ type: "welcome", kind: "agent" }));
      } else if (ws.data.kind === "presence") {
        ws.subscribe("visitors-presence");
        ws.send(JSON.stringify({ type: "presence", agentsOnline: agentSockets.size }));
      } else {
        ws.subscribe(`room:${ws.data.sessionId}`);
        ws.subscribe("visitors-presence");
        ws.send(JSON.stringify({ type: "presence", agentsOnline: agentSockets.size }));
        const history = db
          .query("SELECT * FROM messages WHERE session_id = ? ORDER BY created_at ASC, rowid ASC")
          .all(ws.data.sessionId);
        for (const row of history) {
          ws.send(JSON.stringify({ type: "message", message: mapMessage(row) }));
        }
      }
    },
    async message(ws, raw) {
      let payload;
      try {
        payload = JSON.parse(String(raw));
      } catch {
        ws.send(JSON.stringify({ type: "error", error: "Invalid JSON" }));
        return;
      }

      if (ws.data.kind === "visitor") {
        if (payload.type !== "message" || !String(payload.body || "").trim()) return;
        const sessionId = ws.data.sessionId;
        const session = db.query("SELECT id, status FROM sessions WHERE id = ?").get(sessionId);
        if (!session) return;

        // Closed conversations are terminal: a visitor message opens a NEW session.
        if (session.status === "closed") {
          const newId = crypto.randomUUID();
          const now = new Date().toISOString();
          db.query(
            "INSERT INTO sessions (id, visitor_name, visitor_email, page_url, user_agent, status, created_at, last_message_at) VALUES (?, ?, ?, ?, ?, 'open', ?, ?)",
          ).run(newId, session.visitor_name, session.visitor_email, session.page_url, session.user_agent, now, now);
          const message = insertMessage(newId, "visitor", null, payload.body, payload.id);
          ws.data.sessionId = newId;
          ws.unsubscribe(`room:${sessionId}`);
          ws.subscribe(`room:${newId}`);
          sendToSession(newId, { type: "message", message });
          ws.send(JSON.stringify({ type: "session", sessionId: newId }));
          return;
        }

        const message = insertMessage(sessionId, "visitor", null, payload.body, payload.id);
        sendToSession(sessionId, { type: "message", message });
        return;
      }

      if (ws.data.kind === "agent") {
        if (payload.type === "mark_read" && payload.sessionId) {
          db.query("UPDATE messages SET read_at = ? WHERE session_id = ? AND sender_type = 'visitor' AND read_at IS NULL").run(
            new Date().toISOString(),
            payload.sessionId,
          );
          server.publish(`room:${payload.sessionId}`, JSON.stringify({ type: "read", sessionId: payload.sessionId }));
          return;
        }

        if (payload.type === "message") {
          const sessionId = payload.sessionId;
          const session = db.query("SELECT id FROM sessions WHERE id = ?").get(sessionId);
          if (!session) return;
          const message = insertMessage(sessionId, "agent", ws.data.agentId || null, payload.body, payload.id);
          sendToSession(sessionId, { type: "message", message });
          return;
        }
      }
    },
    close(ws) {
      if (ws.data.kind === "agent") {
        agentSockets.delete(ws);
        ws.unsubscribe("agents");
        server.publish("agents", JSON.stringify({ type: "presence", agentsOnline: agentSockets.size }));
        server.publish("visitors-presence", JSON.stringify({ type: "presence", agentsOnline: agentSockets.size }));
      } else if (ws.data.kind === "presence") {
        ws.unsubscribe("visitors-presence");
      } else {
        ws.unsubscribe(`room:${ws.data.sessionId}`);
        ws.unsubscribe("visitors-presence");
      }
    },
  },
});

function insertMessage(sessionId, senderType, agentId, body, requestedId) {
  const id = normalizeMessageId(requestedId);
  const now = new Date().toISOString();
  const result = db.query(
    "INSERT OR IGNORE INTO messages (id, session_id, sender_type, agent_id, body, created_at, read_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
  ).run(id, sessionId, senderType, agentId, sanitizeText(body), now, now);
  if (result.changes > 0) {
    db.query("UPDATE sessions SET last_message_at = ? WHERE id = ?").run(now, sessionId);
  }
  const row = db.query("SELECT * FROM messages WHERE id = ? AND session_id = ?").get(id, sessionId);
  return row ? mapMessage(row) : null;
}

function mapMessage(row) {
  return {
    id: row.id,
    sessionId: row.session_id,
    senderType: row.sender_type,
    agentId: row.agent_id,
    body: row.body,
    createdAt: row.created_at,
    readAt: row.read_at,
  };
}

console.log(`Eldama realtime server listening on ${server.url}`);
