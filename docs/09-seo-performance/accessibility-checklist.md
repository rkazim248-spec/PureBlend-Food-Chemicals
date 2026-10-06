# Accessibility Checklist

- [ ] Skip-to-content link
- [ ] Landmarks: header, nav, main, footer
- [ ] Keyboard navigable: menus, carousel controls, accordion, modal, chat
- [ ] Visible focus styles (focus-visible), no outline removal without replacement
- [ ] aria-expanded on toggles; aria-current on active nav; aria-controls where applicable
- [ ] All inputs have associated labels; errors use aria-invalid + aria-describedby
- [ ] Buttons have accessible names; icon-only buttons have aria-label
- [ ] Images: alt or empty alt
- [ ] Contrast ≥ 4.5:1 body text, ≥ 3:1 large text / UI
- [ ] Reduced motion: no autoplay carousel, no parallax, transitions shortened
- [ ] Touch targets ≥ 44×44px
- [ ] Modals trap focus and close on Escape
- [ ] Chat messages exposed via aria-live
- [ ] Form success/error announced via role=status/alert

## Implementation Notes — Phase 6 (SEO / a11y / performance / security hardening)

- SEO: `metadataBase` set on root layout; per-page titles/descriptions/canonical/OG already in place; `/robots.txt` and `/sitemap.xml` now generated via `src/app/robots.ts` and `src/app/sitemap.ts`; admin tree marked `noindex,nofollow`; custom 404 rendered for unknown routes and product slugs.
- Error boundaries: `src/app/error.tsx` (public) and `src/app/admin/error.tsx` — professional message, retry + home actions, no stack traces, development console logging only.
- Accessibility: reviewed focus-visible styles, labels, aria-live regions, modal focus, FAQ accordion semantics — already implemented in Phases 1–5; no regressions introduced.
- Performance: chatbot lazy via `next/dynamic` (Phase 5); images use `next/image` with explicit sizes; font `display: swap`; parallel homepage fetches; in-request service dedupe.
- Security: no secrets in repo; env files placeholder-only; `.gitignore` allows committing only the placeholder env files; no `dangerouslySetInnerHTML` anywhere.
- Verification: `tsc --noEmit` = 0, eslint clean, `next build` succeeds, `/robots.txt` + `/sitemap.xml` routes generated.
- Dependency audit: no new dependencies added in Phase 6; dependency list reviewed (next, react, tailwind, eslint, typescript, types only).

