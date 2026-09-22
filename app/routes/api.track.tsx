import { recordAnalyticsEvent, type AnalyticsEventType } from "~/.server/admin-store";

const eventTypes = new Set<AnalyticsEventType>([
  "visit",
  "scroll",
  "quote_click",
  "quote_submit",
  "page_click",
]);

export async function action({ request }: { request: Request }) {
  try {
    const payload = (await request.json()) as {
      type?: AnalyticsEventType;
      sessionId?: string;
      path?: string;
      title?: string;
      depth?: number;
      target?: string;
    };

    if (!payload.type || !eventTypes.has(payload.type) || !payload.sessionId) {
      return Response.json({ ok: false }, { status: 400 });
    }

    await recordAnalyticsEvent({
      type: payload.type,
      sessionId: payload.sessionId,
      path: payload.path || "/",
      title: payload.title?.slice(0, 160),
      depth: Number.isFinite(payload.depth) ? Math.max(0, Math.min(100, payload.depth!)) : undefined,
      target: payload.target?.slice(0, 180),
    });

    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false }, { status: 400 });
  }
}
