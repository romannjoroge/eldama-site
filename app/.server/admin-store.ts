import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export type AnalyticsEventType =
  | "visit"
  | "scroll"
  | "quote_click"
  | "quote_submit"
  | "page_click";

export type AnalyticsEvent = {
  id: string;
  type: AnalyticsEventType;
  sessionId: string;
  path: string;
  title?: string;
  depth?: number;
  target?: string;
  createdAt: string;
};

export type QuoteSubmission = {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  services: string[];
  need: string;
  createdAt: string;
};

export type ChatMessage = {
  id: string;
  roomId: string;
  sender: "visitor" | "admin" | "system";
  name: string;
  text: string;
  createdAt: string;
};

type StoreShape = {
  events: AnalyticsEvent[];
  quotes: QuoteSubmission[];
  chats: ChatMessage[];
};

const storeDir = path.join(process.cwd(), ".eldama-admin");
const storeFile = path.join(storeDir, "store.json");

const emptyStore: StoreShape = {
  events: [],
  quotes: [],
  chats: [],
};

async function readStore(): Promise<StoreShape> {
  try {
    const raw = await readFile(storeFile, "utf8");
    const parsed = JSON.parse(raw) as Partial<StoreShape>;
    return {
      events: Array.isArray(parsed.events) ? parsed.events : [],
      quotes: Array.isArray(parsed.quotes) ? parsed.quotes : [],
      chats: Array.isArray(parsed.chats) ? parsed.chats : [],
    };
  } catch {
    return emptyStore;
  }
}

async function writeStore(store: StoreShape) {
  await mkdir(storeDir, { recursive: true });
  await writeFile(storeFile, JSON.stringify(store, null, 2), "utf8");
}

export async function recordAnalyticsEvent(
  event: Omit<AnalyticsEvent, "id" | "createdAt">,
) {
  const store = await readStore();
  store.events.push({
    ...event,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  });
  store.events = store.events.slice(-5000);
  await writeStore(store);
}

export async function recordQuoteSubmission(
  quote: Omit<QuoteSubmission, "id" | "createdAt">,
) {
  const store = await readStore();
  const submission = {
    ...quote,
    id: `ELD-${Date.now().toString(36).toUpperCase()}`,
    createdAt: new Date().toISOString(),
  };
  store.quotes.push(submission);
  await writeStore(store);
  return submission;
}

export async function getAdminDashboardData() {
  const store = await readStore();
  const sessions = new Map<string, AnalyticsEvent[]>();
  const pageViews = new Map<string, number>();
  const pageClicks = new Map<string, number>();
  const transitions = new Map<string, number>();

  for (const event of store.events) {
    const bucket = sessions.get(event.sessionId) || [];
    bucket.push(event);
    sessions.set(event.sessionId, bucket);

    if (event.type === "visit") {
      pageViews.set(event.path, (pageViews.get(event.path) || 0) + 1);
    }

    if (event.type === "page_click") {
      pageClicks.set(event.path, (pageClicks.get(event.path) || 0) + 1);
    }
  }

  const journeys = [...sessions.entries()]
    .map(([sessionId, events]) => {
      const sorted = events.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
      const visitedPages = sorted
        .filter((event) => event.type === "visit")
        .map((event) => event.path);

      for (let index = 0; index < visitedPages.length - 1; index += 1) {
        const key = `${visitedPages[index]}→${visitedPages[index + 1]}`;
        transitions.set(key, (transitions.get(key) || 0) + 1);
      }

      return {
        sessionId,
        firstSeen: sorted[0]?.createdAt || "",
        lastSeen: sorted.at(-1)?.createdAt || "",
        maxDepth: Math.max(0, ...sorted.map((event) => event.depth || 0)),
        quoteClicked: sorted.some((event) => event.type === "quote_click"),
        quoteSubmitted: sorted.some((event) => event.type === "quote_submit"),
        pages: [...new Set(sorted.map((event) => event.path))],
      };
    })
    .sort((a, b) => b.lastSeen.localeCompare(a.lastSeen))
    .slice(0, 30);

  return {
    totals: {
      visits: store.events.filter((event) => event.type === "visit").length,
      sessions: sessions.size,
      quoteClicks: store.events.filter((event) => event.type === "quote_click").length,
      responses: store.quotes.length,
      chats: new Set(store.chats.map((message) => message.roomId)).size,
      avgDepth: Math.round(
        journeys.reduce((sum, journey) => sum + journey.maxDepth, 0) /
          Math.max(1, journeys.length),
      ),
    },
    pageViews: [...pageViews.entries()]
      .map(([path, count]) => ({ path, count, clicks: pageClicks.get(path) || 0 }))
      .sort((a, b) => b.count - a.count),
    pathExploration: [...transitions.entries()]
      .map(([key, count]) => {
        const [from, to] = key.split("→");
        return { from, to, count };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 12),
    journeys,
    quotes: store.quotes.slice().reverse().slice(0, 30),
    chats: store.chats.slice().reverse().slice(0, 80),
  };
}
