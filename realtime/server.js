import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const port = Number(process.env.REALTIME_PORT || 8787);
const storeDir = path.join(process.cwd(), ".eldama-admin");
const storeFile = path.join(storeDir, "store.json");

async function readStore() {
  try {
    const raw = await readFile(storeFile, "utf8");
    const parsed = JSON.parse(raw);
    return {
      events: Array.isArray(parsed.events) ? parsed.events : [],
      quotes: Array.isArray(parsed.quotes) ? parsed.quotes : [],
      chats: Array.isArray(parsed.chats) ? parsed.chats : [],
    };
  } catch {
    return { events: [], quotes: [], chats: [] };
  }
}

async function writeStore(store) {
  await mkdir(storeDir, { recursive: true });
  await writeFile(storeFile, JSON.stringify(store, null, 2), "utf8");
}

async function saveMessage(message) {
  const store = await readStore();
  store.chats.push(message);
  store.chats = store.chats.slice(-1000);
  await writeStore(store);
}

function cors() {
  return {
    "Access-Control-Allow-Origin": process.env.CORS_ORIGIN || "*",
    "Access-Control-Allow-Methods": "GET,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

const server = Bun.serve({
  port,
  fetch(req, serverInstance) {
    const url = new URL(req.url);

    if (req.method === "OPTIONS") {
      return new Response(null, { headers: cors() });
    }

    if (url.pathname === "/health") {
      return Response.json({
        ok: true,
        pendingWebSockets: serverInstance.pendingWebSockets,
      });
    }

    if (url.pathname === "/ws/chat") {
      const role = url.searchParams.get("role") === "admin" ? "admin" : "visitor";
      const roomId = url.searchParams.get("room") || crypto.randomUUID();
      const upgraded = serverInstance.upgrade(req, {
        data: {
          role,
          roomId,
          connectedAt: Date.now(),
        },
      });

      return upgraded
        ? undefined
        : new Response("WebSocket upgrade failed", { status: 400, headers: cors() });
    }

    return new Response("Not found", { status: 404, headers: cors() });
  },
  websocket: {
    data: {},
    idleTimeout: 255,
    perMessageDeflate: true,
    open(ws) {
      ws.subscribe(`room:${ws.data.roomId}`);

      if (ws.data.role === "admin") {
        ws.subscribe("admins");
      } else {
        server.publish(
          "admins",
          JSON.stringify({
            type: "presence",
            roomId: ws.data.roomId,
            status: "online",
          }),
        );
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

      if (payload.type !== "message" || !String(payload.text || "").trim()) {
        return;
      }

      const roomId = ws.data.role === "admin" && payload.roomId ? payload.roomId : ws.data.roomId;
      const message = {
        id: typeof payload.id === "string" && payload.id ? payload.id : crypto.randomUUID(),
        roomId,
        sender: ws.data.role,
        name: String(payload.name || (ws.data.role === "admin" ? "Eldama admin" : "Website visitor")),
        text: String(payload.text).trim().slice(0, 1200),
        createdAt: new Date().toISOString(),
      };

      await saveMessage(message);

      const encoded = JSON.stringify({ type: "message", message });
      server.publish(`room:${roomId}`, encoded);
      server.publish("admins", encoded);
      ws.send(encoded);
    },
    close(ws) {
      if (ws.data.role === "visitor") {
        server.publish(
          "admins",
          JSON.stringify({
            type: "presence",
            roomId: ws.data.roomId,
            status: "offline",
          }),
        );
      }
    },
  },
});

console.log(`Eldama realtime server listening on ${server.url}`);
