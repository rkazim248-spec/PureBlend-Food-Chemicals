# Non-Functional Requirements

| ID | Category | Requirement | Measurement |
|---|---|---|---|
| NFR-001 | Performance | Pages load fast on typical broadband | Lighthouse perf budget (define threshold — TDD, target ≥80) |
| NFR-002 | Performance | No significant layout shift | CLS target < 0.1 |
| NFR-003 | Performance | Images optimized & lazy-loaded | WebP/AVIF preferred, width/height set |
| NFR-004 | Accessibility | WCAG 2.1 AA intent | Checklist in 09-seo-performance/accessibility-checklist.md |
| NFR-005 | Responsiveness | Works 320px → 1920px+ | Responsive test matrix |
| NFR-006 | SEO | Indexable public pages, unique titles/descriptions | Technical SEO doc |
| NFR-007 | Security | No secrets committed; env-based config | Repo scan + deployment checklist |
| NFR-008 | Reliability | User-facing error states for failed API calls | Every dynamic page |
| NFR-009 | Maintainability | Clear folder structure, conventions, docs | This documentation system |
| NFR-010 | Compatibility | Modern evergreen browsers | Browser test matrix |
| NFR-011 | Usability | Forms validated with clear messages | Admin + contact + login |
| NFR-012 | UX Consistency | One design system across public + admin | design-system.md |

All numeric thresholds that are not fixed by the organizer are TEAM DECISION / TO BE DECIDED and must be recorded once chosen.
