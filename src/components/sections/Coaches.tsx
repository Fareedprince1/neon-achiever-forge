import { IMG } from "@/lib/images";
import { Star, Instagram, Twitter, Facebook } from "lucide-react";

const coaches = [
  { name: "Alex Power", role: "Strength & Conditioning", cert: "ACE Certified", bio: "10+ years building elite athletes. Specializes in barbell programming." },
  { name: "Maya Cruz", role: "HIIT & Fat Loss", cert: "NASM Certified", bio: "Metabolic conditioning expert with 500+ transformations to her name." },
  { name: "Logan Steel", role: "Bodybuilding & Hypertrophy", cert: "CrossFit L2", bio: "National-level bodybuilder mentoring the next generation of lifters." },
];

export function Coaches() {
  return (
    <section id="coaches" className="py-24 bg-card/30">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="max-w-2xl">
          <span className="text-xs uppercase tracking-[0.3em] neon-text">Coaches</span>
          <h2 className="text-display text-4xl md:text-6xl mt-3">Your Fitness Goals, <span className="neon-text">Their Expertise</span></h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-12">
          {coaches.map((c, i) => (
            <article key={c.name} className="bg-card border border-border rounded-3xl overflow-hidden hover:border-primary transition-colors">
              <div className="aspect-[4/5] overflow-hidden">
                <img src={IMG.coaches[i]} alt={c.name} loading="lazy" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-display text-2xl">{c.name}</h3>
                    <p className="text-sm text-primary">{c.role}</p>
                  </div>
                  <span className="text-[10px] bg-primary/10 text-primary border border-primary/30 rounded-full px-2 py-1 whitespace-nowrap">{c.cert}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-3">{c.bio}</p>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, k) => (
                      <Star key={k} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <div className="flex gap-2">
                    {[Instagram, Twitter, Facebook].map((Ic, k) => (
                      <a key={k} href="#" aria-label="social" className="h-8 w-8 rounded-full border border-border flex items-center justify-center hover:border-primary hover:text-primary"><Ic className="h-3.5 w-3.5" /></a>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
