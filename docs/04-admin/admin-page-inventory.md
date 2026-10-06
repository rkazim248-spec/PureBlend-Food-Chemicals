# Admin Page Inventory

| ID | Page | Route | Purpose | API | States |
|---|---|---|---|---|---|
| A-01 | Login | /admin/login | Authenticate admin | POST /api/auth/login | loading, error |
| A-02 | Dashboard | /admin | Overview | GET summary (TDD) | loading, error |
| A-03 | Products list | /admin/products | Manage products | GET/POST/PUT/DELETE /api/products | loading, empty, error |
| A-04 | Product create/edit | /admin/products/new, /admin/products/[id]/edit | Forms | POST/PUT /api/products | submitting, error, success |
| A-05 | Banners | /admin/banners | Manage carousel | /api/banners CRUD | loading, empty, error |
| A-06 | Offers | /admin/offers | Manage offers | /api/offers CRUD | loading, empty, error |
| A-07 | FAQs | /admin/faqs | Manage FAQs | /api/faqs CRUD | loading, empty, error |
| A-08 | Content | /admin/content | Edit pages | GET/PUT /api/content | loading, error |
| A-09 | SEO | /admin/seo | Per-entity SEO | GET/PUT /api/seo | loading, error |

Each list page includes: search, filters (TDD which), pagination, delete confirmation modal, row actions (edit, publish toggle).
