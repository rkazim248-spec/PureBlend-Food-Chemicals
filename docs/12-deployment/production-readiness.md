# Production Readiness

- [ ] Functional requirements matrix all "Verified"
- [ ] Integration tests IT-01..IT-15 green
- [ ] Security review: secrets, authz, rate limits complete
- [ ] Performance acceptable on mobile network (test throttling)
- [ ] Accessibility checklist passes
- [ ] SEO technical checklist passes
- [ ] Documentation complete and current
- [ ] Demo flow rehearsed end-to-end
- [ ] Admin credentials secured and ready to share with judges
- [ ] Backup/rollback plan (TDD: platform-dependent)

## Implementation Notes — Phase 6 (SEO / a11y / performance / security hardening)

- SEO: `metadataBase` set on root layout; per-page titles/descriptions/canonical/OG already in place; `/robots.txt` and `/sitemap.xml` now generated via `src/app/robots.ts` and `src/app/sitemap.ts`; admin tree marked `noindex,nofollow`; custom 404 rendered for unknown routes and product slugs.
- Error boundaries: `src/app/error.tsx` (public) and `src/app/admin/error.tsx` — professional message, retry + home actions, no stack traces, development console logging only.
- Accessibility: reviewed focus-visible styles, labels, aria-live regions, modal focus, FAQ accordion semantics — already implemented in Phases 1–5; no regressions introduced.
- Performance: chatbot lazy via `next/dynamic` (Phase 5); images use `next/image` with explicit sizes; font `display: swap`; parallel homepage fetches; in-request service dedupe.
- Security: no secrets in repo; env files placeholder-only; `.gitignore` allows committing only the placeholder env files; no `dangerouslySetInnerHTML` anywhere.
- Verification: `tsc --noEmit` = 0, eslint clean, `next build` succeeds, `/robots.txt` + `/sitemap.xml` routes generated.
- Dependency audit: no new dependencies added in Phase 6; dependency list reviewed (next, react, tailwind, eslint, typescript, types only).


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


## Implementation Notes — Phase 10 (Deployment readiness reality check)

- Verified locally: production build succeeds (`next build`), typecheck = 0, eslint clean, dev smoke tests previously passed.
- NOT done in this workspace and marked BLOCKED: live deployment, real SMTP delivery, RAG in production, database provisioning, admin-account provisioning, custom domain/HTTPS, responsive pass on a deployed URL. These require hosting/provider credentials and the backend teammate's API.
- Reproducibility documented below in `/docs/12-deployment/deployment-checklist.md` (existing) — install `npm ci`, configure `.env` from `.env.example`, `npm run build`, `npm start` behind HTTPS.
- Credential handoff: jury admin credentials and real SMTP/RAG/DB secrets must be delivered through the official submission channel, never committed.

