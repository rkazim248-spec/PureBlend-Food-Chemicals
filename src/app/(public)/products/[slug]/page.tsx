'use client';

import React, { useState } from 'react';
import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Button } from '@/components/ui/Button';
import { SpecTable } from '@/components/products/SpecTable';
import { ProductCard } from '@/components/products/ProductCard';
import { RFQModal } from '@/components/forms/RFQModal';
import { PRODUCTS_DATA } from '@/data/mockData';
import { 
  ArrowLeft, 
  FileText, 
  ShieldCheck, 
  Download, 
  CheckCircle2, 
  Layers, 
  Clock, 
  Scale, 
  Truck,
  FileCheck2,
  Heart
} from 'lucide-react';
import { useFavorites } from '@/hooks/useFavorites';
import { calculateProductPrice } from '@/lib/pricing';
import { validatePromoCode, calculateDiscountedTotal, DiscountCodeOffer } from '@/lib/discount';

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params?.slug as string;
  const [isRfqOpen, setIsRfqOpen] = useState(false);

  const product = PRODUCTS_DATA.find((p) => p.id === productId);
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = product ? isFavorite(product.id) : false;
  const pricing = product ? calculateProductPrice(product) : null;

  // Promo code state on product page
  const [couponCodeInput, setCouponInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<DiscountCodeOffer | null>(null);
  const [couponError, setCouponError] = useState('');

  const handleApplyCoupon = () => {
    setCouponError('');
    const validation = validatePromoCode(couponCodeInput);
    if (!validation.valid || !validation.offer) {
      setCouponError(validation.error || 'Invalid or expired promo code.');
      return;
    }
    setAppliedPromo(validation.offer);
  };

  const basePriceForCalc = pricing ? pricing.finalPrice : 0;
  const promoCalculation = appliedPromo ? calculateDiscountedTotal(basePriceForCalc, appliedPromo) : null;
  const finalEffectivePrice = promoCalculation ? promoCalculation.finalTotal : basePriceForCalc;

  if (!product) {
    return (
      <PublicLayout>
        <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
          <h1 className="text-2xl font-bold text-charcoal">Ingredient Specification Not Found</h1>
          <p className="text-sm text-secondary-text">
            The requested product monograph could not be located in our active catalogue database.
          </p>
          <Link href="/products">
            <Button variant="primary">Return to Product Catalogue</Button>
          </Link>
        </div>
      </PublicLayout>
    );
  }

  // Related products from the same category
  const relatedProducts = PRODUCTS_DATA.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 3);

  return (
    <PublicLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs
          items={[
            { label: 'Products', href: '/products' },
            { label: product.name }
          ]}
        />

        {/* Top Back Link & Action Bar */}
        <div className="mt-4 mb-6 flex items-center justify-between">
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-secondary-text hover:text-forest transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Products</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href={`/rfq?product=${product.id}`}>
              <Button variant="outline" size="sm" className="hidden sm:inline-flex text-xs">
                Dedicated RFQ Page
              </Button>
            </Link>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsRfqOpen(true)}
              leftIcon={<FileText className="w-3.5 h-3.5" />}
            >
              Request Quotation (RFQ)
            </Button>
          </div>
        </div>

        {/* Product Hero Overview */}
        <div className="bg-white rounded-lg border border-border-subtle p-6 sm:p-8 mb-10 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Col: Core Product Specs */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="font-mono font-bold text-forest bg-soft-green px-2.5 py-1 rounded border border-[#cfe0d5]">
                  {product.code}
                </span>
                <span className="text-secondary-text">·</span>
                <span className="font-semibold text-charcoal">{product.grade}</span>
                <span className="text-secondary-text">·</span>
                <span className="text-secondary-text font-mono">{product.category}</span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-charcoal tracking-tight">
                {product.name}
              </h1>

              <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-secondary-text pt-1">
                <span className="bg-warm-white px-2.5 py-1 rounded border border-border-subtle">
                  INS {product.insNumber}
                </span>
                <span className="bg-warm-white px-2.5 py-1 rounded border border-border-subtle">
                  CAS {product.casNumber}
                </span>
                <span className="bg-warm-white px-2.5 py-1 rounded border border-border-subtle">
                  Formula: {product.chemicalFormula}
                </span>
                <span className="bg-warm-white px-2.5 py-1 rounded border border-border-subtle">
                  MW: {product.molecularWeight}
                </span>
              </div>

              <p className="text-sm text-secondary-text leading-relaxed pt-2">
                {product.description}
              </p>

              {/* Commercial Parameters Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-border-subtle text-xs">
                <div className="p-3 bg-warm-white rounded border border-border-subtle">
                  <span className="text-secondary-text block text-[11px]">Minimum Commercial Order:</span>
                  <span className="font-bold text-charcoal font-mono mt-0.5 block">{product.minOrderQuantity}</span>
                </div>
                <div className="p-3 bg-warm-white rounded border border-border-subtle">
                  <span className="text-secondary-text block text-[11px]">Standard Lead Time:</span>
                  <span className="font-bold text-charcoal font-mono mt-0.5 block">{product.standardLeadTime}</span>
                </div>
                <div className="p-3 bg-warm-white rounded border border-border-subtle col-span-2 sm:col-span-1">
                  <span className="text-secondary-text block text-[11px]">Inventory Status:</span>
                  <span className="font-bold text-emerald-700 font-mono mt-0.5 block">{product.stockStatus}</span>
                </div>
              </div>
            </div>

            {/* Right Col: Product Photo, Quick Quote Card & Document Downloads */}
            <div className="lg:col-span-4 space-y-4">
              <div className="relative h-60 rounded-lg overflow-hidden border border-border-subtle bg-slate-100 shadow-xs group">
                <img
                  src={product.imageUrl || '/images/citric-acid.jpg'}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent pointer-events-none" />
                
                {/* Favorite Heart Button */}
                <button
                  type="button"
                  onClick={() => toggleFavorite(product.id)}
                  className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center shadow-xs transition-all z-10 ${
                    favorited 
                      ? 'bg-rose-50 text-rose-600 border border-rose-200' 
                      : 'bg-white/90 hover:bg-white text-slate-500 hover:text-rose-600 border border-border-subtle'
                  }`}
                  title={favorited ? 'Remove from favorites' : 'Add to favorites'}
                  aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
                >
                  <Heart className={`w-4 h-4 ${favorited ? 'fill-rose-600' : ''}`} />
                </button>

                <div className="absolute top-3 left-3">
                  <span className="text-[10px] font-mono font-bold bg-[#12372A]/90 text-white px-2.5 py-1 rounded shadow-xs">
                    {product.stockStatus}
                  </span>
                </div>
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-300 block">
                    PHYSICAL MONOGRAPH SPECIFICATION
                  </span>
                  <span className="text-xs font-semibold block truncate">
                    {product.appearance}
                  </span>
                </div>
              </div>

              <div className="bg-warm-white rounded-lg border border-border-subtle p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-border-subtle pb-3">
                  <div>
                    <span className="text-[11px] font-mono text-secondary-text uppercase tracking-wider block">
                      Commercial Pricing:
                    </span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-lg font-black font-mono text-charcoal">
                        PKR {finalEffectivePrice.toLocaleString()}
                      </span>
                      {(pricing?.hasDiscount || appliedPromo) && (
                        <span className="text-xs font-mono text-slate-400 line-through">
                          PKR {pricing?.regularPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                  {appliedPromo ? (
                    <span className="bg-emerald-50 text-emerald-700 font-mono text-xs font-bold px-2.5 py-1 rounded border border-emerald-200">
                      -{appliedPromo.value}% Promo
                    </span>
                  ) : pricing?.hasDiscount ? (
                    <span className="bg-rose-50 text-rose-700 font-mono text-xs font-bold px-2.5 py-1 rounded border border-rose-200">
                      {pricing.badgeText}
                    </span>
                  ) : null}
                </div>

                {/* Promo Code Input on Product Page */}
                <div className="bg-white rounded border border-border-subtle p-3 space-y-2">
                  <span className="text-[11px] font-semibold text-charcoal uppercase tracking-wider block">
                    Have a Promo Code?
                  </span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. PUREBLEND10"
                      value={couponCodeInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="flex-1 text-xs px-2.5 py-1.5 rounded border border-border-subtle focus:outline-none focus:border-primary-green uppercase font-mono"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs shrink-0"
                      onClick={handleApplyCoupon}
                    >
                      Apply
                    </Button>
                  </div>
                  {couponError && (
                    <p className="text-[11px] text-rose-600">{couponError}</p>
                  )}
                  {appliedPromo && (
                    <div className="flex items-center justify-between text-[11px] text-emerald-700 bg-soft-green px-2 py-1 rounded">
                      <span className="font-semibold font-mono">Code {appliedPromo.code} applied ({appliedPromo.value}% off)</span>
                      <button
                        type="button"
                        onClick={() => setAppliedPromo(null)}
                        className="text-slate-500 hover:text-rose-600 underline text-[10px]"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>

                <p className="text-xs text-secondary-text leading-relaxed">
                  Receive customized pricing tier calculations based on projected volume, packaging format, and Incoterm delivery destination.
                </p>

                <Button
                  variant="primary"
                  className="w-full justify-center"
                  onClick={() => setIsRfqOpen(true)}
                >
                  Request Instant RFQ Quote
                </Button>

                <div className="pt-3 border-t border-border-subtle space-y-2 text-xs">
                <p className="font-semibold text-charcoal text-[11px] uppercase tracking-wider">
                  Accompanying Lot Documents:
                </p>
                <div className="space-y-1.5 text-secondary-text">
                  <div className="flex items-center gap-2">
                    <FileCheck2 className="w-3.5 h-3.5 text-primary-green" />
                    <span>Certificate of Analysis (COA)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-primary-green" />
                    <span>Safety Data Sheet (SDS / GHS compliant)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary-green" />
                    <span>FCC Technical Specification Sheet (TDS)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

        {/* Detailed Technical Monograph Table */}
        <section className="mb-12">
          <div className="mb-4">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-primary-green">
              Analytical Specifications
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-charcoal tracking-tight mt-1">
              Monograph Parameters & Quality Standards
            </h2>
          </div>
          <SpecTable product={product} />
        </section>

        {/* Industrial Applications Section */}
        <section className="mb-12 bg-white rounded-lg border border-border-subtle p-6 sm:p-8">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-primary-green">
            Processing Functionality
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-charcoal tracking-tight mt-1 mb-4">
            Target Food & Beverage Applications
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {product.applications.map((app, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded bg-warm-white border border-border-subtle text-xs flex items-start gap-2.5"
              >
                <div className="w-5 h-5 rounded-full bg-soft-green text-forest flex items-center justify-center shrink-0 mt-0.5 font-bold text-[10px]">
                  {idx + 1}
                </div>
                <span className="text-charcoal font-medium leading-relaxed">{app}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <section className="mb-8">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-primary-green">
                  Similar Systems
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-charcoal tracking-tight mt-1">
                  Related Ingredients in {product.category}
                </h2>
              </div>
              <Link href={`/products?category=${encodeURIComponent(product.category)}`}>
                <Button variant="ghost" size="sm" className="text-xs text-primary-green hover:underline">
                  View All {product.category} →
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>

      <RFQModal
        isOpen={isRfqOpen}
        onClose={() => setIsRfqOpen(false)}
        preselectedProductId={product.id}
        initialDiscountCode={appliedPromo?.code}
      />
    </PublicLayout>
  );
}
