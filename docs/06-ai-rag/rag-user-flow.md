# RAG User Flow

1. Visitor clicks launcher → window opens with greeting (copy TDD)
2. Visitor types a question → sends → typing indicator
3. Assistant replies → grounded answer, refusal, or error
4. Quick prompts / suggested questions: optional TDD
5. Close → conversation retained in memory (pagination of history TDD)

Empty/edge flows: first open (no messages), rapid sends (disable input while sending), network loss (error toast within chat), unsupported question (refusal message from backend).
