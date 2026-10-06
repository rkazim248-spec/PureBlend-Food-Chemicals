# Pre-Submission Checklist

- [ ] All P0 acceptance tests pass
- [ ] Integration flows IT-01..IT-15 verified
- [ ] Responsive matrix completed
- [ ] Browser matrix completed
- [ ] Accessibility checklist completed
- [ ] SEO checklist completed
- [ ] Performance: no obvious issues; images optimized; no large console errors
- [ ] Security: no secrets committed; admin protected; contact spam tested
- [ ] README complete; docs updated
- [ ] Deployment checklist done; live URL verified
- [ ] Admin credentials ready for judges
- [ ] Chatbot scenarios A–F demoed
- [ ] SMTP email verified received
- [ ] 404 page works; no broken internal links

## Implementation Notes — Phase 6 (SEO / a11y / performance / security hardening)

- SEO: `metadataBase` set on root layout; per-page titles/descriptions/canonical/OG already in place; `/robots.txt` and `/sitemap.xml` now generated via `src/app/robots.ts` and `src/app/sitemap.ts`; admin tree marked `noindex,nofollow`; custom 404 rendered for unknown routes and product slugs.
- Error boundaries: `src/app/error.tsx` (public) and `src/app/admin/error.tsx` — professional message, retry + home actions, no stack traces, development console logging only.
- Accessibility: reviewed focus-visible styles, labels, aria-live regions, modal focus, FAQ accordion semantics — already implemented in Phases 1–5; no regressions introduced.
- Performance: chatbot lazy via `next/dynamic` (Phase 5); images use `next/image` with explicit sizes; font `display: swap`; parallel homepage fetches; in-request service dedupe.
- Security: no secrets in repo; env files placeholder-only; `.gitignore` allows committing only the placeholder env files; no `dangerouslySetInnerHTML` anywhere.
- Verification: `tsc --noEmit` = 0, eslint clean, `next build` succeeds, `/robots.txt` + `/sitemap.xml` routes generated.
- Dependency audit: no new dependencies added in Phase 6; dependency list reviewed (next, react, tailwind, eslint, typescript, types only).

