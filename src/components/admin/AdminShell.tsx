import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Sparkles, MessageSquare, ClipboardList, LogOut, Menu, X, Dumbbell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const NAV = [
  { to: "/admin/dashboard", label: "Overview", icon: LayoutDashboard },
  { to: "/admin/dashboard/free-trials", label: "Free Trials", icon: Sparkles },
  { to: "/admin/dashboard/contact", label: "Contact Queries", icon: MessageSquare },
  { to: "/admin/dashboard/memberships", label: "Memberships", icon: ClipboardList },
] as const;

export function AdminShell({ children }: { children: ReactNode }) {
  const nav = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

  async function logout() {
    await supabase.auth.signOut();
    toast.success("Signed out");
    nav({ to: "/admin" });
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-40 w-64 bg-card border-r border-border flex flex-col transition-transform",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="h-16 px-5 flex items-center gap-2 border-b border-border">
          <Dumbbell className="h-5 w-5 text-primary" />
          <Link to="/" className="text-display text-xl">
            ACHI<span className="neon-text">EVER</span>
          </Link>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {NAV.map((n) => {
            const active = path === n.to;
            return (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                  active
                    ? "bg-primary text-primary-foreground font-bold"
                    : "text-foreground/80 hover:bg-muted hover:text-foreground"
                )}
              >
                <n.icon className="h-4 w-4" />
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-border">
          <Button variant="outline" className="w-full justify-start gap-2" onClick={logout}>
            <LogOut className="h-4 w-4" /> Logout
          </Button>
        </div>
      </aside>

      {/* Mobile backdrop */}
      {open && (
        <div className="fixed inset-0 bg-black/60 z-30 lg:hidden" onClick={() => setOpen(false)} />
      )}

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="h-16 border-b border-border flex items-center justify-between px-4 lg:px-6 bg-background/80 backdrop-blur sticky top-0 z-20">
          <button className="lg:hidden p-2" onClick={() => setOpen((v) => !v)} aria-label="Toggle menu">
            {open ? <X /> : <Menu />}
          </button>
          <div className="text-sm text-muted-foreground">Admin Dashboard</div>
          <div />
        </header>
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
