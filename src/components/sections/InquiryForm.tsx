import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { notifyOwnerWhatsApp } from "@/lib/notify";
import { consumePreselectPlan, PLAN_EVENT } from "@/lib/plan-preselect";
import { cn } from "@/lib/utils";

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your full name").max(100),
  phone: z.string().trim().regex(/^\d{10}$/, "Phone must be exactly 10 digits"),
  email: z.string().trim().email("Enter a valid email").max(255),
});

export function InquiryForm() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", goal: "", batch: "", plan: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const initial = consumePreselectPlan();
    if (initial) setForm((f) => ({ ...f, plan: initial }));
    const onEvt = (e: Event) => {
      const plan = (e as CustomEvent<string>).detail;
      if (plan) setForm((f) => ({ ...f, plan }));
    };
    window.addEventListener(PLAN_EVENT, onEvt as EventListener);
    return () => window.removeEventListener(PLAN_EVENT, onEvt as EventListener);
  }, []);

  const errCls = (k: string) => cn(errors[k] && "border-red-500 focus-visible:ring-red-500");

  return (
    <section id="inquiry" className="py-24 bg-card/30">
      <div className="container mx-auto max-w-3xl px-4">
        <div className="text-center mb-10">
          <span className="text-xs uppercase tracking-[0.3em] neon-text">Inquiry</span>
          <h2 className="text-display text-4xl md:text-6xl mt-3">Take the <span className="neon-text">First Step Today</span></h2>
        </div>

        {success && (
          <div className="mb-6 rounded-2xl border border-green-500/40 bg-green-500/10 text-green-400 px-5 py-4 text-sm font-bold animate-fade-in">
            ✓ We'll contact you within 24 hours!
          </div>
        )}

        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const parsed = schema.safeParse(form);
            if (!parsed.success) {
              const next: Record<string, string> = {};
              for (const issue of parsed.error.issues) next[issue.path[0] as string] = issue.message;
              setErrors(next);
              return;
            }
            setErrors({});
            setSubmitting(true);
            const { error } = await supabase.from("membership_inquiries").insert({
              name: form.name.trim(),
              phone: form.phone.trim(),
              email: form.email.trim(),
              goal: form.goal || null,
              batch: form.batch || null,
              plan: form.plan || null,
              message: form.message.trim() || null,
            });
            setSubmitting(false);
            if (error) { toast.error("Could not submit. Please try again."); return; }
            setSuccess(true);
            toast.success("We'll contact you within 24 hours!");
            notifyOwnerWhatsApp(
              `New MEMBERSHIP inquiry:\nName: ${form.name}\nPhone: ${form.phone}\nEmail: ${form.email}\nPlan: ${form.plan || "—"}\nGoal: ${form.goal || "—"}\nBatch: ${form.batch || "—"}\nMessage: ${form.message || "—"}`
            );
            setForm({ name: "", phone: "", email: "", goal: "", batch: "", plan: "", message: "" });
            setTimeout(() => setSuccess(false), 8000);
          }}
          className="bg-card border border-border rounded-3xl p-6 md:p-8 grid gap-4"
          noValidate
        >
          <div>
            <Input placeholder="Full Name *" value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })} className={errCls("name")} />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Input type="tel" inputMode="numeric" placeholder="Phone (10 digits) *" value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })}
                className={errCls("phone")} />
              {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
            </div>
            <div>
              <Input type="email" placeholder="Email *" value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })} className={errCls("email")} />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <Select value={form.goal} onValueChange={(v) => setForm({ ...form, goal: v })}>
              <SelectTrigger><SelectValue placeholder="Goal" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Lose Weight">Lose Weight</SelectItem>
                <SelectItem value="Build Muscle">Build Muscle</SelectItem>
                <SelectItem value="Improve Fitness">Improve Fitness</SelectItem>
                <SelectItem value="Athletic Performance">Athletic Performance</SelectItem>
              </SelectContent>
            </Select>
            <Select value={form.batch} onValueChange={(v) => setForm({ ...form, batch: v })}>
              <SelectTrigger><SelectValue placeholder="Batch" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Early Morning">Early Morning</SelectItem>
                <SelectItem value="Morning">Morning</SelectItem>
                <SelectItem value="Evening">Evening</SelectItem>
                <SelectItem value="Night">Night</SelectItem>
              </SelectContent>
            </Select>
            <Select value={form.plan} onValueChange={(v) => setForm({ ...form, plan: v })}>
              <SelectTrigger><SelectValue placeholder="Plan" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Basic">Basic</SelectItem>
                <SelectItem value="Pro">Pro</SelectItem>
                <SelectItem value="Elite">Elite</SelectItem>
                <SelectItem value="Not Sure">Not Sure</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Textarea placeholder="Message (optional)" rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
          <Button type="submit" variant="neon" size="lg" className="w-full" disabled={submitting}>
            {submitting ? "Submitting..." : "Book Free Consultation"}
          </Button>
        </form>
      </div>
    </section>
  );
}
