import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export function InquiryForm() {
  return (
    <section className="py-24 bg-card/30">
      <div className="container mx-auto max-w-3xl px-4">
        <div className="text-center mb-10">
          <span className="text-xs uppercase tracking-[0.3em] neon-text">Inquiry</span>
          <h2 className="text-display text-4xl md:text-6xl mt-3">Take the <span className="neon-text">First Step Today</span></h2>
        </div>
        <form
          onSubmit={(e) => { e.preventDefault(); toast.success("We'll be in touch shortly!"); }}
          className="bg-card border border-border rounded-3xl p-6 md:p-8 grid gap-4"
        >
          <Input required placeholder="Full Name" />
          <div className="grid sm:grid-cols-2 gap-4">
            <Input required type="tel" placeholder="Phone" />
            <Input required type="email" placeholder="Email" />
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <Select><SelectTrigger><SelectValue placeholder="Goal" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="lose">Lose Weight</SelectItem>
                <SelectItem value="muscle">Build Muscle</SelectItem>
                <SelectItem value="fitness">Improve Fitness</SelectItem>
                <SelectItem value="athletic">Athletic Performance</SelectItem>
              </SelectContent>
            </Select>
            <Select><SelectTrigger><SelectValue placeholder="Batch" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="early">Early Morning</SelectItem>
                <SelectItem value="morning">Morning</SelectItem>
                <SelectItem value="evening">Evening</SelectItem>
                <SelectItem value="night">Night</SelectItem>
              </SelectContent>
            </Select>
            <Select><SelectTrigger><SelectValue placeholder="Plan" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="basic">Basic</SelectItem>
                <SelectItem value="pro">Pro</SelectItem>
                <SelectItem value="elite">Elite</SelectItem>
                <SelectItem value="unsure">Not Sure</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Textarea placeholder="Message (optional)" rows={4} />
          <Button type="submit" variant="neon" size="lg" className="w-full">Book Free Consultation</Button>
        </form>
      </div>
    </section>
  );
}
