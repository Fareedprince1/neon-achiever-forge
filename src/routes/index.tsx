import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FreeTrialModal, useFirstVisitTrialModal } from "@/components/FreeTrialModal";
import { Hero } from "@/components/sections/Hero";
import { FreeTrialBanner } from "@/components/sections/FreeTrialBanner";
import { Features } from "@/components/sections/Features";
import { BMICalculator } from "@/components/sections/BMICalculator";
import { WhatSetsApart } from "@/components/sections/WhatSetsApart";
import { Programs } from "@/components/sections/Programs";
import { Schedule } from "@/components/sections/Schedule";
import { Equipment } from "@/components/sections/Equipment";
import { Coaches } from "@/components/sections/Coaches";
import { Pricing } from "@/components/sections/Pricing";
import { Transformations } from "@/components/sections/Transformations";
import { CertStrip } from "@/components/sections/CertStrip";
import { Gallery } from "@/components/sections/Gallery";
import { Testimonials } from "@/components/sections/Testimonials";
import { Blog } from "@/components/sections/Blog";
import { InquiryForm } from "@/components/sections/InquiryForm";
import { FAQ } from "@/components/sections/FAQ";
import { Location } from "@/components/sections/Location";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Achiever Gym | Best Gym in Bengaluru" },
      { name: "description", content: "Strength, HIIT, hypertrophy and personal coaching at Achiever Gym Bengaluru. Get your first 3 days free — no credit card required." },
      { property: "og:title", content: "Achiever Gym | Best Gym in Bengaluru" },
      { property: "og:description", content: "Where Champions Are Made. Train smarter at Achiever Gym." },
    ],
  }),
  component: Index,
});

function Index() {
  const [trialOpen, setTrialOpen] = useFirstVisitTrialModal();
  const [open, setOpen] = useState(false);
  const isOpen = trialOpen || open;
  const setBoth = (v: boolean) => { setTrialOpen(v); setOpen(v); };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <Hero />
        <FreeTrialBanner onClaim={() => setOpen(true)} />
        <Features />
        <BMICalculator />
        <WhatSetsApart />
        <Programs />
        <Schedule />
        <Equipment />
        <Coaches />
        <Pricing />
        <Transformations />
        <CertStrip />
        <Gallery />
        <Testimonials />
        <Blog />
        <InquiryForm />
        <FAQ />
        <Location />
        <Contact />
      </main>
      <Footer />
      <FreeTrialModal open={isOpen} onOpenChange={setBoth} />
    </div>
  );
}
