import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  ["Is there a joining fee?", "No joining fee on annual memberships. Monthly plans include a one-time ₹999 onboarding fee."],
  ["Can I pause my membership?", "Yes, you can pause for up to 30 days per year with prior notice."],
  ["Do you offer personal training?", "All plans include trainer support. Pro and Elite include dedicated PT sessions."],
  ["What are your timings?", "Mon–Sat: 5:00 AM – 10:00 PM. Sun: 6:00 AM – 8:00 PM."],
  ["Is nutrition plan included?", "Yes, included in Pro and Elite plans. Available as add-on for Basic."],
  ["Separate sections for men and women?", "We have a women-only training zone and dedicated changing facilities."],
  ["Is parking available?", "Yes, free covered parking for two-wheelers and four-wheelers."],
  ["What is your refund policy?", "Full refund within 7 days of joining if unsatisfied. See refund policy for details."],
];

export function FAQ() {
  return (
    <section id="faq" className="py-24">
      <div className="container mx-auto max-w-3xl px-4">
        <div className="text-center mb-10">
          <span className="text-xs uppercase tracking-[0.3em] neon-text">FAQ</span>
          <h2 className="text-display text-4xl md:text-6xl mt-3">Got Questions? <span className="neon-text">We Have Answers.</span></h2>
        </div>
        <Accordion type="single" collapsible defaultValue="item-0" className="space-y-3">
          {faqs.map(([q, a], i) => (
            <AccordionItem key={i} value={`item-${i}`} className="bg-card border border-border rounded-2xl px-5 [&[data-state=open]]:border-primary">
              <AccordionTrigger className="text-left hover:no-underline py-5">
                <span className="font-bold">{q}</span>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
