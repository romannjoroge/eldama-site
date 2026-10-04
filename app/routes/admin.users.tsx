import { useEffect } from "react";
import { redirect, useFetcher } from "react-router";

import type { Route } from "./+types/admin.users";
import { AdminPage, useToast } from "~/components/admin-ui";
import { getAgentAccessToken } from "~/.server/admin-auth";
import {
  ChatServiceError,
  createChatAgent,
  deleteChatAgent,
  listChatAgents,
  updateChatAgent,
} from "~/.server/chat-service";
import type { ChatAgent } from "~/.server/chat-types";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

type AgentActionData = {
  ok: boolean;
  message?: string;
  error?: string;
};

export async function loader({ request }: Route.LoaderArgs) {
  const agentToken = getAgentAccessToken(request);
  if (!agentToken) throw redirect("/admin");
  try {
    return { agents: await listChatAgents(agentToken), error: null as string | null };
  } catch (error) {
    return {
      agents: [] as ChatAgent[],
      error: error instanceof Error ? error.message : "Could not load agents.",
    };
  }
}

export async function action({ request }: Route.ActionArgs) {
  const agentToken = getAgentAccessToken(request);
  if (!agentToken) {
    return json({ ok: false, error: "You are not authorized to manage agents." }, 401);
  }

  const data = await request.formData();
  const intent = String(data.get("intent") || "");
  try {
    if (intent === "create") {
      await createChatAgent({
        name: String(data.get("name") || "").trim(),
        email: String(data.get("email") || "").trim(),
        password: String(data.get("password") || ""),
      }, agentToken);
      return json({ ok: true, message: "Agent created." });
    }

    if (intent === "update") {
      const id = String(data.get("id") || "");
      await updateChatAgent(id, {
        name: String(data.get("name") || "").trim(),
        email: String(data.get("email") || "").trim(),
        password: String(data.get("password") || ""),
      }, agentToken);
      return json({ ok: true, message: "Agent updated." });
    }

    if (intent === "delete") {
      await deleteChatAgent(String(data.get("id") || ""), agentToken);
      return json({ ok: true, message: "Agent removed." });
    }

    return json({ ok: false, error: "Unknown agent action." }, 400);
  } catch (error) {
    const status = error instanceof ChatServiceError ? error.status : 500;
    return json({
      ok: false,
      error: error instanceof Error ? error.message : "Agent action failed.",
    }, status);
  }
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Agents - Eldama Admin" },
    { name: "robots", content: "noindex,nofollow" },
  ];
}

export default function AdminUsers({ loaderData }: Route.ComponentProps) {
  const fetcher = useFetcher<AgentActionData>();
  const { notify } = useToast();

  useEffect(() => {
    if (loaderData.error) notify(loaderData.error, "error");
  }, [loaderData.error, notify]);

  useEffect(() => {
    if (!fetcher.data) return;
    if (fetcher.data.ok) notify(fetcher.data.message || "Agent saved.", "success");
    else notify(fetcher.data.error || "Agent action failed.", "error");
  }, [fetcher.data, notify]);

  return (
    <AdminPage title="Agents">
      <main className="container-site grid gap-6 py-8 xl:grid-cols-[minmax(300px,0.7fr)_minmax(0,1.3fr)]">
        <section className="rounded-[14px] border border-white/80 bg-white/75 p-5 shadow-[0_8px_22px_rgba(15,23,42,0.1)]">
          <h2 className="text-lg font-semibold">Create agent</h2>
          <fetcher.Form method="post" className="mt-4 space-y-4">
            <input type="hidden" name="intent" value="create" />
            <label className="block text-sm font-semibold">
              Name
              <input name="name" required autoComplete="name" className="input mt-1.5 w-full" />
            </label>
            <label className="block text-sm font-semibold">
              Email
              <input name="email" required type="email" autoComplete="email" className="input mt-1.5 w-full" />
            </label>
            <label className="block text-sm font-semibold">
              Temporary password
              <input name="password" required minLength={8} type="password" autoComplete="new-password" className="input mt-1.5 w-full" />
            </label>
            <button type="submit" className="btn-primary w-full" disabled={fetcher.state !== "idle"}>
              {fetcher.state !== "idle" ? "Saving..." : "Create agent"}
            </button>
          </fetcher.Form>
        </section>

        <section className="min-w-0 rounded-[14px] border border-white/80 bg-white/75 p-5 shadow-[0_8px_22px_rgba(15,23,42,0.1)]">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">Manage agents</h2>
            <span className="text-sm text-graphite">{loaderData.agents.length} total</span>
          </div>
          {loaderData.agents.length === 0 ? (
            <p className="mt-4 rounded-[10px] border border-dashed border-[#b9c4d2] bg-white/55 p-3 text-sm text-graphite">
              No agents found.
            </p>
          ) : (
            <div className="mt-4 space-y-3">
              {loaderData.agents.map((agent) => (
                <article key={agent.id} className="rounded-[10px] border border-hairline bg-white p-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <fetcher.Form method="post" className="grid gap-3 sm:grid-cols-2 sm:col-span-2">
                    <input type="hidden" name="intent" value="update" />
                    <input type="hidden" name="id" value={agent.id} />
                    <label className="block text-sm font-semibold">
                      Name
                      <input name="name" required defaultValue={agent.name || ""} className="input mt-1.5 w-full" />
                    </label>
                    <label className="block text-sm font-semibold">
                      Email
                      <input name="email" required type="email" defaultValue={agent.email} className="input mt-1.5 w-full" />
                    </label>
                    <label className="block text-sm font-semibold sm:col-span-2">
                      Reset password
                      <input name="password" minLength={8} type="password" autoComplete="new-password" placeholder="Leave blank to keep current password" className="input mt-1.5 w-full" />
                    </label>
                    <div className="flex flex-wrap items-center gap-2 sm:col-span-2">
                      <button type="submit" className="btn-primary !h-9 !px-4 !text-[12px]" disabled={fetcher.state !== "idle"}>
                        Save changes
                      </button>
                    </div>
                    </fetcher.Form>
                    <fetcher.Form method="post" className="sm:col-span-2">
                      <input type="hidden" name="intent" value="delete" />
                      <input type="hidden" name="id" value={agent.id} />
                      <button type="submit" className="btn-outline-ink !h-9 !px-4 !text-[12px]" disabled={fetcher.state !== "idle"}>
                        Remove agent
                      </button>
                    </fetcher.Form>
                  </div>
                  <p className="mt-2 break-all text-[11px] text-graphite">ID: {agent.id}</p>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </AdminPage>
  );
}
