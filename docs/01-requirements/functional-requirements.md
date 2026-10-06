# Functional Requirements

> IDs trace to the organizer matrix in `organizer-requirements-matrix.md`. Verify all against the official PDF.

## Public Site
| ID | Requirement | Notes |
|---|---|---|
| REQ-001 | Responsive public website | Mobile-first, all breakpoints |
| REQ-002 | Homepage with dynamic hero/banner carousel | From `banners` table |
| REQ-003 | About page with dynamic content | From content management |
| REQ-004 | Products listing page | Grid, filters/pagination TEAM DECISION |
| REQ-005 | Product detail page | By slug, gallery, specs |
| REQ-006 | Offers page | Active offers from DB |
| REQ-007 | FAQs page | From DB |
| REQ-008 | Contact page | Form + SMTP + anti-spam |
| REQ-009 | Privacy Policy & Terms pages | Managed via CMS |
| REQ-010 | Custom 404 page | |
| REQ-011 | Social links in footer | If required by organizer PDF |
| REQ-012 | Loading states (skeletons/spinners) | Every data-driven section |
| REQ-013 | Empty states | Lists with no data |
| REQ-014 | Error states | API failure UI |

## Admin
| ID | Requirement | Notes |
|---|---|---|
| REQ-020 | Admin login | Secure auth |
| REQ-021 | Admin logout | |
| REQ-022 | Protected admin routes (client + server) | Backend is final boundary |
| REQ-023 | Dashboard overview | Counts/status TEAM DECISION |
| REQ-024 | Product CRUD | Create/read/update/delete + images |
| REQ-025 | Publish/unpublish products | |
| REQ-026 | Category management | If required — verify PDF |
| REQ-027 | Banner/carousel CRUD | |
| REQ-028 | Offer CRUD | Discount fields, dates |
| REQ-029 | FAQ CRUD | |
| REQ-030 | Content management | About/legal pages |
| REQ-031 | SEO controls per entity | Title, description, slug etc. |
| REQ-032 | Every admin action gives success/error feedback | |
| REQ-033 | Delete confirmations | |

## AI Chatbot
| ID | Requirement |
|---|---|
| REQ-040 | Chat widget on public pages |
| REQ-041 | Answers restricted to approved PureBlend knowledge |
| REQ-042 | Clear refusal for unsupported questions |
| REQ-043 | Loading indicator while responding |
| REQ-044 | Error message on API failure |
| REQ-045 | Empty-response handling |
| REQ-046 | Works mobile & desktop, long responses scroll |

## Contact / SMTP
| ID | Requirement |
|---|---|
| REQ-050 | Contact form validation (client + server) |
| REQ-051 | Email delivered via SMTP |
| REQ-052 | Anti-spam (honeypot/rate-limit/captcha — TDD) |
| REQ-053 | Submissions stored/admin-viewable (verify PDF) |

## SEO / Performance / A11y (high level)
| ID | Requirement |
|---|---|
| REQ-060 | Per-page titles & meta descriptions |
| REQ-061 | Semantic headings, alt text |
| REQ-062 | Image optimization, lazy loading |
| REQ-063 | Accessible forms, focus states, contrast |
| REQ-064 | Sitemap & robots (owner: backend/devops — TDD) |

## Security
| ID | Requirement |
|---|---|
| REQ-070 | No secrets in client code/repo |
| REQ-071 | Backend authorization on all admin endpoints |
| REQ-072 | Secure session/token handling |
| REQ-073 | No internal error details leaked to users |
| REQ-074 | Safe handling of uploaded images |
