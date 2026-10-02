import { createHash, timingSafeEqual } from "node:crypto";
import { Database } from "bun:sqlite";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const dataDir = path.join(import.meta.dir, "..", "data");
const dbPath = process.env.CHAT_DB_PATH || path.join(dataDir, "chat.sqlite");
await mkdir(path.dirname(dbPath), { recursive: true });

export const db = new Database(dbPath);
db.run("PRAGMA foreign_keys = ON");
db.run("PRAGMA journal_mode = WAL");

export function sanitizeText(value) {
  return String(value ?? "")
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 2000);
}

export function createSession(input) {
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  db.query(
    `INSERT INTO sessions (id, visitor_name, visitor_email, page_url, user_agent, status, created_at, last_message_at)
     VALUES (?, ?, ?, ?, ?, 'open', ?, ?)`,
  ).run(
    id,
    sanitizeText(input.name || ""),
    sanitizeText(input.email || ""),
    sanitizeText(input.pageUrl || ""),
    sanitizeText(input.userAgent || ""),
    now,
    now,
  );
  return mapSession(db.query("SELECT * FROM sessions WHERE id = ?").get(id));
}

export function getSession(id) {
  const row = db.query("SELECT * FROM sessions WHERE id = ?").get(id);
  return row ? mapSession(row) : null;
}

export function listSessions(status) {
  const rows = db.query(
    `SELECT s.*,
            (SELECT COUNT(*) FROM messages m WHERE m.session_id = s.id AND m.sender_type = 'visitor' AND m.read_at IS NULL) AS unread_count,
            (SELECT m2.body FROM messages m2 WHERE m2.session_id = s.id ORDER BY m2.created_at DESC, m2.rowid DESC LIMIT 1) AS last_message_preview
     FROM sessions s
     WHERE s.status = ?
     ORDER BY COALESCE(s.last_message_at, s.created_at) DESC`,
  ).all(status);
  return rows.map(mapSession);
}

export function getSessionMessages(sessionId) {
  return db.query(
    `SELECT m.*, a.name AS agent_name
     FROM messages m
     LEFT JOIN agents a ON a.id = m.agent_id
     WHERE m.session_id = ?
     ORDER BY m.created_at ASC, m.rowid ASC`,
  ).all(sessionId).map(mapMessage);
}

export function addMessage(input) {
  const session = getSession(input.sessionId);
  if (!session) return null;

  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  const readAt = input.markReadBy ? now : null;
  db.query(
    `INSERT INTO messages (id, session_id, sender_type, agent_id, body, created_at, read_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    id,
    input.sessionId,
    input.senderType,
    input.agentId ? String(input.agentId) : null,
    sanitizeText(input.body),
    now,
    readAt,
  );
  db.query("UPDATE sessions SET last_message_at = ? WHERE id = ?").run(now, input.sessionId);
  return getSessionMessages(input.sessionId).find((message) => message.id === id) || null;
}

export function closeSession(sessionId) {
  const result = db.query("UPDATE sessions SET status = 'closed' WHERE id = ? AND status = 'open'").run(sessionId);
  return result.changes > 0;
}

export function findAgentByEmail(email) {
  const row = db.query("SELECT * FROM agents WHERE email = ?").get(sanitizeText(email).toLowerCase());
  return row ? mapAgent(row) : null;
}

export function createAgent(input) {
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  db.query("INSERT INTO agents (id, email, password_hash, name, created_at) VALUES (?, ?, ?, ?, ?)").run(
    id,
    sanitizeText(input.email).toLowerCase(),
    input.passwordHash,
    sanitizeText(input.name || ""),
    now,
  );
  return findAgentByEmail(input.email);
}

export function hashPassword(password) {
  const salt = crypto.randomUUID();
  const hash = createHash("sha256").update(salt + password).digest("hex");
  return `${salt}:${hash}`;
}

export function validateAgentCredentials(email, password) {
  const agent = findAgentByEmail(email);
  if (!agent) return null;
  const [salt, storedHash] = agent.password_hash.split(":");
  if (!salt || !storedHash) return null;
  const candidate = createHash("sha256").update(salt + password).digest("hex");
  const stored = Buffer.from(storedHash);
  const actual = Buffer.from(candidate);
  if (stored.length !== actual.length || !timingSafeEqual(stored, actual)) return null;
  return publicAgent(agent);
}

export function createAgentSession(agentId, expiresAt) {
  const id = crypto.randomUUID();
  db.query("INSERT INTO agent_sessions (id, agent_id, expires_at) VALUES (?, ?, ?)").run(id, agentId, expiresAt);
  return id;
}

export function getAgentBySession(sessionId) {
  const row = db.query(
    `SELECT a.* FROM agent_sessions s
     JOIN agents a ON a.id = s.agent_id
     WHERE s.id = ? AND s.expires_at > ?`,
  ).get(sessionId, new Date().toISOString());
  return row ? publicAgent(mapAgent(row)) : null;
}

function publicAgent(agent) {
  return {
    id: agent.id,
    email: agent.email,
    name: agent.name,
    created_at: agent.created_at,
  };
}

function mapSession(row) {
  return {
    id: String(row.id),
    visitor_name: row.visitor_name ? String(row.visitor_name) : null,
    visitor_email: row.visitor_email ? String(row.visitor_email) : null,
    page_url: row.page_url ? String(row.page_url) : null,
    user_agent: row.user_agent ? String(row.user_agent) : null,
    status: row.status === "closed" ? "closed" : "open",
    created_at: String(row.created_at),
    last_message_at: row.last_message_at ? String(row.last_message_at) : null,
    unread_count: Number(row.unread_count ?? 0),
    last_message_preview: row.last_message_preview ? String(row.last_message_preview) : null,
  };
}

function mapMessage(row) {
  return {
    id: String(row.id),
    sessionId: String(row.session_id),
    senderType: row.sender_type === "agent" ? "agent" : "visitor",
    agentId: row.agent_id ? String(row.agent_id) : null,
    body: String(row.body),
    createdAt: String(row.created_at),
    readAt: row.read_at ? String(row.read_at) : null,
    agentName: row.agent_name ? String(row.agent_name) : null,
  };
}

function mapAgent(row) {
  return {
    id: String(row.id),
    email: String(row.email),
    password_hash: String(row.password_hash),
    name: row.name ? String(row.name) : null,
    created_at: String(row.created_at),
  };
}