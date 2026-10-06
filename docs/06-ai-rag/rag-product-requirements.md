# RAG Product Requirements

The chatbot must:
- Answer PureBlend-related questions using approved knowledge only
- NOT act as a general-purpose assistant (no coding help, general knowledge, etc.)
- Clearly refuse unsupported questions
- Show a loading state while generating
- Show an error message if the API fails
- Handle empty responses gracefully
- Work on mobile and desktop
- Handle long responses (scrollable)
- Maintain conversation state appropriately (conversationId or equivalent)

Frontend is NOT responsible for retrieval logic â€” that is backend/AI responsibility. Frontend renders conversation state and honors these behaviors.

## Implementation Notes — Phase 5 (AI RAG chatbot frontend)

- ChatWindow rewritten: welcome message + suggested questions (generic, no invented facts), per-message sources indicator only when the backend returns `sources`, clear-conversation action, Escape-to-close, focus input on open and after send, maxLength 500, `aria-live` message region, whitespace-pre-wrap rendering of plain text (no HTML injection), loading spinner labeled "searching PureBlend information".
- Error UX maps `ApiError.code` to friendly messages: `RATE_LIMITED` ? "too quickly", `NETWORK_ERROR`/`TIMEOUT` ? connection message, everything else ? generic unavailable. No stack traces/URLs/providers leaked.
- ChatLauncher lazy-loads ChatWindow via `next/dynamic` (ssr:false) to keep initial page JS small.
- `sendChatMessage` mock mode no longer fabricates answers — it returns an explicit "backend not connected" notice (development only).
- Grounding rules honored: no invented answers, no general-purpose assistant behavior, sources shown only when the contract provides them, no fake citations, no direct AI provider calls, no API keys in client code.
- Contract: `POST /api/chat` with `{ message, conversationId? }` ? `{ reply, conversationId, sources? }`. Unknown contract gaps are documented as backend-team dependencies rather than invented fields.

