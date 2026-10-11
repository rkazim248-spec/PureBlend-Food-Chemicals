'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Button } from '@/components/ui/Button';
import { RFQModal } from '@/components/forms/RFQModal';
import { OFFERS_DATA, PRODUCTS_DATA } from '@/data/mockData';
import { 
  ShieldCheck, 
  CheckCircle2, 
  Calendar, 
  Layers, 
  ArrowRight, 
  FileSpreadsheet, 
  TrendingUp,
  Clock
} from 'lucide-react';

export default function OffersPage() {
  const [isRfqOpen, setIsRfqOpen] = useState(false);
  const [selectedOfferCode, setSelectedOfferCode] = useState<string | null>(null);

  const handleInquireOffer = (code: string) => {
    setSelectedOfferCode(code);
    setIsRfqOpen(true);
  };

  return (
    <PublicLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs items={[{ label: 'B2B Supply Programs & Contracts' }]} />

        {/* Page Header */}
        <div className="my-6 max-w-3xl">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-primary-green">
            Contractual Procurement
          </span>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-charcoal tracking-tight mt-1">
            B2B Volume Supply Programs & Contract Frameworks
          </h1>
          <p className="text-xs sm:text-sm text-secondary-text mt-2 leading-relaxed">
            PureBlend establishes long-term industrial supply agreements, palletized evaluation programs, and vendor-managed consignment inventory for certified food and beverage production facilities.
          </p>
        </div>

        {/* Notice of Transparency */}
        <div className="bg-[#eff5f1] border border-[#d2e4d8] rounded-lg p-4 mb-8 text-xs text-forest flex items-start gap-3">
          <ShieldCheck className="w-4 h-4 text-primary-green shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-charcoal">Commercial Transparency Policy:</span>
            <p className="mt-0.5 text-secondary-text">
              PureBlend does not publish speculative consumer coupons. All volume contract structures are verified against credit assessments, factory consumption audits, and multi-drop delivery logistics.
            </p>
          </div>
        </div>

        {/* Logistics & Buffer Stock Visual Feature */}
        <div className="relative h-48 sm:h-60 rounded-xl overflow-hidden mb-8 border border-border-subtle shadow-xs">
          <img
            src="/images/warehouse-logistics.jpg"
            alt="PureBlend B2B Chemical Warehouse Buffer Inventory"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#12372A]/95 via-[#12372A]/65 to-transparent flex items-center p-6 sm:p-8 text-white">
            <div className="max-w-lg space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-300 bg-white/10 px-2.5 py-0.5 rounded border border-white/20 font-bold">
                12,000 MT BUFFER GUARANTEE
              </span>
              <h2 className="text-lg sm:text-2xl font-black tracking-tight">
                Direct Mill-to-Plant Freight &amp; Standing Order Reserves
              </h2>
              <p className="text-xs text-[#c0dbce] leading-relaxed">
                Our multi-hub palletized inventory contracts insulate industrial food processors from ocean freight spikes and port congestion with guaranteed 24-hour dispatch SLAs.
              </p>
            </div>
          </div>
        </div>

        {/* Offers Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {OFFERS_DATA.map((offer) => {
            const relatedProductsList = PRODUCTS_DATA.filter((p) =>
              offer.targetProducts.includes(p.id)
            );

            return (
              <div
                key={offer.id}
                className="bg-white rounded-lg border border-border-subtle p-6 flex flex-col justify-between shadow-xs hover:border-[#b4cdbd] transition-all"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 text-xs mb-3">
                    <span className="font-mono text-xs font-bold text-forest bg-soft-green px-2 py-0.5 rounded border border-[#cfe0d5]">
                      {offer.badge}
                    </span>
                    <span className="text-xs font-mono text-secondary-text">
                      {offer.inquiryCode}
                    </span>
                  </div>

                  <h2 className="text-lg font-bold text-charcoal leading-snug">
                    {offer.title}
                  </h2>

                  <p className="text-xs text-secondary-text mt-2 leading-relaxed">
                    {offer.description}
                  </p>

                  <div className="mt-4 p-3 rounded bg-warm-white border border-border-subtle">
                    <span className="text-[11px] font-semibold text-secondary-text uppercase block">
                      Target Volume Scale:
                    </span>
                    <span className="text-xs font-mono font-bold text-forest block mt-0.5">
                      {offer.volumeTier}
                    </span>
                  </div>

                  {/* Conditions & Terms */}
                  <div className="mt-4 pt-3 border-t border-border-subtle space-y-2">
                    <p className="text-[11px] font-semibold text-charcoal uppercase tracking-wider">
                      Contractual Terms & Benefits:
                    </p>
                    <ul className="space-y-1.5 text-xs text-secondary-text">
                      {offer.terms.map((term, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-primary-green shrink-0 mt-0.5" />
                          <span>{term}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Target Ingredients */}
                  <div className="mt-4 pt-3 border-t border-border-subtle">
                    <p className="text-[11px] font-semibold text-secondary-text uppercase tracking-wider mb-2">
                      Eligible Products:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {relatedProductsList.map((p) => (
                        <Link
                          key={p.id}
                          href={`/products/${p.id}`}
                          className="text-[11px] font-mono text-charcoal bg-warm-white hover:bg-soft-green px-2 py-0.5 rounded border border-border-subtle transition-colors"
                        >
                          {p.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-border-subtle space-y-3">
                  <div className="flex items-center gap-1.5 text-[11px] text-secondary-text">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{offer.validityDate}</span>
                  </div>

                  <Button
                    variant="primary"
                    className="w-full justify-center text-xs"
                    onClick={() => handleInquireOffer(offer.inquiryCode)}
                  >
                    Inquire for Framework Terms
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Custom Procurement Terms Callout */}
        <div className="bg-warm-white rounded-lg border border-border-subtle p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-base font-bold text-charcoal">
              Multi-Plant or Annual Enterprise Supply Tender?
            </h3>
            <p className="text-xs sm:text-sm text-secondary-text max-w-xl">
              Submit your formal RFP / tender documents directly to our enterprise contracts desk for multi-regional logistics pricing.
            </p>
          </div>
          <Link href="/contact" className="shrink-0">
            <Button variant="outline">
              Submit Tender Request
            </Button>
          </Link>
        </div>
      </div>

      <RFQModal isOpen={isRfqOpen} onClose={() => setIsRfqOpen(false)} />
    </PublicLayout>
  );
}
