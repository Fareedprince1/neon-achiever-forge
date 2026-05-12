import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/refund-policy")({
  head: () => ({
    meta: [
      { title: "Refund Policy | Achiever Gym" },
      { name: "description", content: "Refund and cancellation policy for Achiever Gym memberships." },
    ],
  }),
  component: Page,
});

function Page() {
  const sections: [string, string][] = [
    ["1. 7-Day Satisfaction Guarantee", "If you are not satisfied within 7 days of joining, request a full refund — no questions asked."],
    ["2. Annual Memberships", "Pro-rata refunds for unused months apply, less a 10% processing fee, after the first 7 days."],
    ["3. Personal Training", "Unused PT sessions are refundable within 30 days of purchase."],
    ["4. Refund Timeline", "Refunds are processed within 7–10 business days to the original payment method."],
    ["5. Contact", "Email hello@achievergym.com for refund requests."],
  ];
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-32 pb-24">
        <div className="container mx-auto max-w-3xl px-4">
          <h1 className="text-display text-5xl md:text-6xl">Refund <span className="neon-text">Policy</span></h1>
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
