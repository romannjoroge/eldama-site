// Email notification for new conversations (spec §3.8).
// Uses Resend when RESEND_API_KEY + SUPPORT_EMAIL are configured,
// otherwise logs the notification (so it never blocks or fails the flow).

import { type ChatMessage, type ChatSession } from "./chat-types";

const RESEND_API_KEY = process.env.RESEND_API_KEY || "";
const FROM_EMAIL = process.env.SUPPORT_EMAIL || "";
const TO_EMAIL = process.env.SUPPORT_EMAIL || "";

export async function notifyFirstMessage(
  message: ChatMessage,
  session: ChatSession,
): Promise<void> {
  const subject = `New support chat from ${session.visitor_name || "a visitor"}`;
  const text = [
    `New conversation: ${session.id}`,
    `Name: ${session.visitor_name || "—"}`,
    `Email: ${session.visitor_email || "—"}`,
    `Page: ${session.page_url || "—"}`,
    "",
    `Message: ${message.body}`,
    "",
    `Reply in the admin console: /admin`,
  ].join("\n");

  if (!RESEND_API_KEY || !FROM_EMAIL || !TO_EMAIL) {
    console.log(
      `[email] stub notify ${TO_EMAIL || "(no support email set)"} — ${subject} — ${message.body.slice(0, 80)}`,
    );
    return;
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [TO_EMAIL],
        subject,
        text,
      }),
    });
    if (!res.ok) {
      console.log(`[email] resend failed (${res.status}) — ${await res.text()}`);
    }
  } catch (error) {
    console.log(`[email] send failed: ${error}`);
  }
}
