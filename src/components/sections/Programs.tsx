import { IMG } from "@/lib/images";

const programs = [
  "Barbell Basics", "Kettlebell Masterclass", "Cardio Power Boost",
  "Hypertrophy", "Rope Climbing", "TRX Suspension",
];

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
            <a key={p} href="#trial" className="group relative aspect-[4/5] overflow-hidden rounded-3xl border border-border block">
              <img src={IMG.programs[i]} alt={p} loading="lazy" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <span className="self-start opacity-0 group-hover:opacity-100 transition-opacity bg-primary text-primary-foreground text-xs font-bold rounded-full px-3 py-1 mb-3 neon-glow-sm">
                  {String(i + 1).padStart(2, "0")} · Featured
                </span>
                <h3 className="text-display text-3xl">{p}</h3>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
