# Evaluation Mapping (100 marks)

| Category | Marks | What earns it | Evidence |
|---|---|---|---|
| UI/UX, visual quality & responsiveness | 15 | Design system, polished UI, responsive on all devices, accessibility touches | design-system.md, responsive matrix, live demo |
| Functional completeness & requirement coverage | 25 | Every requirement in matrix implemented and verified | organizer-requirements-matrix.md, acceptance tests |
| Admin dashboard & database | 15 | Real CRUD, publish toggles, dashboard, DB-driven content | admin spec, integration tests |
| AI RAG chatbot | 15 | Grounded answers, refusal behavior, loading/error states, mobile | rag docs, scenarios A–F demo |
| Code quality, architecture & technical understanding | 10 | Clean architecture, reusable components, docs, explainable AI-assisted code | architecture docs, README |
| Performance, SEO & accessibility | 8 | Optimized assets, SEO meta, a11y checklist | lighthouse, checklists |
| Security, admin authentication & SMTP | 7 | Protected admin, working auth, secure handling, SMTP email + anti-spam | security docs, SMTP demo |
| Documentation, deployment & presentation | 5 | Complete docs, live URL, clear demo | docs/, submission checklist |

## Feature → Score Traceability

| Feature | Primary score category | Requirement IDs |
|---|---|---|
| Homepage/carousel | UI/UX 15, Functional 25 | REQ-002, REQ-019, REQ-021 |
| Products + detail | Functional 25 | REQ-004, REQ-005 |
| Admin CRUD | Admin/DB 15 | REQ-024…REQ-031 |
| SEO controls | Functional 25 + Perf/SEO 8 | REQ-009, REQ-060 |
| Chatbot | RAG 15 | REQ-040…REQ-046 |
| Contact/SMTP | Security 7 + Functional 25 | REQ-050…REQ-053 |
| Auth | Security 7 | REQ-070…REQ-074 |
| Docs/deploy/demo | Documentation 5 | REQ-017, REQ-018 |
