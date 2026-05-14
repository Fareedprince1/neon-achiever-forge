import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Download, MessageCircle, Trash2, StickyNote, Search } from "lucide-react";
import { OWNER_WHATSAPP } from "@/lib/notify";

type AnyRow = Record<string, any> & { id: string; created_at: string; status: string; phone?: string | null; name: string };

export type ColumnDef = {
  key: string;
  label: string;
  render?: (row: AnyRow) => React.ReactNode;
  className?: string;
};

const STATUS_OPTIONS: Record<string, string[]> = {
  default: ["new", "called", "converted", "not_interested"],
  contact: ["new", "read", "resolved", "not_interested"],
};

const STATUS_COLORS: Record<string, string> = {
  new: "bg-primary/15 text-primary border-primary/40",
  called: "bg-yellow-500/15 text-yellow-300 border-yellow-500/40",
  converted: "bg-emerald-500/15 text-emerald-300 border-emerald-500/40",
  not_interested: "bg-red-500/15 text-red-300 border-red-500/40",
  read: "bg-blue-500/15 text-blue-300 border-blue-500/40",
  resolved: "bg-emerald-500/15 text-emerald-300 border-emerald-500/40",
};

const ROW_TINT: Record<string, string> = {
  new: "",
  called: "bg-yellow-500/[0.03]",
  converted: "bg-emerald-500/[0.04]",
  not_interested: "opacity-60",
  read: "bg-blue-500/[0.03]",
  resolved: "bg-emerald-500/[0.04]",
};

const PAGE_SIZE = 20;

