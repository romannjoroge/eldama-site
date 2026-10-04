import { redirect } from "react-router";

import type { Route } from "./+types/admin.reports";
import { getAuthedAgent, isAgentRequest } from "~/.server/admin-auth";
import { getAdminDashboardData } from "~/.server/admin-store";
import { Dashboard } from "./admin";

export async function loader({ request }: Route.LoaderArgs) {
  if (!(await isAgentRequest(request))) throw redirect("/admin");
  const agent = await getAuthedAgent(request);
  return { data: await getAdminDashboardData(), isAdmin: agent?.is_admin === true };
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Reports - Eldama Admin" },
    { name: "robots", content: "noindex,nofollow" },
  ];
}

export default function AdminReports({ loaderData }: Route.ComponentProps) {
  if (!loaderData) return null;
  return <Dashboard data={loaderData.data} isAdmin={loaderData.isAdmin} />;
}