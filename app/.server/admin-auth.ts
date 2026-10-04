import { createHmac, timingSafeEqual } from "node:crypto";
import { createChatAgentSession, getChatAgentBySession, validateChatAgent } from "./chat-service";
import type { ChatAgent } from "./chat-types";

const SESSION_COOKIE = "eldama_admin";
const SESSION_MAX_AGE = 60 * 60 * 24;

function sessionSecret() {
  return process.env.ADMIN_SESSION_SECRET || "eldama-dev-admin-secret";
}

function sign(value: string) {
  return createHmac("sha256", sessionSecret()).update(value).digest("base64url");
}

function safeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

function parseCookies(header: string | null) {
  return Object.fromEntries(
    (header || "")
      .split(";")
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => {
        const index = part.indexOf("=");
        return index === -1
          ? [part, ""]
          : [part.slice(0, index), decodeURIComponent(part.slice(index + 1))];
      }),
  );
}

// Validate email+password against the agents table.
export async function validateAgentCredentials(email: string, password: string): Promise<ChatAgent | null> {
  return validateChatAgent(email, password);
}

export async function createAgentSessionCookie(agentId: string) {
  const expiresAtMs = Date.now() + SESSION_MAX_AGE * 1000;
  const agentSessionId = await createChatAgentSession(agentId, new Date(expiresAtMs).toISOString());
  const payload = `${agentSessionId}.${expiresAtMs}`;
  const token = `${payload}.${sign(payload)}`;
  return `${SESSION_COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_MAX_AGE}`;
}

export function clearAdminSessionCookie() {
  return [
    `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`,
    `${SESSION_COOKIE}=; Path=/admin; HttpOnly; SameSite=Lax; Max-Age=0`,
  ];
}

export function getAgentAccessToken(request: Request): string | null {
  const token = parseCookies(request.headers.get("Cookie"))[SESSION_COOKIE];
  if (!token) return null;

  const parts = token.split(".");
  if (parts.length !== 3) return null;

  const [agentSessionId, expiresAtRaw, signature] = parts;
  const expiresAt = Number(expiresAtRaw);
  if (!agentSessionId || !Number.isFinite(expiresAt) || expiresAt < Date.now()) return null;

  const payload = `${agentSessionId}.${expiresAtRaw}`;
  if (!safeEqual(signature, sign(payload))) return null;
  return agentSessionId;
}

// Resolve the authenticated agent by asking Bun to validate the bearer token.
export async function getAuthedAgent(request: Request): Promise<ChatAgent | null> {
  const accessToken = getAgentAccessToken(request);
  if (!accessToken) return null;
  return getChatAgentBySession(accessToken);
}

export async function isAgentRequest(request: Request) {
  return (await getAuthedAgent(request)) !== null;
}

export async function isAdminRequest(request: Request) {
  return (await getAuthedAgent(request))?.is_admin === true;
}
