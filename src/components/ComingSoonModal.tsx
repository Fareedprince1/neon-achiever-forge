import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function ComingSoonModal({ open, onOpenChange, title }: { open: boolean; onOpenChange: (v: boolean) => void; title?: string }) {
  const [email, setEmail] = useState("");
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-display text-2xl">Coming Soon</DialogTitle>
          <DialogDescription>
            {title ? `"${title}" is on the way. ` : ""}Drop your email and we'll notify you the moment it's published.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { toast.error("Please enter a valid email"); return; }
            toast.success("You're on the list! We'll be in touch.");
            setEmail("");
            onOpenChange(false);
          }}
          className="grid gap-3"
        >
          <Input type="email" required placeholder="you@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Button type="submit" variant="neon" size="lg">Notify Me</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
