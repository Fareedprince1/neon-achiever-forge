import { createFileRoute, Outlet, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminShell } from "@/components/admin/AdminShell";
import { Overview } from "@/components/admin/Overview";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/admin/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard | Achiever Gym Admin" }, { name: "robots", content: "noindex" }] }),
  component: AdminDashboardLayout,
});

function AdminDashboardLayout() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [state, setState] = useState<"checking" | "ok" | "denied">("checking");

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const { data: { session }, error: sessErr } = await supabase.auth.getSession();
        if (sessErr) throw sessErr;
        if (!active) return;
        const userId = session?.user?.id;
        if (!userId) {
          console.warn("[admin.dashboard] no session found");
          setState("denied");
          return;
        }
        const { data, error } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", userId)
          .eq("role", "admin")
          .maybeSingle();
        if (error) throw error;
        if (!active) return;
        setState(data ? "ok" : "denied");
      } catch (e) {
        console.error("[admin.dashboard] auth check failed:", e);
        if (active) setState("denied");
      }
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        window.location.href = "/admin";
      }
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  if (state === "checking") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (state === "denied") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md text-center space-y-4">
          <h1 className="text-2xl font-bold">Access Denied</h1>
          <p className="text-muted-foreground text-sm">
            You're either not signed in or your account doesn't have admin access.
            Check the browser console for details.
          </p>
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              window.location.href = "/admin";
            }}
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  const isRoot = path === "/admin/dashboard" || path === "/admin/dashboard/";

  return (
    <AdminShell>
      {isRoot ? <Overview /> : <Outlet />}
    </AdminShell>
  );
}
