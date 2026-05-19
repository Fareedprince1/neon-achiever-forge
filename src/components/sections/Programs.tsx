import { IMG } from "@/lib/images";
import { setPreselectPlan, scrollToInquiry } from "@/lib/plan-preselect";

const programs = [
  { name: "Barbell Basics",        difficulty: "Beginner",     weeks: "8 weeks",  sessions: "3×/week", plan: "Basic" },
  { name: "Kettlebell Masterclass", difficulty: "Intermediate", weeks: "6 weeks",  sessions: "3×/week", plan: "Pro"   },
  { name: "Cardio Power Boost",    difficulty: "Beginner",     weeks: "4 weeks",  sessions: "4×/week", plan: "Basic" },
  { name: "Hypertrophy",            difficulty: "Advanced",     weeks: "12 weeks", sessions: "5×/week", plan: "Elite" },
  { name: "Rope Climbing",          difficulty: "Intermediate", weeks: "6 weeks",  sessions: "2×/week", plan: "Pro"   },
  { name: "TRX Suspension",         difficulty: "Intermediate", weeks: "8 weeks",  sessions: "3×/week", plan: "Pro"   },
];

const diffColor: Record<string, string> = {
  Beginner: "bg-green-500/15 text-green-400 border-green-500/30",
  Intermediate: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  Advanced: "bg-red-500/15 text-red-400 border-red-500/30",
};

export function Programs() {
  return (
    <section id="programs" className="py-24">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="max-w-2xl">
          <span className="text-xs uppercase tracking-[0.3em] neon-text">Programs</span>
          <h2 className="text-display text-4xl md:text-6xl mt-3">
            Train Smarter, <br /><span className="neon-text">Unleash Your Potential</span>
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-12">
          {programs.map((p, i) => (
            <button
              key={p.name}
              type="button"
              onClick={() => { setPreselectPlan(p.plan); scrollToInquiry(); }}
              className="group relative aspect-[4/5] overflow-hidden rounded-3xl border border-border block text-left"
            >
              <img src={IMG.programs[i]} alt={p.name} loading="lazy" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
              <div className="absolute top-4 left-4 flex gap-2">
                <span className={`text-[10px] font-bold uppercase tracking-wider border rounded-full px-2.5 py-1 ${diffColor[p.difficulty]}`}>{p.difficulty}</span>
              </div>
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <span className="self-start opacity-0 group-hover:opacity-100 transition-opacity bg-primary text-primary-foreground text-xs font-bold rounded-full px-3 py-1 mb-3 neon-glow-sm">
                  {String(i + 1).padStart(2, "0")} · Featured
                </span>
                <h3 className="text-display text-3xl">{p.name}</h3>
                <div className="flex gap-3 mt-2 text-xs text-foreground/80">
                  <span>{p.weeks}</span>
                  <span>·</span>
                  <span>{p.sessions}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
