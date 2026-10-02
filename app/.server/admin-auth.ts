import { createHmac, timingSafeEqual } from "node:crypto";
import { createChatAgentSession, getChatAgentBySession, validateChatAgent } from "./chat-service";
import type { ChatAgent } from "./chat-types";

const SESSION_COOKIE = "eldama_admin";
const SESSION_MAX_AGE = 60 * 60 * 8;

// Legacy env fallback for the analytics login (kept working).
function adminUser() {
  return process.env.ADMIN_USER || "admin";
}

function adminPassword() {
  return process.env.ADMIN_PASSWORD || "1234";
}

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
  return `${SESSION_COOKIE}=${encodeURIComponent(token)}; Path=/admin; HttpOnly; SameSite=Lax; Max-Age=${SESSION_MAX_AGE}`;
}

export function clearAdminSessionCookie() {
  return `${SESSION_COOKIE}=; Path=/admin; HttpOnly; SameSite=Lax; Max-Age=0`;
}

// Resolve the authenticated agent from the request cookie.
export async function getAuthedAgent(request: Request): Promise<ChatAgent | null> {
  const token = parseCookies(request.headers.get("Cookie"))[SESSION_COOKIE];
  if (!token) return null;

  const parts = token.split(".");
  if (parts.length !== 3) return null;

  const [agentId, expiresAtRaw, signature] = parts;
  const expiresAt = Number(expiresAtRaw);
  if (!agentId || !Number.isFinite(expiresAt) || expiresAt < Date.now()) return null;

  const payload = `${agentId}.${expiresAtRaw}`;
  if (!safeEqual(signature, sign(payload))) return null;
  return getChatAgentBySession(agentId);
}

// Legacy: keep the old username/password login for the analytics dashboard.
export function validateAdminCredentials(username: string, password: string) {
  return safeEqual(username, adminUser()) && safeEqual(password, adminPassword());
}

export function createAdminSessionCookie() {
  const expiresAt = Date.now() + SESSION_MAX_AGE * 1000;
  const payload = `${adminUser()}.${expiresAt}`;
  const token = `${payload}.${sign(payload)}`;
  return `${SESSION_COOKIE}=${encodeURIComponent(token)}; Path=/admin; HttpOnly; SameSite=Lax; Max-Age=${SESSION_MAX_AGE}`;
}

export async function isAdminRequest(request: Request) {
  return (await getAuthedAgent(request)) !== null || legacyTokenValid(request);
}

function legacyTokenValid(request: Request) {
  const token = parseCookies(request.headers.get("Cookie"))[SESSION_COOKIE];
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [username, expiresAtRaw, signature] = parts;
  const expiresAt = Number(expiresAtRaw);
  if (!username || !Number.isFinite(expiresAt) || expiresAt < Date.now()) return false;
  const payload = `${username}.${expiresAtRaw}`;
  return username === adminUser() && safeEqual(signature, sign(payload));
}
