'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ArrowRight, User, ShieldCheck, Heart } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { RFQModal } from '@/components/forms/RFQModal';
import { PureBlendLogo } from '@/components/ui/PureBlendLogo';
import { useFavorites } from '@/hooks/useFavorites';

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isRfqOpen, setIsRfqOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { favoriteIds } = useFavorites();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: 'Solutions', href: '/solutions' },
    { label: 'Offers', href: '/offers' },
    { label: 'About', href: '/about' },
    { label: 'FAQs', href: '/faqs' },
    { label: 'Contact', href: '/contact' }
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-200 bg-white border-b border-[#D8E2DC] ${
          isScrolled ? 'shadow-xs bg-white/95 backdrop-blur-md' : 'bg-white'
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <Link
            href="/"
            className="flex items-center group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F7A5A] rounded-md"
            aria-label="PureBlend Food Chemicals Home"
          >
            <PureBlendLogo variant="light" size="md" />
          </Link>

          {/* Center Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              const isFav = link.href === '/favorites';
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`text-[13px] font-semibold transition-colors relative py-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#1F7A5A] rounded flex items-center gap-1.5 ${
                    active
                      ? 'text-[#12372A] font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#12372A]'
                      : 'text-[#52615A] hover:text-[#12372A]'
                  }`}
                  aria-current={active ? 'page' : undefined}
                >
                  {isFav && <Heart className="w-3.5 h-3.5 text-rose-600 fill-rose-600/20" />}
                  <span>{link.label}</span>
                  {isFav && favoriteIds.length > 0 && (
                    <span className="bg-rose-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full min-w-[18px] text-center">
                      {favoriteIds.length}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Header Actions */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Favorites Icon Button */}
            <Link
              href="/favorites"
              className="relative w-9 h-9 rounded-full bg-[#EAF3EE] hover:bg-[#D8E2DC] border border-[#D8E2DC] text-[#12372A] flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F7A5A]"
              title="Saved Favorites"
              aria-label="View Saved Favorites"
            >
              <Heart className="w-4 h-4 text-rose-600 fill-rose-600/30" />
              {favoriteIds.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  {favoriteIds.length}
                </span>
              )}
            </Link>

            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsRfqOpen(true)}
              className="bg-[#12372A] hover:bg-[#1F7A5A] text-white text-xs px-4 h-9 font-semibold shadow-xs"
            >
              Request a Quote
            </Button>

            {/* Client Portal Link */}
            <Link
              href="/auth/login"
              className="w-9 h-9 rounded-full bg-[#EAF3EE] hover:bg-[#D8E2DC] border border-[#D8E2DC] text-[#12372A] flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F7A5A]"
              title="Client Portal & Console"
              aria-label="Sign in to Client Portal"
            >
              <User className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile Menu Hamburger */}
          <div className="flex lg:hidden items-center gap-2">
            <Link
              href="/favorites"
              className="relative p-2 rounded-full bg-[#EAF3EE] text-rose-600 border border-[#D8E2DC] flex items-center justify-center"
              aria-label="Favorites"
            >
              <Heart className="w-4 h-4 fill-rose-600/20" />
              {favoriteIds.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                  {favoriteIds.length}
                </span>
              )}
            </Link>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsRfqOpen(true)}
              className="text-xs py-1.5 px-3 h-8 sm:hidden bg-[#12372A]"
            >
              Quote
            </Button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-[#17211D] hover:bg-slate-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F7A5A]"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[#D8E2DC] bg-white px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top duration-200">
            <nav className="flex flex-col space-y-1">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                const isFav = link.href === '/favorites';
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-3 py-2.5 rounded-md text-sm font-semibold transition-colors flex items-center justify-between ${
                      active
                        ? 'bg-[#EAF3EE] text-[#12372A] font-bold'
                        : 'text-[#17211D] hover:bg-[#F8FAF7]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {isFav && <Heart className="w-4 h-4 text-rose-600 fill-rose-600/20" />}
                      <span>{link.label}</span>
                    </div>
                    {isFav && favoriteIds.length > 0 && (
                      <span className="bg-rose-600 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                        {favoriteIds.length}
                      </span>
                    )}
                    {active && !isFav && <span className="w-1.5 h-1.5 rounded-full bg-[#1F7A5A]" />}
                  </Link>
                );
              })}
            </nav>

            <div className="pt-4 border-t border-[#D8E2DC] space-y-2">
              <Button
                variant="primary"
                className="w-full justify-center bg-[#12372A] hover:bg-[#1F7A5A]"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsRfqOpen(true);
                }}
              >
                Request a Quote
              </Button>
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  href="/auth/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 px-3 rounded-md border border-[#D8E2DC] text-xs font-semibold text-[#17211D] hover:bg-[#F8FAF7] flex items-center justify-center gap-1.5"
                >
                  <User className="w-3.5 h-3.5 text-[#52615A]" />
                  <span>Client Portal</span>
                </Link>
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 px-3 rounded-md border border-[#D8E2DC] text-xs font-semibold text-[#17211D] hover:bg-[#F8FAF7] flex items-center justify-center gap-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#52615A]" />
                  <span>Admin Console</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Global RFQ Quick Modal */}
      <RFQModal isOpen={isRfqOpen} onClose={() => setIsRfqOpen(false)} />
    </>
  );
}
