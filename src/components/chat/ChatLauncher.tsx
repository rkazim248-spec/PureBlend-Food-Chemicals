"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

// Lazy-load the chat window so the initial public page stays light.
const ChatWindow = dynamic(() => import("./ChatWindow").then((m) => m.ChatWindow), {
  ssr: false,
});

export function ChatLauncher() {
  const [open, setOpen] = useState(false);
  return (
    <>
      {open && <ChatWindow onClose={() => setOpen(false)} />}
      <button
        type="button"
        aria-label={open ? "Close chat" : "Open chat"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-4 right-4 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-brand-600 text-white shadow-raised transition hover:bg-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"
      >
        <span aria-hidden="true" className="text-xl">{open ? "✕" : "💬"}</span>
      </button>
    </>
  );
}
