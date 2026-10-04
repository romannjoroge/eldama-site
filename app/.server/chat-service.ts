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

async function request<T>(path: string, init: RequestInit = {}, accessToken = serviceToken): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${accessToken}`);
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

export async function getChatSession(sessionId: string, accessToken?: string): Promise<ChatSession | null> {
  const result = await request<{ session: ChatSession | null }>(
    `internal/sessions/${encodeURIComponent(sessionId)}`,
    {},
    accessToken,
  );
  return result.session;
}

export async function getChatSessionMessages(sessionId: string, accessToken?: string): Promise<{
  session: ChatSession;
  messages: ChatMessage[];
}> {
  return request(`api/sessions/${encodeURIComponent(sessionId)}/messages`, {}, accessToken);
}

export async function addChatMessage(input: {
  id?: string;
  sessionId: string;
  senderType: "visitor" | "agent";
  agentId?: string | null;
  body: string;
  markReadBy?: "visitor" | "agent";
}, accessToken?: string): Promise<ChatMessage | null> {
  const result = await request<{ message: ChatMessage | null }>(
    `api/sessions/${encodeURIComponent(input.sessionId)}/messages`,
    {
      method: "POST",
      body: JSON.stringify(input),
    },
    accessToken,
  );
  return result.message;
}

export async function closeChatSession(sessionId: string, accessToken?: string): Promise<boolean> {
  const result = await request<{ closed: boolean }>(
    `internal/sessions/${encodeURIComponent(sessionId)}/close`,
    { method: "POST" },
    accessToken,
  );
  return result.closed;
}

export async function listChatSessions(status: SessionStatus, accessToken?: string): Promise<ChatSession[]> {
  const result = await request<{ sessions: ChatSession[] }>(
    `internal/admin/sessions?status=${status}`,
    {},
    accessToken,
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
    {},
    sessionId,
  );
  return result.agent;
}

export async function markChatSessionRead(sessionId: string, accessToken?: string): Promise<boolean> {
  const result = await request<{ read: boolean }>(
    `internal/sessions/${encodeURIComponent(sessionId)}/read`,
    { method: "POST" },
    accessToken,
  );
  return result.read;
}

export async function listChatAgents(accessToken?: string): Promise<ChatAgent[]> {
  const result = await request<{ agents: ChatAgent[] }>("internal/admin/agents", {}, accessToken);
  return result.agents;
}

export async function createChatAgent(input: { name: string; email: string; password: string }, accessToken?: string): Promise<ChatAgent> {
  const result = await request<{ agent: ChatAgent }>("internal/admin/agents", {
    method: "POST",
    body: JSON.stringify(input),
  }, accessToken);
  return result.agent;
}

export async function updateChatAgent(id: string, input: { name: string; email: string; password?: string }, accessToken?: string): Promise<ChatAgent> {
  const result = await request<{ agent: ChatAgent }>(`internal/admin/agents/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  }, accessToken);
  return result.agent;
}

export async function deleteChatAgent(id: string, accessToken?: string): Promise<void> {
  await request(`internal/admin/agents/${encodeURIComponent(id)}`, { method: "DELETE" }, accessToken);
}