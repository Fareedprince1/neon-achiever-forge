import { IMG } from "@/lib/images";

const items = [
  { name: "Rohan M.", result: "Lost 18kg in 4 months", program: "HIIT + Nutrition Coaching" },
  { name: "Anita K.", result: "Gained 7kg lean mass", program: "Hypertrophy Program" },
  { name: "Vikram S.", result: "Cut 22kg in 6 months", program: "Strength + Cardio Combo" },
];

export function Transformations() {
  return (
    <section className="py-24 bg-card/30">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-[0.3em] neon-text">Transformations</span>
          <h2 className="text-display text-4xl md:text-6xl mt-3">Real People. <span className="neon-text">Real Results.</span></h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {items.map((it, i) => (
            <article key={it.name} className="bg-card border border-border rounded-3xl overflow-hidden hover:border-primary transition-colors">
              <div className="grid grid-cols-2 relative">
                <div className="aspect-square overflow-hidden">
                  <img src={IMG.transformations[i][0]} alt={`${it.name} before`} loading="lazy" className="w-full h-full object-cover" />
                  <span className="absolute top-3 left-3 bg-background/80 text-foreground text-[10px] font-bold uppercase rounded-full px-2 py-1">Before</span>
                </div>
                <div className="aspect-square overflow-hidden">
                  <img src={IMG.transformations[i][1]} alt={`${it.name} after`} loading="lazy" className="w-full h-full object-cover" />
                  <span className="absolute top-3 right-3 bg-primary text-primary-foreground text-[10px] font-bold uppercase rounded-full px-2 py-1">After</span>
                </div>
                <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-primary neon-glow" />
              </div>
              <div className="p-5">
                <h3 className="text-display text-xl">{it.name}</h3>
                <p className="neon-text text-sm font-bold mt-1">{it.result}</p>
                <p className="text-xs text-muted-foreground mt-1">{it.program}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
