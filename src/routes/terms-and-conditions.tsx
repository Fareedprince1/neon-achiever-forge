import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/terms-and-conditions")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions | Achiever Gym" },
      { name: "description", content: "Membership terms, conduct and use of Achiever Gym facilities." },
    ],
  }),
  component: Page,
});

function Page() {
  const sections: [string, string][] = [
    ["1. Membership", "Membership is non-transferable. Members must be 16+ or accompanied by a guardian."],
    ["2. Code of Conduct", "Respect staff, coaches and fellow members. Re-rack weights and wipe equipment after use."],
    ["3. Health & Liability", "You confirm fitness to train. Achiever Gym is not liable for injuries arising from improper use of equipment."],
    ["4. Cancellation", "Either party may terminate membership with 30 days' notice. Outstanding dues remain payable."],
    ["5. Changes", "We may update class schedules, pricing or facilities with prior notice."],
  ];
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-32 pb-24">
        <div className="container mx-auto max-w-3xl px-4">
          <h1 className="text-display text-5xl md:text-6xl">Terms & <span className="neon-text">Conditions</span></h1>
          <p className="text-muted-foreground mt-2">Last updated: May 2026</p>
          <div className="mt-10 space-y-4">
            {sections.map(([t, b]) => (
              <div key={t} className="bg-card border border-border rounded-2xl p-6">
                <h2 className="text-xl font-bold neon-text">{t}</h2>
                <p className="mt-3 text-muted-foreground">{b}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
