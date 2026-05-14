import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { notifyOwnerWhatsApp } from "@/lib/notify";

export function InquiryForm() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", goal: "", batch: "", plan: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  return (
    <section id="inquiry" className="py-24 bg-card/30">
      <div className="container mx-auto max-w-3xl px-4">
        <div className="text-center mb-10">
          <span className="text-xs uppercase tracking-[0.3em] neon-text">Inquiry</span>
          <h2 className="text-display text-4xl md:text-6xl mt-3">Take the <span className="neon-text">First Step Today</span></h2>
        </div>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (!form.name.trim() || !form.phone.trim() || !form.email.trim()) {
              toast.error("Name, phone and email are required");
              return;
            }
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
            toast.success("We'll be in touch shortly!");
            notifyOwnerWhatsApp(
              `New MEMBERSHIP inquiry:\nName: ${form.name}\nPhone: ${form.phone}\nEmail: ${form.email}\nPlan: ${form.plan || "—"}\nGoal: ${form.goal || "—"}\nBatch: ${form.batch || "—"}\nMessage: ${form.message || "—"}`
            );
            setForm({ name: "", phone: "", email: "", goal: "", batch: "", plan: "", message: "" });
          }}
          className="bg-card border border-border rounded-3xl p-6 md:p-8 grid gap-4"
        >
          <Input required placeholder="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <div className="grid sm:grid-cols-2 gap-4">
            <Input required type="tel" placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <Input required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
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
