import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/dashboard/schedule")({
  head: () => ({ meta: [{ title: "Class Schedule | Admin" }, { name: "robots", content: "noindex" }] }),
  component: ScheduleAdmin,
});

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

type Row = {
  id: string;
  day: string;
  time: string;
  class_name: string;
  trainer: string;
  duration: string;
  spots_left: number;
  sort_order: number;
};

function ScheduleAdmin() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Partial<Row>>({ day: "Mon", time: "", class_name: "", trainer: "", duration: "45 min", spots_left: 10, sort_order: 0 });

  async function load() {
    setLoading(true);
    const { data, error } = await (supabase.from as any)("class_schedule").select("*").order("day").order("sort_order");
    setLoading(false);
    if (error) return toast.error(error.message);
    setRows((data ?? []) as Row[]);
  }

  useEffect(() => {
    load();
    const ch = supabase
      .channel("admin-class-schedule")
      .on("postgres_changes", { event: "*", schema: "public", table: "class_schedule" }, () => load())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  async function updateSpots(id: string, spots: number) {
    const { error } = await (supabase.from as any)("class_schedule").update({ spots_left: spots }).eq("id", id);
    if (error) return toast.error(error.message);
  }

  async function remove(id: string) {
    if (!confirm("Delete this class?")) return;
    const { error } = await (supabase.from as any)("class_schedule").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
  }

  async function create() {
    if (!draft.time || !draft.class_name || !draft.trainer) return toast.error("Fill all fields");
    const { error } = await (supabase.from as any)("class_schedule").insert(draft);
    if (error) return toast.error(error.message);
    toast.success("Class added");
    setOpen(false);
    setDraft({ day: "Mon", time: "", class_name: "", trainer: "", duration: "45 min", spots_left: 10, sort_order: 0 });
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-display text-3xl">Class Schedule</h1>
          <p className="text-sm text-muted-foreground">Updates reflect on the homepage instantly.</p>
        </div>
        <Button variant="neon" onClick={() => setOpen(true)} className="gap-2"><Plus className="h-4 w-4" /> Add Class</Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
      ) : days.map((d) => {
        const dayRows = rows.filter((r) => r.day === d);
        return (
          <div key={d} className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="px-5 py-3 border-b border-border bg-background/40 font-bold">{d}</div>
            {dayRows.length === 0 ? (
              <div className="px-5 py-6 text-sm text-muted-foreground">No classes.</div>
            ) : dayRows.map((r) => (
              <div key={r.id} className="grid grid-cols-2 md:grid-cols-6 gap-3 items-center px-5 py-3 border-b border-border last:border-0">
                <div className="font-bold text-primary">{r.time}</div>
                <div>{r.class_name}</div>
                <div className="text-sm text-muted-foreground">{r.trainer}</div>
                <div className="text-sm text-muted-foreground">{r.duration}</div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Spots</span>
                  <Input
                    type="number"
                    min={0}
                    defaultValue={r.spots_left}
                    onBlur={(e) => {
                      const n = parseInt(e.target.value) || 0;
                      if (n !== r.spots_left) updateSpots(r.id, n);
                    }}
                    className="h-8 w-20"
                  />
                </div>
                <div className="text-right">
                  <button onClick={() => remove(r.id)} className="h-8 w-8 inline-flex items-center justify-center rounded-md border border-border hover:border-destructive hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        );
      })}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader><DialogTitle>Add Class</DialogTitle></DialogHeader>
          <div className="grid gap-3">
            <Select value={draft.day} onValueChange={(v) => setDraft({ ...draft, day: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {days.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
              </SelectContent>
            </Select>
            <Input placeholder="Time (e.g. 6:00 AM)" value={draft.time ?? ""} onChange={(e) => setDraft({ ...draft, time: e.target.value })} />
            <Input placeholder="Class name" value={draft.class_name ?? ""} onChange={(e) => setDraft({ ...draft, class_name: e.target.value })} />
            <Input placeholder="Trainer" value={draft.trainer ?? ""} onChange={(e) => setDraft({ ...draft, trainer: e.target.value })} />
            <Input placeholder="Duration (e.g. 45 min)" value={draft.duration ?? ""} onChange={(e) => setDraft({ ...draft, duration: e.target.value })} />
            <Input type="number" placeholder="Spots left" value={draft.spots_left ?? 0} onChange={(e) => setDraft({ ...draft, spots_left: parseInt(e.target.value) || 0 })} />
            <Input type="number" placeholder="Sort order" value={draft.sort_order ?? 0} onChange={(e) => setDraft({ ...draft, sort_order: parseInt(e.target.value) || 0 })} />
            <Button variant="neon" onClick={create}>Save</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
