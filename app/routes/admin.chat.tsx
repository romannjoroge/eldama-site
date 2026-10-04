import { useEffect } from "react";
import { redirect } from "react-router";

import type { Route } from "./+types/admin.chat";
import { AdminPage, useToast } from "~/components/admin-ui";
import { getAgentAccessToken, getAuthedAgent, isAgentRequest } from "~/.server/admin-auth";
import { listChatSessions } from "~/.server/chat-service";
import type { ChatSession } from "~/.server/chat-types";
import { AgentChat } from "./admin";

export async function loader({ request }: Route.LoaderArgs) {
  const agentToken = getAgentAccessToken(request);
  if (!agentToken || !(await isAgentRequest(request))) throw redirect("/admin");
  const agent = await getAuthedAgent(request);
  if (!agent) throw redirect("/admin");
  try {
    const [open, closed] = await Promise.all([
      listChatSessions("open", agentToken),
      listChatSessions("closed", agentToken),
    ]);
    return { open, closed, agentToken, isAdmin: agent.is_admin, error: null as string | null };
  } catch (error) {
    return {
      open: [] as ChatSession[],
      closed: [] as ChatSession[],
      agentToken,
      isAdmin: agent.is_admin,
      error: error instanceof Error ? error.message : "Could not load chat sessions.",
    };
  }
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Live Chat - Eldama Admin" },
    { name: "robots", content: "noindex,nofollow" },
  ];
}

export default function AdminChat({ loaderData }: Route.ComponentProps) {
  const { notify } = useToast();
  const data = loaderData ?? {
    open: [] as ChatSession[],
    closed: [] as ChatSession[],
    agentToken: "",
    isAdmin: false,
    error: "Could not load chat sessions.",
  };

  useEffect(() => {
    if (data.error) notify(data.error, "error");
  }, [data.error, notify]);

  return (
    <AdminPage title="Live chat" isAdmin={data.isAdmin}>
      <main className="container-site py-8">
        <AgentChat
          open={data.open}
          closed={data.closed}
          agentToken={data.agentToken}
          notify={notify}
        />
      </main>
    </AdminPage>
  );
}
