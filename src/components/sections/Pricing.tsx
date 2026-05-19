import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Plan = {
  name: string; monthly: number; yearly: number; savings: number; popular?: boolean;
  features: { label: string; on: boolean }[];
};

const plans: Plan[] = [
  { name: "Basic", monthly: 999, yearly: 799, savings: 2400, features: [
    { label: "Gym Floor Access", on: true },
    { label: "Locker Room", on: true },
    { label: "Basic Equipment", on: true },
    { label: "1 Guest Pass / month", on: true },
    { label: "Group Classes", on: false },
    { label: "Personal Trainer", on: false },
  ]},
  { name: "Pro", monthly: 1799, yearly: 1439, savings: 4320, popular: true, features: [
    { label: "Everything in Basic", on: true },
    { label: "All Group Classes", on: true },
    { label: "Diet & Nutrition Plan", on: true },
    { label: "Progress Tracking", on: true },
    { label: "2 PT Sessions / month", on: true },
    { label: "Dedicated Coach", on: false },
  ]},
  { name: "Elite", monthly: 2999, yearly: 2399, savings: 7200, features: [
    { label: "Everything in Pro", on: true },
    { label: "Dedicated Personal Coach", on: true },
    { label: "Custom Workout Plan", on: true },
    { label: "Priority Class Booking", on: true },
    { label: "Unlimited PT Sessions", on: true },
    { label: "Monthly Body Assessment", on: true },
  ]},
];

export function Pricing() {
  const [yearly, setYearly] = useState(false);
  return (
    <section id="pricing" className="py-24">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs uppercase tracking-[0.3em] neon-text">Pricing</span>
          <h2 className="text-display text-4xl md:text-6xl mt-3">Choose Your Plan, <span className="neon-text">Start Your Journey</span></h2>

          <div className="inline-flex items-center bg-card border border-border rounded-full p-1 mt-7">
            <button onClick={() => setYearly(false)} className={cn("px-5 py-2 rounded-full text-sm transition-colors", !yearly && "bg-primary text-primary-foreground font-bold")}>Monthly</button>
            <button onClick={() => setYearly(true)} className={cn("px-5 py-2 rounded-full text-sm transition-colors", yearly && "bg-primary text-primary-foreground font-bold")}>Yearly <span className="text-[10px] opacity-80">−20%</span></button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-12">
          {plans.map((p) => {
            const price = yearly ? p.yearly : p.monthly;
            return (
              <div key={p.name} className={cn(
                "rounded-3xl p-7 border transition-all relative hover:-translate-y-1",
                p.popular
                  ? "bg-primary text-primary-foreground border-primary neon-glow scale-[1.02]"
                  : "bg-card border-border hover:border-primary hover:shadow-[0_0_24px_-4px_hsl(var(--primary)/0.6)]"
              )}>
                {p.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-background text-primary border border-primary text-[10px] font-bold uppercase tracking-widest rounded-full px-3 py-1 flex items-center gap-2">
                    <span className="relative inline-flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                    </span>
                    Most Popular
                  </span>
                )}
                <h3 className="text-display text-3xl uppercase">{p.name}</h3>
                <div className="mt-4">
                  <span className="text-display text-5xl">₹{price.toLocaleString("en-IN")}</span>
                  <span className={cn("text-sm ml-1", p.popular ? "text-primary-foreground/70" : "text-muted-foreground")}>/mo{yearly ? " · billed yearly" : ""}</span>
                </div>
                {yearly && (
                  <span className={cn(
                    "inline-block mt-3 text-[11px] font-bold uppercase tracking-wider rounded-full px-3 py-1",
                    p.popular ? "bg-background/20 text-primary-foreground" : "bg-green-500/15 text-green-500 border border-green-500/30"
                  )}>
                    Save ₹{p.savings.toLocaleString("en-IN")}/yr
                  </span>
                )}
                <ul className="mt-6 space-y-3">
                  {p.features.map((f) => (
                    <li key={f.label} className={cn("flex gap-3 items-center text-sm", !f.on && "opacity-50")}>
                      {f.on
                        ? <Check className={cn("h-4 w-4 flex-shrink-0", p.popular ? "" : "text-primary")} />
                        : <X className="h-4 w-4 flex-shrink-0" />}
                      <span className={!f.on ? "line-through" : ""}>{f.label}</span>
                    </li>
                  ))}
                </ul>
                <Button asChild variant={p.popular ? "default" : "neon"} size="lg" className={cn("w-full mt-7", p.popular && "bg-background text-foreground hover:bg-background/90")}>
                  <a href="#inquiry">Get {p.name}</a>
                </Button>
              </div>
            );
          })}
        </div>

        <p className="text-center mt-8 text-muted-foreground">
          Not sure? <a href="#inquiry" className="neon-text hover:underline">Book a free consultation →</a>
        </p>
      </div>
    </section>
  );
}
