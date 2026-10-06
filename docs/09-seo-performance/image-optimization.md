# Image Optimization

- Use the framework's image component (or equivalent) for automatic resizing/format
- Always set alt text (meaningful) or empty alt for decorative
- Provide width/height to avoid CLS
- Lazy-load below-the-fold images; eager/preload the hero image
- Admin uploads: validate type (jpeg/png/webp), size limit TDD, and let backend store/optimize
