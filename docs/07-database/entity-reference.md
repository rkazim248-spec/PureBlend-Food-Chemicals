# Entity Reference (Frontend-Facing Fields)

See `request-response-models.md` for authoritative shapes. Summary:

- **Product**: id, name, slug, description, specifications, images[{url, alt}], category, published, seo, timestamps
- **Category**: id, name, slug
- **Banner**: id, title, imageUrl, linkUrl, order, active, validity dates
- **Offer**: id, title, description, discountText, validFrom/To, active, imageUrl
- **FAQ**: id, question, answer, order, published
- **Content**: pageKey, title, blocks (heading/body), updatedAt
- **SEO**: entityType, entityId, metaTitle, metaDescription, ogImage
- **Admin/User**: id, email, name, role
- **Chat Message/Response**: message, reply, conversationId, sources?
- **Contact Submission**: name, email, subject, message, timestamp

TEAM DECISION: exact field types and whether specifications is structured JSON.
