# Integration Test Plan

End-to-end flows crossing frontend and backend:

- IT-01 Admin login → dashboard loads
- IT-02 Product create → appears on /products and /products/[slug]
- IT-03 Product edit → public page reflects change
- IT-04 Product unpublish → hidden publicly
- IT-05 Banner create/reorder → homepage carousel updates
- IT-06 Offer create → /offers lists it
- IT-07 FAQ create → /faqs lists it
- IT-08 Content edit → /about reflects it
- IT-09 SEO save → page head updated
- IT-10 Contact submit → SMTP email received + stored (if applicable)
- IT-11 Contact spam (honeypot/rate limit) → rejected
- IT-12 Chat supported question → grounded answer
- IT-13 Chat unsupported → refusal
- IT-14 Chat API error → error UI
- IT-15 Unauth admin API call → 401/403

Each case maps to acceptance test IDs where applicable.
