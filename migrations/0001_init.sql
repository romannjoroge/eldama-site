-- 0001_init.sql
-- Support chat MVP schema. Four tables, minimal on purpose (see chat.md).

CREATE TABLE IF NOT EXISTS sessions (
  id              TEXT PRIMARY KEY,          -- uuid
  visitor_name    TEXT,
  visitor_email   TEXT,
  page_url        TEXT,
  user_agent      TEXT,
  status          TEXT NOT NULL DEFAULT 'open',  -- 'open' | 'closed'
  created_at      TEXT NOT NULL,
  last_message_at TEXT
);

CREATE TABLE IF NOT EXISTS messages (
  id              TEXT PRIMARY KEY,          -- uuid
  session_id      TEXT NOT NULL REFERENCES sessions(id),
  sender_type     TEXT NOT NULL,             -- 'visitor' | 'agent'
  agent_id        TEXT REFERENCES agents(id),
  body            TEXT NOT NULL,
  created_at      TEXT NOT NULL,
  read_at         TEXT
);

CREATE TABLE IF NOT EXISTS agents (
  id              TEXT PRIMARY KEY,          -- uuid
  email           TEXT NOT NULL UNIQUE,
  password_hash   TEXT NOT NULL,
  name            TEXT,
  created_at      TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS agent_sessions (
  id              TEXT PRIMARY KEY,          -- uuid
  agent_id        TEXT NOT NULL REFERENCES agents(id),
  expires_at      TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_messages_session ON messages(session_id, created_at);
CREATE INDEX IF NOT EXISTS idx_sessions_status_last ON sessions(status, last_message_at);
CREATE INDEX IF NOT EXISTS idx_agent_sessions_agent ON agent_sessions(agent_id);
