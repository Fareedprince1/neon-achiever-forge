import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Sparkles, MessageSquare, ClipboardList, TrendingUp, Clock, Users } from "lucide-react";

type Stats = {
  todayLeads: number;
  monthLeads: number;
  pending: number;
  conversionRate: number;
  trials: number;
  contacts: number;
  memberships: number;
};

const TABLES = ["free_trial_requests", "contact_queries", "membership_inquiries"] as const;

export function Overview() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    (async () => {
      const startOfDay = new Date(); startOfDay.setHours(0, 0, 0, 0);
      const startOfMonth = new Date(); startOfMonth.setDate(1); startOfMonth.setHours(0, 0, 0, 0);

      const all = await Promise.all(
        TABLES.map((t) => supabase.from(t).select("status,created_at"))
      );
      const rows = all.flatMap((r) => (r.data ?? []) as { status: string; created_at: string }[]);
      const todayLeads = rows.filter((r) => new Date(r.created_at) >= startOfDay).length;
      const monthLeads = rows.filter((r) => new Date(r.created_at) >= startOfMonth).length;
      const pending = rows.filter((r) => r.status === "new" || r.status === "called").length;
      const converted = rows.filter((r) => r.status === "converted" || r.status === "resolved").length;
      const conversionRate = rows.length ? Math.round((converted / rows.length) * 100) : 0;

      setStats({
        todayLeads,
        monthLeads,
        pending,
        conversionRate,
        trials: (all[0].data ?? []).length,
        contacts: (all[1].data ?? []).length,
        memberships: (all[2].data ?? []).length,
      });
    })();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-display text-3xl md:text-4xl">Overview</h1>
        <p className="text-sm text-muted-foreground">Your gym's lead pipeline at a glance.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat icon={Users} label="Leads Today" value={stats?.todayLeads ?? "—"} accent />
        <Stat icon={TrendingUp} label="This Month" value={stats?.monthLeads ?? "—"} />
        <Stat icon={Clock} label="Pending Follow-ups" value={stats?.pending ?? "—"} />
        <Stat icon={Sparkles} label="Conversion Rate" value={stats ? `${stats.conversionRate}%` : "—"} />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Stat icon={Sparkles} label="Free Trial Requests" value={stats?.trials ?? "—"} />
        <Stat icon={MessageSquare} label="Contact Queries" value={stats?.contacts ?? "—"} />
        <Stat icon={ClipboardList} label="Membership Inquiries" value={stats?.memberships ?? "—"} />
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value, accent }: { icon: any; label: string; value: number | string; accent?: boolean }) {
  return (
    <div className={`bg-card border ${accent ? "border-primary/40" : "border-border"} rounded-2xl p-5`}>
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-widest text-muted-foreground">{label}</span>
        <Icon className={`h-5 w-5 ${accent ? "text-primary" : "text-muted-foreground"}`} />
      </div>
      <div className="mt-3 text-3xl font-bold">{value}</div>
    </div>
  );
}
