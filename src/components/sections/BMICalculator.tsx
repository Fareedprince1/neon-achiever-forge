import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";

function category(bmi: number) {
  if (bmi < 18.5) return { label: "Underweight", color: "bg-red-500", text: "text-red-500", pct: 20 };
  if (bmi < 25)   return { label: "Normal",      color: "bg-green-500", text: "text-green-500", pct: 50 };
  if (bmi < 30)   return { label: "Overweight",  color: "bg-yellow-500", text: "text-yellow-500", pct: 75 };
  return            { label: "Obese",       color: "bg-red-500", text: "text-red-500", pct: 95 };
}

export function BMICalculator() {
  const [h, setH] = useState("");
  const [w, setW] = useState("");
  const [bmi, setBmi] = useState<number | null>(null);
  const [errors, setErrors] = useState<{ h?: string; w?: string }>({});

  const calc = (e: React.FormEvent) => {
    e.preventDefault();
    const hn = Number(h);
    const wn = Number(w);
    const next: { h?: string; w?: string } = {};
    if (!hn || hn <= 0) next.h = "Enter a valid height";
    else if (hn < 50 || hn > 250) next.h = "Height must be between 50 and 250 cm";
    if (!wn || wn <= 0) next.w = "Enter a valid weight";
    else if (wn < 20 || wn > 300) next.w = "Weight must be between 20 and 300 kg";
    setErrors(next);
    if (next.h || next.w) { setBmi(null); return; }
    const hm = hn / 100;
    setBmi(+(wn / (hm * hm)).toFixed(1));
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
          <form onSubmit={calc} className="grid sm:grid-cols-3 gap-4 items-start" noValidate>
            <div>
              <label className="text-sm text-muted-foreground">Height (cm)</label>
              <Input type="number" value={h} onChange={(e) => setH(e.target.value)} placeholder="175"
                className={errors.h ? "border-red-500 focus-visible:ring-red-500" : ""} />
              {errors.h && <p className="text-xs text-red-500 mt-1">{errors.h}</p>}
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Weight (kg)</label>
              <Input type="number" value={w} onChange={(e) => setW(e.target.value)} placeholder="70"
                className={errors.w ? "border-red-500 focus-visible:ring-red-500" : ""} />
              {errors.w && <p className="text-xs text-red-500 mt-1">{errors.w}</p>}
            </div>
            <Button type="submit" variant="neon" size="lg" className="sm:mt-6">Calculate BMI</Button>
          </form>

          {bmi !== null && cat && (
            <div className="mt-8 animate-fade-in">
              <div className="flex items-baseline justify-between">
                <div>
                  <div className={`text-display text-5xl ${cat.text}`}>Your BMI is {bmi}</div>
                  <div className={`text-sm mt-1 ${cat.text}`}>Category: {cat.label}</div>
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

          <a href="#inquiry" className="inline-flex items-center gap-2 mt-6 text-sm neon-text hover:underline">
            Want a personalized plan? Talk to our experts <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
