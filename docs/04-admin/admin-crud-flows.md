# Admin CRUD Flows

## Create (e.g. Product)
1. Click "Add" → form opens
2. Fill fields → client validation
3. Submit → button loading → API POST
4. Success → toast + redirect to list + refreshed data
5. Error → inline/toast error, keep entered data

## Edit
1. Row "Edit" → form pre-filled
2. Change fields → Save → PUT
3. Success toast + list refresh

## Delete
1. Row "Delete" → confirmation modal
2. Confirm → DELETE → success toast → row removed
3. Cancel → modal closes, no change

## Publish/Unpublish
1. Toggle on row → PATCH status
2. Badge updates; public visibility changes
3. Error → revert toggle + error toast

## SEO Edit
1. Select entity → fields shown
2. Save → PUT /api/seo → success toast
3. Verify via view-source on public page
