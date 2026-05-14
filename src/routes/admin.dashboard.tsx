import { createFileRoute, useNavigate, Outlet, useRouterState } from "@tanstack/react-router";
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
  const nav = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [state, setState] = useState<"checking" | "ok" | "denied">("checking");

  useEffect(() => {
    let active = true;

    const check = async (userId: string | null) => {
      if (!userId) {
        if (active) {
          setState("denied");
          nav({ to: "/admin" });
        }
        return;
      }
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .eq("role", "admin")
        .maybeSingle();
      if (!active) return;
      if (data) setState("ok");
      else {
        setState("denied");
        nav({ to: "/admin" });
      }
    };

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        nav({ to: "/admin" });
      } else {
        setTimeout(() => check(session?.user?.id ?? null), 0);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      check(session?.user?.id ?? null);
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [nav]);

  if (state !== "ok") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
