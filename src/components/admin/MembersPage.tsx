import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Phone,
  MessageCircle,
  Edit,
  Trash2,
  Download,
  Plus,
  AlertTriangle,
  X as XIcon,
  Search,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { cn } from "@/lib/utils";
import { MemberFormDialog } from "./MemberFormDialog";
import {
  daysBetween,
  displayStatus,
  expiredMessage,
  expiringMessage,
  fmtDate,
  waLink,
  PLANS,
  BATCHES,
  type DisplayStatus,
} from "./members-utils";

export type Member = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  plan: string;
  batch: string;
  membership_start_date: string;
  membership_end_date: string;
  payment_amount: number | null;
  payment_mode: string | null;
  status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

const PAGE_SIZE = 10;

type StatusFilter = "All" | DisplayStatus;
type SortKey = "name" | "plan" | "membership_start_date" | "membership_end_date" | "days";

const STATUS_PILL: Record<DisplayStatus, string> = {
  Active: "bg-emerald-500/15 text-emerald-300 border-emerald-500/40",
  "Expiring Soon": "bg-amber-500/15 text-amber-300 border-amber-500/40 animate-pulse",
  Expired: "bg-red-500/15 text-red-300 border-red-500/40",
  Inactive: "bg-zinc-500/15 text-zinc-400 border-zinc-500/40",
};

const ROW_BORDER: Record<DisplayStatus, string> = {
  Active: "",
  "Expiring Soon": "border-l-[3px] border-amber-500",
  Expired: "border-l-[3px] border-red-500 opacity-80",
  Inactive: "border-l-[3px] border-zinc-500 italic opacity-60",
};

