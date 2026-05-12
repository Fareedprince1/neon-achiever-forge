# Achiever Gym — Build Plan

A dark-themed, neon-green accented fitness website matching the reference image's visual language. Single-page main route with anchor scrolling for most sections, plus separate routes for legal pages.

## Design System (src/styles.css)

- Background `#0a0a0a`, card `#1a1a1a`, accent `#C8F400`, text `#ffffff`
- Tokens added in oklch: `--background`, `--card`, `--primary` (neon), `--primary-foreground` (black), `--border` (subtle white/10)
- Custom utilities: `.neon-glow` (box-shadow 0 0 20px #C8F40066), `.text-display` (Anton/Bebas heavy)
- Fonts via Google Fonts in `__root.tsx` head: Anton + Bebas Neue (headings), Inter (body)
- Border radius 12–16px on cards
- Reusable button variants: `neon` (filled), `neon-outline`, `pill`
- Scroll-reveal via Intersection Observer hook (`useReveal`) → `animate-fade-in` + slide-up
- Smooth scroll: `html { scroll-behavior: smooth }`

## Route Structure

```
src/routes/
  __root.tsx              -> shell, fonts, providers, WhatsApp FAB, CookieBanner
  index.tsx               -> home (sections 1–22)
  privacy-policy.tsx
  terms-and-conditions.tsx
  refund-policy.tsx
```

Each route sets its own `head()` meta. Home title: "Achiever Gym | Best Gym in Bengaluru".

## Components (src/components/)

Layout: `Navbar`, `Footer`, `WhatsAppFab`, `CookieBanner`, `FreeTrialModal`

Sections (all in `src/components/sections/`):
1. `Hero` — full-screen image, headline, dual CTA, floating stat badges, brand logo strip
2. `FreeTrialBanner` — neon full-width strip + Claim button (opens modal)
3. `Features` — 2×3 grid, lucide icons in neon
4. `BMICalculator` — controlled inputs, computes BMI, color-coded bar (under/normal/over/obese)
5. `WhatSetsApart` — horizontal scroll snap, 4 cards
6. `Programs` — 3×2 grid, hover neon overlay badge
7. `Schedule` — Tabs (Mon–Sun) + table per day
8. `Equipment` — 4 cards
9. `Coaches` — 3 cards with photo, cert badge, socials, stars
10. `Pricing` — Monthly/Yearly toggle (−20%), 3 tiers, Pro highlighted neon
11. `Transformations` — 3 split before/after cards with neon divider
12. `CertStrip` — logo row, neon glow on hover
13. `Gallery` — masonry 3-col, hover zoom + neon tint
14. `Testimonials` — auto-sliding carousel (embla)
15. `Blog` — 3 cards
16. `InquiryForm` — full form with selects
17. `FAQ` — shadcn Accordion, neon + icon
18. `Location` — Google Maps iframe + info card
19. `Contact` — form + info column

## Imagery

Use Unsplash fitness URLs (loading="lazy") via constants file `src/lib/images.ts`. No image generation; URL strings only with descriptive alt text.

## State / Utilities

- `useReveal` hook for scroll animations
- `FreeTrialModal` opens on first load (sessionStorage flag), reusable from banner button
- `CookieBanner` uses localStorage for accept/dismiss
- BMI logic: `weight / (heightM)^2`, categories with color thresholds
- Pricing toggle: local state, yearly = monthly × 12 × 0.8

## Tech Notes

- shadcn primitives: Tabs, Accordion, Dialog, Carousel, Select, Input, Button, Badge
- Lucide icons throughout
- All nav links use `<Link to="/" hash="section-id">` or in-page anchor scroll handler
- Sticky navbar with `backdrop-blur` once `scrollY > 20`
- Mobile nav uses Sheet from shadcn
- WhatsApp FAB: fixed `bottom-6 right-6`, `animate-pulse` ring, `https://wa.me/919876543210?text=...`

## SEO

Per-route `head()` with title, description, og:title, og:description; legal pages get distinct meta. Single H1 per page. Semantic `<section>` with `id` for anchor nav. Alt text on every image. Viewport already set in root.

## Out of Scope / Assumptions

- Forms are static (no backend) — submit shows toast "We'll be in touch"
- Brand logos (Nike/Adidas/ACE/etc.) rendered as styled text wordmarks to avoid trademarked SVGs
- Maps iframe uses generic Bengaluru embed URL
- No Lovable Cloud needed (purely static/presentational)

## Build Order

1. Tokens, fonts, base styles, reusable Button/Badge variants
2. Layout shell (Navbar, Footer, FAB, CookieBanner, root meta)
3. Home sections in spec order
4. Legal routes
5. Polish: scroll reveal, hover states, responsive QA at mobile/tablet/desktop
