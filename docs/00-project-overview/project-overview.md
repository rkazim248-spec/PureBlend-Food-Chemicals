# Project Overview

## Project Name
PureBlend Food Chemicals — Round 2 Website Solution

## Client Name
PureBlend Food Chemicals (fictional client defined by the hackathon organizer)

## Hackathon Round
Round 2 — AI Web Development Hackathon

## Problem Summary
The organizer defines the full problem statement in the official Round 2 problem statement PDF. **That PDF is the single source of truth.** At the time of writing this documentation, the organizer PDF was **not present in the workspace** — the team must place it in the repo (e.g. `/docs/problem-statement.pdf` or a linked location) and reconcile any team assumptions below against it.

From the organizer brief (as relayed to the team), the client needs a production-minded, database-driven company website with:

- Public marketing site (home, about, products, offers, FAQs, contact, legal pages)
- Admin dashboard for dynamic content management (products, banners, offers, FAQs, SEO, banners/carousel)
- AI RAG chatbot restricted to approved PureBlend knowledge
- SMTP contact workflow
- Authentication & authorization for admin
- Security, performance, accessibility, SEO, deployment, documentation

## Solution Summary
A full-stack web application:

- **Public website** — modern, responsive, SEO-friendly, database-driven pages
- **Admin dashboard** — protected area for CRUD over products, banners, offers, FAQs, content, SEO
- **AI RAG chatbot** — answers only from approved PureBlend knowledge, refuses unsupported questions
- **Contact workflow** — validated form persisted by backend and delivered via SMTP

## Core Features
1. Dynamic homepage with banner/carousel
2. Product catalog with detail pages
3. Offers/discounts
4. FAQs
5. Contact page with SMTP email delivery + anti-spam
6. Admin authentication (login/logout, protected routes)
7. Admin CRUD: products, categories, banners, offers, FAQs, content, SEO
8. Publish/unpublish content
9. AI RAG chatbot grounded in approved knowledge
10. SEO controls per page/product

## Primary Users
- **Visitor / Public user** — browses products, offers, FAQs, uses chatbot, submits contact form
- **Admin user** — manages site content through the dashboard

## Admin Users
- Site administrator (full access). TEAM DECISION / TO BE DECIDED: whether multiple roles exist.

## Technology Assumptions
All technology choices are **TEAM DECISION / TO BE DECIDED** unless subsequently approved. Candidates to decide:

- Frontend framework (e.g. Next.js, React SPA, Vue/Nuxt)
- Backend framework (e.g. Node/Express, NestJS, Django, Laravel)
- Database (e.g. PostgreSQL, MySQL, MongoDB)
- Auth mechanism (session cookie vs JWT)
- RAG stack (vector DB vs keyword retrieval; LLM provider)
- Hosting/deployment platform

## Team Responsibilities
- FRONTEND TEAM: public site UI, admin UI, API integration, chatbot UI, SEO/a11y/performance on the client
- BACKEND TEAM: API, database, auth, SMTP, RAG retrieval service, admin authorization
- SHARED: API contract, design system, integration testing, deployment

## Project Status
Pre-implementation (documentation phase). No application code exists yet.

## Source-of-Truth Rules
1. Organizer's official problem statement
2. Approved team architecture decisions
3. Approved API contract
4. Approved design system
5. Implementation code

If code conflicts with documentation, flag it. If documentation conflicts with the organizer, the organizer wins.

## Related Documents
- [Problem Statement Summary](./problem-statement-summary.md)
- [Project Goals](./project-goals.md)
- [Scope](./scope.md)
- [Success Criteria](./success-criteria.md)
- [Docs README](../README.md)
