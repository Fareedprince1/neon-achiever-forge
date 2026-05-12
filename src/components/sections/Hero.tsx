import { Button } from "@/components/ui/button";
import { IMG } from "@/lib/images";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section id="home" className="relative min-h-[100svh] flex items-center pt-20 overflow-hidden">
      <div className="absolute inset-0">
        <img src={IMG.hero} alt="Athlete training at Achiever Gym" className="w-full h-full object-cover" loading="eager" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="relative container mx-auto max-w-7xl px-4 grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-primary border border-primary/40 rounded-full px-3 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" /> Bengaluru's #1 Performance Gym
          </span>
          <h1 className="text-display text-5xl md:text-7xl lg:text-8xl mt-5">
            Sculpt Your Body, <br />
            <span className="neon-text">Elevate</span> Your Spirit
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-lg">
            Achiever Gym — Where Champions Are Made. Train with elite coaches, world-class equipment, and a community that pushes you further.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild variant="neon" size="lg"><a href="#trial">Get Started <ArrowRight className="h-4 w-4" /></a></Button>
            <Button asChild variant="neon-outline" size="lg"><a href="#programs">Explore Programs</a></Button>
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            {[
              ["12K+", "Members"],
              ["50+", "Trainers"],
              ["15+", "Years"],
            ].map(([n, l]) => (
              <div key={l} className="bg-card/80 backdrop-blur border border-border rounded-2xl px-5 py-3">
                <div className="text-display text-2xl neon-text">{n}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">{l}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="hidden lg:block relative">
          <div className="absolute -top-6 -right-6 bg-card border border-border rounded-2xl p-4 neon-glow-sm">
            <div className="text-display text-3xl neon-text">98%</div>
            <div className="text-xs text-muted-foreground">Goal Success Rate</div>
          </div>
          <div className="absolute bottom-10 -left-6 bg-card border border-border rounded-2xl p-4">
            <div className="text-display text-3xl">4.9★</div>
            <div className="text-xs text-muted-foreground">Member Rating</div>
          </div>
        </div>
      </div>

      {/* Brand strip */}
      <div className="absolute bottom-0 inset-x-0 border-t border-border bg-background/60 backdrop-blur">
        <div className="container mx-auto max-w-7xl px-4 py-5 flex flex-wrap justify-center md:justify-between gap-6 items-center text-muted-foreground">
          {["NIKE", "ADIDAS", "UNDER ARMOUR", "REEBOK", "PUMA", "TECHNOGYM"].map((b) => (
            <span key={b} className="text-display text-lg tracking-widest hover:neon-text transition-colors">{b}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
