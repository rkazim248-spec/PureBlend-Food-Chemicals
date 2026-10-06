# API Endpoints

F = frontend usage, A = admin usage, P = public.

## Auth
| Method | Endpoint | Purpose | Auth | Request | Query | Response | Errors | Used by |
|---|---|---|---|---|---|---|---|---|
| POST | /api/auth/login | Login | Public | {email, password} | — | user + token/session | 401 invalid creds, 422 validation | F Login |
| POST | /api/auth/logout | Logout | Auth | — | — | 200 | 401 | F/A |
| GET | /api/auth/me | Current user | Auth | — | — | user | 401 | F/A guard |

## Products
| Method | Endpoint | Purpose | Auth | Request | Query | Response | Errors | Used by |
|---|---|---|---|---|---|---|---|---|
| GET | /api/products | List products | Public | — | page, limit, category, search TDD | Product[] + pagination | 500 | F Products |
| GET | /api/products/[slug] | Detail | Public | — | — | Product | 404 | F Detail |
| POST | /api/products | Create | Admin | Product payload | — | Product | 400,401,403,422 | A |
| PUT | /api/products/[id] | Update | Admin | Product payload | — | Product | 400,401,403,404,422 | A |
| DELETE | /api/products/[id] | Delete | Admin | — | — | 200 | 401,403,404 | A |
| PATCH | /api/products/[id]/publish | Publish toggle | Admin | {published} | — | Product | 401,403,404 | A |

## Categories (TDD whether needed)
GET /api/categories → Category[]

## Banners
GET /api/banners (public: active only) ; admin CRUD at /api/banners + /[id]; publish toggle same pattern.

## Offers
GET /api/offers ; admin CRUD /api/offers + /[id]

## FAQs
GET /api/faqs ; admin CRUD /api/faqs + /[id]

## Content
GET /api/content/[page]; PUT /api/content/[page] (admin)

## SEO
GET /api/seo?entityType=&entityId=; PUT /api/seo (admin)

## Contact
POST /api/contact {name, email, subject, message, honeypot} → 200; errors 422, 429 (rate limit), 500

## Chat
POST /api/chat {message, conversationId?} → {reply, sources? TDD}; errors 400, 429, 500, 503

## Upload (TDD)
POST /api/upload (multipart image) → {url}; validate type/size; auth required

Each endpoint: frontend handles loading; list endpoints may return empty arrays → empty state.

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