export function LeadsTable({
  table,
  columns,
  statusVariant = "default",
  csvName,
}: {
  table: "free_trial_requests" | "contact_queries" | "membership_inquiries";
  columns: ColumnDef[];
  statusVariant?: "default" | "contact";
  csvName: string;
}) {
  const [rows, setRows] = useState<AnyRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [page, setPage] = useState(1);
  const [noteFor, setNoteFor] = useState<AnyRow | null>(null);
  const [noteDraft, setNoteDraft] = useState("");

  const statuses = STATUS_OPTIONS[statusVariant];

  async function load() {
    setLoading(true);
    const { data, error } = await supabase.from(table).select("*").order("created_at", { ascending: false });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    setRows((data ?? []) as AnyRow[]);
  }

  useEffect(() => {
    load();
    const ch = supabase
      .channel(`leads-${table}`)
      .on("postgres_changes", { event: "*", schema: "public", table }, (payload) => {
        if (payload.eventType === "INSERT") {
          const row = payload.new as AnyRow;
          setRows((r) => [row, ...r.filter((x) => x.id !== row.id)]);
          toast.success(`🔔 New lead: ${row.name ?? ""}`, { description: row.phone ?? row.email ?? "" });
        } else if (payload.eventType === "UPDATE") {
          const row = payload.new as AnyRow;
          setRows((r) => r.map((x) => (x.id === row.id ? row : x)));
        } else if (payload.eventType === "DELETE") {
          const old = payload.old as AnyRow;
          setRows((r) => r.filter((x) => x.id !== old.id));
        }
      })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [table]);

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    return rows.filter((r) => {
      if (s) {
        const hay = `${r.name ?? ""} ${r.phone ?? ""} ${r.email ?? ""}`.toLowerCase();
        if (!hay.includes(s)) return false;
      }
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (from && new Date(r.created_at) < new Date(from)) return false;
      if (to && new Date(r.created_at) > new Date(to + "T23:59:59")) return false;
      return true;
    });
  }, [rows, search, statusFilter, from, to]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  useEffect(() => { setPage(1); }, [search, statusFilter, from, to]);

  async function updateStatus(id: string, status: string) {
    const { error } = await supabase.from(table).update({ status: status as any }).eq("id", id);
    if (error) return toast.error(error.message);
    setRows((r) => r.map((x) => (x.id === id ? { ...x, status } : x)));
    toast.success("Status updated");
  }

  async function remove(id: string) {
    if (!confirm("Delete this lead permanently?")) return;
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) return toast.error(error.message);
    setRows((r) => r.filter((x) => x.id !== id));
    toast.success("Deleted");
  }

  async function saveNote() {
    if (!noteFor) return;
    const { error } = await supabase.from(table).update({ notes: noteDraft }).eq("id", noteFor.id);
    if (error) return toast.error(error.message);
    setRows((r) => r.map((x) => (x.id === noteFor.id ? { ...x, notes: noteDraft } : x)));
    setNoteFor(null);
    toast.success("Note saved");
  }

  function exportCsv() {
    const allCols = ["id", ...columns.map((c) => c.key), "status", "notes", "created_at"];
    const header = allCols.join(",");
    const body = filtered
      .map((r) => allCols.map((k) => JSON.stringify(r[k] ?? "")).join(","))
      .join("\n");
    const blob = new Blob([header + "\n" + body], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `${csvName}-${new Date().toISOString().slice(0, 10)}.csv`; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="grid gap-3 lg:grid-cols-[1fr_180px_160px_160px_auto]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search name, phone, email..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {statuses.map((s) => <SelectItem key={s} value={s}>{labelize(s)}</SelectItem>)}
          </SelectContent>
        </Select>
        <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
        <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
        <Button variant="outline" onClick={exportCsv} className="gap-2"><Download className="h-4 w-4" /> CSV</Button>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((c) => <TableHead key={c.key} className={c.className}>{c.label}</TableHead>)}
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={columns.length + 3} className="text-center py-10 text-muted-foreground">Loading...</TableCell></TableRow>
              ) : pageRows.length === 0 ? (
                <TableRow><TableCell colSpan={columns.length + 3} className="text-center py-10 text-muted-foreground">No leads found</TableCell></TableRow>
              ) : pageRows.map((r) => (
                <TableRow key={r.id} className={ROW_TINT[r.status] ?? ""}>
                  {columns.map((c) => (
                    <TableCell key={c.key} className={c.className}>
                      {c.render ? c.render(r) : (r[c.key] ?? "—")}
                    </TableCell>
                  ))}
                  <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                    {new Date(r.created_at).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Select value={r.status} onValueChange={(v) => updateStatus(r.id, v)}>
                      <SelectTrigger className={`h-8 text-xs border ${STATUS_COLORS[r.status] ?? ""}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statuses.map((s) => <SelectItem key={s} value={s}>{labelize(s)}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1 justify-end">
                      {r.phone && (
                        <a
                          href={`https://wa.me/${cleanPhone(r.phone) || OWNER_WHATSAPP}`}
                          target="_blank" rel="noopener noreferrer"
                          className="h-8 w-8 inline-flex items-center justify-center rounded-md border border-border hover:border-primary hover:text-primary"
                          title="WhatsApp"
                        >
                          <MessageCircle className="h-4 w-4" />
                        </a>
                      )}
                      <button
                        onClick={() => { setNoteFor(r); setNoteDraft(r.notes ?? ""); }}
                        className="h-8 w-8 inline-flex items-center justify-center rounded-md border border-border hover:border-primary hover:text-primary"
                        title="Notes"
                      ><StickyNote className="h-4 w-4" /></button>
                      <button
                        onClick={() => remove(r.id)}
                        className="h-8 w-8 inline-flex items-center justify-center rounded-md border border-border hover:border-destructive hover:text-destructive"
                        title="Delete"
                      ><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between text-sm">
        <div className="text-muted-foreground">{filtered.length} result(s)</div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Prev</Button>
          <span className="text-xs">Page {page} / {totalPages}</span>
          <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Next</Button>
        </div>
      </div>

      <Dialog open={!!noteFor} onOpenChange={(o) => !o && setNoteFor(null)}>
        <DialogContent className="bg-card border-border">
          <DialogHeader><DialogTitle>Notes — {noteFor?.name}</DialogTitle></DialogHeader>
          <Textarea rows={6} value={noteDraft} onChange={(e) => setNoteDraft(e.target.value)} placeholder="Add notes about this lead..." />
          <Button variant="neon" onClick={saveNote}>Save Note</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  return <Badge variant="outline" className={STATUS_COLORS[status] ?? ""}>{labelize(status)}</Badge>;
}

function labelize(s: string) {
  return s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function cleanPhone(p: string) {
  const digits = (p || "").replace(/\D/g, "");
  if (!digits) return "";
  return digits.length === 10 ? `91${digits}` : digits;
}
