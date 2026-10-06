# Security Requirements

- Never expose secrets (API keys, SMTP passwords, DB URLs, AI keys) in client code or repo
- Never trust client-side authorization: backend enforces on every request
- Never rely on hidden admin buttons
- Validate all form inputs (client + server)
- Avoid rendering untrusted HTML; sanitize if unavoidable
- Safe upload handling: type/size validation, server-side checks
- Secure credential handling per auth flow
- Protect admin routes (UI guard + API 401/403)
- Rate limiting / anti-spam on contact and chat endpoints (backend)
- No sensitive info in logs; no internal errors shown to users
- HTTPS in production; secure headers (backend/hosting)
- Backend authorization is the final security boundary

## Implementation Notes — Phase 6 (SEO / a11y / performance / security hardening)

- SEO: `metadataBase` set on root layout; per-page titles/descriptions/canonical/OG already in place; `/robots.txt` and `/sitemap.xml` now generated via `src/app/robots.ts` and `src/app/sitemap.ts`; admin tree marked `noindex,nofollow`; custom 404 rendered for unknown routes and product slugs.
- Error boundaries: `src/app/error.tsx` (public) and `src/app/admin/error.tsx` — professional message, retry + home actions, no stack traces, development console logging only.
- Accessibility: reviewed focus-visible styles, labels, aria-live regions, modal focus, FAQ accordion semantics — already implemented in Phases 1–5; no regressions introduced.
- Performance: chatbot lazy via `next/dynamic` (Phase 5); images use `next/image` with explicit sizes; font `display: swap`; parallel homepage fetches; in-request service dedupe.
- Security: no secrets in repo; env files placeholder-only; `.gitignore` allows committing only the placeholder env files; no `dangerouslySetInnerHTML` anywhere.
- Verification: `tsc --noEmit` = 0, eslint clean, `next build` succeeds, `/robots.txt` + `/sitemap.xml` routes generated.
- Dependency audit: no new dependencies added in Phase 6; dependency list reviewed (next, react, tailwind, eslint, typescript, types only).


## Implementation Notes — Phase 8 (Contact + SMTP)

- New server-side route handler: `src/app/api/contact/route.ts` (Next.js App Router). It is the same-origin endpoint the Phase 3 service posts to (`NEXT_PUBLIC_API_BASE_URL` is now empty → relative URL).
- Server validation: required name/subject, email regex, length caps (name 120, email 200, subject 200, message 5000, min 10), 400 on malformed JSON.
- Anti-spam: honeypot field (bots get a fake 200, no email sent) + per-IP in-memory rate limit (5 per 10 minutes → 429 RATE_LIMITED). Documented limitation: per-instance memory only.
- SMTP: nodemailer, config from server-only env (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_FROM`, `CONTACT_RECIPIENT`). Missing config → 503 safe message; delivery failure → 502 safe message. No credentials in client bundles or repo.
- Email safety: plain-text + escaped HTML body; `replyTo`/subject header values stripped of CR/LF to prevent header injection; no arbitrary HTML from user input.
- Frontend form already matched the contract (name/email/subject/message/honeypot) with success/error/loading states and submit-disable — validated against the endpoint.
- Test results (production server): valid submission → 503 (SMTP intentionally unconfigured in test), honeypot → 200 without side effects, invalid email → 422, short message → 422. Real inbox delivery requires real SMTP credentials — NOT claimed complete until actually tested with them.
- Env files updated: `NEXT_PUBLIC_API_BASE_URL` emptied in `.env.development`/`.env.production`; SMTP placeholders appended to `.env.example`.


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

