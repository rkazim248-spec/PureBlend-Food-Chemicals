# User Stories

Each story: As a / I want / So that, followed by acceptance criteria.

## Visitor Stories

### US-V01 Browse homepage
As a visitor, I want to see a modern homepage with featured products and current banners, so that I can quickly understand PureBlend.
- AC: Hero carousel renders active banners from the backend; graceful empty state if none.

### US-V02 View products
As a visitor, I want to browse the product catalog, so that I can find ingredients/chemicals I need.
- AC: Products load from API; loading skeleton; empty state; error state with retry.

### US-V03 View product details
As a visitor, I want a detail page per product with description, specifications, and images, so that I can evaluate it.
- AC: Route `/products/[slug]` renders by slug; 404 for unknown slug; SEO title/description.

### US-V04 Browse offers
As a visitor, I want to see active offers/discounts, so that I can take advantage of deals.
- AC: Only active/published offers listed; dates respected.

### US-V05 Read FAQs
As a visitor, I want to read FAQs, so that I can get quick answers.
- AC: FAQs from DB; accessible list; empty state.

### US-V06 Contact company
As a visitor, I want to send an inquiry via the contact form, so that PureBlend can respond.
- AC: Client+server validation; SMTP delivery; anti-spam; success/error feedback.

### US-V07 Use chatbot
As a visitor, I want to ask the chatbot about PureBlend, so that I can get instant answers.
- AC: Supported questions answered from approved knowledge; unsupported refused; loading/error/empty states.

## Admin Stories

### US-A01 Login
As an admin, I want to log in securely, so that I can manage content.
- AC: Invalid credentials show error; success routes to dashboard.

### US-A02 View dashboard
As an admin, I want an overview dashboard, so that I can see the system status.
- AC: Summary widgets load; loading/error states.

### US-A03 Manage products
As an admin, I want to create/edit/delete/publish products, so that the catalog stays current.
- AC: All CRUD operations persist and reflect publicly.

### US-A04 Manage banners
As an admin, I want to manage homepage banners, so that promotions stay current.
- AC: CRUD works; public carousel updates.

### US-A05 Manage offers
As an admin, I want to manage offers, so that discounts are accurate.
- AC: CRUD + active flag works.

### US-A06 Manage FAQs
As an admin, I want to manage FAQs, so that visitors get accurate answers.
- AC: CRUD works.

### US-A07 Manage content
As an admin, I want to edit static page content, so that pages stay up to date.
- AC: Edits render publicly.

### US-A08 Manage SEO
As an admin, I want to set SEO fields per entity, so that pages rank well.
- AC: Meta tags reflect settings.

### US-A09 Publish/unpublish
As an admin, I want to publish/unpublish content, so that drafts stay hidden.
- AC: Unpublished items not visible publicly.

### US-A10 Logout
As an admin, I want to log out, so that my session ends securely.
- AC: Session cleared; admin routes inaccessible after.
