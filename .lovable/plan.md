
# Achiever Gym — Site-Wide Fix & Polish Plan

Aesthetic, brand colors, fonts, section order, images, footer, and logo stay untouched. All work is frontend.

---

## 1. Critical Bug Fixes

### BMI Calculator (`src/components/sections/BMICalculator.tsx`)
- Add input validation: height 50–250 cm, weight 20–300 kg, reject ≤0. Show inline red error under each field.
- Show result block below the button: "Your BMI is X.X", category label, and color-coded bar (green = Normal, yellow = Overweight, red = Underweight/Obese).
- Add CTA link "Want a personalized plan? Talk to our experts" → `#inquiry`.

### Inquiry Form (`src/components/sections/InquiryForm.tsx`)
- Add three required fields above the existing dropdowns: Full Name, Phone (10-digit regex), Email.
- Keep existing Goal / Batch / Plan dropdowns.
- Submit handler: validate via zod, highlight invalid fields in red with messages, show green success banner "We'll contact you within 24 hours!", reset form. Continue persisting to Supabase as today.

### Schedule (`src/components/sections/Schedule.tsx` + seed data)
- Insert the full weekly timetable (13 classes Mon–Sun, exactly as specified) into `class_schedule` via a data insert so the existing realtime table renders them.
- Change the "Book a Class" button to scroll to `#inquiry`.

### Pricing Toggle (`src/components/sections/Pricing.tsx`)
- Replace the current `* 0.8` math with explicit yearly prices: Basic 799, Pro 1,439, Elite 2,399.
- When Yearly is active, show a "Save ₹X,XXX/yr" badge per card (2,400 / 4,320 / 7,200). Remove badges when Monthly.

---

## 2. Dead Links & Broken Buttons

### Features / Training Pillars (`src/components/sections/Features.tsx`)
- Wire the 4 "Learn More" buttons: Cardio → `#schedule`, Strength → `#programs`, Fat Loss → `#pricing`, HIIT → `#programs`.

### Program Cards (`src/components/sections/Programs.tsx`)
- Each card click scrolls to `#inquiry` and pre-fills the Plan dropdown (via a small shared store or URL hash like `#inquiry?plan=...` read by the form).
- Add per-card metadata: Difficulty badge (Beginner/Intermediate/Advanced), Duration (e.g. "8 weeks"), Sessions/week (e.g. "3×/week").

### Coaches (`src/components/sections/Coaches.tsx`)
- Replace `href="#"` with the 9 specified social URLs (Alex / Maya / Logan × IG, X, LinkedIn).
- Add `target="_blank"`, `rel="noopener noreferrer"`, and descriptive `aria-label` per link.
- Replace plain certification text with styled pill chips (accent border + small icon).

### Blog (`src/components/sections/Blog.tsx`)
- Point the 3 "Read More" links to `/blog/top-5-exercises-fat-loss`, `/blog/what-to-eat-before-after-workout`, `/blog/how-to-stay-consistent-gym`.
- Since the article routes don't exist, open a "Coming Soon — subscribe to be notified" modal with an email capture instead of routing.

### Location / Get Directions (`src/components/sections/Location.tsx`)
- Update the maps href to `https://maps.google.com/?q=45+Fitness+Boulevard+Sector+12+Bengaluru+560001` and update the displayed address text accordingly.

---

## 3. CTA & Conversion

### Hero (`src/components/sections/Hero.tsx`)
- Promote "Get Started" to solid filled primary (brand accent, larger padding) and scroll to `#inquiry`.
- Keep "Explore Programs" as outline/ghost → `#programs`.
- Move the stats row (12K+, 50+, 15+, 98%) into the hero, directly under the headline, above the fold (see §5 for the count-up animation).

### Free-Trial Banner (`src/routes/index.tsx`)
- Remove the `<FreeTrialBanner />` section between Hero and Features.

### Navbar (`src/components/Navbar.tsx`)
- "Get 3 Days Free" button now scrolls to `#inquiry` instead of `#trial`.

---

## 4. Navigation

### Active section indicator (`Navbar.tsx`)
- Add an IntersectionObserver hook that tracks visible section IDs and stores the active one in state.
- The matching link gets the brand accent color + a bottom-border indicator, with a 200ms transition.

### Mobile drawer
- Hamburger already exists; convert the dropdown into a full-width slide-down drawer with vertically stacked links at 48px tap targets, an explicit ✕ close button, and auto-close on link click.

---

## 5. UX Polish

### WhatsApp FAB (`src/components/WhatsAppFab.tsx`)
- Hidden until the user scrolls past 30% of page height (scroll listener with `requestAnimationFrame`).
- Tooltip on hover ("Chat with us on WhatsApp") — already partially present, refine.
- On screens <768px, apply `bottom: 80px` to clear mobile safe area.

### FAQ (`src/components/sections/FAQ.tsx`)
- Use Radix Accordion in single-open mode, `defaultValue` = first item.
- Animated chevron rotates 180° when open via CSS transition.

### Pricing cards
- Pulsing green dot next to "Most Popular" on the Pro plan.
- Hover: `translateY(-4px)` + accent border glow.
- Add the "Not sure? Book a free consultation →" link under all 3 cards (already partially present — keep and wire to `#inquiry`).

### Animated stat counters (in Hero)
- New `<CountUp>` helper using `requestAnimationFrame`, 1.5 s ease-out, runs once on mount.

### Trust badges
- Coach certification chips rebuilt as pill components with accent border + lucide icon (Award/ShieldCheck).

---

## 6. Out of Scope
Color scheme, typography, section ordering, images, footer, legal links, and the ACHIEVER logo are explicitly preserved.

---

## Technical Notes

- **Plan pre-fill from Program cards:** simplest approach is a tiny module-level store (`useSyncExternalStore`) or `sessionStorage.setItem('preselectPlan', …)` + `dispatchEvent(new Event('plan-preselect'))`; the Inquiry form reads it on mount.
- **Schedule seeding:** insert the 13 rows via the Supabase insert tool (table `class_schedule` already exists with the right columns).
- **Validation:** use `zod` (already a dependency) for both Inquiry and BMI inputs.
- **Files touched:** `BMICalculator.tsx`, `InquiryForm.tsx`, `Schedule.tsx`, `Pricing.tsx`, `Features.tsx`, `Programs.tsx`, `Coaches.tsx`, `Blog.tsx` (+ new `ComingSoonModal`), `Location.tsx`, `Hero.tsx` (+ new `CountUp.tsx`), `Navbar.tsx`, `WhatsAppFab.tsx`, `FAQ.tsx`, `src/routes/index.tsx`. No backend or schema changes beyond the schedule data insert.
