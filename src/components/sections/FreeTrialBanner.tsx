import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export function FreeTrialBanner({ onClaim }: { onClaim: () => void }) {
  return (
    <section id="trial" className="relative">
      <div className="bg-primary text-primary-foreground">
        <div className="container mx-auto max-w-7xl px-4 py-5 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-3 text-center md:text-left">
            <Sparkles className="h-6 w-6" />
            <p className="text-base md:text-lg font-bold">
              Get Your First 3 Days FREE — No Credit Card Required
            </p>
          </div>
          <Button onClick={onClaim} className="bg-background text-foreground hover:bg-background/80 rounded-full px-6 h-11 font-bold">
            Claim Free Trial
          </Button>
        </div>
      </div>
    </section>
  );
}
