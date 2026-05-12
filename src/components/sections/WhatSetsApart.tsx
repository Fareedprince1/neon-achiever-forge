import { Button } from "@/components/ui/button";
import { Heart, Dumbbell, Flame, Zap, ArrowRight } from "lucide-react";

const cards = [
  { icon: Heart, title: "Cardio Training", desc: "Build endurance with treadmill, cycling, and rowing circuits engineered to torch calories." },
  { icon: Dumbbell, title: "Strength Build", desc: "Progressive overload programs with compound lifts and accessory work for raw power." },
  { icon: Flame, title: "Fat Loss", desc: "Metabolic conditioning and nutrition coaching to drop body fat sustainably." },
  { icon: Zap, title: "HIIT Workouts", desc: "Short, intense, sweat-soaked sessions that maximize output in minimal time." },
];

export function WhatSetsApart() {
  return (
    <section className="py-24 bg-card/30">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] neon-text">Our Edge</span>
            <h2 className="text-display text-4xl md:text-6xl mt-3 max-w-2xl">
              Discover What <span className="neon-text">Sets Us Apart</span>
            </h2>
          </div>
          <p className="text-muted-foreground max-w-md">Swipe to explore our four signature training pillars.</p>
        </div>

        <div className="flex gap-5 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory -mx-4 px-4">
          {cards.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="snap-start flex-shrink-0 w-[300px] md:w-[360px] bg-card border border-border rounded-3xl p-7 hover:border-primary transition-colors">
              <div className="h-14 w-14 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center mb-5">
                <Icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-display text-2xl">{title}</h3>
              <p className="text-sm text-muted-foreground mt-2 mb-6">{desc}</p>
              <Button variant="neon-outline" size="sm" className="rounded-full">Learn More <ArrowRight className="h-3 w-3" /></Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
