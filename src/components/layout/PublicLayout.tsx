import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ChatLauncher } from "@/components/chat/ChatLauncher";

export function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-brand-600 focus:px-4 focus:py-2 focus:text-white">
        Skip to content
      </a>
      <Header />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer />
      <ChatLauncher />
    </div>
  );
}
