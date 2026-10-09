import { ChatLauncher } from "@/components/chat/ChatLauncher";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ChatLauncher />
    </>
  );
}
