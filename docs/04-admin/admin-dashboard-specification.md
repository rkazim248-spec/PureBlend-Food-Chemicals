# Admin Dashboard Specification

## Purpose
A secure, authenticated area where PureBlend staff manage all public-facing content without developer involvement. The organizer requires real functionality — no fake hard-coded controls.

## Modules & Requirements
For every module: page purpose, navigation, table columns, search, filters, create form, edit form, delete confirmation, publish/unpublish, empty state, loading state, error state, success feedback, API requirements, permissions.

### 1. Dashboard
- Purpose: overview of content status
- Columns/widgets: product count, active banners, active offers, FAQ count, recent submissions (if stored)
- States: loading skeleton, error
- API: summary endpoint (TDD)

### 2. Content Management
- Purpose: edit about/privacy/terms blocks
- Columns: page, section, updatedAt, status
- Create/edit: title + rich text or markdown (TDD)
- API: GET/PUT /api/content

### 3. Banners
- Purpose: manage homepage carousel
- Columns: title, image, order, active, start/end dates (TDD)
- Create/edit: title, image upload, link, order, active toggle
- API: /api/banners CRUD

### 4. Products
- Purpose: product catalog management
- Columns: name, category, price (TDD), status(published), updatedAt, actions
- Search: name; Filters: category, status
- Create/edit: name, slug (auto from name, editable), description, specs, images, category, SEO fields, published
- Delete: confirmation modal
- API: /api/products CRUD

### 5. Offers
- Purpose: manage discounts
- Columns: title, discount, validFrom/To, active
- API: /api/offers CRUD

### 6. FAQs
- Purpose: manage FAQs
- Columns: question, category (TDD), order, published
- API: /api/faqs CRUD

### 7. SEO
- Purpose: per-entity SEO fields
- Columns: entity type, entity, metaTitle, metaDescription, updatedAt
- API: /api/seo GET/PUT

## Global Admin UX Rules
- Every mutation: success toast, error toast, loading state on submit
- Deletes always confirm
- Tables: loading skeleton, empty row message, error banner
- Forms: client validation + server error display
- Unauthorized API responses (401/403): redirect to login / show forbidden
