import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Trash2, Loader2, Star, Pencil } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/dashboard/testimonials")({
  head: () => ({ meta: [{ title: "Testimonials | Admin" }, { name: "robots", content: "noindex" }] }),
  component: TestimonialsAdmin,
});

type Row = {
  id: string;
  member_name: string;
  member_image: string | null;
  quote: string;
  rating: number;
  duration: string | null;
  is_active: boolean;
  sort_order: number;
};

const empty: Partial<Row> = { member_name: "", member_image: "", quote: "", rating: 5, duration: "", is_active: true, sort_order: 0 };

function TestimonialsAdmin() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<Row> | null>(null);

  async function load() {
    setLoading(true);
    const { data, error } = await (supabase.from as any)("testimonials").select("*").order("sort_order");
    setLoading(false);
    if (error) return toast.error(error.message);
    setRows((data ?? []) as Row[]);
  }

  useEffect(() => {
    load();
    const ch = supabase
      .channel("admin-testimonials")
      .on("postgres_changes", { event: "*", schema: "public", table: "testimonials" }, () => load())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  async function save() {
    if (!editing?.member_name || !editing?.quote) return toast.error("Name and quote required");
    if (editing.id) {
      const { id, ...rest } = editing as any;
      const { error } = await (supabase.from as any)("testimonials").update(rest).eq("id", id);
      if (error) return toast.error(error.message);
    } else {
      const { error } = await (supabase.from as any)("testimonials").insert(editing);
      if (error) return toast.error(error.message);
    }
    toast.success("Saved");
    setOpen(false);
    setEditing(null);
  }

  async function toggleActive(r: Row) {
    const { error } = await (supabase.from as any)("testimonials").update({ is_active: !r.is_active }).eq("id", r.id);
    if (error) toast.error(error.message);
  }

  async function remove(id: string) {
    if (!confirm("Delete this testimonial?")) return;
    const { error } = await (supabase.from as any)("testimonials").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-display text-3xl">Testimonials</h1>
          <p className="text-sm text-muted-foreground">Toggle off to hide from the homepage instantly.</p>
        </div>
        <Button variant="neon" onClick={() => { setEditing({ ...empty }); setOpen(true); }} className="gap-2"><Plus className="h-4 w-4" /> Add Testimonial</Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
      ) : rows.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-8 text-center text-muted-foreground">No testimonials yet.</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {rows.map((r) => (
            <div key={r.id} className={`bg-card border rounded-2xl p-5 ${r.is_active ? "border-border" : "border-border opacity-60"}`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-bold">{r.member_name}</div>
                  <div className="text-xs text-muted-foreground">{r.duration}</div>
                </div>
                <div className="flex gap-0.5">{Array.from({ length: r.rating }).map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-primary text-primary" />)}</div>
              </div>
              <p className="text-sm mt-3 text-muted-foreground">"{r.quote}"</p>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                <div className="flex items-center gap-2">
                  <Switch checked={r.is_active} onCheckedChange={() => toggleActive(r)} />
                  <span className="text-xs text-muted-foreground">{r.is_active ? "Active" : "Hidden"}</span>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => { setEditing(r); setOpen(true); }} className="h-8 w-8 inline-flex items-center justify-center rounded-md border border-border hover:border-primary hover:text-primary">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button onClick={() => remove(r.id)} className="h-8 w-8 inline-flex items-center justify-center rounded-md border border-border hover:border-destructive hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setEditing(null); }}>
        <DialogContent className="bg-card border-border">
          <DialogHeader><DialogTitle>{editing?.id ? "Edit" : "Add"} Testimonial</DialogTitle></DialogHeader>
          <div className="grid gap-3">
            <Input placeholder="Member name" value={editing?.member_name ?? ""} onChange={(e) => setEditing({ ...editing, member_name: e.target.value })} />
            <Input placeholder="Image URL (optional)" value={editing?.member_image ?? ""} onChange={(e) => setEditing({ ...editing, member_image: e.target.value })} />
            <Textarea rows={4} placeholder="Quote" value={editing?.quote ?? ""} onChange={(e) => setEditing({ ...editing, quote: e.target.value })} />
            <Input type="number" min={1} max={5} placeholder="Rating (1-5)" value={editing?.rating ?? 5} onChange={(e) => setEditing({ ...editing, rating: parseInt(e.target.value) || 5 })} />
            <Input placeholder="Duration (e.g. Member · 2 yrs)" value={editing?.duration ?? ""} onChange={(e) => setEditing({ ...editing, duration: e.target.value })} />
            <Input type="number" placeholder="Sort order" value={editing?.sort_order ?? 0} onChange={(e) => setEditing({ ...editing, sort_order: parseInt(e.target.value) || 0 })} />
            <div className="flex items-center gap-2">
              <Switch checked={editing?.is_active ?? true} onCheckedChange={(v) => setEditing({ ...editing, is_active: v })} />
              <span className="text-sm">Show on website</span>
            </div>
            <Button variant="neon" onClick={save}>Save</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
