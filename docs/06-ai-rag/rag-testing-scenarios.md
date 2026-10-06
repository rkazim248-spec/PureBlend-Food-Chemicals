# RAG Testing Scenarios

**Scenario A — Supported question**: e.g. "What products do you offer?" → grounded answer rendered; typing indicator shown first; source indicator if provided.
**Scenario B — Unsupported question**: e.g. "Write me a poem" → refusal message, no error styling, session continues.
**Scenario C — No relevant knowledge**: question about PureBlend but absent from KB → polite "not available, contact us" response.
**Scenario D — API error**: backend down → error bubble + retry.
**Scenario E — Slow response**: > threshold (TDD, e.g. 8s) → "still working…" indicator; timeout → error.
**Scenario F — Empty response**: API returns empty reply → fallback message "No response received, please try again."

Also test mobile viewport, long responses scrolling, and rapid repeated sends (input disabled while sending).
