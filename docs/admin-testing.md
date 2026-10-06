# Admin Testing Guide

## Login
Navigate to `/admin/login`. In development with `NEXT_PUBLIC_USE_MOCK_DATA=true`, a dev user is returned (no real password). In production, sign in with the provisioned admin account; invalid credentials show a friendly error.

## Products
- Go to `/admin/products` → "Add Product" → fill required fields (name, slug, description) → Save.
- Edit via "Edit"; delete via "Delete" (confirmation modal required).
- Toggle published/draft via the status button.

## Banners
`/admin/banners` — create/edit (title, image URL, alt, link, order, active), delete, activate/deactivate. The public homepage renders the first active banner.

## Offers
`/admin/offers` — create/edit (title, description, discount text, validTo, active), delete, toggle active.

## FAQs
`/admin/faqs` — create/edit (question, answer, order, published), delete, toggle published.

## Content
`/admin/content` — select a page (about / privacy / terms), edit body, Save. Backend persistence required for production.

## SEO
`/admin/seo` — enter entity ID, load existing record, edit meta title/description (with character guidance), Save.

## Logout
Topbar "Logout" → clears session and returns to login.

## Unauthorized access
Visiting `/admin` without a session redirects to `/admin/login` (UX guard; backend must still enforce per-request authorization).
