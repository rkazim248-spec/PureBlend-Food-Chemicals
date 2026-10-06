# RAG Grounding Rules (frontend-facing expectations)

- The backend MUST restrict answers to the approved PureBlend knowledge base
- The frontend must never present general AI knowledge as PureBlend info
- If `sources` are provided, the UI may show them (TDD)
- Refusals must be polite and redirect the user to approved topics or contact
- The UI should not claim certainty beyond what the backend provides
