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

Frontend is NOT responsible for retrieval logic — that is backend/AI responsibility. Frontend renders conversation state and honors these behaviors.
