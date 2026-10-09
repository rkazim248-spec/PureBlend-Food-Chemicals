"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

// Lazy-load the chat window so the initial public page stays light.
const ChatWindow = dynamic(() => import("./ChatWindow").then((m) => m.ChatWindow), {
  ssr: false,
});

export function ChatLauncher() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  if (pathname === "/sign-in" || pathname === "/create-account") return null;
  return (
    <>
      {open && <ChatWindow onClose={() => setOpen(false)} />}
      {!open && <span className="fixed bottom-5 right-20 z-40 hidden rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-brand-700 shadow-card sm:block">Ask PureBlend</span>}
      <button
        type="button"
        aria-label={open ? "Close chat" : "Open chat"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-brand-600 text-white shadow-raised transition hover:-translate-y-0.5 hover:bg-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"
      >
        <span aria-hidden="true" className="text-xl">{open ? "✕" : "⌁"}</span>
      </button>
    </>
  );
}
