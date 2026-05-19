import { Apple, Users, LineChart, Crown, HeartHandshake, Dumbbell, Heart, Flame, Zap, ArrowRight } from "lucide-react";
import { useReveal } from "@/hooks/use-reveal";

const items = [
  { icon: Apple, title: "Nutrition Guidance", desc: "Custom diet plans aligned to your goals and preferences." },
  { icon: Dumbbell, title: "Expert Trainers", desc: "Certified coaches with years of athletic experience." },
  { icon: LineChart, title: "Progress Tracking", desc: "Monthly assessments and data-driven adjustments." },
  { icon: Crown, title: "Premium Membership", desc: "Lounges, towels, and concierge add-ons that elevate." },
  { icon: HeartHandshake, title: "Community Support", desc: "Train alongside a tribe that holds you accountable." },
  { icon: Users, title: "Next-Level Equipment", desc: "Hammer Strength, Technogym, and free weights galore." },
];

const pillars = [
  { icon: Heart,  title: "Cardio Training", desc: "Endurance + heart-health programming.", href: "#schedule" },
  { icon: Dumbbell, title: "Strength Build", desc: "Progressive overload, perfect form.", href: "#programs" },
  { icon: Flame,  title: "Fat Loss",        desc: "Targeted plans to torch body fat.",  href: "#pricing" },
  { icon: Zap,    title: "HIIT Workouts",   desc: "High-intensity, low-time, big results.", href: "#programs" },
];

export function Features() {
  const ref = useReveal();
  return (
    <section id="about" className="py-24">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="max-w-2xl">
          <span className="text-xs uppercase tracking-[0.3em] neon-text">About Achiever</span>
          <h2 className="text-display text-4xl md:text-6xl mt-3">
            Inspired to Inspire <span className="neon-text">Your Best Self</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            We blend elite coaching, science-backed programming and a culture of excellence to forge bodies and minds that perform.
          </p>
        </div>

        <div ref={ref} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-12">
          {items.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-card border border-border rounded-2xl p-6 hover:border-primary transition-colors group">
              <div className="h-12 w-12 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center mb-4 group-hover:neon-glow-sm transition-all">
                <Icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">{title}</h3>
              <p className="text-sm text-muted-foreground mt-2">{desc}</p>
            </div>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-8">
          {pillars.map(({ icon: Icon, title, desc, href }) => (
            <div key={title} className="bg-card border border-border rounded-2xl p-6 hover:border-primary transition-colors group">
              <div className="h-12 w-12 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center mb-4">
                <Icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-bold">{title}</h3>
              <p className="text-sm text-muted-foreground mt-2">{desc}</p>
              <a href={href} className="inline-flex items-center gap-1 text-sm neon-text mt-3 hover:underline">
                Learn More <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
