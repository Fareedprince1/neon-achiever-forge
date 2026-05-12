import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy | Achiever Gym" },
      { name: "description", content: "How Achiever Gym collects, uses and protects your personal data." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-32 pb-24">
        <div className="container mx-auto max-w-3xl px-4">
          <h1 className="text-display text-5xl md:text-6xl">Privacy <span className="neon-text">Policy</span></h1>
          <p className="text-muted-foreground mt-2">Last updated: May 2026</p>
          <div className="prose prose-invert mt-10 space-y-6 text-foreground/90">
            <Section title="1. Information We Collect">
              We collect information you provide when signing up — name, contact details, fitness goals, and health information shared with our coaches.
            </Section>
            <Section title="2. How We Use Your Data">
              To deliver coaching, manage your membership, communicate updates, and improve our services. We never sell your personal data.
            </Section>
            <Section title="3. Data Security">
              Your data is stored securely with industry-standard encryption and access controls.
            </Section>
            <Section title="4. Cookies">
              We use cookies for analytics and to remember your preferences. You can manage cookie settings via the banner.
            </Section>
            <Section title="5. Your Rights">
              You may request access, correction or deletion of your data at any time by emailing hello@achievergym.com.
            </Section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <h2 className="text-xl font-bold neon-text">{title}</h2>
      <p className="mt-3 text-muted-foreground">{children}</p>
    </div>
  );
}
