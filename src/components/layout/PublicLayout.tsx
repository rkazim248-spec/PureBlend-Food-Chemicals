'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { FloatingAIChat } from '@/components/chat/FloatingAIChat';

export function PublicLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith('/auth/login') || pathname?.startsWith('/auth/signup') || pathname?.startsWith('/auth');

  return (
    <div className="min-h-screen flex flex-col bg-warm-white text-charcoal">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      {!isAuthPage && <FloatingAIChat />}
    </div>
  );
}

