import { createFileRoute, useNavigate, Outlet } from "@tanstack/react-router";
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

  useEffect(() => {
    if (!loading && !isAdmin) nav({ to: "/admin" });
  }, [loading, isAdmin, nav]);

  if (loading) {
    return <div className="min-h-screen bg-background text-foreground flex items-center justify-center">Loading…</div>;
  }
  if (!isAdmin) return null;

  return (
    <AdminShell>
      <RouteOrOverview />
    </AdminShell>
  );
}

function RouteOrOverview() {
  // If a child route is matched, TanStack renders Outlet; otherwise show overview.
  return (
    <>
      <OutletOrOverview />
    </>
  );
}

function OutletOrOverview() {
  // We render Outlet; child index route shows Overview. For root /admin/dashboard show Overview directly.
  const path = typeof window !== "undefined" ? window.location.pathname : "";
  if (path === "/admin/dashboard" || path === "/admin/dashboard/") return <Overview />;
  return <Outlet />;
}
