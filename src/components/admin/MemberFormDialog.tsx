import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  PLANS, BATCHES, PAY_MODES, PLAN_PRICING, addMonths, fmtDate, toISO,
  type Plan,
} from "./members-utils";
import type { Member } from "./MembersPage";

const baseSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 chars").max(100),
  phone: z.string().trim().regex(/^\d{10}$/, "Phone must be exactly 10 digits"),
  email: z.string().trim().email("Invalid email").max(255).optional().or(z.literal("")),
  plan: z.enum(PLANS),
  batch: z.enum(BATCHES),
  membership_start_date: z.string().min(1, "Required"),
  payment_amount: z.union([z.string(), z.number()]).optional(),
  payment_mode: z.string().optional(),
  notes: z.string().max(300).optional(),
});

const DURATIONS: { label: string; months: number }[] = [
  { label: "1 Month", months: 1 },
  { label: "3 Months", months: 3 },
  { label: "6 Months", months: 6 },
  { label: "1 Year", months: 12 },
];

type Props = {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  mode: "add" | "edit";
  member?: Member;
  onSaved: () => void;
};

export function MemberFormDialog({ open, onOpenChange, mode, member, onSaved }: Props) {
  const isEdit = mode === "edit" && member;

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [plan, setPlan] = useState<Plan>("Basic");
  const [batch, setBatch] = useState<string>("Morning");
  const [startDate, setStartDate] = useState(toISO(new Date()));
  const [durationMonths, setDurationMonths] = useState<number>(1);
  const [paymentAmount, setPaymentAmount] = useState<string>("");
  const [paymentMode, setPaymentMode] = useState<string>("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [errs, setErrs] = useState<Record<string, string>>({});
  const [confirmDeactivate, setConfirmDeactivate] = useState(false);

  // Renewal-only state (edit mode)
  const [renewPlan, setRenewPlan] = useState<Plan>("Basic");
  const [renewMonths, setRenewMonths] = useState<number | null>(null);
  const [renewAmount, setRenewAmount] = useState<string>("");
  const [renewMode, setRenewMode] = useState<string>("");

  useEffect(() => {
    if (!open) return;
    if (isEdit && member) {
      setName(member.name);
      setPhone(member.phone);
      setEmail(member.email ?? "");
      setPlan(member.plan as Plan);
      setBatch(member.batch);
      setStartDate(member.membership_start_date);
      setPaymentAmount(member.payment_amount?.toString() ?? "");
      setPaymentMode(member.payment_mode ?? "");
      setNotes(member.notes ?? "");
      setRenewPlan(member.plan as Plan);
      setRenewMonths(null);
      setRenewAmount("");
      setRenewMode("");
    } else {
      setName(""); setPhone(""); setEmail("");
      setPlan("Basic"); setBatch("Morning");
      setStartDate(toISO(new Date()));
      setDurationMonths(1);
      setPaymentAmount(""); setPaymentMode(""); setNotes("");
    }
    setErrs({});
  }, [open, isEdit, member]);

  const computedEnd = useMemo(() => {
    const d = new Date(startDate);
    return addMonths(d, durationMonths);
  }, [startDate, durationMonths]);

  const renewPreview = useMemo(() => {
    if (renewMonths == null) return null;
    const today = new Date();
    const end = addMonths(today, renewMonths);
    const amount = PLAN_PRICING[renewPlan].monthly * renewMonths;
    return { start: today, end, amount, planChanged: member && renewPlan !== member.plan };
  }, [renewMonths, renewPlan, member]);

  useEffect(() => {
    if (renewPreview && !renewAmount) setRenewAmount(String(renewPreview.amount));
  }, [renewPreview]);

  async function handleSave() {
    setErrs({});
    const parsed = baseSchema.safeParse({
      name, phone, email, plan, batch,
      membership_start_date: startDate,
      payment_amount: paymentAmount, payment_mode: paymentMode, notes,
    });
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const i of parsed.error.issues) next[i.path[0] as string] = i.message;
      setErrs(next);
      return;
    }

    setSaving(true);

    if (isEdit && member) {
      let nextStart = startDate;
      let nextEnd = member.membership_end_date;
      let nextPlan = plan;
      let nextStatus = member.status;
      let nextAmount: number | null = paymentAmount ? Number(paymentAmount) : member.payment_amount;
      let nextMode = paymentMode || member.payment_mode;
      let nextNotes = notes;

      if (renewMonths != null && renewPreview) {
        nextStart = toISO(renewPreview.start);
        nextEnd = toISO(renewPreview.end);
        nextPlan = renewPlan;
        nextStatus = "Active";
        if (renewAmount) nextAmount = Number(renewAmount);
        if (renewMode) nextMode = renewMode;
        const ts = new Date().toLocaleString("en-IN");
        const noteLine = `Renewed ${renewMonths}mo · ${renewPlan} · ₹${renewAmount} — ${ts}`;
        nextNotes = nextNotes ? `${noteLine}\n${nextNotes}` : noteLine;
      }

      const { error } = await supabase.from("members").update({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim() || null,
        plan: nextPlan,
        batch,
        membership_start_date: nextStart,
        membership_end_date: nextEnd,
        payment_amount: nextAmount,
        payment_mode: nextMode || null,
        status: nextStatus,
        notes: nextNotes.trim() || null,
      }).eq("id", member.id);

      setSaving(false);
      if (error) { toast.error("Save failed"); return; }
      toast.success("Changes saved ✓");
      onSaved();
    } else {
      const { error } = await supabase.from("members").insert({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim() || null,
        plan, batch,
        membership_start_date: startDate,
        membership_end_date: toISO(computedEnd),
        payment_amount: paymentAmount ? Number(paymentAmount) : null,
        payment_mode: paymentMode || null,
        status: "Active",
        notes: notes.trim() || null,
      });
      setSaving(false);
      if (error) { toast.error(error.message); return; }
      toast.success("Member added!");
      onSaved();
    }
  }

  async function toggleStatus() {
    if (!isEdit || !member) return;
    const goingInactive = member.status !== "Inactive";
    if (goingInactive) {
      setConfirmDeactivate(true);
      return;
    }
    const { error } = await supabase.from("members").update({ status: "Active" }).eq("id", member.id);
    if (error) { toast.error("Failed"); return; }
    toast.success("Membership activated ✓");
    onSaved();
  }

  async function confirmDeactivateNow() {
    if (!member) return;
    const { error } = await supabase.from("members").update({ status: "Inactive" }).eq("id", member.id);
    setConfirmDeactivate(false);
    if (error) { toast.error("Failed"); return; }
    toast.success("Membership deactivated");
    onSaved();
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-display text-2xl">
              {isEdit ? `Edit Member — ${member!.name}` : "Add New Member"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            <Field label="Full Name *" err={errs.name}>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </Field>
            <div className="grid sm:grid-cols-2 gap-3">
              <Field label="Phone (10 digits) *" err={errs.phone}>
                <Input value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))} />
              </Field>
              <Field label="Email" err={errs.email}>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </Field>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <Field label="Plan *">
                <Select value={plan} onValueChange={(v) => setPlan(v as Plan)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{PLANS.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                </Select>
              </Field>
              <Field label="Batch *">
                <Select value={batch} onValueChange={setBatch}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{BATCHES.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
                </Select>
              </Field>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <Field label="Start Date *">
                <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              </Field>
              {!isEdit && (
                <Field label="Duration">
                  <Select value={String(durationMonths)} onValueChange={(v) => setDurationMonths(Number(v))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {DURATIONS.map((d) => <SelectItem key={d.months} value={String(d.months)}>{d.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </Field>
              )}
            </div>
            {!isEdit && (
              <div className="text-xs text-muted-foreground">Membership ends on: <span className="font-semibold text-foreground">{fmtDate(computedEnd)}</span></div>
            )}
            <div className="grid sm:grid-cols-2 gap-3">
              <Field label="Payment Amount (₹)">
                <Input type="number" value={paymentAmount} onChange={(e) => setPaymentAmount(e.target.value)} />
              </Field>
              <Field label="Payment Mode">
                <Select value={paymentMode} onValueChange={setPaymentMode}>
                  <SelectTrigger><SelectValue placeholder="Select…" /></SelectTrigger>
                  <SelectContent>{PAY_MODES.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
                </Select>
              </Field>
            </div>
            <Field label={`Notes (${notes.length}/300)`} err={errs.notes}>
              <Textarea rows={3} maxLength={300} value={notes} onChange={(e) => setNotes(e.target.value)} />
            </Field>

            {/* Edit-only: status + renewal */}
            {isEdit && member && (
              <>
                <div className="mt-2 border-t border-border pt-4">
                  <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Membership Status</div>
                  <div className="flex items-center gap-3">
                    <span className={cn(
                      "inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs border font-semibold",
                      member.status === "Inactive"
                        ? "border-zinc-500/40 bg-zinc-500/15 text-zinc-300"
                        : "border-emerald-500/40 bg-emerald-500/15 text-emerald-300",
                    )}>
                      <span className={cn("h-1.5 w-1.5 rounded-full", member.status === "Inactive" ? "bg-zinc-400" : "bg-emerald-400")} />
                      {member.status === "Inactive" ? "INACTIVE" : "ACTIVE"}
                    </span>
                    {member.status === "Inactive" ? (
                      <Button size="sm" variant="neon" onClick={toggleStatus}>Activate Membership</Button>
                    ) : (
                      <Button size="sm" variant="outline" className="border-red-500/50 text-red-300 hover:bg-red-500/10" onClick={toggleStatus}>
                        Deactivate Membership
                      </Button>
                    )}
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Renew Membership</div>

                  <div className="text-xs text-muted-foreground mb-2">Select Plan for Renewal</div>
                  <div className="grid sm:grid-cols-3 gap-2 mb-4">
                    {PLANS.map((p) => {
                      const selected = renewPlan === p;
                      const info = PLAN_PRICING[p];
                      return (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setRenewPlan(p)}
                          className={cn(
                            "text-left rounded-xl border p-3 transition",
                            selected ? "border-primary bg-primary/10" : "border-border bg-card hover:border-primary/40",
                          )}
                        >
                          <div className="font-bold">{p}</div>
                          <div className="text-xs text-muted-foreground">₹{info.monthly}/mo</div>
                          <ul className="mt-1.5 text-[11px] text-muted-foreground space-y-0.5">
                            {info.features.map((f) => <li key={f}>• {f}</li>)}
                          </ul>
                        </button>
                      );
                    })}
                  </div>

                  <div className="text-xs text-muted-foreground mb-2">Renewal Duration</div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {DURATIONS.map((d) => (
                      <Button
                        key={d.months}
                        size="sm"
                        variant={renewMonths === d.months ? "neon" : "outline"}
                        onClick={() => { setRenewMonths(d.months); setRenewAmount(String(PLAN_PRICING[renewPlan].monthly * d.months)); }}
                      >
                        +{d.label}
                      </Button>
                    ))}
                  </div>

                  {renewPreview && (
                    <>
                      <div className="rounded-xl border border-primary/30 bg-primary/5 p-3 text-sm space-y-1 mb-3">
                        <div>Plan: <span className="font-semibold">{renewPlan}</span></div>
                        <div>New start: <span className="font-semibold">{fmtDate(renewPreview.start)}</span></div>
                        <div>New expiry: <span className="font-semibold">{fmtDate(renewPreview.end)}</span></div>
                        <div>Amount due: <span className="font-semibold">₹{renewPreview.amount.toLocaleString("en-IN")}</span></div>
                        {renewPreview.planChanged && (
                          <div className="text-amber-300 text-xs">Plan changed: {member!.plan} → {renewPlan}</div>
                        )}
                      </div>
                      <div className="grid sm:grid-cols-2 gap-3">
                        <Field label="Payment Amount (₹)">
                          <Input type="number" value={renewAmount} onChange={(e) => setRenewAmount(e.target.value)} />
                        </Field>
                        <Field label="Payment Mode">
                          <Select value={renewMode} onValueChange={setRenewMode}>
                            <SelectTrigger><SelectValue placeholder="Select…" /></SelectTrigger>
                            <SelectContent>{PAY_MODES.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
                          </Select>
                        </Field>
                      </div>
                    </>
                  )}
                </div>

                {member.notes && (
                  <div className="border-t border-border pt-3">
                    <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Notes History</div>
                    <div className="max-h-32 overflow-y-auto text-xs whitespace-pre-wrap text-muted-foreground bg-muted/30 rounded p-2">
                      {member.notes}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button variant="neon" onClick={handleSave} disabled={saving}>
              {saving ? "Saving…" : isEdit ? "Save Changes" : "Save Member"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={confirmDeactivate} onOpenChange={setConfirmDeactivate}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deactivate {member?.name}'s membership?</AlertDialogTitle>
            <AlertDialogDescription>They will lose access to the gym.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeactivateNow} className="bg-red-600 hover:bg-red-700 text-white">
              Deactivate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function Field({ label, err, children }: { label: string; err?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs text-muted-foreground mb-1">{label}</label>
      {children}
      {err && <p className="text-xs text-red-400 mt-1">{err}</p>}
    </div>
  );
}
