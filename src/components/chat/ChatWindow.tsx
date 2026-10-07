"use client";

import { useEffect, useRef, useState, useCallback, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Spinner } from "@/components/ui/Spinner";
import { sendChatMessage } from "@/lib/api";
import { ApiError } from "@/lib/api/types";

interface ChatMessage {
  id: number;
  role: "user" | "assistant" | "error";
  text: string;
  sources?: { title: string; url?: string }[];
}

const WELCOME: ChatMessage = {
  id: 0,
  role: "assistant",
  text: "Hello! Ask me anything about PureBlend products, offers, or FAQs. I only use approved PureBlend information.",
};

const SUGGESTED = [
  "What products are available?",
  "How can I contact PureBlend?",
  "What offers are currently available?",
];

export function ChatWindow({ onClose, embedded = false }: { onClose?: () => void; embedded?: boolean }) {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME]);
  const [value, setValue] = useState("");
  const [sending, setSending] = useState(false);
  const [conversationId, setConversationId] = useState<string | undefined>();
  const nextId = useRef(1);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const focusInput = useCallback(() => inputRef.current?.focus(), []);

  useEffect(() => { focusInput(); }, [focusInput]);

  async function submit(text: string) {
    const message = text.trim();
    if (!message || sending) return;

    setMessages((m) => [...m, { id: nextId.current++, role: "user", text: message }]);
    setValue("");
    setSending(true);

    try {
      const res = await sendChatMessage(message, conversationId);
      setConversationId(res.conversationId);
      setMessages((m) => [
        ...m,
        {
          id: nextId.current++,
          role: "assistant",
          text: res.reply?.trim() ? res.reply : "I did not receive a response. Please try again.",
          sources: res.sources,
        },
      ]);
    } catch (err) {
      let text = "The assistant is temporarily unavailable. Please try again later.";
      if (err instanceof ApiError && err.code === "RATE_LIMITED") {
        text = "You are sending messages too quickly. Please wait a moment and try again.";
      } else if (err instanceof ApiError && (err.code === "NETWORK_ERROR" || err.code === "TIMEOUT")) {
        text = "Unable to connect right now. Please check your connection and try again.";
      }
      setMessages((m) => [...m, { id: nextId.current++, role: "error", text }]);
    } finally {
      setSending(false);
      requestAnimationFrame(() => listRef.current?.scrollTo({ top: listRef.current.scrollHeight }));
      focusInput();
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    submit(value);
  }

  function clearConversation() {
    setMessages([WELCOME]);
    setConversationId(undefined);
    setValue("");
    focusInput();
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="PureBlend assistant"
      onKeyDown={(e) => { if (e.key === "Escape" && onClose) onClose(); }}
      className={embedded
        ? "flex h-[32rem] w-full flex-col bg-white sm:rounded-lg"
        : "fixed inset-0 z-50 flex flex-col bg-white sm:inset-auto sm:bottom-20 sm:right-4 sm:h-[30rem] sm:w-96 sm:rounded-lg sm:border sm:border-neutral-200 sm:shadow-modal"}
    >
      <div className="flex items-center justify-between border-b border-neutral-200 bg-brand-600 px-4 py-3 text-white sm:rounded-t-lg">
        <p className="font-bold">PureBlend Assistant</p>
        <div className="flex items-center gap-2">
          <button type="button" onClick={clearConversation} className="rounded px-2 py-1 text-xs hover:bg-brand-700" aria-label="Clear conversation">
            Clear
          </button>
          {onClose && (
            <button type="button" aria-label="Close chat" onClick={onClose} className="rounded px-2 py-1 hover:bg-brand-700">✕</button>
          )}
        </div>
      </div>

      <div ref={listRef} aria-live="polite" className="flex-1 space-y-3 overflow-y-auto p-4 text-sm">
        {messages.map((m) => (
          <div key={m.id} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
            <div
              className={
                m.role === "user"
                  ? "max-w-[80%] rounded-lg rounded-br-sm bg-brand-600 px-3 py-2 text-white"
                  : m.role === "error"
                    ? "max-w-[80%] rounded-lg rounded-bl-sm bg-red-50 px-3 py-2 text-red-800"
                    : "max-w-[80%] rounded-lg rounded-bl-sm bg-neutral-100 px-3 py-2 text-neutral-800"
              }
            >
              <p className="whitespace-pre-wrap break-words">{m.text}</p>
              {m.sources && m.sources.length > 0 && (
                <p className="mt-2 border-t border-neutral-200 pt-1 text-xs text-neutral-500">
                  Based on PureBlend information{m.sources[0]?.title ? `: ${m.sources.map((s) => s.title).join(", ")}` : ""}
                </p>
              )}
            </div>
          </div>
        ))}
        {sending && (
          <div className="flex justify-start">
            <p className="rounded-lg rounded-bl-sm bg-neutral-100 px-3 py-2" aria-label="Assistant is searching PureBlend information">
              <Spinner label="Assistant is searching PureBlend information" />
            </p>
          </div>
        )}
      </div>

      {messages.length === 1 && (
        <div className="flex flex-wrap gap-2 border-t border-neutral-100 px-4 py-2">
          {SUGGESTED.map((q) => (
            <button key={q} type="button" onClick={() => submit(q)} className="rounded-pill border border-neutral-200 px-3 py-1 text-xs font-semibold text-brand-700 hover:bg-brand-50">
              {q}
            </button>
          ))}
        </div>
      )}

      <form onSubmit={onSubmit} className="flex items-end gap-2 border-t border-neutral-200 p-3">
        <div className="flex-1">
          <Input
            ref={inputRef}
            aria-label="Message"
            placeholder="Ask about PureBlend…"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            disabled={sending}
            maxLength={500}
          />
        </div>
        <Button type="submit" loading={sending} disabled={!value.trim()}>Send</Button>
      </form>
    </div>
  );
}
