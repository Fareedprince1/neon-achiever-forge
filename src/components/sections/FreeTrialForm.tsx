import { useState } from "react";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { notifyOwnerWhatsApp } from "@/lib/notify";
import { cn } from "@/lib/utils";

const schema = z.object({
  name: z.string().trim().min(2, "Enter your full name").max(100),
  phone: z.string().trim().regex(/^\d{10}$/, "Phone must be 10 digits"),
});

export function FreeTrialForm() {
  const [form, setForm] = useState({ name: "", phone: "", goal: "", batch: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const errCls = (k: string) => cn(errors[k] && "border-red-500 focus-visible:ring-red-500");

  return (
    <section id="trial" className="py-20 bg-primary/5 border-y border-primary/20">
      <div className="container mx-auto max-w-3xl px-4">
        <div className="text-center mb-8">
          <span className="text-xs uppercase tracking-[0.3em] neon-text">Free Trial</span>
          <h2 className="text-display text-4xl md:text-5xl mt-3">
            Claim Your <span className="neon-text">3 Days Free</span>
          </h2>
          <p className="text-muted-foreground mt-3">No credit card. No obligation. Just train.</p>
        </div>

        {success && (
          <div className="mb-6 rounded-2xl border border-green-500/40 bg-green-500/10 text-green-400 px-5 py-4 text-sm font-bold animate-fade-in text-center">
            ✓ Your free trial is confirmed! We'll call you shortly.
          </div>
        )}

        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const parsed = schema.safeParse(form);
            if (!parsed.success) {
              const next: Record<string, string> = {};
              for (const i of parsed.error.issues) next[i.path[0] as string] = i.message;
              setErrors(next);
              return;
            }
            setErrors({});
            setSubmitting(true);
            const { error } = await supabase.from("free_trial_requests").insert({
              name: form.name.trim(),
              phone: form.phone.trim(),
              goal: form.goal || null,
              batch: form.batch || null,
            });
            setSubmitting(false);
            if (error) { toast.error("Could not submit. Please try again."); return; }
            setSuccess(true);
            toast.success("Your free trial is confirmed! We'll call you shortly.");
            notifyOwnerWhatsApp(
              `New FREE TRIAL request:\nName: ${form.name}\nPhone: ${form.phone}\nGoal: ${form.goal || "—"}\nBatch: ${form.batch || "—"}`,
            );
            setForm({ name: "", phone: "", goal: "", batch: "" });
            setTimeout(() => setSuccess(false), 8000);
          }}
          className="bg-card border border-border rounded-3xl p-6 md:p-8 grid gap-4"
          noValidate
        >
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Input placeholder="Full Name *" value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })} className={errCls("name")} />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>
            <div>
              <Input type="tel" inputMode="numeric" placeholder="Phone (10 digits) *" value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })}
                className={errCls("phone")} />
              {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Select value={form.goal} onValueChange={(v) => setForm({ ...form, goal: v })}>
              <SelectTrigger><SelectValue placeholder="Your Goal" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Lose Weight">Lose Weight</SelectItem>
                <SelectItem value="Build Muscle">Build Muscle</SelectItem>
                <SelectItem value="Improve Fitness">Improve Fitness</SelectItem>
                <SelectItem value="General Fitness">General Fitness</SelectItem>
              </SelectContent>
            </Select>
            <Select value={form.batch} onValueChange={(v) => setForm({ ...form, batch: v })}>
              <SelectTrigger><SelectValue placeholder="Preferred Batch" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Morning">Morning</SelectItem>
                <SelectItem value="Evening">Evening</SelectItem>
                <SelectItem value="Weekend">Weekend</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" variant="neon" size="lg" className="w-full" disabled={submitting}>
            {submitting ? "Submitting..." : "Claim My 3 Free Days"}
          </Button>
        </form>
      </div>
    </section>
  );
}
