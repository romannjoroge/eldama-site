export type SessionStatus = "open" | "closed";

export type ChatSession = {
  id: string;
  visitor_name: string | null;
  visitor_email: string | null;
  page_url: string | null;
  user_agent: string | null;
  status: SessionStatus;
  created_at: string;
  last_message_at: string | null;
  unread_count: number;
  last_message_preview: string | null;
};

export type ChatMessage = {
  id: string;
  sessionId: string;
  senderType: "visitor" | "agent";
  agentId: string | null;
  body: string;
  createdAt: string;
  readAt: string | null;
  agentName?: string | null;
};

export type ChatAgent = {
  id: string;
  email: string;
  name: string | null;
  created_at: string;
};