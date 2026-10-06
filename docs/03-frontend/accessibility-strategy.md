# Accessibility Strategy

- Semantic HTML first; ARIA only when semantics are insufficient
- Visible focus states on all interactive elements
- Keyboard operable: nav, menus, modals (focus trap), carousels, accordions, chat
- Associated labels for every input; error messages linked via aria-describedby
- Color contrast meets WCAG AA
- Alt text on meaningful images; empty alt for decorative
- Form errors announced; validation messages clear
- Screen-reader: landmarks (header/nav/main/footer), aria-live for toasts and chat replies
- prefers-reduced-motion respected
- Touch targets ≥ 44px; no hover-only functionality

See full checklist: `09-seo-performance/accessibility-checklist.md`
