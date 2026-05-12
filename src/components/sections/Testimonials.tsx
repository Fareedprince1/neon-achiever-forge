import { useEffect, useState } from "react";
import { IMG } from "@/lib/images";
import { Star, Quote } from "lucide-react";

const items = [
  { name: "Sneha R.", duration: "Member · 2 yrs", quote: "The coaches push me beyond limits I never thought I had. My energy is unmatched." },
  { name: "Arjun T.", duration: "Member · 1 yr", quote: "Cleanest equipment and the most welcoming community. Achiever feels like home." },
  { name: "Priya N.", duration: "Member · 8 mo", quote: "Lost 12kg, gained confidence and made lifelong friends. Worth every rupee." },
  { name: "Karan V.", duration: "Member · 3 yrs", quote: "Programming is elite. I went from skinny to strong in under a year." },
];

export function Testimonials() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % items.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="py-24 bg-card/30">
      <div className="container mx-auto max-w-5xl px-4">
        <div className="text-center mb-10">
          <span className="text-xs uppercase tracking-[0.3em] neon-text">Testimonials</span>
          <h2 className="text-display text-4xl md:text-6xl mt-3">Your Success Stories, <span className="neon-text">Our Inspiration</span></h2>
        </div>

        <div className="relative bg-card border border-border rounded-3xl p-8 md:p-12">
          <Quote className="h-12 w-12 text-primary opacity-30 mb-4" />
          <div className="min-h-[160px]">
            {items.map((t, k) => (
              <div key={k} className={`transition-opacity duration-500 ${k === i ? "opacity-100" : "opacity-0 absolute inset-12"}`}>
                {k === i && (
                  <>
                    <p className="text-xl md:text-2xl leading-relaxed">"{t.quote}"</p>
                    <div className="flex items-center gap-4 mt-6">
                      <img src={IMG.testimonials[k]} alt={t.name} className="h-12 w-12 rounded-full object-cover border border-border" />
                      <div>
                        <div className="font-bold">{t.name}</div>
                        <div className="text-xs text-muted-foreground">{t.duration}</div>
                      </div>
                      <div className="ml-auto flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, s) => <Star key={s} className="h-4 w-4 fill-primary text-primary drop-shadow-[0_0_4px_rgba(200,244,0,0.8)]" />)}
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-6">
            {items.map((_, k) => (
              <button key={k} aria-label={`Slide ${k+1}`} onClick={() => setI(k)} className={`h-1.5 rounded-full transition-all ${k === i ? "bg-primary w-8" : "bg-border w-3"}`} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
