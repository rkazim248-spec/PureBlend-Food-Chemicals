# API Contract Overview

> This is the single approved contract between frontend and backend. Changes require updating this doc + notifying both teams. Endpoints without a final decision are marked **TDD**.

## Conventions
- Base path: `/api`
- JSON request/response
- Auth: per `authentication-flow.md` (cookie session vs Bearer token — TDD)
- Success: 2xx with resource or `{ data: ... }`
- Error: standard shape per `error-response-standard.md`
- Pagination: `?page=&limit=` — TDD exact params
- Slugs for public product routes; IDs for admin CRUD

## Endpoint Groups
- `/api/auth/*` — login, logout, me
- `/api/products/*` — public list/detail + admin CRUD
- `/api/categories/*` — TDD
- `/api/banners/*`
- `/api/offers/*`
- `/api/faqs/*`
- `/api/content/*`
- `/api/seo/*`
- `/api/contact/*`
- `/api/chat/*`
- `/api/upload/*` — TDD (image upload for admin)

See `api-endpoints.md` for the full table, `request-response-models.md` for models.

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

