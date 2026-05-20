import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  IdCard,
  Sparkles,
  ClipboardList,
  LogOut,
  Menu,
  X,
  Dumbbell,
  CalendarDays,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const NAV = [
  { to: "/admin/dashboard", label: "Overview", icon: LayoutDashboard },
  { to: "/admin/dashboard/members", label: "Members", icon: IdCard },
  { to: "/admin/dashboard/free-trials", label: "Free Trials", icon: Sparkles },
  { to: "/admin/dashboard/memberships", label: "Memberships", icon: ClipboardList },
  { to: "/admin/dashboard/schedule", label: "Class Schedule", icon: CalendarDays },
  { to: "/admin/dashboard/testimonials", label: "Testimonials", icon: Star },
] as const;

export function AdminShell({ children }: { children: ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);

  async function logout() {
    await supabase.auth.signOut();
    toast.success("Signed out");
    window.location.href = "/admin";
  }

  const currentLabel = NAV.find((n) => n.to === path)?.label ?? "Dashboard";

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-40 w-[220px] bg-card border-r border-border flex flex-col transition-transform",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="px-5 py-4 border-b-2 border-primary/50 flex items-center gap-2">
          <Dumbbell className="h-5 w-5 text-primary" />
          <Link to="/" className="text-display text-xl">
            ACHI<span className="neon-text">EVER</span>
          </Link>
        </div>
        <div className="px-4 py-4 border-b border-border flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground grid place-items-center font-bold text-sm">
            GA
          </div>
          <div>
            <div className="text-sm font-semibold leading-tight">Gym Admin</div>
            <div className="text-[11px] text-muted-foreground">Admin</div>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {NAV.map((n) => {
            const active = path === n.to || (n.to !== "/admin/dashboard" && path.startsWith(n.to));
            return (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors border-l-[3px]",
                  active
                    ? "bg-primary text-primary-foreground font-bold border-primary"
                    : "text-foreground/80 border-transparent hover:bg-muted hover:text-foreground hover:border-primary",
                )}
              >
                <n.icon className="h-4 w-4" />
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-border">
          <Button
            variant="outline"
            className="w-full justify-start gap-2"
            onClick={() => setConfirmLogout(true)}
          >
            <LogOut className="h-4 w-4" /> Logout
          </Button>
        </div>
      </aside>

      {open && (
        <div className="fixed inset-0 bg-black/60 z-30 lg:hidden" onClick={() => setOpen(false)} />
      )}

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="h-16 border-b border-border flex items-center justify-between px-4 lg:px-6 bg-background/80 backdrop-blur sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button className="lg:hidden p-2" onClick={() => setOpen((v) => !v)} aria-label="Toggle menu">
              {open ? <X /> : <Menu />}
            </button>
            <div className="text-sm text-muted-foreground">
              Dashboard <span className="mx-1.5">›</span>
              <span className="text-foreground font-medium">{currentLabel}</span>
            </div>
          </div>
          <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground grid place-items-center font-bold text-xs">
            GA
          </div>
        </header>
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>

      <AlertDialog open={confirmLogout} onOpenChange={setConfirmLogout}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>You'll need to sign in again to access the dashboard.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No</AlertDialogCancel>
            <AlertDialogAction onClick={logout} className="bg-red-600 hover:bg-red-700 text-white">
              Yes, logout
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
