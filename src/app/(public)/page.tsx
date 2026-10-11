'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { Button } from '@/components/ui/Button';
import { RFQModal } from '@/components/forms/RFQModal';
import { useToast } from '@/components/ui/Toast';
import { 
  PRODUCTS_DATA, 
  OFFERS_DATA, 
  BANNER_SLIDES, 
  SOLUTIONS_DATA,
  FAQS_DATA 
} from '@/data/mockData';
import { BannerSlide, Product } from '@/types';
import { 
  ArrowRight, 
  ArrowLeft,
  ShieldCheck, 
  CheckCircle2, 
  FlaskConical, 
  Award, 
  Truck, 
  Clock, 
  FileText,
  Search,
  ExternalLink,
  Layers,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Lock,
  Headphones,
  Check,
  Percent,
  Calendar,
  X,
  SlidersHorizontal,
  ChevronDown,
  Building,
  Mail,
  Send,
  Download,
  Package,
  FileCheck2,
  HelpCircle,
  Eye,
  Info,
  Copy,
  Tag,
  Flame,
  Timer
} from 'lucide-react';

interface SeasonalPromo {
  id: string;
  seasonTag: string;
  badge: string;
  title: string;
  highlightDiscount: string;
  subText: string;
  description: string;
  promoCode: string;
  validUntil: string;
  allocationLeft: string;
  targetChemicals: string[];
  recommendedProductId: string;
}

const SEASONAL_PROMOS: SeasonalPromo[] = [
  {
    id: 'q4-surge',
    seasonTag: 'AUTUMN / WINTER 2026 CAMPAIGN',
    badge: 'PEAK PRODUCTION OFFER',
    title: 'Seasonal Beverage & Preserves Surge: Volume Rebate',
    highlightDiscount: '14% VOLUME REBATE',
    subText: 'Standing Full-Truckload (FTL) orders ≥ 10 Metric Tons',
    description: 'Ensure unhindered bottling, syrup, and confectionery runs through peak winter demand. Reserve verified batch allocations of Citric Acid Anhydrous and Xanthan Gum with locked freight and zero penalty buffer storage.',
    promoCode: 'WINTER-SURGE26',
    validUntil: 'Dec 31, 2026',
    allocationLeft: '380 MT Buffer Remaining',
    targetChemicals: ['Citric Acid Anhydrous (PB-AC-01)', 'Xanthan Gum 80 Mesh (PB-HY-03)', 'Malic Acid (PB-AC-04)'],
    recommendedProductId: 'citric-acid-anhydrous'
  },
  {
    id: 'holiday-bakery',
    seasonTag: 'HOLIDAY BAKERY & CONFECTIONERY',
    badge: 'EXPEDITED TESTING INCLUDED',
    title: 'Clean-Label Leavening & Shelf-Life Extension Bundle',
    highlightDiscount: 'FREE 500g PILOT KITS',
    subText: '+ Tier-2 Pallet Pricing on SAPP 28 & Calcium Propionate',
    description: 'Prevent holiday microbial spoilage and optimize gas-release rates in industrial baked goods. Includes complimentary pilot-line sample testing and full FCC XIII / USP regulatory documentation dispatched in 48 hours.',
    promoCode: 'BAKE-HOLIDAY26',
    validUntil: 'Nov 30, 2026',
    allocationLeft: 'Limited to 65 Commercial Bakeries',
    targetChemicals: ['Calcium Propionate (PB-PR-05)', 'SAPP 28 Leavening (PB-LE-08)', 'Potassium Sorbate (PB-PR-02)'],
    recommendedProductId: 'calcium-propionate'
  },
  {
    id: 'contract-lock-2027',
    seasonTag: '2027 STRATEGIC PROCUREMENT',
    badge: 'INFLATION HEDGE GUARANTEE',
    title: 'Annual Standing Purchase Order (SPO) Price Lock',
    highlightDiscount: '12-MONTH PRICE CEILING',
    subText: 'Zero spot market surcharge across all 140+ compounds',
    description: 'Protect your 2027 manufacturing margins against international freight spikes and energy volatility. Secure fixed quarterly volume allocations with up to 45 days free holding in our regional hubs.',
    promoCode: 'LOCK-SPO2027',
    validUntil: 'Open through Jan 15, 2027',
    allocationLeft: '18 Annual Facility Slots',
    targetChemicals: ['All FCC 13 Pharmacopeial Ingredients', 'Custom Dry Blends'],
    recommendedProductId: 'citric-acid-anhydrous'
  }
];

