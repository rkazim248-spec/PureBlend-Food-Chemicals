# RAG Testing Guide

Open the chat launcher (bottom-right of any public page).

## Supported questions — expect grounded answers
- "What products are available?"
- "How can I contact PureBlend?"
- "What offers are currently available?"

## Unsupported / unrelated questions — expect honest refusal
- "Write me a poem about the sea."
- "What is the weather in Paris?"
- "Invent a new product for PureBlend."

Expected behavior: the assistant states it does not have enough approved PureBlend information and does not invent facts (no fake prices, specs, certifications, or history).

## Error behavior
With the backend unavailable or `NEXT_PUBLIC_USE_MOCK_DATA=true`, the assistant displays: "backend not connected" / temporarily unavailable — never a fake answer.

## Abuse UX
Send messages rapidly → backend rate limit (if enabled) shows: "You are sending messages too quickly…"
