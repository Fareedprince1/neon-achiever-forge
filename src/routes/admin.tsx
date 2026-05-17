import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Lock, Loader2 } from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin Login | Achiever Gym" }, { name: "robots", content: "noindex" }] }),
  component: AdminLogin,
});

function AdminLogin() {
  const nav = useNavigate();
  const [checking, setChecking] = useState(true);
  const [signedInEmail, setSignedInEmail] = useState<string | null>(null);
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  // If already signed in, auto-redirect to dashboard. Otherwise show login form.
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        window.location.href = "/admin/dashboard";
        return;
      }
      setChecking(false);
    });
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    if (mode === "login") {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setBusy(false);
        return toast.error(error.message);
      }
      if (data.user) {
        toast.success("Signed in. Loading dashboard...");
        window.location.href = "/admin/dashboard";
      }
    } else {
      const redirectUrl = `${window.location.origin}/admin`;
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: redirectUrl },
      });
      setBusy(false);
      if (error) return toast.error(error.message);
      toast.success("Account created. Confirm your email, then ask the owner to grant admin access.");
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
    setSignedInEmail(null);
    toast.success("Signed out");
  }

  if (checking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
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

        {signedInEmail ? (
          <div className="grid gap-3">
            <p className="text-sm text-center text-muted-foreground">
              Signed in as <span className="text-foreground font-medium">{signedInEmail}</span>
            </p>
            <Button variant="neon" size="lg" onClick={() => (window.location.href = "/admin/dashboard")}>
              Continue to Dashboard
            </Button>
            <Button variant="outline" onClick={signOut}>
              Sign out
            </Button>
          </div>
        ) : (
          <>
            <form onSubmit={submit} className="grid gap-3">
              <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
              <Button type="submit" variant="neon" size="lg" disabled={busy}>
                {busy ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Please wait...</> : mode === "login" ? "Sign In" : "Create Admin Account"}
              </Button>
            </form>

            <button
              type="button"
              onClick={() => setMode(mode === "login" ? "signup" : "login")}
              className="mt-4 text-xs text-muted-foreground hover:text-primary w-full text-center"
            >
              {mode === "login" ? "First time? Create an account" : "Have an account? Sign in"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
