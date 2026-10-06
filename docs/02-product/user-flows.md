# User Flows

## Public
- Chatbot open/close flow: launcher → window → question → typing indicator → grounded answer | refusal | error
- Contact form flow: fill → client validation → submit → loading → success | error → retry
- Product browse flow: grid → detail → back

## Admin
- Login flow: credentials → loading → success redirect | error message
- CRUD flow: list → create/edit form → validate → save → success toast → refreshed list
- Delete flow: row delete → confirmation modal → confirm → success toast
- Publish toggle flow: toggle → API PATCH → badge updates → public visibility changes
- SEO flow: edit SEO fields → save → verify in page source

Each flow must define loading, empty, and error states. See page inventory for per-page states.
