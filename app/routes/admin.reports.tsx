import { redirect } from "react-router";

import type { Route } from "./+types/admin.reports";
import { isAdminRequest } from "~/.server/admin-auth";
import { getAdminDashboardData } from "~/.server/admin-store";
import { Dashboard } from "./admin";

export async function loader({ request }: Route.LoaderArgs) {
  if (!(await isAdminRequest(request))) throw redirect("/admin");
  return { data: await getAdminDashboardData() };
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Reports - Eldama Admin" },
    { name: "robots", content: "noindex,nofollow" },
  ];
}

export default function AdminReports({ loaderData }: Route.ComponentProps) {
  if (!loaderData) return null;
  return <Dashboard data={loaderData.data} />;
}