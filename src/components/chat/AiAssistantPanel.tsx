"use client";

import dynamic from "next/dynamic";

const ChatWindow = dynamic(() => import("./ChatWindow").then((m) => m.ChatWindow), { ssr: false });

export function AiAssistantPanel() {
  return <ChatWindow embedded />;
}
