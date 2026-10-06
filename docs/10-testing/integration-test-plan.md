# Integration Test Plan

End-to-end flows crossing frontend and backend:

- IT-01 Admin login → dashboard loads
- IT-02 Product create → appears on /products and /products/[slug]
- IT-03 Product edit → public page reflects change
- IT-04 Product unpublish → hidden publicly
- IT-05 Banner create/reorder → homepage carousel updates
- IT-06 Offer create → /offers lists it
- IT-07 FAQ create → /faqs lists it
- IT-08 Content edit → /about reflects it
- IT-09 SEO save → page head updated
- IT-10 Contact submit → SMTP email received + stored (if applicable)
- IT-11 Contact spam (honeypot/rate limit) → rejected
- IT-12 Chat supported question → grounded answer
- IT-13 Chat unsupported → refusal
- IT-14 Chat API error → error UI
- IT-15 Unauth admin API call → 401/403

Each case maps to acceptance test IDs where applicable.

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


## Implementation Notes — Phase 4 (Admin Dashboard frontend)

- Admin routes: `/admin` (overview), `/admin/login`, `/admin/products`, `/admin/banners`, `/admin/offers`, `/admin/faqs`, `/admin/content`, `/admin/seo`. Admin detail/edit-as-page routes were not needed because create/edit happens in accessible modals via the shared `EntityManager`.
- New components: `AdminGuard` (UX session check via `GET /api/auth/me`, redirect to login on failure — not the security boundary), `EntityManager` (generic CRUD: search, table, create/edit modal, delete confirmation modal, status toggle, loading/error/empty, skeletons), `TableSkeleton`.
- Admin CRUD flows: create/edit modal → validation → loading button → service → list refresh; delete → confirmation → processing state → error/success via list refresh; publish/activate toggle with busy state and label from the entity's real flag.
- Auth boundary: `admin.login/logout/getMe` services call `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me` through the Phase 3 API layer. In mock mode (`NEXT_PUBLIC_USE_MOCK_DATA=true`) they return a dev user so the dashboard is demoable locally; production mode enforces real session flow.
- Mock mode admin CRUD echoes inputs (development only) — no fake persistence, no fake production success. Production uses the documented endpoints only.
- Loading/empty/error states present on every admin module; no fake sample records in empty states.
- No raw fetch in components — all via `admin` services namespace under `src/lib/api/admin.ts`.
- Responsive: sidebar becomes a horizontally scrollable nav on mobile, content stacks, modals are centered/full-width on small screens, tables scroll horizontally.
- A11y: labels on all fields, role=alert on errors, modal Escape/backdrop close and initial focus, buttons have accessible names.
- Verification: `tsc --noEmit` = 0, eslint clean, `next build` succeeds, all admin routes + `/` smoke-tested 200 on the dev server.


## Implementation Notes — Phase 8 (Contact + SMTP)

- New server-side route handler: `src/app/api/contact/route.ts` (Next.js App Router). It is the same-origin endpoint the Phase 3 service posts to (`NEXT_PUBLIC_API_BASE_URL` is now empty → relative URL).
- Server validation: required name/subject, email regex, length caps (name 120, email 200, subject 200, message 5000, min 10), 400 on malformed JSON.
- Anti-spam: honeypot field (bots get a fake 200, no email sent) + per-IP in-memory rate limit (5 per 10 minutes → 429 RATE_LIMITED). Documented limitation: per-instance memory only.
- SMTP: nodemailer, config from server-only env (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_FROM`, `CONTACT_RECIPIENT`). Missing config → 503 safe message; delivery failure → 502 safe message. No credentials in client bundles or repo.
- Email safety: plain-text + escaped HTML body; `replyTo`/subject header values stripped of CR/LF to prevent header injection; no arbitrary HTML from user input.
- Frontend form already matched the contract (name/email/subject/message/honeypot) with success/error/loading states and submit-disable — validated against the endpoint.
- Test results (production server): valid submission → 503 (SMTP intentionally unconfigured in test), honeypot → 200 without side effects, invalid email → 422, short message → 422. Real inbox delivery requires real SMTP credentials — NOT claimed complete until actually tested with them.
- Env files updated: `NEXT_PUBLIC_API_BASE_URL` emptied in `.env.development`/`.env.production`; SMTP placeholders appended to `.env.example`.

