'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';
import { Button } from '@/components/ui/Button';
import { RFQModal } from '@/components/forms/RFQModal';
import { ArrowRight, Heart } from 'lucide-react';
import { useFavorites } from '@/hooks/useFavorites';
import { calculateProductPrice } from '@/lib/pricing';

export function ProductCard({ product }: { product: Product }) {
  const [isRfqOpen, setIsRfqOpen] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(product.id);
  const pricing = calculateProductPrice(product);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchEndX - touchStartX;

    if (diff > 60) {
      // Swipe right -> toggle favorite
      toggleFavorite(product.id);
    } else if (diff < -60) {
      // Swipe left -> navigate to product details
      window.location.href = `/products/${product.id}`;
    }
    setTouchStartX(null);
  };

  return (
    <>
      <div 
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="bg-white rounded-lg border border-border-subtle p-5 hover:border-[#b8cdbf] hover:shadow-md transition-all duration-200 flex flex-col justify-between group overflow-hidden touch-pan-y"
      >
        <div>
          {/* Card Image Banner */}
          <div className="relative h-44 -mx-5 -mt-5 mb-4 overflow-hidden bg-slate-100 border-b border-border-subtle group-hover:opacity-95 transition-opacity">
            <Image
              src={product.imageUrl || '/images/citric-acid.jpg'}
              alt={product.name}
              fill
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
            
            {/* Product Code Badge */}
            <div className="absolute top-3 left-3">
              <span className="font-mono text-xs font-bold text-forest bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded shadow-xs border border-[#cfe0d5]">
                {product.code}
              </span>
            </div>

            {/* Favorite Heart Button */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleFavorite(product.id);
              }}
              className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center shadow-xs transition-all z-10 ${
                favorited 
                  ? 'bg-rose-50 text-rose-600 border border-rose-200' 
                  : 'bg-white/90 hover:bg-white text-slate-500 hover:text-rose-600 border border-border-subtle'
              }`}
              title={favorited ? 'Remove from favorites' : 'Add to favorites'}
              aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart className={`w-4 h-4 ${favorited ? 'fill-rose-600' : ''}`} />
            </button>

            {/* Stock Status Badge */}
            <div className="absolute bottom-9 right-3">
              <span className="text-[10px] font-mono font-bold bg-[#12372A]/90 text-white px-2 py-0.5 rounded shadow-xs">
                {product.stockStatus}
              </span>
            </div>

            <div className="absolute bottom-2 left-3 right-3 text-[11px] text-white/90 font-mono truncate">
              {product.grade}
            </div>
          </div>

          {/* Title & Chemical Identifiers */}
          <h3 className="text-base font-bold text-charcoal group-hover:text-forest transition-colors leading-snug">
            <Link href={`/products/${product.id}`} className="focus-visible:outline-none focus-visible:underline">
              {product.name}
            </Link>
          </h3>

          {/* Clean metadata */}
          <div className="flex items-center gap-1.5 text-xs text-secondary-text mt-1.5 font-mono">
            <span>{product.insNumber}</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>CAS {product.casNumber}</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>{product.category}</span>
          </div>

          {/* Pricing & Discount Section */}
          <div className="mt-3 p-2.5 rounded bg-warm-white border border-border-subtle text-xs flex items-center justify-between">
            <div>
              <span className="text-secondary-text text-[10px] block font-mono">Commercial Price:</span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="font-bold text-charcoal font-mono text-sm">
                  PKR {pricing.finalPrice.toLocaleString()} <span className="text-[10px] text-secondary-text font-normal font-sans">{pricing.unit}</span>
                </span>
                {pricing.hasDiscount && (
                  <span className="text-slate-400 line-through font-mono text-xs">
                    PKR {pricing.regularPrice.toLocaleString()}
                  </span>
                )}
              </div>
            </div>
            {pricing.hasDiscount && (
              <span className="bg-rose-50 text-rose-700 font-mono text-[10px] font-bold px-2 py-0.5 rounded border border-rose-200">
                {pricing.badgeText}
              </span>
            )}
          </div>

          {/* Short Description */}
          <p className="text-xs text-secondary-text mt-2.5 line-clamp-2 leading-relaxed">
            {product.shortDescription}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 pt-3 border-t border-border-subtle flex items-center justify-between gap-2">
          <Link
            href={`/products/${product.id}`}
            className="text-xs font-semibold text-forest hover:text-forest-light flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
          >
            <span>Datasheet</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsRfqOpen(true)}
            className="text-xs"
          >
            RFQ Quote
          </Button>
        </div>
      </div>

      <RFQModal
        isOpen={isRfqOpen}
        onClose={() => setIsRfqOpen(false)}
        preselectedProductId={product.id}
      />
    </>
  );
}