export default function HomePage() {
  const { showToast } = useToast();

  // 1. Top Announcement Bar State
  const [showAnnouncement, setShowAnnouncement] = useState(true);

  // 1.1 Seasonal Promotional Banner Section State
  const [activeSeasonalIndex, setActiveSeasonalIndex] = useState(0);
  const [isSeasonalBannerVisible, setIsSeasonalBannerVisible] = useState(true);
  const [isSeasonalBannerExpanded, setIsSeasonalBannerExpanded] = useState(true);
  const [copiedSeasonalCode, setCopiedSeasonalCode] = useState(false);

  // 2. Banner / Carousel State (hydrated with localStorage if admin customized it)
  const [slides, setSlides] = useState<BannerSlide[]>(BANNER_SLIDES);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isAutoPlayPaused, setIsAutoPlayPaused] = useState(false);

  useEffect(() => {
    const syncSlides = () => {
      try {
        const stored = localStorage.getItem('pureblend_banner_slides');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setSlides(parsed.filter((s: BannerSlide) => s.active));
          }
        }
      } catch {
        // fallback
      }
    };

    window.addEventListener('storage', syncSlides);
    const timer = setTimeout(syncSlides, 0);
    return () => {
      window.removeEventListener('storage', syncSlides);
      clearTimeout(timer);
    };
  }, []);

  // Filter active slides and sort by order
  const activeSlides = useMemo(() => {
    const act = slides.filter((s) => s.active);
    return act.length > 0 ? act.sort((a, b) => a.order - b.order) : BANNER_SLIDES;
  }, [slides]);

  // Autoplay timer
  useEffect(() => {
    if (isAutoPlayPaused || activeSlides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % activeSlides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isAutoPlayPaused, activeSlides.length]);

  const nextSlide = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % activeSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);
  };

  const currentSlide = activeSlides[currentSlideIndex] || activeSlides[0];

  // 3. RFQ Modal State
  const [isRfqOpen, setIsRfqOpen] = useState(false);
  const [selectedProductRfq, setSelectedProductRfq] = useState<string | undefined>(undefined);

  const openQuoteForProduct = (productId?: string) => {
    setSelectedProductRfq(productId);
    setIsRfqOpen(true);
  };

  // 4. Products Category Filter in Catalog Section
  const [activeCatalogCategory, setActiveCatalogCategory] = useState<string>('All');
  const [catalogSearch, setCatalogSearch] = useState<string>('');

  const filteredCatalogProducts = useMemo(() => {
    return PRODUCTS_DATA.filter((p) => {
      const matchCat = activeCatalogCategory === 'All' || p.category === activeCatalogCategory;
      const matchSearch =
        catalogSearch.trim() === '' ||
        p.name.toLowerCase().includes(catalogSearch.toLowerCase()) ||
        p.code.toLowerCase().includes(catalogSearch.toLowerCase()) ||
        p.casNumber.toLowerCase().includes(catalogSearch.toLowerCase()) ||
        p.insNumber.toLowerCase().includes(catalogSearch.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [activeCatalogCategory, catalogSearch]);

  // 5. Spec Quick-View Drawer / Modal
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // 6. Chemical Quick Lookup Tool
  const [lookupQuery, setLookupQuery] = useState('');
  const [matchedChemical, setMatchedChemical] = useState<Product | null>(PRODUCTS_DATA[0]);

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookupQuery.trim()) return;
    const q = lookupQuery.toLowerCase().trim();
    const found = PRODUCTS_DATA.find(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.code.toLowerCase().includes(q) ||
        p.casNumber.toLowerCase().includes(q) ||
        p.insNumber.toLowerCase().includes(q)
    );
    if (found) {
      setMatchedChemical(found);
      showToast({
        title: 'Chemical Found',
        description: `Loaded monograph for ${found.name}`,
        type: 'success'
      });
    } else {
      showToast({
        title: 'Not Found in Catalog',
        description: 'No matching compound found. Showing closest benchmark.',
        type: 'warning'
      });
    }
  };

  // 7. On-Page RFQ Form State
  const [inlineRfq, setInlineRfq] = useState({
    company: '',
    contact: '',
    email: '',
    phone: '',
    productId: PRODUCTS_DATA[0]?.id || '',
    volume: '5',
    unit: 'Metric Tons (MT)',
    packaging: '25kg Kraft Bags w/ PE Liner',
    incoterm: 'FOB',
    notes: ''
  });
  const [inlineSubmitting, setInlineSubmitting] = useState(false);
  const [inlineSubmitted, setInlineSubmitted] = useState(false);

  const handleInlineRfqSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inlineRfq.company || !inlineRfq.email || !inlineRfq.contact) {
      showToast({
        title: 'Missing Required Fields',
        description: 'Please provide company name, contact person, and corporate email.',
        type: 'error'
      });
      return;
    }
    setInlineSubmitting(true);
    setTimeout(() => {
      setInlineSubmitting(false);
      setInlineSubmitted(true);
      showToast({
        title: 'RFQ Dispatched Successfully',
        description: 'Quotation dossier logged. Reference: RFQ-PB-2026-LIVE',
        type: 'success'
      });
    }, 1200);
  };

  // 8. FAQ Accordion State
  const [openFaqId, setOpenFaqId] = useState<string | null>(FAQS_DATA[0]?.id || null);

  const toggleFaq = (id: string) => {
    setOpenFaqId((prev) => (prev === id ? null : id));
  };

  const activeSeasonalPromo = SEASONAL_PROMOS[activeSeasonalIndex] || SEASONAL_PROMOS[0];

  const handleCopyPromoCode = (code: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(code);
    }
    setCopiedSeasonalCode(true);
    showToast({
      title: 'Promo Code Copied',
      description: `Code "${code}" copied to clipboard! Paste it into your RFQ.`,
      type: 'success'
    });
    setTimeout(() => setCopiedSeasonalCode(false), 2500);
  };

  const handleApplySeasonalPromo = (promo: SeasonalPromo) => {
    openQuoteForProduct(promo.recommendedProductId);
    showToast({
      title: 'Seasonal Offer Applied',
      description: `Applied ${promo.promoCode} (${promo.highlightDiscount}) to your RFQ builder.`,
      type: 'success'
    });
  };

  return (
    <PublicLayout>
      {/* =========================================================================
          SECTION 0: TOP ANNOUNCEMENT & CAMPAIGN PROMOTION BANNER
      ========================================================================= */}
      {showAnnouncement && (
        <aside 
          aria-label="Promotion announcement"
          className="bg-[#12372A] text-white text-xs border-b border-[#245848] px-4 py-2.5 transition-all"
        >
          <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 text-center sm:text-left">
              <span className="bg-[#1F7A5A] text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded tracking-wider uppercase">
                Q4 INCENTIVE
              </span>
              <span className="text-[#d0e5da]">
                Standing Purchase Order Guarantee: Lock in fixed-rate volume pricing on Citric Acid &amp; Potassium Sorbate through 2027.
              </span>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Link 
                href="/offers" 
                className="font-bold underline text-emerald-300 hover:text-white flex items-center gap-1"
              >
                <span>View Program</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
              <button 
                type="button"
                onClick={() => setShowAnnouncement(false)}
                className="text-[#96b8a7] hover:text-white p-0.5 rounded focus-visible:outline-none"
                aria-label="Dismiss announcement"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* =========================================================================
          SECTION 0.5: TOP SEASONAL OFFERS PROMOTIONAL BANNER SECTION
      ========================================================================= */}
      {isSeasonalBannerVisible && (
        <section 
          className="bg-gradient-to-r from-[#F0F5F2] via-[#EBF3EF] to-[#F5F8F6] border-b border-[#CFDDD4] relative transition-all"
          aria-label="Current Seasonal Offers and Sourcing Specials"
        >
          {/* Subtle Industrial Background Texture */}
          <div 
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, #12372A 1px, transparent 0)`,
              backgroundSize: '24px 24px'
            }}
          />

          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-5 relative z-10">
            {/* Top Bar inside Seasonal Banner: Header & Tabs */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#D8E2DC]/80">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#12372A] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Flame className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#1F7A5A] bg-[#EAF3EE] px-2 py-0.5 rounded border border-[#cce0d5]">
                      SEASONAL PROCUREMENT SPECIALS
                    </span>
                    <span className="text-[10px] font-mono text-[#52615A]">
                      Q4 2026 / Q1 2027 WINDOW
                    </span>
                  </div>
                  <h2 className="text-sm sm:text-base font-black text-[#17211D] tracking-tight mt-0.5">
                    Current Seasonal Offers &amp; High-Volume Sourcing Incentives
                  </h2>
                </div>
              </div>

              {/* Offer Selector Tabs & Controls */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center bg-white p-1 rounded-lg border border-[#D8E2DC] shadow-2xs">
                  {SEASONAL_PROMOS.map((promo, idx) => (
                    <button
                      key={promo.id}
                      type="button"
                      onClick={() => setActiveSeasonalIndex(idx)}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-md transition-all ${
                        activeSeasonalIndex === idx
                          ? 'bg-[#12372A] text-white shadow-xs'
                          : 'text-[#52615A] hover:text-[#17211D] hover:bg-[#F8FAF7]'
                      }`}
                    >
                      {idx === 0 && 'Beverage Surge (-14%)'}
                      {idx === 1 && 'Bakery Package (Free Pilot)'}
                      {idx === 2 && '2027 Price Ceiling Lock'}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-1.5 ml-auto lg:ml-0">
                  <button
                    type="button"
                    onClick={() => setIsSeasonalBannerExpanded(!isSeasonalBannerExpanded)}
                    className="text-xs text-[#52615A] hover:text-[#17211D] px-2 py-1 rounded border border-[#D8E2DC] bg-white transition-colors"
                    title={isSeasonalBannerExpanded ? 'Collapse section' : 'Expand section'}
                  >
                    {isSeasonalBannerExpanded ? 'Minimize' : 'Expand'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsSeasonalBannerVisible(false)}
                    className="p-1 rounded text-[#52615A] hover:text-[#17211D] hover:bg-white transition-colors"
                    aria-label="Dismiss seasonal banner"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Expanded Seasonal Offer Card */}
            {isSeasonalBannerExpanded && (
              <div className="mt-4 grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch animate-in fade-in duration-200">
                {/* Left Column: Offer Details */}
                <div className="lg:col-span-8 bg-white rounded-xl border border-[#D8E2DC] p-5 sm:p-6 flex flex-col justify-between shadow-2xs">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#C9A227] bg-[#FEF6E7] border border-[#F3DEB0] px-2.5 py-0.5 rounded">
                        {activeSeasonalPromo.badge}
                      </span>
                      <span className="text-[10px] font-mono text-[#52615A]">
                        {activeSeasonalPromo.seasonTag}
                      </span>
                    </div>

                    <h3 className="text-lg sm:text-xl font-black text-[#17211D] tracking-tight">
                      {activeSeasonalPromo.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-[#52615A] mt-2 leading-relaxed">
                      {activeSeasonalPromo.description}
                    </p>

                    {/* Target Chemicals Pills */}
                    <div className="mt-4 pt-3 border-t border-[#D8E2DC] flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-mono font-bold text-[#17211D]">
                        Target Ingredients:
                      </span>
                      {activeSeasonalPromo.targetChemicals.map((chem, i) => (
                        <span 
                          key={i} 
                          className="text-[11px] font-mono bg-[#EAF3EE] text-[#12372A] px-2 py-0.5 rounded border border-[#cbe2d4]"
                        >
                          {chem}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Urgency & Validity Metadata */}
                  <div className="mt-5 pt-3 border-t border-[#D8E2DC] flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-[#52615A]">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-[#1F7A5A]" />
                      <span>{activeSeasonalPromo.validUntil}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="font-semibold text-emerald-800">{activeSeasonalPromo.allocationLeft}</span>
                    </div>
                  </div>
                </div>

                {/* Right Column: Highlight Discount & Action Box */}
                <div className="lg:col-span-4 bg-[#12372A] text-white rounded-xl border border-[#245848] p-5 sm:p-6 flex flex-col justify-between shadow-md">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase text-emerald-300 tracking-wider">
                        COMMERCIAL BENEFIT
                      </span>
                      <Percent className="w-4 h-4 text-emerald-400" />
                    </div>

                    <div className="mt-2">
                      <span className="text-2xl sm:text-3xl font-black tracking-tight text-white block">
                        {activeSeasonalPromo.highlightDiscount}
                      </span>
                      <span className="text-xs text-[#a4c5b5] block mt-0.5">
                        {activeSeasonalPromo.subText}
                      </span>
                    </div>

                    {/* Promo Code Box with Copy Button */}
                    <div className="mt-4 p-2.5 rounded-lg bg-black/35 border border-white/15 flex items-center justify-between gap-2">
                      <div>
                        <span className="text-[9px] font-mono text-[#86a898] uppercase block">
                          Contract Promo Code
                        </span>
                        <span className="font-mono font-bold text-sm text-emerald-300">
                          {activeSeasonalPromo.promoCode}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopyPromoCode(activeSeasonalPromo.promoCode)}
                        className="px-2.5 py-1.5 rounded bg-white/15 hover:bg-white/25 text-white text-[11px] font-mono font-semibold transition-colors flex items-center gap-1.5 focus-visible:outline-none"
                        title="Copy promo code"
                      >
                        {copiedSeasonalCode ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-300" />
                            <span className="text-emerald-300">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-5 flex flex-col sm:flex-row items-center gap-2.5">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleApplySeasonalPromo(activeSeasonalPromo)}
                      className="w-full sm:flex-1 bg-[#1F7A5A] hover:bg-emerald-600 text-white font-bold text-xs h-9 justify-center shadow-xs"
                    >
                      Apply to Quick Quote
                    </Button>
                    <Link href="/offers" className="w-full sm:flex-1">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full text-xs text-[#12372A] font-bold bg-white hover:bg-slate-50 border-emerald-300 h-9 justify-center shadow-xs"
                      >
                        <span>View All Standing Offers</span>
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* =========================================================================
          SECTION 1: DYNAMIC RESPONSIVE HERO BANNER / CAROUSEL SLIDER
      ========================================================================= */}
      <section 
        className="relative overflow-hidden bg-[#0D211A] text-white border-b border-[#D8E2DC]"
        onMouseEnter={() => setIsAutoPlayPaused(true)}
        onMouseLeave={() => setIsAutoPlayPaused(false)}
        aria-label="Homepage Hero Banner Carousel"
      >
        {/* Background Image / Subtle Grid Overlay */}
        <div 
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)`,
            backgroundSize: '24px 24px'
          }}
        />

        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center min-h-[460px]">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6">
              {/* Slide Kicker Pill */}
              <div className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-wider text-emerald-300 bg-[#16382D] px-3.5 py-1 rounded-full border border-[#235343] shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{currentSlide.kicker}</span>
              </div>

              {/* Dynamic Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-[52px] font-black tracking-tight leading-[1.12] text-white min-h-[70px]">
                {currentSlide.title}
              </h1>

              {/* Supporting Copy */}
              <p className="text-sm sm:text-base text-[#a8c9bb] leading-relaxed max-w-2xl min-h-[60px]">
                {currentSlide.description}
              </p>

              {/* Actions & Carousel Triggers */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <Link href={currentSlide.ctaLink}>
                  <Button
                    variant="primary"
                    size="lg"
                    className="bg-[#1F7A5A] hover:bg-emerald-600 text-white text-sm px-8 h-12 font-bold shadow-md flex items-center gap-2 rounded-lg"
                  >
                    <span>{currentSlide.ctaText}</span>
                  </Button>
                </Link>
                {currentSlide.secondaryCtaText && (
                  currentSlide.secondaryCtaLink === '/rfq' ? (
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => openQuoteForProduct()}
                      className="bg-white/15 hover:bg-white/25 border-white/30 text-white text-sm px-6 h-12 font-bold shadow-sm"
                    >
                      {currentSlide.secondaryCtaText}
                    </Button>
                  ) : (
                    <Link href={currentSlide.secondaryCtaLink || '/products'}>
                      <Button
                        variant="outline"
                        size="lg"
                        className="bg-white/15 hover:bg-white/25 border-white/30 text-white text-sm px-6 h-12 font-bold shadow-sm"
                      >
                        {currentSlide.secondaryCtaText}
                      </Button>
                    </Link>
                  )
                )}
              </div>

              {/* Micro-Proof Badges */}
              <div className="pt-6 border-t border-white/10 flex flex-wrap items-center gap-6 text-xs font-mono text-[#94b8a7]">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>99.8% Lot Compliance</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>24hr Cold-Chain Dispatch</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>ISO 22000 &amp; FSSC Certified</span>
                </div>
              </div>
            </div>

            {/* Right Hero Card: Laboratory Assay Visual Display */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl border border-white/15 bg-gradient-to-b from-[#133026] to-[#0A1A14] p-5 shadow-2xl overflow-hidden group">
                {/* Visual Canvas with Photorealistic Facility & Assay Overlay */}
                <div className="relative h-72 sm:h-80 w-full rounded-xl overflow-hidden flex flex-col justify-between p-5 text-white border border-white/10 shadow-inner">
                  {/* Real Photorealistic Facility / Laboratory Image */}
                  <Image
                    src={currentSlide.imageUrl || '/images/hero-facility.jpg'}
                    alt={currentSlide.title}
                    fill
                    className="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  {/* Subtle Industrial Tint & Dark Gradients */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0D211A] via-black/40 to-black/60 pointer-events-none" />

                  {/* Top Bar inside Card */}
                  <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/15 text-[11px] font-mono">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span>{currentSlide.badgeText || 'BATCH QA VERIFIED'}</span>
                    </div>
                    <div className="bg-[#EAF3EE] text-[#12372A] font-mono text-[11px] font-bold px-2.5 py-1 rounded border border-[#cbe2d4] flex items-center gap-1 shadow-xs">
                      <Award className="w-3.5 h-3.5 text-[#1F7A5A]" />
                      <span>{currentSlide.badgeValue || '99.8% Lot Clearance'}</span>
                    </div>
                  </div>

                  {/* Center Badge / Chemistry Standard */}
                  <div className="relative z-10 my-auto text-center py-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-xs font-mono text-emerald-200">
                      <FlaskConical className="w-4 h-4 text-emerald-400" />
                      <span>FCC XIII &amp; USP 43 Certified Facility</span>
                    </div>
                  </div>

                  {/* Bottom Specification Tag Overlay */}
                  <div className="relative z-10 bg-black/60 backdrop-blur-md p-3.5 rounded-lg border border-white/15 text-xs space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-[#a4c5b5] font-mono">HPLC Active Assay:</span>
                      <span className="font-mono font-bold text-emerald-300">
                        {currentSlide.chemicalPurity || '99.96% Purity (FCC Std)'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-[#86a898] font-mono pt-0.5 border-t border-white/10">
                      <span>CODE: {currentSlide.chemicalCode || 'PB-AC-01'}</span>
                      <span className="text-emerald-400 font-semibold">100% GS1 Traceable</span>
                    </div>
                  </div>
                </div>

                {/* Sub-card badges */}
                <div className="mt-3.5 grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="p-2.5 rounded-lg bg-white/5 border border-white/10 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="text-white text-[11px] font-semibold">ISO 22000 &amp; FSSC</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white/5 border border-white/10 flex items-center gap-2">
                    <Award className="w-4 h-4 text-[#C9A227] shrink-0" />
                    <span className="text-white text-[11px] font-semibold">USP/FCC Pharmacopeia</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Carousel Slide Controls & Indicators */}
          <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {activeSlides.map((slide, idx) => (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => setCurrentSlideIndex(idx)}
                  className={`h-2 rounded-full transition-all duration-300 focus-visible:outline-none ${
                    idx === currentSlideIndex
                      ? 'w-8 bg-emerald-400'
                      : 'w-2 bg-white/30 hover:bg-white/50'
                  }`}
                  aria-label={`Jump to slide ${idx + 1}`}
                />
              ))}
              <span className="text-xs font-mono text-white/50 ml-2">
                0{currentSlideIndex + 1} / 0{activeSlides.length}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={prevSlide}
                className="p-2 rounded-md bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-colors focus-visible:outline-none"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={nextSlide}
                className="p-2 rounded-md bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-colors focus-visible:outline-none"
                aria-label="Next slide"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: 5 VALUE PILLARS & OPERATIONAL ADVANTAGES
      ========================================================================= */}
      <section className="bg-white border-b border-[#D8E2DC] py-10">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-[#F8FAF7] rounded-xl border border-[#D8E2DC] p-4 space-y-1.5 hover:border-[#1F7A5A] transition-colors">
              <div className="w-7 h-7 rounded-md bg-[#EAF3EE] text-[#1F7A5A] flex items-center justify-center font-bold text-xs">
                01
              </div>
              <h2 className="text-xs font-bold text-[#17211D] uppercase tracking-wider">Quality-Focused</h2>
              <p className="text-xs text-[#52615A] leading-snug">
                Standardized FCC &amp; USP testing across all active ingredient lots.
              </p>
            </div>

            <div className="bg-[#F8FAF7] rounded-xl border border-[#D8E2DC] p-4 space-y-1.5 hover:border-[#1F7A5A] transition-colors">
              <div className="w-7 h-7 rounded-md bg-[#EAF3EE] text-[#1F7A5A] flex items-center justify-center font-bold text-xs">
                02
              </div>
              <h2 className="text-xs font-bold text-[#17211D] uppercase tracking-wider">Reliable Supply</h2>
              <p className="text-xs text-[#52615A] leading-snug">
                Multi-hub nationwide warehousing with guaranteed buffer stocks.
              </p>
            </div>

            <div className="bg-[#F8FAF7] rounded-xl border border-[#D8E2DC] p-4 space-y-1.5 hover:border-[#1F7A5A] transition-colors">
              <div className="w-7 h-7 rounded-md bg-[#EAF3EE] text-[#1F7A5A] flex items-center justify-center font-bold text-xs">
                03
              </div>
              <h2 className="text-xs font-bold text-[#17211D] uppercase tracking-wider">Technical Expertise</h2>
              <p className="text-xs text-[#52615A] leading-snug">
                On-staff food application scientists and formulation rheologists.
              </p>
            </div>

            <div className="bg-[#F8FAF7] rounded-xl border border-[#D8E2DC] p-4 space-y-1.5 hover:border-[#1F7A5A] transition-colors">
              <div className="w-7 h-7 rounded-md bg-[#EAF3EE] text-[#1F7A5A] flex items-center justify-center font-bold text-xs">
                04
              </div>
              <h2 className="text-xs font-bold text-[#17211D] uppercase tracking-wider">Industry Solutions</h2>
              <p className="text-xs text-[#52615A] leading-snug">
                Custom dry blends, acidity curves &amp; clean-label formulations.
              </p>
            </div>

            <div className="bg-[#F8FAF7] rounded-xl border border-[#D8E2DC] p-4 space-y-1.5 hover:border-[#1F7A5A] transition-colors">
              <div className="w-7 h-7 rounded-md bg-[#EAF3EE] text-[#1F7A5A] flex items-center justify-center font-bold text-xs">
                05
              </div>
              <h2 className="text-xs font-bold text-[#17211D] uppercase tracking-wider">Customer Support</h2>
              <p className="text-xs text-[#52615A] leading-snug">
                Rapid CoA downloads &amp; direct technical sales desk access.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: INGREDIENT PRODUCT FAMILIES
      ========================================================================= */}
      <section className="py-16 bg-[#F8FAF7] border-b border-[#D8E2DC]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#1F7A5A]">
                INGREDIENT FAMILIES
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#17211D] tracking-tight mt-1">
                Explore Our Product Solutions
              </h2>
              <p className="text-xs sm:text-sm text-[#52615A] mt-1 max-w-xl">
                Engineered chemical grades meeting stringent United States Pharmacopeia and Food Chemicals Codex benchmarks.
              </p>
            </div>
            <Link
              href="/products"
              className="text-xs font-bold text-[#12372A] hover:text-[#1F7A5A] flex items-center gap-1.5 group"
            >
              <span>View All 140+ Compounds</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Family 1 */}
            <div className="bg-white rounded-xl border border-[#D8E2DC] p-5 flex flex-col justify-between hover:border-[#1F7A5A] hover:shadow-md transition-all">
              <div>
                <div className="relative h-40 rounded-lg overflow-hidden p-4 text-white flex flex-col justify-between mb-4 group/img">
                  <img
                    src="/images/citric-acid.jpg"
                    alt="Acidulants and pH Regulators"
                    className="absolute inset-0 w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/30 pointer-events-none" />
                  <span className="relative z-10 text-[10px] font-mono tracking-widest uppercase bg-black/60 px-2 py-0.5 rounded w-max border border-white/20">
                    CAS GRADE SERIES
                  </span>
                  <div className="relative z-10">
                    <span className="text-xs font-mono text-emerald-300 block">pH Control &amp; Chelation</span>
                    <strong className="text-base font-bold">Acidulants &amp; Buffers</strong>
                  </div>
                </div>

                <h3 className="text-base font-bold text-[#17211D]">
                  Acidulants &amp; pH Regulators
                </h3>
                <p className="text-xs text-[#52615A] mt-2 leading-relaxed">
                  Optimize flavor, enhance shelf-stability, and balance tartness profiles with high-titration organic acids.
                </p>

                <div className="mt-3.5 pt-3 border-t border-[#D8E2DC] flex flex-wrap gap-1.5">
                  <span className="text-[11px] font-mono bg-[#EAF3EE] text-[#12372A] px-2 py-0.5 rounded">
                    Citric Acid
                  </span>
                  <span className="text-[11px] font-mono bg-[#EAF3EE] text-[#12372A] px-2 py-0.5 rounded">
                    Malic Acid
                  </span>
                  <span className="text-[11px] font-mono bg-[#EAF3EE] text-[#12372A] px-2 py-0.5 rounded">
                    Sodium Citrate
                  </span>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-[#D8E2DC]">
                <Link
                  href="/products?category=Acidulants"
                  className="text-xs font-bold text-[#12372A] hover:text-[#1F7A5A] flex items-center justify-between"
                >
                  <span>Explore Category</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Family 2 */}
            <div className="bg-white rounded-xl border border-[#D8E2DC] p-5 flex flex-col justify-between hover:border-[#1F7A5A] hover:shadow-md transition-all">
              <div>
                <div className="relative h-40 rounded-lg overflow-hidden p-4 text-white flex flex-col justify-between mb-4 group/img">
                  <img
                    src="/images/hydrocolloid-texture.jpg"
                    alt="Hydrocolloids and Stabilizers"
                    className="absolute inset-0 w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/30 pointer-events-none" />
                  <span className="relative z-10 text-[10px] font-mono tracking-widest uppercase bg-black/60 px-2 py-0.5 rounded w-max border border-white/20">
                    TEXTURE &amp; VISCOSITY
                  </span>
                  <div className="relative z-10">
                    <span className="text-xs font-mono text-emerald-200 block">Rheology Modifiers</span>
                    <strong className="text-base font-bold">Hydrocolloids</strong>
                  </div>
                </div>

                <h3 className="text-base font-bold text-[#17211D]">
                  Hydrocolloids &amp; Stabilizers
                </h3>
                <p className="text-xs text-[#52615A] mt-2 leading-relaxed">
                  Precision suspension, syneresis control, and modified rheology for plant-based, bakery, and liquid food matrices.
                </p>

                <div className="mt-3.5 pt-3 border-t border-[#D8E2DC] flex flex-wrap gap-1.5">
                  <span className="text-[11px] font-mono bg-[#EAF3EE] text-[#12372A] px-2 py-0.5 rounded">
                    Xanthan Gum 200
                  </span>
                  <span className="text-[11px] font-mono bg-[#EAF3EE] text-[#12372A] px-2 py-0.5 rounded">
                    Pectin HM/LM
                  </span>
                  <span className="text-[11px] font-mono bg-[#EAF3EE] text-[#12372A] px-2 py-0.5 rounded">
                    Carrageenan
                  </span>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-[#D8E2DC]">
                <Link
                  href="/products?category=Hydrocolloids+%26+Stabilizers"
                  className="text-xs font-bold text-[#12372A] hover:text-[#1F7A5A] flex items-center justify-between"
                >
                  <span>Explore Category</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Family 3 */}
            <div className="bg-white rounded-xl border border-[#D8E2DC] p-5 flex flex-col justify-between hover:border-[#1F7A5A] hover:shadow-md transition-all">
              <div>
                <div className="relative h-40 rounded-lg overflow-hidden p-4 text-white flex flex-col justify-between mb-4 group/img">
                  <img
                    src="/images/lab-testing.jpg"
                    alt="Food Preservatives and Antimicrobials"
                    className="absolute inset-0 w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/30 pointer-events-none" />
                  <span className="relative z-10 text-[10px] font-mono tracking-widest uppercase bg-black/60 px-2 py-0.5 rounded w-max border border-white/20">
                    MICROBIAL CONTROL
                  </span>
                  <div className="relative z-10">
                    <span className="text-xs font-mono text-emerald-300 block">Antimicrobials</span>
                    <strong className="text-base font-bold">Food Preservatives</strong>
                  </div>
                </div>

                <h3 className="text-base font-bold text-[#17211D]">
                  Antimicrobials &amp; Preservatives
                </h3>
                <p className="text-xs text-[#52615A] mt-2 leading-relaxed">
                  Inhibit yeast, mold, and bacterial spoiling with high-dissolution potassium sorbate and calcium propionate.
                </p>

                <div className="mt-3.5 pt-3 border-t border-[#D8E2DC] flex flex-wrap gap-1.5">
                  <span className="text-[11px] font-mono bg-[#EAF3EE] text-[#12372A] px-2 py-0.5 rounded">
                    Potassium Sorbate
                  </span>
                  <span className="text-[11px] font-mono bg-[#EAF3EE] text-[#12372A] px-2 py-0.5 rounded">
                    Sodium Benzoate
                  </span>
                  <span className="text-[11px] font-mono bg-[#EAF3EE] text-[#12372A] px-2 py-0.5 rounded">
                    Calcium Propionate
                  </span>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-[#D8E2DC]">
                <Link
                  href="/products?category=Preservatives"
                  className="text-xs font-bold text-[#12372A] hover:text-[#1F7A5A] flex items-center justify-between"
                >
                  <span>Explore Category</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Family 4 */}
            <div className="bg-white rounded-xl border border-[#D8E2DC] p-5 flex flex-col justify-between hover:border-[#1F7A5A] hover:shadow-md transition-all">
              <div>
                <div className="relative h-40 rounded-lg overflow-hidden p-4 text-white flex flex-col justify-between mb-4 group/img">
                  <img
                    src="/images/warehouse-logistics.jpg"
                    alt="Functional Phosphates and Buffers"
                    className="absolute inset-0 w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/30 pointer-events-none" />
                  <span className="relative z-10 text-[10px] font-mono tracking-widest uppercase bg-black/60 px-2 py-0.5 rounded w-max border border-white/20">
                    FUNCTIONAL SALTS
                  </span>
                  <div className="relative z-10">
                    <span className="text-xs font-mono text-emerald-200 block">Aeration &amp; Leavening</span>
                    <strong className="text-base font-bold">Phosphates &amp; Buffers</strong>
                  </div>
                </div>

                <h3 className="text-base font-bold text-[#17211D]">
                  Leavening &amp; Buffering Agents
                </h3>
                <p className="text-xs text-[#52615A] mt-2 leading-relaxed">
                  Precise gas-release curves, mineral fortification, and emulsion stabilization for commercial baking and meats.
                </p>

                <div className="mt-3.5 pt-3 border-t border-[#D8E2DC] flex flex-wrap gap-1.5">
                  <span className="text-[11px] font-mono bg-[#EAF3EE] text-[#12372A] px-2 py-0.5 rounded">
                    SAPP 28
                  </span>
                  <span className="text-[11px] font-mono bg-[#EAF3EE] text-[#12372A] px-2 py-0.5 rounded">
                    STPP
                  </span>
                  <span className="text-[11px] font-mono bg-[#EAF3EE] text-[#12372A] px-2 py-0.5 rounded">
                    Monocalcium Phosphate
                  </span>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-[#D8E2DC]">
                <Link
                  href="/products?category=Leavening+%26+Buffering+Agents"
                  className="text-xs font-bold text-[#12372A] hover:text-[#1F7A5A] flex items-center justify-between"
                >
                  <span>Explore Category</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: DYNAMIC FEATURED PRODUCTS SHOWCASE WITH REAL-TIME TABS & QUICK VIEW
      ========================================================================= */}
      <section className="py-16 bg-white border-b border-[#D8E2DC]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#1F7A5A]">
                CATALOGUE HIGHLIGHTS
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#17211D] tracking-tight mt-1">
                Featured Chemical Monographs &amp; Active SKUs
              </h2>
              <p className="text-xs sm:text-sm text-[#52615A] mt-1 max-w-xl">
                Direct factory supply with complete Certificates of Analysis, FCC 13 compliance, and validated pharmacopeial assays.
              </p>
            </div>
            <Link
              href="/products"
              className="text-xs font-bold text-[#12372A] hover:text-[#1F7A5A] flex items-center gap-1.5 group"
            >
              <span>Full Product Database</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Interactive Filter Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 pb-4 border-b border-[#D8E2DC]">
            {/* Category Segmented Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
              {['All', 'Acidulants', 'Preservatives', 'Hydrocolloids & Stabilizers', 'Antioxidants'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCatalogCategory(cat)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-md whitespace-nowrap transition-colors ${
                    activeCatalogCategory === cat
                      ? 'bg-[#12372A] text-white shadow-xs'
                      : 'bg-[#F8FAF7] text-[#52615A] hover:bg-[#EAF3EE] hover:text-[#12372A]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Quick Filter Search */}
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filter by name, CAS, code..."
                value={catalogSearch}
                onChange={(e) => setCatalogSearch(e.target.value)}
                className="w-full text-xs pl-8 pr-3 py-1.5 rounded-md border border-[#D8E2DC] bg-[#F8FAF7] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1F7A5A]"
              />
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCatalogProducts.slice(0, 6).map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl border border-[#D8E2DC] p-5 flex flex-col justify-between hover:border-[#1F7A5A] hover:shadow-md transition-all group overflow-hidden"
              >
                <div>
                  {/* Product Card Image Banner */}
                  <div className="relative h-44 -mx-5 -mt-5 mb-4 overflow-hidden bg-slate-100 border-b border-[#D8E2DC] group-hover:opacity-95 transition-opacity">
                    <img
                      src={product.imageUrl || '/images/citric-acid.jpg'}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute top-3 left-3">
                      <span className="font-mono text-xs font-bold text-forest bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded shadow-xs border border-[#cfe0d5]">
                        {product.code}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3">
                      <span className="text-[10px] font-mono font-bold bg-[#12372A]/90 text-white px-2 py-0.5 rounded shadow-xs">
                        {product.stockStatus}
                      </span>
                    </div>
                    <div className="absolute bottom-2 left-3 right-3 text-[11px] text-white/90 font-mono truncate">
                      {product.grade}
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-[#17211D] group-hover:text-[#1F7A5A] transition-colors">
                    {product.name}
                  </h3>

                  <p className="text-xs text-[#52615A] mt-1.5 line-clamp-2 leading-relaxed">
                    {product.shortDescription}
                  </p>

                  {/* Chemical Specs Grid */}
                  <div className="mt-4 pt-3 border-t border-[#D8E2DC] grid grid-cols-2 gap-2 text-[11px] font-mono">
                    <div>
                      <span className="text-[#889790] block text-[10px]">CAS / INS</span>
                      <span className="font-semibold text-[#17211D]">{product.casNumber}</span>
                    </div>
                    <div>
                      <span className="text-[#889790] block text-[10px]">PURITY ASSAY</span>
                      <span className="font-semibold text-emerald-700">{product.purity}</span>
                    </div>
                    <div>
                      <span className="text-[#889790] block text-[10px]">GRADE</span>
                      <span className="font-semibold text-[#17211D] truncate block">{product.grade}</span>
                    </div>
                    <div>
                      <span className="text-[#889790] block text-[10px]">MIN MOQ</span>
                      <span className="font-semibold text-[#17211D]">{product.minOrderQuantity}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-5 pt-3 border-t border-[#D8E2DC] flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setQuickViewProduct(product)}
                    className="text-xs font-semibold text-[#52615A] hover:text-[#12372A] flex items-center gap-1 focus-visible:outline-none"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Quick Spec</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/products/${product.id}`}
                      className="text-xs font-semibold text-[#12372A] hover:underline"
                    >
                      Monograph
                    </Link>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => openQuoteForProduct(product.id)}
                      className="text-xs bg-[#12372A] hover:bg-[#1F7A5A] px-3 py-1.5 h-8 font-semibold"
                    >
                      Get Quote
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link href="/products">
              <Button variant="outline" size="md" className="border-[#D8E2DC] text-[#12372A] hover:bg-[#F8FAF7]">
                <span>Browse Full Product Catalogue ({PRODUCTS_DATA.length} Formulations)</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: CHEMICAL IDENTITY & SPECIFICATION LOOKUP TOOL
      ========================================================================= */}
      <section className="py-14 bg-[#112921] text-white border-b border-[#1b3d32]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-mono text-emerald-300 bg-[#194033] px-3 py-1 rounded-full border border-[#235343]">
                <FlaskConical className="w-3.5 h-3.5" />
                <span>TECHNICAL MONOGRAPH LOOKUP</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                Inspect Raw Chemical Identity &amp; Analytical Tolerances
              </h2>
              <p className="text-xs sm:text-sm text-[#a4c5b5] leading-relaxed">
                Query our chemical formulation database by CAS number, INS E-code, or common trade name to inspect molecular weight, assay limits, and storage criteria.
              </p>

              {/* Search Form */}
              <form onSubmit={handleLookup} className="flex gap-2 pt-2">
                <input
                  type="text"
                  placeholder="e.g. 77-92-9, Citric, INS 202..."
                  value={lookupQuery}
                  onChange={(e) => setLookupQuery(e.target.value)}
                  className="flex-1 bg-black/40 border border-white/20 rounded-md px-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-400 font-mono"
                />
                <Button 
                  type="submit" 
                  variant="primary" 
                  size="sm"
                  className="bg-[#1F7A5A] hover:bg-emerald-600 px-4 text-xs font-semibold"
                >
                  Query Spec
                </Button>
              </form>
            </div>

            {/* Live Spec Card */}
            <div className="lg:col-span-7">
              {matchedChemical && (
                <div className="bg-white/5 border border-white/15 rounded-xl p-6 backdrop-blur-md space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/10">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-300 bg-white/10 px-2 py-0.5 rounded">
                        {matchedChemical.code}
                      </span>
                      <h3 className="text-lg font-bold text-white mt-1">
                        {matchedChemical.name}
                      </h3>
                    </div>
                    <Link href={`/products/${matchedChemical.id}`}>
                      <Button variant="outline" size="sm" className="text-xs border-white/30 text-white hover:bg-white/10 h-8">
                        <span>Full Monograph</span>
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </Button>
                    </Link>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
                    <div className="bg-black/30 p-3 rounded-lg border border-white/5">
                      <span className="text-[#88aa9a] text-[10px] block">EMPIRICAL FORMULA</span>
                      <span className="font-bold text-white text-sm">{matchedChemical.chemicalFormula}</span>
                    </div>
                    <div className="bg-black/30 p-3 rounded-lg border border-white/5">
                      <span className="text-[#88aa9a] text-[10px] block">MOLECULAR WT</span>
                      <span className="font-bold text-white text-sm">{matchedChemical.molecularWeight}</span>
                    </div>
                    <div className="bg-black/30 p-3 rounded-lg border border-white/5">
                      <span className="text-[#88aa9a] text-[10px] block">ASSAY PURITY</span>
                      <span className="font-bold text-emerald-300 text-sm">{matchedChemical.purity}</span>
                    </div>
                    <div className="bg-black/30 p-3 rounded-lg border border-white/5">
                      <span className="text-[#88aa9a] text-[10px] block">CAS IDENTIFIER</span>
                      <span className="font-bold text-white text-sm">{matchedChemical.casNumber}</span>
                    </div>
                  </div>

                  <div className="text-xs text-[#a4c5b5] pt-2 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 font-mono">
                    <span>Appearance: {matchedChemical.appearance}</span>
                    <span className="text-emerald-300">MoQ: {matchedChemical.minOrderQuantity}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: INDUSTRY APPLICATIONS & SOLUTIONS MATRIX
      ========================================================================= */}
      <section className="py-16 bg-[#F8FAF7] border-b border-[#D8E2DC]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#1F7A5A]">
                TARGET MANUFACTURING APPLICATIONS
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#17211D] tracking-tight mt-1">
                Engineered Solutions for Commercial Food Processing
              </h2>
              <p className="text-xs sm:text-sm text-[#52615A] mt-1 max-w-xl">
                Functional chemical systems targeted for precise viscosity curves, microbiological stability, and organoleptic balance.
              </p>
            </div>
            <Link
              href="/solutions"
              className="text-xs font-bold text-[#12372A] hover:text-[#1F7A5A] flex items-center gap-1.5 group"
            >
              <span>Explore All 5 Sectors</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SOLUTIONS_DATA.slice(0, 3).map((solution) => (
              <div
                key={solution.id}
                className="bg-white rounded-xl border border-[#D8E2DC] overflow-hidden flex flex-col justify-between hover:border-[#1F7A5A] hover:shadow-md transition-all group"
              >
                <div>
                  {/* Solution Card Photo Banner */}
                  <div className="relative h-44 w-full bg-slate-100 overflow-hidden border-b border-[#D8E2DC]">
                    <img
                      src={solution.imageUrl || '/images/lab-testing.jpg'}
                      alt={solution.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent pointer-events-none" />
                    <div className="absolute top-3 left-3">
                      <span className="text-[10px] font-mono font-bold text-emerald-300 bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded border border-white/20 uppercase tracking-wider">
                        {solution.categoryTag}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-lg font-bold text-[#17211D]">
                      {solution.title}
                    </h3>
                    <p className="text-xs text-[#52615A] font-semibold mt-1">
                      {solution.subtitle}
                    </p>
                    <p className="text-xs text-[#52615A] mt-2.5 leading-relaxed">
                      {solution.description}
                    </p>

                    <div className="mt-4 pt-3 border-t border-[#D8E2DC] space-y-2">
                      <span className="text-[11px] font-mono font-bold text-[#17211D] uppercase tracking-wider block">
                        Target Functional Benefits:
                      </span>
                      <ul className="space-y-1">
                        {solution.functionalBenefits.slice(0, 3).map((benefit, i) => (
                          <li key={i} className="text-xs text-[#52615A] flex items-start gap-1.5">
                            <Check className="w-3.5 h-3.5 text-[#1F7A5A] shrink-0 mt-0.5" />
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0 mt-auto">
                  <div className="pt-3 border-t border-[#D8E2DC] flex items-center justify-between">
                    <Link
                      href={`/solutions#${solution.id}`}
                      className="text-xs font-bold text-[#12372A] hover:text-[#1F7A5A] flex items-center gap-1"
                    >
                      <span>View Formulations</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                      <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openQuoteForProduct()}
                      className="text-xs px-4 py-2"
                    >
                      Inquire System
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 7: B2B STANDING OFFERS & VOLUME DISCOUNT CAMPAIGNS
      ========================================================================= */}
      <section className="py-16 bg-white border-b border-[#D8E2DC]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#1F7A5A]">
                COMMERCIAL INCENTIVES
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#17211D] tracking-tight mt-1">
                Active B2B Contract Offers &amp; Volume Programs
              </h2>
              <p className="text-xs sm:text-sm text-[#52615A] mt-1 max-w-xl">
                Standing purchase contracts, annual pricing agreements, and pilot production sampling incentives.
              </p>
            </div>
            <Link
              href="/offers"
              className="text-xs font-bold text-[#12372A] hover:text-[#1F7A5A] flex items-center gap-1.5 group"
            >
              <span>All Commercial Tiers</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {OFFERS_DATA.map((offer) => (
              <div
                key={offer.id}
                className="bg-[#F8FAF7] rounded-xl border border-[#D8E2DC] p-6 flex flex-col justify-between hover:border-[#1F7A5A] hover:shadow-md transition-all relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 bg-[#12372A] text-white text-[10px] font-mono font-bold px-3 py-1 rounded-bl-lg">
                  {offer.badge}
                </div>

                <div>
                  <span className="text-xs font-mono font-bold text-[#1F7A5A] uppercase tracking-wider block mb-1">
                    {offer.volumeTier}
                  </span>
                  <h3 className="text-lg font-bold text-[#17211D] pr-12">
                    {offer.title}
                  </h3>
                  <p className="text-xs text-[#52615A] mt-2 leading-relaxed">
                    {offer.description}
                  </p>

                  <div className="mt-4 pt-3 border-t border-[#D8E2DC] space-y-1.5">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#17211D] font-bold block">
                      Program Inclusions:
                    </span>
                    {offer.terms.map((t, idx) => (
                      <div key={idx} className="text-xs text-[#52615A] flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-[#1F7A5A] shrink-0" />
                        <span>{t}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-3 border-t border-[#D8E2DC] flex items-center justify-between">
                  <div className="text-[11px] font-mono text-[#52615A]">
                    <span>Code: </span>
                    <strong className="text-[#12372A]">{offer.inquiryCode}</strong>
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => openQuoteForProduct()}
                    className="bg-[#12372A] hover:bg-[#1F7A5A] text-xs h-8 px-3 font-semibold"
                  >
                    Lock Program
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 8: QUALITY ASSURANCE & LABORATORY TESTING RIGOR
      ========================================================================= */}
      <section className="py-16 bg-[#F8FAF7] border-b border-[#D8E2DC]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-4">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#1F7A5A]">
                QUALITY CONTROL &amp; PHARMACOPEIA RIGOR
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#17211D] tracking-tight">
                Analytical Verification Before Any Lot Leaves Our Facility
              </h2>
              <p className="text-xs sm:text-sm text-[#52615A] leading-relaxed">
                PureBlend implements a three-tier quality release protocol. Every incoming batch is analyzed for chemical identity, active potency, moisture content, trace heavy metals via ICP-MS, and microbiological limits.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3 bg-white p-3.5 rounded-lg border border-[#D8E2DC]">
                  <div className="w-8 h-8 rounded bg-[#EAF3EE] text-[#1F7A5A] flex items-center justify-center shrink-0 mt-0.5">
                    <FlaskConical className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-[#17211D]">HPLC &amp; Potentiometric Titration</h3>
                    <p className="text-[11px] text-[#52615A]">
                      High-precision active assay verification meeting Food Chemicals Codex XIII guidelines.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-white p-3.5 rounded-lg border border-[#D8E2DC]">
                  <div className="w-8 h-8 rounded bg-[#EAF3EE] text-[#1F7A5A] flex items-center justify-center shrink-0 mt-0.5">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-[#17211D]">ICP-MS Heavy Metal Profiling</h3>
                    <p className="text-[11px] text-[#52615A]">
                      Lead &lt; 0.5 ppm, Arsenic &lt; 1.0 ppm, Cadmium and Mercury below detectable limits.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-white p-3.5 rounded-lg border border-[#D8E2DC]">
                  <div className="w-8 h-8 rounded bg-[#EAF3EE] text-[#1F7A5A] flex items-center justify-center shrink-0 mt-0.5">
                    <FileCheck2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-[#17211D]">Digital GS1 Lot Traceability</h3>
                    <p className="text-[11px] text-[#52615A]">
                      Instant download of lot-specific Certificate of Analysis dossiers via our Client Portal.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Card: Sample COA Mock Dossier */}
            <div className="lg:col-span-6">
              <div className="bg-white rounded-xl border border-[#D8E2DC] p-6 shadow-sm space-y-4">
                {/* Visual Analytical Lab Banner */}
                <div className="relative h-44 rounded-lg overflow-hidden border border-[#D8E2DC] bg-slate-100">
                  <img
                    src="/images/lab-testing.jpg"
                    alt="PureBlend Quality Control Analytical Testing Laboratory"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent pointer-events-none" />
                  <div className="absolute bottom-3 left-3 text-white">
                    <span className="text-[10px] font-mono text-emerald-300 font-bold uppercase tracking-wider block">
                      ON-SITE LABORATORY AUDIT
                    </span>
                    <span className="text-xs font-semibold">
                      Agilent HPLC &amp; PerkinElmer ICP-MS Spectrometry Skids
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pb-3 border-b border-[#D8E2DC]">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-[#1F7A5A] font-bold">
                      VERIFIED CERTIFICATE OF ANALYSIS
                    </span>
                    <h3 className="text-sm font-bold text-[#17211D]">
                      Lot PB-2609-082 • Citric Acid Anhydrous
                    </h3>
                  </div>
                  <span className="text-[11px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                    PASSED / RELEASED
                  </span>
                </div>

                {/* Table of parameters */}
                <div className="text-xs font-mono space-y-2">
                  <div className="grid grid-cols-3 text-[10px] text-[#7A8781] pb-1 border-b border-[#D8E2DC]">
                    <span>TEST PARAMETER</span>
                    <span>SPECIFICATION</span>
                    <span className="text-right">ACTUAL ASSAY</span>
                  </div>
                  <div className="grid grid-cols-3 py-1 border-b border-slate-100">
                    <span className="font-semibold text-[#17211D]">Appearance</span>
                    <span className="text-[#52615A]">White Crystals</span>
                    <span className="text-right text-emerald-700">Conforms</span>
                  </div>
                  <div className="grid grid-cols-3 py-1 border-b border-slate-100">
                    <span className="font-semibold text-[#17211D]">Purity (Dry Basis)</span>
                    <span className="text-[#52615A]">99.5 – 100.0%</span>
                    <span className="text-right font-bold text-emerald-700">99.96%</span>
                  </div>
                  <div className="grid grid-cols-3 py-1 border-b border-slate-100">
                    <span className="font-semibold text-[#17211D]">Moisture (Loss on Dry)</span>
                    <span className="text-[#52615A]">≤ 0.5%</span>
                    <span className="text-right text-emerald-700">0.18%</span>
                  </div>
                  <div className="grid grid-cols-3 py-1 border-b border-slate-100">
                    <span className="font-semibold text-[#17211D]">Heavy Metals (as Pb)</span>
                    <span className="text-[#52615A]">≤ 5 mg/kg</span>
                    <span className="text-right text-emerald-700">&lt; 1 mg/kg</span>
                  </div>
                  <div className="grid grid-cols-3 py-1">
                    <span className="font-semibold text-[#17211D]">Arsenic (As)</span>
                    <span className="text-[#52615A]">≤ 1 mg/kg</span>
                    <span className="text-right text-emerald-700">&lt; 0.2 mg/kg</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#D8E2DC] flex items-center justify-between text-xs">
                  <span className="text-[#52615A] font-mono text-[11px]">Authorized by: QA Release Directorate</span>
                  <Link href="/about">
                    <Button variant="outline" size="sm" className="text-xs h-8">
                      Quality Charter
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 9: CLIENT TESTIMONIALS & MANUFACTURING CASE STUDIES
      ========================================================================= */}
      <section className="py-16 bg-white border-b border-[#D8E2DC]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#1F7A5A]">
              PROVEN INDUSTRIAL PARTNERSHIPS
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#17211D] tracking-tight mt-1">
              Trusted by Commercial Food &amp; Beverage Manufacturers
            </h2>
            <p className="text-xs sm:text-sm text-[#52615A] mt-2">
              Over 280 regional and national processing plants depend on PureBlend for on-spec ingredient consistency and cold-chain supply security.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#F8FAF7] rounded-xl border border-[#D8E2DC] p-6 space-y-4">
              <div className="flex items-center gap-1 text-[#C9A227]">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-sm">★</span>
                ))}
              </div>
              <p className="text-xs text-[#17211D] leading-relaxed italic">
                &ldquo;PureBlend solved our severe beverage clarity fallout issue. Their high-solubility Citric Acid Anhydrous lot clearance has held at 100% across two years of monthly tanker orders.&rdquo;
              </p>
              <div className="pt-3 border-t border-[#D8E2DC] flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#12372A] text-white flex items-center justify-center font-bold text-xs">
                  TB
                </div>
                <div>
                  <h3 className="text-xs font-bold text-[#17211D]">Tyler Bennett</h3>
                  <span className="text-[10px] text-[#52615A] block">VP Procurement • Pacific Beverage Group</span>
                </div>
              </div>
            </div>

            <div className="bg-[#F8FAF7] rounded-xl border border-[#D8E2DC] p-6 space-y-4">
              <div className="flex items-center gap-1 text-[#C9A227]">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-sm">★</span>
                ))}
              </div>
              <p className="text-xs text-[#17211D] leading-relaxed italic">
                &ldquo;The low-dust Potassium Sorbate granules cut our dry blending cycle time by 18 minutes per run. Their regulatory dossier made our SQF Level 3 recertification seamless.&rdquo;
              </p>
              <div className="pt-3 border-t border-[#D8E2DC] flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#1F7A5A] text-white flex items-center justify-center font-bold text-xs">
                  ER
                </div>
                <div>
                  <h3 className="text-xs font-bold text-[#17211D]">Elena Rostova</h3>
                  <span className="text-[10px] text-[#52615A] block">Quality Director • Artisan Baked Foods</span>
                </div>
              </div>
            </div>

            <div className="bg-[#F8FAF7] rounded-xl border border-[#D8E2DC] p-6 space-y-4">
              <div className="flex items-center gap-1 text-[#C9A227]">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-sm">★</span>
                ))}
              </div>
              <p className="text-xs text-[#17211D] leading-relaxed italic">
                &ldquo;During the global supply pinch, PureBlend delivered on their standing buffer contract without missing a single delivery deadline. Exceptional supply chain commitment.&rdquo;
              </p>
              <div className="pt-3 border-t border-[#D8E2DC] flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#245848] text-white flex items-center justify-center font-bold text-xs">
                  DM
                </div>
                <div>
                  <h3 className="text-xs font-bold text-[#17211D]">David Miller</h3>
                  <span className="text-[10px] text-[#52615A] block">Operations Head • Dairy Crest Ingredients</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 10: FREQUENTLY ASKED QUESTIONS PREVIEW
      ========================================================================= */}
      <section className="py-16 bg-[#F8FAF7] border-b border-[#D8E2DC]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#1F7A5A]">
              KNOWLEDGE BASE &amp; SOURCING
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#17211D] tracking-tight mt-1">
              Frequently Asked Sourcing Questions
            </h2>
            <p className="text-xs sm:text-sm text-[#52615A] mt-2">
              Common inquiries regarding minimum order quantities, audit dossiers, lead times, and pallet logistics.
            </p>
          </div>

          <div className="space-y-3">
            {FAQS_DATA.slice(0, 5).map((faq) => {
              const isOpen = openFaqId === faq.id;
              return (
                <div
                  key={faq.id}
                  className="bg-white rounded-lg border border-[#D8E2DC] overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full text-left p-4.5 flex items-center justify-between gap-4 font-semibold text-xs sm:text-sm text-[#17211D] hover:bg-[#F8FAF7] transition-colors"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#52615A] transition-transform duration-200 shrink-0 ${
                        isOpen ? 'rotate-180 text-[#1F7A5A]' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4.5 pb-4.5 pt-1 text-xs text-[#52615A] leading-relaxed border-t border-slate-100">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-8 text-center">
            <Link href="/faqs">
              <Button variant="outline" size="sm" className="border-[#D8E2DC] text-[#12372A] hover:bg-white text-xs">
                <span>View All Procurement FAQs</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 11: ON-PAGE INTERACTIVE RFQ & SAMPLE REQUEST CONSOLE
      ========================================================================= */}
      <section className="py-16 bg-white border-b border-[#D8E2DC]" id="rfq-console">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left Info Column */}
            <div className="lg:col-span-5 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-wider text-[#1F7A5A] bg-[#EAF3EE] px-3 py-1 rounded-full border border-[#cce0d5]">
                <Package className="w-3.5 h-3.5" />
                <span>RAPID B2B QUOTATION ENGINE</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#17211D] tracking-tight">
                Request Custom Quotation or Laboratory Sample Kit
              </h2>
              <p className="text-xs sm:text-sm text-[#52615A] leading-relaxed">
                Submit target specifications, volume parameters, and delivery destinations. Our commercial pricing desk issues authentic quotes complete with COA documentation within 1 business day.
              </p>

              <div className="pt-4 border-t border-[#D8E2DC] space-y-3 text-xs font-mono text-[#52615A]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#16845B]" />
                  <span>Complimentary 500g R&amp;D Pilot Samples</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#16845B]" />
                  <span>Guaranteed 24-Hour Commercial Response</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#16845B]" />
                  <span>Direct Technical Formulation Support</span>
                </div>
              </div>

              <div className="p-4 bg-[#F8FAF7] rounded-xl border border-[#D8E2DC] space-y-2 mt-4">
                <span className="text-[11px] font-bold text-[#17211D] uppercase tracking-wider block">
                  Need Immediate Emergency Supply?
                </span>
                <p className="text-xs text-[#52615A]">
                  Call our technical procurement desk at <strong className="text-[#12372A]">+1 (800) 555-PBCHEM</strong> or email <strong className="text-[#12372A]">orders@pureblendchemicals.com</strong>.
                </p>
              </div>
            </div>

            {/* Right RFQ Form */}
            <div className="lg:col-span-7">
              <div className="bg-[#F8FAF7] rounded-2xl border border-[#D8E2DC] p-6 sm:p-8 shadow-xs">
                {inlineSubmitted ? (
                  <div className="text-center py-8 space-y-4">
                    <div className="w-12 h-12 bg-emerald-100 text-[#1F7A5A] rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-[#17211D]">
                      Quotation Request Successfully Logged
                    </h3>
                    <p className="text-xs text-[#52615A] max-w-md mx-auto">
                      Thank you, {inlineRfq.contact}. Our commercial team will review your parameters for {inlineRfq.volume} {inlineRfq.unit} and dispatch a formal quotation dossier within 24 hours.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setInlineSubmitted(false)}
                      className="text-xs mt-2"
                    >
                      Submit Another Inquiry
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleInlineRfqSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-[#17211D] block mb-1">
                          Company Name *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Acme Beverage Corp"
                          value={inlineRfq.company}
                          onChange={(e) => setInlineRfq({ ...inlineRfq, company: e.target.value })}
                          className="w-full text-xs px-3 py-2 rounded-md border border-[#D8E2DC] bg-white focus:outline-none focus:ring-1 focus:ring-[#1F7A5A]"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-[#17211D] block mb-1">
                          Contact Person *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Jane Doe"
                          value={inlineRfq.contact}
                          onChange={(e) => setInlineRfq({ ...inlineRfq, contact: e.target.value })}
                          className="w-full text-xs px-3 py-2 rounded-md border border-[#D8E2DC] bg-white focus:outline-none focus:ring-1 focus:ring-[#1F7A5A]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-[#17211D] block mb-1">
                          Corporate Email *
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="procurement@acme.com"
                          value={inlineRfq.email}
                          onChange={(e) => setInlineRfq({ ...inlineRfq, email: e.target.value })}
                          className="w-full text-xs px-3 py-2 rounded-md border border-[#D8E2DC] bg-white focus:outline-none focus:ring-1 focus:ring-[#1F7A5A]"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-[#17211D] block mb-1">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          placeholder="+1 (555) 000-0000"
                          value={inlineRfq.phone}
                          onChange={(e) => setInlineRfq({ ...inlineRfq, phone: e.target.value })}
                          className="w-full text-xs px-3 py-2 rounded-md border border-[#D8E2DC] bg-white focus:outline-none focus:ring-1 focus:ring-[#1F7A5A]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="sm:col-span-2">
                        <label className="text-xs font-semibold text-[#17211D] block mb-1">
                          Selected Chemical / Ingredient *
                        </label>
                        <select
                          value={inlineRfq.productId}
                          onChange={(e) => setInlineRfq({ ...inlineRfq, productId: e.target.value })}
                          className="w-full text-xs px-3 py-2 rounded-md border border-[#D8E2DC] bg-white focus:outline-none focus:ring-1 focus:ring-[#1F7A5A]"
                        >
                          {PRODUCTS_DATA.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name} ({p.code})
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-[#17211D] block mb-1">
                          Volume Required
                        </label>
                        <div className="flex gap-1.5">
                          <input
                            type="number"
                            min="1"
                            value={inlineRfq.volume}
                            onChange={(e) => setInlineRfq({ ...inlineRfq, volume: e.target.value })}
                            className="w-20 text-xs px-2.5 py-2 rounded-md border border-[#D8E2DC] bg-white focus:outline-none focus:ring-1 focus:ring-[#1F7A5A]"
                          />
                          <select
                            value={inlineRfq.unit}
                            onChange={(e) => setInlineRfq({ ...inlineRfq, unit: e.target.value })}
                            className="flex-1 text-xs px-2 py-2 rounded-md border border-[#D8E2DC] bg-white focus:outline-none focus:ring-1 focus:ring-[#1F7A5A]"
                          >
                            <option value="Metric Tons (MT)">MT</option>
                            <option value="Pallets">Pallets</option>
                            <option value="kg">kg</option>
                            <option value="FCL (20ft Container)">FCL</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-[#17211D] block mb-1">
                        Application Details or Target Specs (Optional)
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Specify target mesh size, delivery timeline, or sample kit requests..."
                        value={inlineRfq.notes}
                        onChange={(e) => setInlineRfq({ ...inlineRfq, notes: e.target.value })}
                        className="w-full text-xs px-3 py-2 rounded-md border border-[#D8E2DC] bg-white focus:outline-none focus:ring-1 focus:ring-[#1F7A5A]"
                      />
                    </div>

                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      disabled={inlineSubmitting}
                      className="w-full bg-[#12372A] hover:bg-[#1F7A5A] text-white font-semibold text-xs py-3 h-11"
                    >
                      {inlineSubmitting ? 'Transmitting RFQ Dossier...' : 'Submit Official RFQ & Sample Request'}
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 12: BOTTOM HERO CTA
      ========================================================================= */}
      <section className="py-20 bg-[#0D211A] text-white">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-emerald-300 bg-[#16382D] px-3 py-1 rounded-full border border-[#235343]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>PARTNER WITH PUREBLEND</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight max-w-3xl mx-auto">
            Let&apos;s Find the Right Solution for Your Application.
          </h2>

          <p className="text-sm sm:text-base text-[#9ebcb0] max-w-2xl mx-auto leading-relaxed">
            Request sample lots, acquire batch-specific Certificates of Analysis, or consult directly with our food science team for custom dry blends and bulk contract pricing.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Button
              variant="primary"
              size="lg"
              onClick={() => openQuoteForProduct()}
              className="bg-[#1F7A5A] hover:bg-emerald-600 text-white font-semibold px-6 h-12 shadow-md"
            >
              Request a Quote &amp; Samples
            </Button>
            <Link href="/products">
              <Button
                variant="outline"
                size="lg"
                className="bg-white/20 hover:bg-white/30 border-white/30 text-white font-bold px-6 h-12 shadow-sm"
              >
                Explore Catalogue
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Spec Modal */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-xl border border-[#D8E2DC] max-w-xl w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono text-[#1F7A5A] bg-[#EAF3EE] px-2 py-0.5 rounded font-bold">
                  {quickViewProduct.code}
                </span>
                <h3 className="text-lg font-bold text-[#17211D] mt-1">
                  {quickViewProduct.name}
                </h3>
                <span className="text-xs text-[#52615A]">{quickViewProduct.grade}</span>
              </div>
              <button
                type="button"
                onClick={() => setQuickViewProduct(null)}
                className="p-1 rounded text-slate-400 hover:text-slate-600"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#52615A] leading-relaxed">
              {quickViewProduct.description}
            </p>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono bg-[#F8FAF7] p-3.5 rounded-lg border border-[#D8E2DC]">
              <div>
                <span className="text-[#889790] text-[10px] block">CAS NUMBER</span>
                <span className="font-semibold text-[#17211D]">{quickViewProduct.casNumber}</span>
              </div>
              <div>
                <span className="text-[#889790] text-[10px] block">INS NUMBER</span>
                <span className="font-semibold text-[#17211D]">{quickViewProduct.insNumber}</span>
              </div>
              <div>
                <span className="text-[#889790] text-[10px] block">PURITY</span>
                <span className="font-semibold text-emerald-700">{quickViewProduct.purity}</span>
              </div>
              <div>
                <span className="text-[#889790] text-[10px] block">FORMULA</span>
                <span className="font-semibold text-[#17211D]">{quickViewProduct.chemicalFormula}</span>
              </div>
              <div>
                <span className="text-[#889790] text-[10px] block">MOLECULAR WT</span>
                <span className="font-semibold text-[#17211D]">{quickViewProduct.molecularWeight}</span>
              </div>
              <div>
                <span className="text-[#889790] text-[10px] block">SHELF LIFE</span>
                <span className="font-semibold text-[#17211D]">{quickViewProduct.shelfLife}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQuickViewProduct(null)}
                className="text-xs"
              >
                Close
              </Button>
              <Link href={`/products/${quickViewProduct.id}`}>
                <Button variant="primary" size="sm" className="text-xs bg-[#12372A]">
                  Full Datasheet
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Global RFQ Quick Modal */}
      <RFQModal
        isOpen={isRfqOpen}
        onClose={() => setIsRfqOpen(false)}
        initialProductId={selectedProductRfq}
      />
    </PublicLayout>
  );
}
