import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

type Props = { open: boolean; onOpenChange: (o: boolean) => void };

export function FreeTrialModal({ open, onOpenChange }: Props) {
  const [submitting, setSubmitting] = useState(false);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-display text-2xl">Claim your 3 days free</DialogTitle>
          <DialogDescription>Tell us a bit about you and we'll set up your trial.</DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSubmitting(true);
            setTimeout(() => {
              setSubmitting(false);
              onOpenChange(false);
              toast.success("Trial booked! We'll call you shortly.");
            }, 600);
          }}
          className="grid gap-3"
        >
          <Input required placeholder="Full Name" />
          <Input required type="tel" placeholder="Phone" />
          <Select>
            <SelectTrigger><SelectValue placeholder="Your Goal" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="lose">Lose Weight</SelectItem>
              <SelectItem value="muscle">Build Muscle</SelectItem>
              <SelectItem value="fitness">Improve Fitness</SelectItem>
              <SelectItem value="athletic">Athletic Performance</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger><SelectValue placeholder="Preferred Batch" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="early">Early Morning</SelectItem>
              <SelectItem value="morning">Morning</SelectItem>
              <SelectItem value="evening">Evening</SelectItem>
              <SelectItem value="night">Night</SelectItem>
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
