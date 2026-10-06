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


## Implementation Notes — Phase 3 (frontend data/API integration layer)

- Centralized API layer in `src/lib/api/`: `client.ts` (`apiRequest` with timeout via `AbortSignal.timeout`, query-param builder, auth-token hook, network-error/timeout/malformed-response normalization to `ApiError`), `types.ts` (entities mirroring `/docs/05-backend-integration` + `/docs/07-database`), `endpoints.ts` (all documented endpoint paths — no invented routes), `services.ts` (`getProducts`, `getProductBySlug`, `getBanners`, `getOffers`, `getFaqs`, `sendChatMessage`, `submitContact`), `index.ts` barrel.
- UI never calls `fetch` directly; ContactForm and ChatWindow now use services.
- Environment strategy: `NEXT_PUBLIC_API_BASE_URL`, `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_USE_MOCK_DATA`. Defaults to REAL API (production-safe). `.env.development` enables mocks locally; `.env.production` forces `NEXT_PUBLIC_USE_MOCK_DATA=false`. `.env.example` contains placeholders only — no secrets. `.gitignore` allows committing `.env.example` / `.env.development` / `.env.production`.
- Mock strategy: `src/mocks/dev-fixtures.ts` (moved from `src/data/`), clearly marked DEVELOPMENT ONLY; services branch on `config.useMockData`. Production never renders fixtures. No fake admin CRUD, no fake SMTP success, no fake RAG answers.
- Error handling: every public page resolves its fetch in try/catch and renders `ErrorState` on failure; no raw framework errors reach users; `ApiError` never leaks stack traces or internal details.
- `/products`, `/products/[slug]`, `/offers`, `/faqs`, homepage sections all consume services. Related-products and page metadata degrade gracefully. Product SEO title/description fall back when absent.
- Chatbot boundary preserved: frontend posts only to `POST /api/chat`; no AI provider calls, no keys in client code.
- React ESLint rule `react-hooks/error-boundaries` prohibits JSX construction inside try/catch — pages were refactored to fetch-then-render. `tsc --noEmit` = 0, eslint clean, `next build` succeeds, dev-server smoke test passes with fixtures (mock mode).
- Performance: parallel `Promise.allSettled` fetches on homepage (no waterfalls), request dedupe map in services, `next/image` sizes set, loading/error/empty states retained.

Backend-team dependencies (documented in `/docs/05-backend-integration`): products/banners/offers/faqs list+detail endpoints, content endpoints, `/api/contact` (SMTP), `/api/chat` (RAG), auth endpoints, standard error shape compliance.

