import { IMG } from "@/lib/images";
import { ArrowRight } from "lucide-react";

const posts = [
  { tag: "Fat Loss", title: "Top 5 Exercises for Fat Loss", date: "Apr 22, 2026" },
  { tag: "Nutrition", title: "What to Eat Before & After Workout", date: "Apr 15, 2026" },
  { tag: "Mindset", title: "How to Stay Consistent at the Gym", date: "Apr 03, 2026" },
];

export function Blog() {
  return (
    <section className="py-24">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="max-w-2xl mb-10">
          <span className="text-xs uppercase tracking-[0.3em] neon-text">Insights</span>
          <h2 className="text-display text-4xl md:text-6xl mt-3">Fuel Your <span className="neon-text">Knowledge</span></h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {posts.map((p, i) => (
            <article key={p.title} className="bg-card border border-border rounded-3xl overflow-hidden hover:border-primary transition-colors group">
              <div className="aspect-[16/10] overflow-hidden">
                <img src={IMG.blog[i]} alt={p.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-6">
                <span className="inline-block bg-primary/10 text-primary border border-primary/30 text-[10px] uppercase tracking-widest rounded-full px-2 py-1">{p.tag}</span>
                <h3 className="text-xl font-bold mt-3">{p.title}</h3>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-xs text-muted-foreground">{p.date}</span>
                  <a href="#" className="inline-flex items-center gap-1 text-sm neon-text hover:underline">Read More <ArrowRight className="h-3 w-3" /></a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
