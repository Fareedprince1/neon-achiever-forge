import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Phone, Mail, MapPin, Clock, Instagram, Facebook, Youtube, Twitter } from "lucide-react";
import { toast } from "sonner";

export function Contact() {
  return (
    <section id="contact" className="py-24">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="max-w-2xl mb-10">
          <span className="text-xs uppercase tracking-[0.3em] neon-text">Contact</span>
          <h2 className="text-display text-4xl md:text-6xl mt-3">Connect. Engage. <span className="neon-text">Transform.</span></h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <form
            onSubmit={(e) => { e.preventDefault(); toast.success("Message sent — we'll reply within 24h."); }}
            className="bg-card border border-border rounded-3xl p-7 grid gap-4"
          >
            <Input required placeholder="Name" />
            <Input required type="email" placeholder="Email" />
            <Input required type="tel" placeholder="Phone" />
            <Textarea required placeholder="Message" rows={5} />
            <Button type="submit" variant="neon" size="lg">Send Message</Button>
          </form>

          <div className="bg-card border border-border rounded-3xl p-7 flex flex-col gap-5">
            <Info icon={Phone} label="Phone" value="+91 98765 43210" />
            <Info icon={Mail} label="Email" value="hello@achievergym.com" />
            <Info icon={MapPin} label="Address" value="45 Fitness Boulevard, Sector 12, Bengaluru" />
            <Info icon={Clock} label="Hours" value="Mon–Sat 5AM–10PM · Sun 6AM–8PM" />
            <div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Follow Us</div>
              <div className="flex gap-3">
                {[Instagram, Facebook, Youtube, Twitter].map((Ic, i) => (
                  <a key={i} href="#" aria-label="social" className="h-10 w-10 rounded-full border border-border flex items-center justify-center hover:border-primary hover:text-primary transition-colors">
                    <Ic className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Info({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex gap-4">
      <span className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center flex-shrink-0">
        <Icon className="h-4 w-4 text-primary" />
      </span>
      <div>
        <div className="text-[11px] uppercase tracking-widest text-muted-foreground">{label}</div>
        <div className="text-sm font-medium">{value}</div>
      </div>
    </div>
  );
}
