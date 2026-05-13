import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type AdminAuthState = {
  loading: boolean;
  userId: string | null;
  email: string | null;
  isAdmin: boolean;
};

export function useAdminAuth(): AdminAuthState {
  const [state, setState] = useState<AdminAuthState>({
    loading: true,
    userId: null,
    email: null,
    isAdmin: false,
  });

  useEffect(() => {
    let active = true;

    const check = async (userId: string | null, email: string | null) => {
      if (!userId) {
        if (active) setState({ loading: false, userId: null, email: null, isAdmin: false });
        return;
      }
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .eq("role", "admin")
        .maybeSingle();
      if (active) setState({ loading: false, userId, email, isAdmin: !!data });
    };

    // Set up listener FIRST
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      // Defer the supabase call to avoid deadlocks
      setTimeout(() => check(session?.user?.id ?? null, session?.user?.email ?? null), 0);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      check(session?.user?.id ?? null, session?.user?.email ?? null);
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return state;
}
