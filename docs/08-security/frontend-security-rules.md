# Frontend Security Rules

1. Secrets live only in environment variables; never commit `.env` files
2. Only genuinely public config goes in client-exposed env vars (e.g. public API URL)
3. No tokens in localStorage if httpOnly cookie auth is chosen (TDD); document whichever is selected
4. Escape/sanitize any rich content from the CMS
5. Validate and trim all user input before submit
6. Disable submit while pending to prevent double posts
7. Don't log sensitive data to console in production
8. Don't expose internal error messages; show generic + code
9. Route guards redirect unauthenticated users but never replace server authz
10. Uploads: restrict accept types client-side; backend must re-validate
