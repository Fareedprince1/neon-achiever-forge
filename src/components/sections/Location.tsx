import { Button } from "@/components/ui/button";
import { MapPin, Clock, Phone, Mail } from "lucide-react";

export function Location() {
  return (
    <section className="py-24 bg-card/30">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="max-w-2xl mb-10">
          <span className="text-xs uppercase tracking-[0.3em] neon-text">Location</span>
          <h2 className="text-display text-4xl md:text-6xl mt-3">Find <span className="neon-text">Us Here</span></h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-3xl overflow-hidden border border-border min-h-[360px]">
            <iframe
              title="Achiever Gym Location"
              src="https://www.google.com/maps?q=Bengaluru&output=embed"
              className="w-full h-full min-h-[360px] grayscale contrast-125"
              loading="lazy"
            />
          </div>

          <div className="bg-card border border-border rounded-3xl p-7">
            <ul className="space-y-5">
              <Row icon={MapPin}>45 Fitness Boulevard, Sector 12, Bengaluru — 560001</Row>
              <Row icon={Clock}>Mon–Sat: 5:00 AM – 10:00 PM<br />Sun: 6:00 AM – 8:00 PM</Row>
              <Row icon={Phone}>+91 98765 43210</Row>
              <Row icon={Mail}>hello@achievergym.com</Row>
            </ul>
            <Button asChild variant="neon" size="lg" className="mt-7"><a href="https://maps.google.com/?q=Bengaluru" target="_blank" rel="noreferrer">Get Directions</a></Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Row({ icon: Icon, children }: { icon: any; children: React.ReactNode }) {
  return (
    <li className="flex gap-4">
      <span className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center flex-shrink-0">
        <Icon className="h-4 w-4 text-primary" />
      </span>
      <span className="text-sm text-foreground/90 leading-relaxed pt-2">{children}</span>
    </li>
  );
}
