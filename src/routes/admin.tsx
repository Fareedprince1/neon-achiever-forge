import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAdminAuth } from "@/hooks/use-admin-auth";
import { useEffect } from "react";
import { Lock } from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin Login | Achiever Gym" }, { name: "robots", content: "noindex" }] }),
  component: AdminLogin,
});

function AdminLogin() {
  const nav = useNavigate();
  const { loading, isAdmin, userId } = useAdminAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && isAdmin) nav({ to: "/admin/dashboard" });
  }, [loading, isAdmin, nav]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setBusy(false);
      if (error) return toast.error(error.message);
      toast.success("Signed in");
    } else {
      const redirectUrl = `${window.location.origin}/admin`;
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: redirectUrl },
      });
      setBusy(false);
      if (error) return toast.error(error.message);
      toast.success("Account created. Check your email to confirm, then ask the owner to grant admin access.");
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-card border border-border rounded-3xl p-8">
        <Link to="/" className="text-display text-2xl block text-center mb-2">
          ACHI<span className="neon-text">EVER</span>
        </Link>
        <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-[0.3em] text-muted-foreground mb-6">
          <Lock className="h-3 w-3" /> Admin Access
        </div>

        <form onSubmit={submit} className="grid gap-3">
          <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
          <Button type="submit" variant="neon" size="lg" disabled={busy}>
            {busy ? "Please wait..." : mode === "login" ? "Sign In" : "Create Admin Account"}
          </Button>
        </form>

        <button
          type="button"
          onClick={() => setMode(mode === "login" ? "signup" : "login")}
          className="mt-4 text-xs text-muted-foreground hover:text-primary w-full text-center"
        >
          {mode === "login" ? "First time? Create an account" : "Have an account? Sign in"}
        </button>

        {userId && !isAdmin && !loading && (
          <p className="mt-4 text-xs text-destructive text-center">
            Signed in but not an admin yet. Ask the owner to grant your user the admin role.
          </p>
        )}
      </div>
    </div>
  );
}
