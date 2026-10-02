import type { ChatAgent, ChatMessage, ChatSession, SessionStatus } from "./chat-types";

const serviceUrl = process.env.CHAT_SERVICE_URL || `http://127.0.0.1:${process.env.REALTIME_PORT || "8787"}`;
const serviceToken = process.env.CHAT_SERVICE_TOKEN || "local-dev-chat-service-token";

export class ChatServiceError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "ChatServiceError";
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${serviceToken}`);
  if (init.body) headers.set("Content-Type", "application/json");

  let response: Response;
  try {
    response = await fetch(new URL(path, `${serviceUrl.replace(/\/$/, "")}/`), {
      ...init,
      headers,
    });
  } catch {
    throw new ChatServiceError("Chat service unavailable", 503);
  }

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new ChatServiceError(payload.error || "Chat service request failed", response.status);
  }
  return payload as T;
}

export async function createChatSession(input: {
  name?: string;
  email?: string;
  pageUrl?: string;
  userAgent?: string;
}): Promise<ChatSession> {
  const result = await request<{ session: ChatSession }>("internal/sessions", {
    method: "POST",
    body: JSON.stringify(input),
  });
  return result.session;
}

export async function getChatSession(sessionId: string): Promise<ChatSession | null> {
  const result = await request<{ session: ChatSession | null }>(
    `internal/sessions/${encodeURIComponent(sessionId)}`,
  );
  return result.session;
}

export async function getChatSessionMessages(sessionId: string): Promise<{
  session: ChatSession;
  messages: ChatMessage[];
}> {
  return request(`internal/sessions/${encodeURIComponent(sessionId)}/messages`);
}

export async function addChatMessage(input: {
  sessionId: string;
  senderType: "visitor" | "agent";
  agentId?: string | null;
  body: string;
  markReadBy?: "visitor" | "agent";
}): Promise<ChatMessage | null> {
  const result = await request<{ message: ChatMessage | null }>(
    `internal/sessions/${encodeURIComponent(input.sessionId)}/messages`,
    {
      method: "POST",
      body: JSON.stringify(input),
    },
  );
  return result.message;
}

export async function closeChatSession(sessionId: string): Promise<boolean> {
  const result = await request<{ closed: boolean }>(
    `internal/sessions/${encodeURIComponent(sessionId)}/close`,
    { method: "POST" },
  );
  return result.closed;
}

export async function listChatSessions(status: SessionStatus): Promise<ChatSession[]> {
  const result = await request<{ sessions: ChatSession[] }>(
    `internal/admin/sessions?status=${status}`,
  );
  return result.sessions;
}

export async function validateChatAgent(email: string, password: string): Promise<ChatAgent | null> {
  const result = await request<{ agent: ChatAgent | null }>("internal/admin/agents/validate", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  return result.agent;
}

export async function createChatAgentSession(agentId: string, expiresAt: string): Promise<string> {
  const result = await request<{ sessionId: string }>("internal/admin/agent-sessions", {
    method: "POST",
    body: JSON.stringify({ agentId, expiresAt }),
  });
  return result.sessionId;
}

export async function getChatAgentBySession(sessionId: string): Promise<ChatAgent | null> {
  const result = await request<{ agent: ChatAgent | null }>(
    `internal/admin/agent-sessions/${encodeURIComponent(sessionId)}`,
  );
  return result.agent;
}