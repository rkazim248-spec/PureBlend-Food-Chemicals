import type { Metadata } from 'next';
import './globals.css';
import { ToastProvider } from '@/components/ui/Toast';

export const metadata: Metadata = {
  title: 'PureBlend Food Chemicals | Industrial Food Ingredients & Chemicals',
  description:
    'B2B food chemicals, acidulants, antimicrobial preservatives, hydrocolloids, and specialty ingredient solutions for industrial food and beverage manufacturing.',
  openGraph: {
    title: 'PureBlend Food Chemicals | Industrial Food Ingredients & Chemicals',
    description:
      'B2B food chemicals, acidulants, antimicrobial preservatives, hydrocolloids, and specialty ingredient solutions for industrial food and beverage manufacturing.',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PureBlend Food Chemicals | Industrial Food Ingredients & Chemicals',
    description:
      'B2B food chemicals, acidulants, antimicrobial preservatives, hydrocolloids, and specialty ingredient solutions for industrial food and beverage manufacturing.'
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className="bg-warm-white text-charcoal min-h-screen antialiased">
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
