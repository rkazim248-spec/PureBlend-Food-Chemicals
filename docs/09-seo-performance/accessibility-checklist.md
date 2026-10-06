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
