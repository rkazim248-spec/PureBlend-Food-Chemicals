'use client';

import React from 'react';
import Link from 'next/link';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Button } from '@/components/ui/Button';
import { ProductCard } from '@/components/products/ProductCard';
import { PRODUCTS_DATA } from '@/data/mockData';
import { useFavorites } from '@/hooks/useFavorites';
import { Heart, ShoppingBag, ArrowRight, Trash2 } from 'lucide-react';

export default function FavoritesPage() {
  const { favoriteIds, toggleFavorite, isLoaded } = useFavorites();

  const favoriteProducts = PRODUCTS_DATA.filter((p) => favoriteIds.includes(p.id));

  return (
    <PublicLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs items={[{ label: 'Saved Favorites' }]} />

        <div className="mt-4 mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border-subtle pb-6">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-charcoal tracking-tight">
                Saved Favorites & Product Watchlist
              </h1>
              <span className="text-xs font-mono font-bold bg-[#EAF3EE] text-[#12372A] px-2.5 py-1 rounded-full border border-[#cfe0d5]">
                {favoriteProducts.length} Saved
              </span>
            </div>
            <p className="text-sm text-secondary-text mt-1">
              Your bookmarked food chemicals, hydrocolloids, and antimicrobial preservation systems.
            </p>
          </div>
          {favoriteProducts.length > 0 && (
            <Link href="/rfq">
              <Button variant="primary" size="sm" leftIcon={<ShoppingBag className="w-4 h-4" />}>
                Request Batch Quotation for All
              </Button>
            </Link>
          )}
        </div>

        {!isLoaded ? (
          <div className="py-20 text-center text-secondary-text">Loading saved favorites...</div>
        ) : favoriteProducts.length === 0 ? (
          <div className="bg-white rounded-lg border border-border-subtle p-12 text-center max-w-2xl mx-auto my-12 space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#EAF3EE] text-forest flex items-center justify-center mx-auto">
              <Heart className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-charcoal">Your Favorites List is Empty</h3>
            <p className="text-sm text-secondary-text max-w-md mx-auto">
              Browse our industrial food chemical catalogue and click the heart icon on any product card to save it to your watchlist for quick comparison and RFQ requests.
            </p>
            <div className="pt-2">
              <Link href="/products">
                <Button variant="primary" leftIcon={<ArrowRight className="w-4 h-4" />}>
                  Explore Product Catalogue
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteProducts.map((product) => (
              <div key={product.id} className="relative group">
                <ProductCard product={product} />
                <button
                  type="button"
                  onClick={() => toggleFavorite(product.id)}
                  className="absolute top-3 right-14 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-rose-600 border border-border-subtle flex items-center justify-center shadow-xs transition-transform active:scale-95"
                  title="Remove from favorites"
                  aria-label="Remove from favorites"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </PublicLayout>
  );
}
