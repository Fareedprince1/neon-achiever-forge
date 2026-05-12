import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";

function category(bmi: number) {
  if (bmi < 18.5) return { label: "Underweight", color: "bg-blue-500", pct: 20 };
  if (bmi < 25) return { label: "Normal", color: "bg-primary", pct: 50 };
  if (bmi < 30) return { label: "Overweight", color: "bg-amber-500", pct: 75 };
  return { label: "Obese", color: "bg-destructive", pct: 95 };
}

export function BMICalculator() {
  const [h, setH] = useState("");
  const [w, setW] = useState("");
  const [bmi, setBmi] = useState<number | null>(null);

  const calc = (e: React.FormEvent) => {
    e.preventDefault();
    const hm = Number(h) / 100;
    const wk = Number(w);
    if (!hm || !wk) return;
    setBmi(+(wk / (hm * hm)).toFixed(1));
  };

  const cat = bmi ? category(bmi) : null;

  return (
    <section className="py-24">
      <div className="container mx-auto max-w-5xl px-4">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs uppercase tracking-[0.3em] neon-text">BMI Calculator</span>
          <h2 className="text-display text-4xl md:text-6xl mt-3">Know Your <span className="neon-text">Fitness Level</span></h2>
        </div>

        <div className="bg-card border border-border rounded-3xl p-8 md:p-10 mt-10">
          <form onSubmit={calc} className="grid sm:grid-cols-3 gap-4 items-end">
            <div>
              <label className="text-sm text-muted-foreground">Height (cm)</label>
              <Input type="number" min="50" max="250" value={h} onChange={(e) => setH(e.target.value)} placeholder="175" required />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Weight (kg)</label>
              <Input type="number" min="20" max="300" value={w} onChange={(e) => setW(e.target.value)} placeholder="70" required />
            </div>
            <Button type="submit" variant="neon" size="lg">Calculate BMI</Button>
          </form>

          {bmi !== null && cat && (
            <div className="mt-8">
              <div className="flex items-baseline justify-between">
                <div>
                  <div className="text-display text-5xl neon-text">{bmi}</div>
                  <div className="text-sm text-muted-foreground">Your BMI · {cat.label}</div>
                </div>
              </div>
              <div className="mt-4 h-3 rounded-full bg-secondary overflow-hidden">
                <div className={`${cat.color} h-full transition-all`} style={{ width: `${cat.pct}%` }} />
              </div>
              <div className="flex justify-between text-[11px] text-muted-foreground mt-2">
                <span>Under</span><span>Normal</span><span>Over</span><span>Obese</span>
              </div>
            </div>
          )}

          <a href="#contact" className="inline-flex items-center gap-2 mt-6 text-sm neon-text hover:underline">
            Want a personalized plan? Talk to our experts <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
