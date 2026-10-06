# PureBlend UI/UX Design System

## Philosophy
PureBlend is a premium B2B food-chemicals company. The interface must communicate: PURE, SCIENTIFIC, TRUSTED, PREMIUM, INDUSTRIAL, MODERN, PROFESSIONAL. It must not look like a generic SaaS template, e-commerce store, or neon AI startup.

## Color (60/25/10/5)
- 60% neutral backgrounds: `#F8FAF7` (primary), `#EEF4F0` (secondary), white (surfaces)
- 10% green: Deep Forest Green `#12372A` (primary actions, key UI), Premium Emerald `#1F7A5A` (hover/secondary/success), Soft Sage `#DCEFE7` (badge/info surfaces)
- 5% gold: Warm Gold `#C9A227` — used sparingly for highlights only
- Dark sections: `#0D211A` (CTA, footer)
- Text: `#17211D` primary, `#52615A` secondary, `#7A8781` muted

## Typography
- Body: **Inter** via `--font-sans`
- Headings: **Manrope** via `--font-display`, tighter tracking, `text-wrap: balance`
- Hierarchy: H1 48–64 / H2 36–48 / H3 24–30 / body 16–18 / small 13–14

## Layout
- Container: 1200–1280px, consistent horizontal padding (32–48 / 24–32 / 16–20)
- Spacing scale: 4/8/12/16/24/32/48/64/80/96

## Components
- Buttons: primary (forest green), secondary (green border), ghost, danger; loading/disabled/focus states
- Cards: 16px radius, subtle border, minimal shadow, 20–28px padding
- Inputs: 44–56px height, 10–12px radius, visible focus ring, per-field errors
- Tables: clear headers, row hover, responsive scroll/cards, empty/loading/error
- Modals: Escape-close, backdrop, focus management, confirm for destructive actions

## Motion
- 150–250ms hovers, 200–400ms dialogs, subtle card lift, image scale 1.02–1.05
- `prefers-reduced-motion` disables all non-essential motion

## Accessibility
- WCAG AA contrast, visible focus rings, labels on all controls, no color-only meaning, keyboard-operaBLE chatbot/accordion/modals, alt text, `aria-current` on active nav

## Anti-patterns (must avoid)
Excessive gradients, glassmorphism, neon glows, fake screenshots, generic AI wording, mixed icon styles, random radii/shadows, raw hex values in components.
