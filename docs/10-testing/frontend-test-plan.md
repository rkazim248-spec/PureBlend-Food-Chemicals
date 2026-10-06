# Frontend Test Plan

Areas:
- Pages render with loading → success/empty/error states
- Components: carousel, cards, accordion, modal, toast, chat widget, forms
- Form validation messages
- Route guard behavior for /admin
- SEO head output on public pages
- Responsive behavior per matrix

Cases for each dynamic feature must cover: success, empty, error, slow.
See acceptance test cases for IDs.

## Implementation Notes — Phase 2 (actual decisions)

- Project migrated from `pureblend-web/` into the repository root — the repo root is now the active project.
- Homepage assembled from documented sections only: Hero, About intro, Why PureBlend, Product showcase, Offers, AI assistant CTA, Contact CTA. No invented certifications/partners/statistics.
- Products listing: `ProductsBrowser` client component adds search + category filter over props-injected data (fixtures now; API later). Empty/no-match/error states implemented.
- Product detail: breadcrumb, gallery slot (aspect-ratio, lazy/eager image component), specifications `<dl>`, "Request specifications" CTA, related products by category, `generateMetadata` uses product SEO fields when present.
- Offers page: `OfferSection`/`OfferCard` with validity date display and empty state. No fake discount math.
- FAQs: accessible accordion (aria-expanded/controls/region, keyboard operable) with loading/empty/error patterns ready at the page level.
- Contact: validated form (name/email/subject/message + hidden honeypot), per-field errors, submit-disable, success/error feedback; posts to `POST /api/contact` — SMTP wiring deferred to backend phase.
- Privacy/Terms: readable long-form layout with clear placeholder copy marked for CMS replacement.
- Footer: config-driven social links (`config.socials`) — rendered only when real URLs are provided, per organizer rule about working social links.
- 404 page implemented and verified for unknown routes and unknown product slugs.
- SEO applied to every public page via `pageMetadata()` (title, description, canonical, Open Graph).
- Image strategy: `next/image`, aspect-ratio containers, object-cover, explicit sizes, priority only for hero, dev SVG placeholder asset.
- Responsive QA performed by code review + build; visual device testing still needs a human pass at 320px–1920px.
- All Phase 2 routes verified on the production server: pages return 200, unknown product and unknown URL return the custom 404.
- `tsc --noEmit` = 0, eslint clean, `next build` succeeds from the repository root.

