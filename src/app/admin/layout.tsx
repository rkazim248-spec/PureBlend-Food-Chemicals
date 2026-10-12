'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  FileSpreadsheet, 
  FileCheck2, 
  Tag, 
  LogOut, 
  Globe, 
  Menu, 
  X, 
  Bell, 
  User, 
  ShieldCheck,
  ChevronRight,
  SlidersHorizontal
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { AdminGuard } from '@/components/admin/AdminGuard';
import { admin } from '@/lib/api';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  async function handleSignOut() {
    try {
      await admin.logout();
    } catch (error) {
      console.error('Admin sign-out failed:', error);
    } finally {
      router.replace('/auth/login');
    }
  }

  const navigation = [
    { name: 'Dashboard Overview', href: '/admin', icon: LayoutDashboard },
    { name: 'Banner / Carousel', href: '/admin/banners', icon: SlidersHorizontal },
    { name: 'SEO & Site Metadata', href: '/admin/seo', icon: Globe },
    { name: 'Product Inventory', href: '/admin/products', icon: Package },
    { name: 'Quotation RFQs', href: '/admin/rfqs', icon: FileSpreadsheet, badge: '3' },
    { name: 'Quality & Batch COAs', href: '/admin/quality', icon: FileCheck2 },
    { name: 'Supply Contracts & Offers', href: '/admin/offers', icon: Tag },
    { name: 'Discount & Promo Codes', href: '/admin/discounts', icon: Tag },
  ];

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <AdminGuard>
      <div className="min-h-screen bg-[#F4F6F4] flex flex-col md:flex-row text-charcoal">
      {/* Mobile Header Bar */}
      <div className="md:hidden bg-[#112921] text-white px-4 py-3 flex items-center justify-between border-b border-[#1b3d32] sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded bg-primary-green flex items-center justify-center font-bold text-xs">
            PB
          </div>
          <span className="font-bold text-sm tracking-tight uppercase">PureBlend Console</span>
        </div>
        <button
          type="button"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1.5 rounded text-white hover:bg-white/10"
          aria-label="Toggle navigation drawer"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#112921] text-white flex flex-col justify-between transition-transform duration-200 ease-in-out md:translate-x-0 md:static ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-0 -translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="p-5 border-b border-[#1b3d32] flex items-center justify-between">
            <Link href="/admin" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded bg-forest-light border border-emerald-400/30 flex items-center justify-center font-mono font-bold text-emerald-300 text-sm">
                PB
              </div>
              <div>
                <span className="font-black text-sm tracking-tight uppercase block leading-none">
                  PureBlend
                </span>
                <span className="text-[10px] text-[#86a898] font-mono uppercase tracking-widest mt-0.5 block">
                  Operations Console
                </span>
              </div>
            </Link>
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="md:hidden text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 text-xs">
            {navigation.map((item) => {
              const active = isActive(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-md font-medium transition-colors ${
                    active
                      ? 'bg-primary-green text-white font-bold shadow-xs'
                      : 'text-[#a1beaf] hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="bg-emerald-400/20 text-emerald-300 border border-emerald-400/40 text-[10px] font-mono px-1.5 py-0.2 rounded font-bold">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-[#1b3d32] space-y-3 text-xs">
          <div className="bg-[#17382d] p-3 rounded border border-[#234e40] space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-[#88aa9a]">Role:</span>
              <span className="font-semibold text-emerald-300 font-mono">STAFF_ADMIN</span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-[#88aa9a]">Audit Session:</span>
              <span className="text-white font-mono">ACTIVE</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <Link
              href="/"
              className="text-[#96b8a7] hover:text-white flex items-center gap-1.5 transition-colors text-xs"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Public Website</span>
            </Link>
            <button
              type="button"
              onClick={handleSignOut}
              className="text-red-300 hover:text-red-200 flex items-center gap-1 transition-colors text-xs"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Console Bar */}
        <header className="bg-white border-b border-border-subtle px-6 py-3.5 hidden md:flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-secondary-text">
            <span>PureBlend Operations</span>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span className="font-semibold text-charcoal capitalize">
              {pathname === '/admin' ? 'Overview' : pathname.replace('/admin/', '')}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/" target="_blank">
              <Button variant="ghost" size="sm" className="text-xs text-secondary-text hover:text-forest" leftIcon={<Globe className="w-3.5 h-3.5" />}>
                Live Storefront
              </Button>
            </Link>
            <div className="h-4 w-px bg-border-subtle" />
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-soft-green text-forest flex items-center justify-center font-bold text-xs border border-border-subtle">
                A
              </div>
              <div className="text-left text-xs leading-tight">
                <span className="font-bold text-charcoal block">Arthur Vance</span>
                <span className="text-[10px] text-secondary-text block">Operations QA</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
      </div>
    </AdminGuard>
  );
}
