# Acceptance Test Cases

Format: ID | Feature | Precondition | Steps | Expected | Priority | Status

- TEST-001 | Homepage load | Seeded banners/products | Open `/` | Banners carousel + featured content render; no console errors | P0 | Planned
- TEST-002 | Products listing | Products seeded | Open `/products` | Grid loads; loading then data | P0 | Planned
- TEST-003 | Product detail | Known slug | Open `/products/[slug]` | Detail renders; SEO title present | P0 | Planned
- TEST-004 | Product 404 | Unknown slug | Open `/products/nope` | Custom 404 page | P1 | Planned
- TEST-005 | Offers page | Active offer seeded | Open `/offers` | Offer listed | P1 | Planned
- TEST-006 | FAQs page | FAQs seeded | Open `/faqs` | FAQs render, accordion works | P1 | Planned
- TEST-007 | Contact valid | — | Submit valid form | Success message; email received via SMTP | P0 | Planned
- TEST-008 | Contact invalid | — | Submit invalid email | Field error shown | P0 | Planned
- TEST-009 | Contact spam | honeypot filled | Submit hidden field filled | Submission rejected/ignored | P0 | Planned
- TEST-010 | Admin login invalid | — | Wrong password | Error message | P0 | Planned
- TEST-011 | Admin login valid | Admin user | Correct creds | Redirect to dashboard | P0 | Planned
- TEST-012 | Unauth admin access | Logged out | Open `/admin` | Redirect to login | P0 | Planned
- TEST-013 | Product CRUD | Logged in | Create product | Appears in list + public site | P0 | Planned
- TEST-014 | Banner CRUD | Logged in | Add banner | Carousel shows it | P0 | Planned
- TEST-015 | Offer CRUD | Logged in | Add offer | Shown on /offers | P0 | Planned
- TEST-016 | FAQ CRUD | Logged in | Add FAQ | Shown on /faqs | P0 | Planned
- TEST-017 | Content edit | Logged in | Edit about | /about reflects change | P1 | Planned
- TEST-018 | SEO control | Logged in | Set meta title | Page head contains it | P1 | Planned
- TEST-019 | Publish toggle | Logged in | Unpublish product | Hidden on public site | P0 | Planned
- TEST-020 | Chat supported | KB seeded | Ask product question | Grounded answer | P0 | Planned
- TEST-021 | Chat unsupported | KB seeded | Ask general question | Refusal message | P0 | Planned
- TEST-022 | Chat error | API down | Send message | Error + retry | P1 | Planned
- TEST-023 | Chat empty response | API returns empty | Send message | Fallback message | P1 | Planned
- TEST-024 | Chat slow | Slow API | Send message | Typing indicator + still-working | P2 | Planned
- TEST-025 | Loading states | Throttle network | Open /products | Skeletons visible | P1 | Planned
- TEST-026 | Empty states | Empty DB | Open /offers | Empty message | P1 | Planned
- TEST-027 | Error states | API 500 | Open /products | Error UI + retry | P1 | Planned
- TEST-028 | 404 page | — | Open /xyz | Custom 404 | P2 | Planned
- TEST-029 | Mobile nav | Mobile viewport | Open nav | Menu works, closes | P1 | Planned
- TEST-030 | Chatbot mobile | Mobile viewport | Open chat | Full-screen usable | P1 | Planned
- TEST-031 | a11y keyboard | — | Tab through homepage | Focus visible, logical order | P1 | Planned
- TEST-032 | No secrets in bundle | Build output | Search bundle for keys | None found | P0 | Planned