export function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  const [q, setQ] = useState("");
  const [planF, setPlanF] = useState<string>("All");
  const [statusF, setStatusF] = useState<StatusFilter>("All");
  const [batchF, setBatchF] = useState<string>("All");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [sortKey, setSortKey] = useState<SortKey>("membership_end_date");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);

  const [showDismissed, setShowDismissed] = useState(false);

  const [addOpen, setAddOpen] = useState(false);
  const [editing, setEditing] = useState<Member | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Member | null>(null);
  const [exporting, setExporting] = useState(false);

  async function load() {
    setLoading(true);
    const { data, error } = await supabase
      .from("members")
      .select("*")
      .order("created_at", { ascending: false });
    setLoading(false);
    if (error) {
      toast.error("Failed to load members");
      return;
    }
    setMembers((data ?? []) as Member[]);
  }

  useEffect(() => { load(); }, []);

  const expiringCount = useMemo(
    () =>
      members.filter((m) => {
        const d = daysBetween(m.membership_end_date);
        return m.status !== "Inactive" && d >= 0 && d <= 7;
      }).length,
    [members],
  );

  // Stats
  const stats = useMemo(() => {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const startMonth = new Date(today); startMonth.setDate(1);
    let active = 0, expiring = 0, expired = 0, renewedMonth = 0;
    for (const m of members) {
      const s = displayStatus(m.status, m.membership_end_date);
      if (s === "Active") active++;
      if (s === "Expiring Soon") expiring++;
      if (s === "Expired") expired++;
      if (new Date(m.membership_start_date) >= startMonth) renewedMonth++;
    }
    return { active, expiring, expired, renewedMonth };
  }, [members]);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    let arr = members.filter((m) => {
      if (term && !`${m.name} ${m.phone} ${m.email ?? ""}`.toLowerCase().includes(term)) return false;
      if (planF !== "All" && m.plan !== planF) return false;
      if (batchF !== "All" && m.batch !== batchF) return false;
      if (statusF !== "All" && displayStatus(m.status, m.membership_end_date) !== statusF) return false;
      if (fromDate && m.membership_end_date < fromDate) return false;
      if (toDate && m.membership_end_date > toDate) return false;
      return true;
    });
    arr = [...arr].sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      if (sortKey === "days") return (daysBetween(a.membership_end_date) - daysBetween(b.membership_end_date)) * dir;
      const av = (a as any)[sortKey] ?? "";
      const bv = (b as any)[sortKey] ?? "";
      return String(av).localeCompare(String(bv)) * dir;
    });
    return arr;
  }, [members, q, planF, statusF, batchF, fromDate, toDate, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  useEffect(() => { setPage(1); }, [q, planF, statusF, batchF, fromDate, toDate]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
  }

  function exportCsv() {
    setExporting(true);
    const headers = ["Name","Phone","Email","Plan","Batch","Start Date","End Date","Status"];
    const rows = filtered.map((m) => [
      m.name, m.phone, m.email ?? "", m.plan, m.batch,
      m.membership_start_date, m.membership_end_date,
      displayStatus(m.status, m.membership_end_date),
    ]);
    const csv = [headers, ...rows]
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `members-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setTimeout(() => { setExporting(false); toast.success("CSV downloaded ✓"); }, 300);
  }

  function whatsappAllExpiring() {
    const list = members.filter((m) => {
      const d = daysBetween(m.membership_end_date);
      return m.status !== "Inactive" && d >= 0 && d <= 7;
    });
    if (!list.length) return;
    if (!confirm(`Open WhatsApp for ${list.length} expiring members in new tabs?`)) return;
    list.forEach((m, i) => {
      setTimeout(() => {
        window.open(waLink(m.phone, expiringMessage(m.name, m.plan, m.membership_end_date)), "_blank");
      }, i * 500);
    });
  }

  async function performDelete(m: Member) {
    const snap = m;
    const { error } = await supabase.from("members").delete().eq("id", m.id);
    if (error) { toast.error("Delete failed"); return; }
    setMembers((cur) => cur.filter((x) => x.id !== m.id));
    setDeleteTarget(null);
    toast.success(`${m.name} deleted`, {
      duration: 5000,
      action: {
        label: "Undo",
        onClick: async () => {
          const { error: e2 } = await supabase.from("members").insert({
            id: snap.id,
            name: snap.name, phone: snap.phone, email: snap.email,
            plan: snap.plan, batch: snap.batch,
            membership_start_date: snap.membership_start_date,
            membership_end_date: snap.membership_end_date,
            payment_amount: snap.payment_amount, payment_mode: snap.payment_mode,
            status: snap.status, notes: snap.notes,
          });
          if (e2) toast.error("Undo failed"); else { toast.success("Restored"); load(); }
        },
      },
    });
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-display text-3xl">Members</h1>
          <p className="text-sm text-muted-foreground">Manage active gym memberships, renewals and access.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Active" value={stats.active} tone="emerald" onClick={() => setStatusF("Active")} />
        <StatCard label="Expiring This Week" value={stats.expiring} tone="amber" onClick={() => setStatusF("Expiring Soon")} />
        <StatCard label="Expired" value={stats.expired} tone="red" onClick={() => setStatusF("Expired")} />
        <StatCard label="Renewals This Month" value={stats.renewedMonth} tone="green" onClick={() => setStatusF("All")} />
      </div>

      {/* Expiring banner */}
      {expiringCount > 0 && !showDismissed && (
        <div className="border border-amber-500/40 bg-amber-500/10 text-amber-200 rounded-2xl p-4 flex flex-wrap items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-400" />
          <span className="font-semibold">⚠ {expiringCount} membership{expiringCount > 1 ? "s" : ""} expire within 7 days — act now</span>
          <div className="ml-auto flex items-center gap-2">
            <Button size="sm" variant="outline" className="border-amber-500/40 hover:bg-amber-500/20" onClick={whatsappAllExpiring}>
              <MessageCircle className="h-4 w-4 mr-1.5" /> WhatsApp All Expiring
            </Button>
            <Button size="sm" variant="outline" className="border-amber-500/40 hover:bg-amber-500/20" onClick={() => setStatusF("Expiring Soon")}>
              View Expiring Only
            </Button>
            <button onClick={() => setShowDismissed(true)} className="p-1 hover:text-amber-100" aria-label="Dismiss">
              <XIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-card border border-border rounded-2xl p-4 grid gap-3 md:grid-cols-12">
        <div className="md:col-span-4 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by name, phone, email..." value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
        </div>
        <div className="md:col-span-2">
          <Select value={planF} onValueChange={setPlanF}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Plans</SelectItem>
              {PLANS.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="md:col-span-2">
          <Select value={statusF} onValueChange={(v) => setStatusF(v as StatusFilter)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Status</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Expiring Soon">Expiring Soon</SelectItem>
              <SelectItem value="Expired">Expired</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="md:col-span-2">
          <Select value={batchF} onValueChange={setBatchF}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Batches</SelectItem>
              {BATCHES.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="md:col-span-2 flex gap-2">
          <Button onClick={exportCsv} variant="outline" disabled={exporting} className="flex-1">
            <Download className="h-4 w-4 mr-1.5" /> {exporting ? "..." : "CSV"}
          </Button>
          <Button onClick={() => setAddOpen(true)} variant="neon" className="flex-1">
            <Plus className="h-4 w-4 mr-1.5" /> Add
          </Button>
        </div>
        <div className="md:col-span-6 flex items-center gap-2 text-xs">
          <span className="text-muted-foreground">End date:</span>
          <div className="relative">
            <Input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="h-8 w-40" />
            {fromDate && <button onClick={() => setFromDate("")} className="absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground"><XIcon className="h-3 w-3" /></button>}
          </div>
          <span className="text-muted-foreground">to</span>
          <div className="relative">
            <Input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="h-8 w-40" />
            {toDate && <button onClick={() => setToDate("")} className="absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground"><XIcon className="h-3 w-3" /></button>}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <Table>
          <TableHeader className="sticky top-0 bg-card">
            <TableRow>
              <TableHead>#</TableHead>
              <SortableHead label="Name" k="name" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} />
              <TableHead>Phone</TableHead>
              <TableHead>Email</TableHead>
              <SortableHead label="Plan" k="plan" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} />
              <TableHead>Batch</TableHead>
              <SortableHead label="Start" k="membership_start_date" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} />
              <SortableHead label="End" k="membership_end_date" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} />
              <SortableHead label="Days Left" k="days" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} />
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && (
              <TableRow><TableCell colSpan={11} className="text-center py-8 text-muted-foreground">Loading…</TableCell></TableRow>
            )}
            {!loading && paged.length === 0 && (
              <TableRow><TableCell colSpan={11} className="text-center py-12 text-muted-foreground">No members match the filters.</TableCell></TableRow>
            )}
            {paged.map((m, i) => {
              const status = displayStatus(m.status, m.membership_end_date);
              const days = daysBetween(m.membership_end_date);
              return (
                <TableRow
                  key={m.id}
                  className={cn(
                    i % 2 === 0 ? "bg-[#1e1e1e]/40" : "bg-[#181818]/40",
                    "hover:bg-[#2a2a2a]",
                    ROW_BORDER[status],
                  )}
                >
                  <TableCell className="text-muted-foreground">{(safePage - 1) * PAGE_SIZE + i + 1}</TableCell>
                  <TableCell className="font-semibold">{m.name}</TableCell>
                  <TableCell>{m.phone}</TableCell>
                  <TableCell className="text-muted-foreground text-xs">{m.email ?? "—"}</TableCell>
                  <TableCell>{m.plan}</TableCell>
                  <TableCell>{m.batch}</TableCell>
                  <TableCell className="text-xs">{fmtDate(m.membership_start_date)}</TableCell>
                  <TableCell className="text-xs">{fmtDate(m.membership_end_date)}</TableCell>
                  <TableCell>
                    <DaysLeftCell days={days} />
                  </TableCell>
                  <TableCell>
                    <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border", STATUS_PILL[status])}>
                      {status === "Expiring Soon" && <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />}
                      {status === "Expired" && days < 0 && <span className="h-1.5 w-1.5 rounded-full bg-red-500" />}
                      {status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="inline-flex items-center gap-1">
                      <a href={`tel:+91${m.phone}`} title="Call member" aria-label="Call member" className="p-1.5 rounded hover:bg-muted">
                        <Phone className="h-4 w-4" />
                      </a>
                      <a
                        href={waLink(
                          m.phone,
                          status === "Expired"
                            ? expiredMessage(m.name, m.plan, m.membership_end_date)
                            : expiringMessage(m.name, m.plan, m.membership_end_date),
                        )}
                        target="_blank"
                        rel="noreferrer"
                        title="Send WhatsApp"
                        aria-label="Send WhatsApp"
                        className="p-1.5 rounded hover:bg-muted text-emerald-400"
                      >
                        <MessageCircle className="h-4 w-4" />
                      </a>
                      <button onClick={() => setEditing(m)} title="Edit member" aria-label="Edit member" className="p-1.5 rounded hover:bg-muted">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button onClick={() => setDeleteTarget(m)} title="Delete member" aria-label="Delete member" className="p-1.5 rounded hover:bg-muted text-red-400">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {filtered.length > 0 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-border text-xs text-muted-foreground">
            <div>
              Showing {(safePage - 1) * PAGE_SIZE + 1}–
              {Math.min(safePage * PAGE_SIZE, filtered.length)} of {filtered.length}
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" disabled={safePage <= 1} onClick={() => setPage(safePage - 1)} className={cn(safePage <= 1 && "opacity-40")}>
                Prev
              </Button>
              <span>Page {safePage} / {totalPages}</span>
              <Button size="sm" variant="outline" disabled={safePage >= totalPages} onClick={() => setPage(safePage + 1)} className={cn(safePage >= totalPages && "opacity-40")}>
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Add */}
      <MemberFormDialog
        mode="add"
        open={addOpen}
        onOpenChange={setAddOpen}
        onSaved={() => { setAddOpen(false); load(); }}
      />

      {/* Edit */}
      {editing && (
        <MemberFormDialog
          mode="edit"
          member={editing}
          open={!!editing}
          onOpenChange={(o) => !o && setEditing(null)}
          onSaved={() => { setEditing(null); load(); }}
        />
      )}

      {/* Delete confirm */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {deleteTarget?.name}?</AlertDialogTitle>
            <AlertDialogDescription>This cannot be undone (you'll have a 5-second window to undo via toast).</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteTarget && performDelete(deleteTarget)} className="bg-red-600 hover:bg-red-700 text-white">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function StatCard({ label, value, tone, onClick }: { label: string; value: number; tone: "emerald"|"amber"|"red"|"green"; onClick?: () => void }) {
  const toneClass = {
    emerald: "border-emerald-500/40 text-emerald-300",
    amber: "border-amber-500/40 text-amber-300 bg-amber-500/5",
    red: "border-red-500/40 text-red-300 bg-red-500/5",
    green: "border-emerald-500/40 text-emerald-300 bg-emerald-500/5",
  }[tone];
  return (
    <button onClick={onClick} className={cn("text-left bg-card border rounded-2xl p-5 transition-transform hover:scale-[1.02]", toneClass)}>
      <div className="text-xs uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="mt-2 text-3xl font-bold">{value}</div>
    </button>
  );
}

function DaysLeftCell({ days }: { days: number }) {
  if (days < 0) return <span className="text-red-400/70 text-xs">Expired {Math.abs(days)}d ago</span>;
  if (days === 0) return <span className="text-red-400 font-bold">Today</span>;
  if (days <= 7) return (
    <span className="inline-flex items-center gap-1 text-red-400 font-bold">
      <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
      {days}d
    </span>
  );
  if (days <= 30) return (
    <span className="inline-flex items-center gap-1 text-amber-300">
      <AlertTriangle className="h-3 w-3" /> {days}d
    </span>
  );
  return <span className="text-emerald-300">{days}d</span>;
}

function SortableHead({
  label, k, sortKey, sortDir, onSort,
}: { label: string; k: SortKey; sortKey: SortKey; sortDir: "asc"|"desc"; onSort: (k: SortKey) => void }) {
  const active = sortKey === k;
  return (
    <TableHead>
      <button onClick={() => onSort(k)} className="inline-flex items-center gap-1 hover:text-foreground">
        {label}
        {active && (sortDir === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
      </button>
    </TableHead>
  );
}
