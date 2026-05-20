import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { Sparkles, ClipboardList, TrendingUp, Clock, Users, IdCard } from "lucide-react";
import { toast } from "sonner";

type Stats = {
  todayLeads: number;
  monthLeads: number;
  pending: number;
  conversionRate: number;
  trials: number;
  memberships: number;
};

const TABLES = ["free_trial_requests", "membership_inquiries"] as const;

export function Overview() {
  const [stats, setStats] = useState<Stats | null>(null);

  async function load() {
    const startOfDay = new Date(); startOfDay.setHours(0, 0, 0, 0);
    const startOfMonth = new Date(); startOfMonth.setDate(1); startOfMonth.setHours(0, 0, 0, 0);

    const [trials, memberships] = await Promise.all(
      TABLES.map((t) => supabase.from(t).select("status,created_at")),
    );
    const mRows = (memberships.data ?? []) as { status: string; created_at: string }[];
    const tRows = (trials.data ?? []) as { status: string; created_at: string }[];

    const todayLeads = mRows.filter((r) => new Date(r.created_at) >= startOfDay).length;
    const monthLeads = mRows.filter((r) => new Date(r.created_at) >= startOfMonth).length;
    const pending = mRows.filter((r) => r.status === "new" || r.status === "called").length;
    const all = [...tRows, ...mRows];
    const converted = all.filter((r) => r.status === "converted").length;
    const conversionRate = all.length ? Math.round((converted / all.length) * 100) : 0;

    setStats({
      todayLeads,
      monthLeads,
      pending,
      conversionRate,
      trials: tRows.length,
      memberships: mRows.length,
    });
  }

  useEffect(() => {
    load();
    const channels = TABLES.map((t) =>
      supabase
        .channel(`overview-${t}`)
        .on("postgres_changes", { event: "*", schema: "public", table: t }, (payload) => {
          load();
          if (payload.eventType === "INSERT") {
            const r: any = payload.new;
            const labels: Record<string, string> = {
              free_trial_requests: "🔔 New Free Trial Request",
              membership_inquiries: "🔔 New Membership Inquiry",
            };
            toast.success(labels[t] ?? "New lead", {
              description: `${r.name ?? ""} ${r.phone ? "· " + r.phone : ""}`,
            });
          }
        })
        .subscribe(),
    );
    return () => { channels.forEach((c) => supabase.removeChannel(c)); };
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-display text-3xl md:text-4xl">Overview</h1>
        <p className="text-sm text-muted-foreground">Your gym's lead pipeline at a glance. Updates in real-time.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Stat to="/admin/dashboard/memberships" icon={Users} label="Leads Today" value={stats?.todayLeads ?? "—"} accent />
        <Stat to="/admin/dashboard/memberships" icon={TrendingUp} label="This Month" value={stats?.monthLeads ?? "—"} />
        <Stat to="/admin/dashboard/memberships" icon={Clock} label="Pending Follow-ups" value={stats?.pending ?? "—"} />
        <Stat to="/admin/dashboard/free-trials" icon={Sparkles} label="Free Trial Requests" value={stats?.trials ?? "—"} />
        <Stat to="/admin/dashboard/memberships" icon={ClipboardList} label="Membership Inquiries" value={stats?.memberships ?? "—"} />
        <Stat to="/admin/dashboard/members" icon={IdCard} label="Conversion Rate" value={stats ? `${stats.conversionRate}%` : "—"} />
      </div>
    </div>
  );
}

function Stat({
  icon: Icon, label, value, accent, to,
}: { icon: any; label: string; value: number | string; accent?: boolean; to: string }) {
  return (
    <Link
      to={to}
      className={`block bg-card border ${accent ? "border-primary/40" : "border-border"} rounded-2xl p-5 transition-transform hover:scale-[1.02] hover:border-primary cursor-pointer`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-widest text-muted-foreground">{label}</span>
        <Icon className={`h-6 w-6 ${accent ? "text-primary" : "text-muted-foreground"}`} />
      </div>
      <div className="mt-3 text-3xl font-bold">{value}</div>
    </Link>
  );
}
