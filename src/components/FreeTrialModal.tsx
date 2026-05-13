import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { notifyOwnerWhatsApp } from "@/lib/notify";

type Props = { open: boolean; onOpenChange: (o: boolean) => void };

export function FreeTrialModal({ open, onOpenChange }: Props) {
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", goal: "", batch: "" });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-display text-2xl">Claim your 3 days free</DialogTitle>
          <DialogDescription>Tell us a bit about you and we'll set up your trial.</DialogDescription>
        </DialogHeader>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (!form.name.trim() || !form.phone.trim()) {
              toast.error("Name and phone are required");
              return;
            }
            setSubmitting(true);
            const { error } = await supabase.from("free_trial_requests").insert({
              name: form.name.trim(),
              phone: form.phone.trim(),
              goal: form.goal || null,
              batch: form.batch || null,
            });
            setSubmitting(false);
            if (error) {
              toast.error("Could not submit. Please try again.");
              return;
            }
            onOpenChange(false);
            toast.success("Trial booked! We'll call you shortly.");
            notifyOwnerWhatsApp(
              `New FREE TRIAL request:\nName: ${form.name}\nPhone: ${form.phone}\nGoal: ${form.goal || "—"}\nBatch: ${form.batch || "—"}`
            );
            setForm({ name: "", phone: "", goal: "", batch: "" });
          }}
          className="grid gap-3"
        >
          <Input required placeholder="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input required type="tel" placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <Select value={form.goal} onValueChange={(v) => setForm({ ...form, goal: v })}>
            <SelectTrigger><SelectValue placeholder="Your Goal" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Lose Weight">Lose Weight</SelectItem>
              <SelectItem value="Build Muscle">Build Muscle</SelectItem>
              <SelectItem value="Improve Fitness">Improve Fitness</SelectItem>
              <SelectItem value="Athletic Performance">Athletic Performance</SelectItem>
            </SelectContent>
          </Select>
          <Select value={form.batch} onValueChange={(v) => setForm({ ...form, batch: v })}>
            <SelectTrigger><SelectValue placeholder="Preferred Batch" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Early Morning">Early Morning</SelectItem>
              <SelectItem value="Morning">Morning</SelectItem>
              <SelectItem value="Evening">Evening</SelectItem>
              <SelectItem value="Night">Night</SelectItem>
            </SelectContent>
          </Select>
          <Button type="submit" variant="neon" size="lg" disabled={submitting} className="w-full">
            {submitting ? "Booking..." : "Book My Free Trial"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function useFirstVisitTrialModal() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("ag_trial_seen")) return;
    const t = setTimeout(() => {
      setOpen(true);
      sessionStorage.setItem("ag_trial_seen", "1");
    }, 1500);
    return () => clearTimeout(t);
  }, []);
  return [open, setOpen] as const;
}
