"use client";

import { useRef, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Spinner } from "@/components/ui/Spinner";
import { endpoints } from "@/lib/api/endpoints";
import { apiRequest } from "@/lib/api/client";
import type { ChatResponse } from "@/lib/api/types";

interface ChatMessage {
  id: number;
  role: "user" | "assistant" | "error";
  text: string;
}

/**
 * Frontend-only chat UI. NO retrieval logic here — the backend RAG service
 * answers via POST /api/chat (see docs/06-ai-rag). If the backend is not
 * available, the UI shows a clear error state.
 */
export function ChatWindow({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 0, role: "assistant", text: "Hello! Ask me anything about PureBlend products, offers, or FAQs." },
  ]);
  const [value, setValue] = useState("");
  const [sending, setSending] = useState(false);
  const [conversationId, setConversationId] = useState<string | undefined>();
  const nextId = useRef(1);
  const listRef = useRef<HTMLDivElement>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const message = value.trim();
    if (!message || sending) return;

    const userMsg: ChatMessage = { id: nextId.current++, role: "user", text: message };
    setMessages((m) => [...m, userMsg]);
    setValue("");
    setSending(true);

    try {
      const res = await apiRequest<ChatResponse>(endpoints.chat.send, {
        method: "POST",
        body: { message, conversationId },
      });
      setConversationId(res.conversationId);
      setMessages((m) => [
        ...m,
        {
          id: nextId.current++,
          role: "assistant",
          text: res.reply?.trim() ? res.reply : "I did not receive a response. Please try again.",
        },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        { id: nextId.current++, role: "error", text: "The assistant is unavailable right now. Please try again later." },
      ]);
    } finally {
      setSending(false);
      requestAnimationFrame(() => listRef.current?.scrollTo({ top: listRef.current.scrollHeight }));
    }
  }

  return (
    <div
      role="dialog"
      aria-label="PureBlend assistant"
      className="fixed inset-0 z-50 flex flex-col bg-white sm:inset-auto sm:bottom-20 sm:right-4 sm:h-[28rem] sm:w-96 sm:rounded-lg sm:border sm:border-neutral-200 sm:shadow-modal"
    >
      <div className="flex items-center justify-between border-b border-neutral-200 bg-brand-600 px-4 py-3 text-white sm:rounded-t-lg">
        <p className="font-bold">PureBlend Assistant</p>
        <button type="button" aria-label="Close chat" onClick={onClose} className="rounded px-2 py-1 hover:bg-brand-700">✕</button>
      </div>

      <div ref={listRef} aria-live="polite" className="flex-1 space-y-3 overflow-y-auto p-4 text-sm">
        {messages.map((m) => (
          <div key={m.id} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
            <p
              className={
                m.role === "user"
                  ? "max-w-[80%] rounded-lg rounded-br-sm bg-brand-600 px-3 py-2 text-white"
                  : m.role === "error"
                    ? "max-w-[80%] rounded-lg rounded-bl-sm bg-red-50 px-3 py-2 text-red-800"
                    : "max-w-[80%] rounded-lg rounded-bl-sm bg-neutral-100 px-3 py-2 text-neutral-800"
              }
            >
              {m.text}
            </p>
          </div>
        ))}
        {sending && (
          <div className="flex justify-start">
            <p className="rounded-lg rounded-bl-sm bg-neutral-100 px-3 py-2">
              <Spinner label="Assistant is typing" />
            </p>
          </div>
        )}
      </div>

      <form onSubmit={onSubmit} className="flex items-end gap-2 border-t border-neutral-200 p-3">
        <div className="flex-1">
          <Input
            aria-label="Message"
            placeholder="Ask about PureBlend…"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            disabled={sending}
          />
        </div>
        <Button type="submit" loading={sending} disabled={!value.trim()}>Send</Button>
      </form>
    </div>
  );
}
