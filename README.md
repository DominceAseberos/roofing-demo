# Apex Ridge — Whop Roofing Template

An editorial, production-ready website template for a US high-ticket roofing company, built on
**TanStack Start + Vite + Tailwind CSS v4** and deployed as a **Whop Website** on Cloudflare Workers.

The design is intentionally art-directed rather than template-generic: warm paper white, ink black,
oxidized copper, Instrument Serif display type, hairline rules, asymmetric grids, Lenis smooth
scrolling, masked image reveals, a cursor-following service preview, and a custom pixel-event monitor.

## Live configuration

- **Production:** https://doms-roofing-demo.whop.site
- **Whop app:** `app_PkiltbZ8lCeqDN`
- **Business account:** `biz_kZ6a8AY0DzKYmL`
- **Product:** `prod_PwSSY5uIUp9g5`

### Live plans

| Plan | Price | Whop ID |
| --- | --- | --- |
| Roof Inspection | $149 one-time | `plan_nMILcy1Wzx33K` |
| Project Deposit | $500 one-time | `plan_n0z7fGWZKkC5B` |
| Emergency Tarp | $750 flat-rate | `plan_fU1oo9o697d1g` |

## What is wired up

- **Whop Payment Elements** from `@whop/elements-react` 1.9.0 with three real checkout surfaces:
  `PaymentElement` + the required `BrandingElement` inside `Payments`, hosted `CheckoutElement`, and
  a separate `ExpressCheckoutElement` for Apple Pay / Google Pay / PayPal wallets. The SDK allows
  exactly one entry element per checkout session, so these are presented as distinct tabs.
- **Card on file:** the $500 deposit mounts the payment surface with
  `setupFutureUsage="off_session"` so the payment method can be used later for the final balance.
- **Whop Leads:** the estimate form calls a TanStack server function which writes
  `event_name: "lead"` to the Events API with the customer's name, email, phone, city, state,
  postal code, value, and service context. The API key never reaches the browser.
- **Whop Invoices:** the final-invoice workflow creates a 14 × $1,000 draft invoice (a hidden
  `Final Balance Unit` variant keeps the order under Whop's new-account per-purchase cap), then
  either issues it against a stored card or sends a payable link. Whop requires the selling account
  to complete verification before a draft can be issued or sent; until then the invoice is created
  as a draft and the UI reports the exact verification requirement.
- **Custom pixel events:** `estimate_requested`, `service_viewed`, and `deposit_started` are fired
  through `whop.track`. A live event monitor (bottom right) exposes the event history for demos
  and screen recording. Page views and checkout events are automatic on whop.app.
- **Three-act demo:** the workflow section walks through $500 deposit → completed job → $14,000
  final balance with a live/sandbox invoice receipt.

## Project map

```
src/config/roofingConfig.ts        Company, plans, services, financing, coverage, reviews
src/lib/tracking.ts                whop.track wrapper + event history subscription
src/lib/scroll.ts                  Lenis-aware section scrolling and scroll locking
src/components/SmoothScroll.tsx    Root Lenis surface, reduced-motion aware
src/components/Reveal.tsx           One-shot IntersectionObserver reveal primitive
src/components/Header.tsx          Editorial masthead, sticky nav, full-screen mobile menu
src/components/Hero.tsx            Cover-style hero, silent 1080p film loop, poster fallback
src/components/Manifesto.tsx       Point-of-view spread and standards
src/components/ServicesSection.tsx Hover-preview service index + full-screen detail overlay
src/components/ProjectStory.tsx    Lakeway field note with subtle parallax
src/components/FinancingSection.tsx Editorial monthly estimator
src/components/PaymentElementsSection.tsx  Plan ledger + all Whop checkout modes
src/components/EstimateFormSection.tsx     Whop lead capture
src/components/WorkflowSimulator.tsx        Deposit → build → invoice acts
src/components/ServiceAreaSection.tsx       Radar coverage graphic + zip checker
src/components/TestimonialsSection.tsx      Quote carousel + written guarantees
src/components/FinalCta.tsx                 Closing editorial call to action
src/components/PixelEventHUD.tsx            Live pixel audit for recording
src/server/whopService.ts                   Server-side Events and Invoices API calls
```

## Rebranding

Edit only `src/config/roofingConfig.ts` to change:

- company name, phone, email, address, license, rating, and Whop account
- the three live plan IDs, prices, descriptions, features, and badges
- services, coverage cities/counties, financing terms, reviews, and warranties

The layout pulls from this config for all commercial content. Replace the images in `public/images`
to change the art direction without touching the layout code.

## Environment

The server functions are inert without credentials, so the template still demos with clearly marked
preview receipts. To go fully live, set these **server-only** variables in the Whop deployment:

```env
ROOFING_WHOP_API_KEY=...
ROOFING_FINAL_INVOICE_VARIANT_ID=...
ROOFING_FINAL_INVOICE_UNIT_AMOUNT=1000
```

`ROOFING_WHOP_API_KEY` is used by `src/server/whopService.ts`; `WHOP_API_KEY` itself is reserved by
the Whop hosted runtime, so do not try to override it. `ROOFING_FINAL_INVOICE_VARIANT_ID` points to
the hidden `$1,000` final-balance unit; the server invoices 14 units for the `$14,000` demo. Never
expose these values with a `VITE_` prefix.

For local development:

```powershell
$env:ROOFING_WHOP_API_KEY="..."
$env:ROOFING_FINAL_INVOICE_VARIANT_ID="..."
npm run dev
```

## Commands

```bash
npm run typecheck
npm run dev          # Vite dev server
npm run build        # production build + Whop package
whop apps deploy     # deploy to the live Whop app
whop apps get app_PkiltbZ8lCeqDN
whop apps logs app_PkiltbZ8lCeqDN
```

## Design notes

- **Type:** Instrument Serif for editorial display, Manrope for interface, DM Mono for field notes.
- **Palette:** `#f4f1ea` paper, `#171713` ink, `#a8442a` oxidized copper.
- **Motion:** Lenis smooth scroll, masked line reveals, image curtain reveals, slow marquee, cursor
  image preview, and a silent 1080p roof-film loop. The film is desktop-only and disables itself for
  reduced motion, save-data, and slow connections. Mobile gets the WebP poster.
- **Hero film:** `public/videos/hero-loop.webm` (3.5 MB) and `hero-loop.mp4` (4.6 MB), generated from
  the 4K source and crossfaded at the tail for a clean loop. The poster is
  `public/images/hero-video-poster.webp`.
- **No generic component kit:** no rounded card grid, no gradient SaaS hero, no stock dashboard
  panels. Every section is composed for this brand.

## Deploy

The Whop CLI is already configured for this app:

```bash
npm run build
whop apps deploy
```

After deploy, verify the live URL, complete a sandbox Payment Element checkout, submit the estimate
form, open the pixel HUD, and run the final invoice step for the recording.
