# Unsupported Question Behavior

When the chatbot receives an unsupported/general question, the backend should respond with a refusal message, e.g.:
"I can only help with questions about PureBlend Food Chemicals — our products, offers, FAQs, and contact details. For anything else, please contact our team."

Frontend behavior:
- Render the refusal as a normal assistant message (distinct styling allowed)
- Keep the conversation going — do not terminate the session
- Do not show an error state for refusals (they are successful responses)
