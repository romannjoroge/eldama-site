import { useCallback } from "react";
import { Form, NavLink } from "react-router";
import { toast } from "sonner";

export type ToastKind = "error" | "success";

export function useToast() {
  const notify = useCallback((message: string, kind: ToastKind = "error") => {
    if (kind === "success") toast.success(message);
    else toast.error(message);
  }, []);

  return { notify };
}

export function AdminNavigation({ title }: { title: string }) {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    "rounded-[7px] px-3 py-2 text-sm font-semibold " + (isActive ? "bg-primary text-white" : "text-ink hover:bg-white/70");

  return (
    <header className="sticky top-0 z-30 border-b border-white/70 bg-white/85 shadow-[0_8px_24px_rgba(15,23,42,0.12)] backdrop-blur">
      <div className="container-site flex min-h-16 flex-wrap items-center justify-between gap-3 py-2">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary">Eldama Command Panel</p>
          <h1 className="text-xl font-semibold">{title}</h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <nav aria-label="Admin pages" className="flex flex-wrap items-center gap-1">
            <NavLink to="/admin/reports" className={linkClass}>Reports</NavLink>
            <NavLink to="/admin/chat" className={linkClass}>Live chat</NavLink>
            <NavLink to="/admin/users" className={linkClass}>Agents</NavLink>
          </nav>
          <Form method="post" action="/admin">
            <input type="hidden" name="intent" value="logout" />
            <button className="btn-outline-ink !h-9 !px-3 !text-[12px]" type="submit">Log out</button>
          </Form>
        </div>
      </div>
    </header>
  );
}

export function AdminPage({ title, children }: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#f6f7fa,#dce3ee)] text-ink">
      <AdminNavigation title={title} />
      {children}
    </div>
  );
}