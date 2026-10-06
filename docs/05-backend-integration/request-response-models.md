# Request / Response Models (frontend-facing)

> Field-level details are TDD until the backend finalizes the schema. This is what the frontend expects to consume.

## Product
{ id, name, slug, description, specifications (structure TDD), images: [{url, alt}], category {id, name} | null, published, seo {title, description}, createdAt, updatedAt }

## Category
{ id, name, slug }

## Banner
{ id, title, imageUrl, linkUrl, order, active, validFrom?, validTo? }

## Offer
{ id, title, description, discountText, validFrom, validTo, active, imageUrl? }

## FAQ
{ id, question, answer, order, published }

## ContentPage
{ id, pageKey, title, blocks: [{heading?, body}], updatedAt }

## SEO
{ id, entityType, entityId, metaTitle, metaDescription, ogImage? }

## ContactSubmission
{ name, email, subject, message } (response: {success, message})

## ChatMessage
Request: { message: string, conversationId?: string }
Response: { reply: string, conversationId: string, sources?: [{title, url?}] TDD }

## User
{ id, email, role, name }

All datetimes ISO 8601. All IDs strings/UUIDs TDD.
