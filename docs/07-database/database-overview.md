# Database Overview (Frontend Perspective)

The frontend does not talk to the database directly — only via the API. This document records what data the frontend expects.

Entities: Product, Category, Banner, Offer, FAQ, Content, SEO, Admin/User, Chat Message/Response, Contact Submission.

All persistence, schemas, migrations, and queries are BACKEND TEAM responsibility. Frontend requirements per entity are in `frontend-data-requirements.md`; field-level API shapes in `05-backend-integration/request-response-models.md`.
