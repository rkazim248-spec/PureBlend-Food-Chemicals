# Chatbot UI Specification

Components (see component inventory):
- Chat Launcher: floating button, bottom-right; aria-label "Open chat"
- Chat Window: header (title + close), message list (scrollable), input + send
- Message Bubble: user vs assistant styling, timestamps TDD
- Typing Indicator: animated dots while waiting
- Source/grounding indicator: if backend returns sources (TDD)

Responsive: desktop floating panel (~380px); mobile: near-fullscreen overlay.
States per conversation: idle, sending (typing indicator), success, error (with retry), empty reply fallback, slow (after N seconds show "still working…" — TDD threshold).
Input: trimmed, max length TDD, Enter to send, Shift+Enter newline.
Auto-scroll to latest message; respect reduced motion.
