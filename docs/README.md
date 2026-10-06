# PureBlend Food Chemicals — Documentation System

## What this is
The complete pre-implementation documentation for the Round 2 hackathon solution. It is the contract between frontend, backend, QA, and the jury. **No application code exists until this documentation is complete and reviewed.**

## Source-of-Truth Hierarchy
1. Organizer's official problem statement (PDF — must be added to the repo)
2. Approved team architecture decisions
3. Approved API contract (`05-backend-integration/api-contract.md`)
4. Approved design system (`03-frontend/design-system.md`)
5. Implementation code

If documentation conflicts with the organizer, the organizer wins. If code conflicts with docs, flag it and fix one of them.

## Map of Documents

| Folder | Contents |
|---|---|
| `00-project-overview/` | Project overview, problem summary, goals, scope, success criteria |
| `01-requirements/` | Functional/non-functional requirements, traceability matrix, user stories, acceptance criteria, out of scope |
| `02-product/` | Vision, users, personas, journeys, flows |
| `03-frontend/` | Frontend architecture, pages, components, design system, responsive/a11y strategy, state, API integration contract, folder structure |
| `04-admin/` | Admin spec, navigation, page inventory, CRUD flows, permission UI |
| `05-backend-integration/` | API contract, endpoints, models, error standard, auth flow, integration rules |
| `06-ai-rag/` | RAG requirements, chat UI spec, flows, grounding rules, unsupported behavior, test scenarios |
| `07-database/` | DB overview, entity reference, frontend data requirements |
| `08-security/` | Security requirements, frontend rules, auth security, sensitive data rules |
| `09-seo-performance/` | SEO requirements, technical SEO, performance, images, accessibility checklist |
| `10-testing/` | Testing strategy, plans, matrices, acceptance tests, pre-submission checklist |
| `11-development/` | Phases, responsibility matrix, git/branch strategy, coding standards, AI coding rules |
| `12-deployment/` | Architecture, env vars, checklists, readiness |
| `13-hackathon/` | Evaluation mapping, demo flow, score optimization, presentation outline, submission checklist |

## Who reads what

**Frontend developer must read:**
`03-frontend/*`, `04-admin/*`, `05-backend-integration/*`, `06-ai-rag/chatbot-ui-specification.md`, `08-security/*`, `09-seo-performance/*`, `10-testing/*`, `11-development/*`, `01-requirements/*`

**Backend developer must read:**
`05-backend-integration/*`, `07-database/*`, `06-ai-rag/rag-product-requirements.md`, `08-security/*`, `12-deployment/*`, `01-requirements/*`, `10-testing/integration-test-plan.md`

**Both developers must read:**
`README.md` (this file), `00-project-overview/*`, `01-requirements/*`, `02-product/*`, `11-development/*`, `13-hackathon/jury-demo-flow.md`, `13-hackathon/evaluation-mapping.md`

**QA:** `01-requirements/*`, `10-testing/*`, `RESPONSIVE/BROWSER matrices`
**Presenter:** `13-hackathon/*`, `00-project-overview/success-criteria.md`

## AI coding agents must read
`README.md` → `11-development/ai-coding-rules.md` → relevant domain doc before writing code.

## How documentation changes are handled
1. Open a PR editing the doc
2. Mention both frontend + backend owners if the change crosses the boundary
3. API contract changes additionally require updating both endpoint tables and model docs, and announcing to both teams
4. Merged docs are the new truth; conflicting code must be fixed or flagged

## Conventions
- `TEAM DECISION / TO BE DECIDED` marks anything not fixed by the organizer
- Requirement IDs: `REQ-###`; test IDs: `TEST-###`; integration IDs: `IT-##`
- Every dynamic feature: loading + empty + error states defined; backend dependency identified; security boundary noted if sensitive
