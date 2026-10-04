import { useEffect } from "react";
import { redirect, useFetcher } from "react-router";

import type { Route } from "./+types/admin.profile";
import { AdminPage, useToast } from "~/components/admin-ui";
import { getAgentAccessToken, getAuthedAgent } from "~/.server/admin-auth";
import { ChatServiceError, getChatAgentProfile, updateChatAgentProfile } from "~/.server/chat-service";
import type { ChatAgent } from "~/.server/chat-types";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

type ProfileActionData = {
  ok: boolean;
  message?: string;
  error?: string;
};

export async function loader({ request }: Route.LoaderArgs) {
  const token = getAgentAccessToken(request);
  if (!token || !(await getAuthedAgent(request))) throw redirect("/admin");
  try {
    return { agent: await getChatAgentProfile(token), error: null as string | null };
  } catch (error) {
    return {
      agent: null as ChatAgent | null,
      error: error instanceof Error ? error.message : "Could not load your profile.",
    };
  }
}

export async function action({ request }: Route.ActionArgs) {
  const token = getAgentAccessToken(request);
  if (!token || !(await getAuthedAgent(request))) {
    return json({ ok: false, error: "Your session expired. Sign in again." }, 401);
  }

  const form = await request.formData();
  const password = String(form.get("password") || "");
  try {
    await updateChatAgentProfile({
      name: String(form.get("name") || "").trim(),
      email: String(form.get("email") || "").trim(),
      password,
    }, token);
    return json({ ok: true, message: "Profile updated." });
  } catch (error) {
    return json({
      ok: false,
      error: error instanceof ChatServiceError || error instanceof Error
        ? error.message
        : "Could not update your profile.",
    }, error instanceof ChatServiceError ? error.status : 500);
  }
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Profile Settings - Eldama Admin" },
    { name: "robots", content: "noindex,nofollow" },
  ];
}

export default function AdminProfile({ loaderData }: Route.ComponentProps) {
  const fetcher = useFetcher<ProfileActionData>();
  const { notify } = useToast();
  const agent = loaderData?.agent;

  useEffect(() => {
    if (loaderData?.error) notify(loaderData.error, "error");
  }, [loaderData?.error, notify]);

  useEffect(() => {
    if (!fetcher.data) return;
    if (fetcher.data.ok) notify(fetcher.data.message || "Profile updated.", "success");
    else notify(fetcher.data.error || "Could not update your profile.", "error");
  }, [fetcher.data, notify]);

  return (
    <AdminPage title="Profile settings" isAdmin={agent?.is_admin === true}>
      <main className="container-site py-8">
        <section className="max-w-2xl rounded-[14px] border border-white/80 bg-white/75 p-5 shadow-[0_8px_22px_rgba(15,23,42,0.1)]">
          <h2 className="text-lg font-semibold">Your account</h2>
          {agent && (
            <fetcher.Form method="post" className="mt-4 space-y-4">
              <label className="block text-sm font-semibold">
                Name
                <input name="name" required autoComplete="name" defaultValue={agent.name || ""} className="input mt-1.5 w-full" />
              </label>
              <label className="block text-sm font-semibold">
                Email
                <input name="email" required type="email" autoComplete="email" defaultValue={agent.email} className="input mt-1.5 w-full" />
              </label>
              <label className="block text-sm font-semibold">
                New password
                <input name="password" type="password" minLength={8} autoComplete="new-password" className="input mt-1.5 w-full" aria-describedby="profile-password-help" />
                <span id="profile-password-help" className="mt-1 block font-normal text-graphite">Leave blank to keep your current password.</span>
              </label>
              <button type="submit" className="btn-primary" disabled={fetcher.state !== "idle"}>
                {fetcher.state === "idle" ? "Save profile" : "Saving..."}
              </button>
            </fetcher.Form>
          )}
        </section>
      </main>
    </AdminPage>
  );
}
