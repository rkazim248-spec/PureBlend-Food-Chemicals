# Unsupported Question Behavior

When the chatbot receives an unsupported/general question, the backend should respond with a refusal message, e.g.:
"I can only help with questions about PureBlend Food Chemicals â€” our products, offers, FAQs, and contact details. For anything else, please contact our team."

Frontend behavior:
- Render the refusal as a normal assistant message (distinct styling allowed)
- Keep the conversation going â€” do not terminate the session
- Do not show an error state for refusals (they are successful responses)

## Implementation Notes — Phase 5 (AI RAG chatbot frontend)

- ChatWindow rewritten: welcome message + suggested questions (generic, no invented facts), per-message sources indicator only when the backend returns `sources`, clear-conversation action, Escape-to-close, focus input on open and after send, maxLength 500, `aria-live` message region, whitespace-pre-wrap rendering of plain text (no HTML injection), loading spinner labeled "searching PureBlend information".
- Error UX maps `ApiError.code` to friendly messages: `RATE_LIMITED` ? "too quickly", `NETWORK_ERROR`/`TIMEOUT` ? connection message, everything else ? generic unavailable. No stack traces/URLs/providers leaked.
- ChatLauncher lazy-loads ChatWindow via `next/dynamic` (ssr:false) to keep initial page JS small.
- `sendChatMessage` mock mode no longer fabricates answers — it returns an explicit "backend not connected" notice (development only).
- Grounding rules honored: no invented answers, no general-purpose assistant behavior, sources shown only when the contract provides them, no fake citations, no direct AI provider calls, no API keys in client code.
- Contract: `POST /api/chat` with `{ message, conversationId? }` ? `{ reply, conversationId, sources? }`. Unknown contract gaps are documented as backend-team dependencies rather than invented fields.

