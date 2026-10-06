# Testing Strategy

Levels:
1. Unit (components/utilities) — framework test runner TDD
2. Integration (frontend ↔ API, admin CRUD flows)
3. E2E (critical journeys: browse → detail → contact; admin login → CRUD → public visible)
4. Manual QA with device/browser/responsive matrices

Principles:
- Every requirement has at least one acceptance test
- Testing loading/empty/error states explicitly
- RAG UI scenarios tested per `06-ai-rag/rag-testing-scenarios.md`
- Contact form tested end-to-end including SMTP delivery and spam rejection
- Accessibility checks via automated (axe) + keyboard walkthrough
- SEO checks via page-source inspection and Lighthouse
- Security checks: no secrets, protected admin, API rejects unauth

Test data: seeded dev database; no production secrets in tests.

## Implementation Notes — Phase 9 (Security audit & hardening)

- XSS: no `dangerouslySetInnerHTML` anywhere; all dynamic content rendered as text; chatbot replies rendered as plain text with pre-wrap; email HTML body escaped.
- Security headers added in `next.config.ts`: X-Content-Type-Options, X-Frame-Options DENY, Referrer-Policy, Permissions-Policy, and a conservative CSP (`default-src 'self'`, `frame-ancestors 'none'`, `form-action 'self'`; `script-src 'unsafe-inline'` retained because Next.js hydration requires it — documented trade-off).
- Secret audit: `git grep` for password/secret/api-key/token/smtp/database_url across tracked files — only placeholders and docs found; `.env.local` / real credential files are gitignored; only placeholder env files are tracked.
- Dependency audit: `npm audit` — 5 high-severity findings remain, all inside the dev-only ESLint chain (`micromatch`/`fast-glob` via `eslint-config-next`). Fixing requires `--force` major bumps, which was NOT applied to avoid breaking Next's pinned ESLint integration. Documented as accepted dev-only risk; not shipped to production runtime.
- Rate limiting: contact endpoint implements per-IP limit (5/10min); login/chat rate limits remain backend-team responsibility (documented dependency).
- Error security: route handler returns safe generic messages for 400/422/429/502/503; SMTP/network internals only logged server-side.
- Auth/authorization: frontend guard + backend-boundary documented; no claims of backend security from the frontend side.
- CORS: same-origin architecture (API routes in the Next app) removes the CORS surface for contact; remaining cross-origin backend endpoints default to same-origin relative calls.
- Upload security: no upload endpoint exists yet — dependency documented; frontend will validate type/size only, backend remains authoritative.
- RAG: no prompt-editing surface, plain-text rendering, no provider keys in client, unsupported-question behavior enforced by contract.
- Verified: `tsc --noEmit` = 0, eslint clean, production build succeeds with new headers config.

