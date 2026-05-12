import { Bike, Dumbbell, Cog, Activity } from "lucide-react";

const items = [
  { icon: Bike, title: "Cardio Zone", desc: "Treadmills, ellipticals, bikes & rowers from Technogym." },
  { icon: Dumbbell, title: "Free Weights", desc: "Olympic bars, dumbbells up to 70kg, premium plates." },
  { icon: Cog, title: "Cable & Machines", desc: "Hammer Strength selectorized & plate-loaded stations." },
  { icon: Activity, title: "Functional Zone", desc: "Turf, sleds, ropes, kettlebells, and rigs for athletes." },
];

export function Equipment() {
  return (
    <section className="py-24">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="max-w-2xl">
          <span className="text-xs uppercase tracking-[0.3em] neon-text">Equipment</span>
          <h2 className="text-display text-4xl md:text-6xl mt-3">World-Class Equipment, <span className="neon-text">Zero Excuses</span></h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-12">
          {items.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-card border border-border rounded-3xl p-6 hover:border-primary transition-colors">
              <Icon className="h-10 w-10 text-primary mb-4" />
              <h3 className="font-bold text-lg">{title}</h3>
              <p className="text-sm text-muted-foreground mt-2">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
