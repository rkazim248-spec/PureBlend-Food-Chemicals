# Frontend Security Rules

1. Secrets live only in environment variables; never commit `.env` files
2. Only genuinely public config goes in client-exposed env vars (e.g. public API URL)
3. No tokens in localStorage if httpOnly cookie auth is chosen (TDD); document whichever is selected
4. Escape/sanitize any rich content from the CMS
5. Validate and trim all user input before submit
6. Disable submit while pending to prevent double posts
7. Don't log sensitive data to console in production
8. Don't expose internal error messages; show generic + code
9. Route guards redirect unauthenticated users but never replace server authz
10. Uploads: restrict accept types client-side; backend must re-validate

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


## Implementation Notes � Phase 5 (AI RAG chatbot frontend)

- ChatWindow rewritten: welcome message + suggested questions (generic, no invented facts), per-message sources indicator only when the backend returns `sources`, clear-conversation action, Escape-to-close, focus input on open and after send, maxLength 500, `aria-live` message region, whitespace-pre-wrap rendering of plain text (no HTML injection), loading spinner labeled "searching PureBlend information".
- Error UX maps `ApiError.code` to friendly messages: `RATE_LIMITED` ? "too quickly", `NETWORK_ERROR`/`TIMEOUT` ? connection message, everything else ? generic unavailable. No stack traces/URLs/providers leaked.
- ChatLauncher lazy-loads ChatWindow via `next/dynamic` (ssr:false) to keep initial page JS small.
- `sendChatMessage` mock mode no longer fabricates answers � it returns an explicit "backend not connected" notice (development only).
- Grounding rules honored: no invented answers, no general-purpose assistant behavior, sources shown only when the contract provides them, no fake citations, no direct AI provider calls, no API keys in client code.
- Contract: `POST /api/chat` with `{ message, conversationId? }` ? `{ reply, conversationId, sources? }`. Unknown contract gaps are documented as backend-team dependencies rather than invented fields.


## Implementation Notes — Phase 6 (SEO / a11y / performance / security hardening)

- SEO: `metadataBase` set on root layout; per-page titles/descriptions/canonical/OG already in place; `/robots.txt` and `/sitemap.xml` now generated via `src/app/robots.ts` and `src/app/sitemap.ts`; admin tree marked `noindex,nofollow`; custom 404 rendered for unknown routes and product slugs.
- Error boundaries: `src/app/error.tsx` (public) and `src/app/admin/error.tsx` — professional message, retry + home actions, no stack traces, development console logging only.
- Accessibility: reviewed focus-visible styles, labels, aria-live regions, modal focus, FAQ accordion semantics — already implemented in Phases 1–5; no regressions introduced.
- Performance: chatbot lazy via `next/dynamic` (Phase 5); images use `next/image` with explicit sizes; font `display: swap`; parallel homepage fetches; in-request service dedupe.
- Security: no secrets in repo; env files placeholder-only; `.gitignore` allows committing only the placeholder env files; no `dangerouslySetInnerHTML` anywhere.
- Verification: `tsc --noEmit` = 0, eslint clean, `next build` succeeds, `/robots.txt` + `/sitemap.xml` routes generated.
- Dependency audit: no new dependencies added in Phase 6; dependency list reviewed (next, react, tailwind, eslint, typescript, types only).

