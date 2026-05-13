import { createFileRoute, useNavigate, Outlet, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAdminAuth } from "@/hooks/use-admin-auth";
import { AdminShell } from "@/components/admin/AdminShell";
import { Overview } from "@/components/admin/Overview";

export const Route = createFileRoute("/admin/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard | Achiever Gym Admin" }, { name: "robots", content: "noindex" }] }),
  component: AdminDashboardLayout,
});

function AdminDashboardLayout() {
  const nav = useNavigate();
  const { loading, isAdmin } = useAdminAuth();
  const path = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (!loading && !isAdmin) nav({ to: "/admin" });
  }, [loading, isAdmin, nav]);

  if (loading) {
    return <div className="min-h-screen bg-background text-foreground flex items-center justify-center">Loading…</div>;
  }
  if (!isAdmin) return null;

  const isRoot = path === "/admin/dashboard" || path === "/admin/dashboard/";

  return (
    <AdminShell>
      {isRoot ? <Overview /> : <Outlet />}
    </AdminShell>
  );
}
