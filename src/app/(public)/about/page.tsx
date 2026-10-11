'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Button } from '@/components/ui/Button';
import { RFQModal } from '@/components/forms/RFQModal';
import { 
  ShieldCheck, 
  FlaskConical, 
  CheckCircle2, 
  Truck, 
  Award, 
  FileCheck2,
  ArrowRight,
  Layers,
  Scale
} from 'lucide-react';

export default function AboutPage() {
  const [isRfqOpen, setIsRfqOpen] = useState(false);

  return (
    <PublicLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs items={[{ label: 'About PureBlend' }]} />

        {/* Page Hero */}
        <div className="my-8 max-w-3xl">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-primary-green">
            Corporate Profile & Standards
          </span>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-charcoal tracking-tight mt-1">
            PureBlend Food Chemicals: Precision Quality in Industrial Food Ingredients
          </h1>
          <p className="text-sm text-secondary-text mt-3 leading-relaxed">
            PureBlend Food Chemicals is a B2B supplier specializing in food-grade acidulants, antimicrobial preservatives, hydrocolloids, and functional phosphates. We partner with commercial food and beverage processing facilities to guarantee pharmacopeial purity, batch traceability, and supply chain continuity.
          </p>
        </div>

        {/* Core Operational Principles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-10">
          <div className="bg-white rounded-lg border border-border-subtle p-6 space-y-3">
            <div className="w-10 h-10 rounded bg-soft-green text-forest flex items-center justify-center">
              <FlaskConical className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-charcoal">Analytical Rigor</h2>
            <p className="text-xs text-secondary-text leading-relaxed">
              Every production lot undergoes rigorous multi-parameter analysis for active purity, heavy metals, microbial limits, and particle size distribution in compliance with the current Food Chemicals Codex (FCC).
            </p>
          </div>

          <div className="bg-white rounded-lg border border-border-subtle p-6 space-y-3">
            <div className="w-10 h-10 rounded bg-soft-green text-forest flex items-center justify-center">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-charcoal">Complete Lot Traceability</h2>
            <p className="text-xs text-secondary-text leading-relaxed">
              From raw fermentation stock through secondary packaging and freight delivery, our GS1-compliant lot tagging provides instant auditing capability and authentic Certificate of Analysis (COA) dossiers.
            </p>
          </div>

          <div className="bg-white rounded-lg border border-border-subtle p-6 space-y-3">
            <div className="w-10 h-10 rounded bg-soft-green text-forest flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-charcoal">Logistical Redundancy</h2>
            <p className="text-xs text-secondary-text leading-relaxed">
              Multi-warehouse inventory buffering ensures food processors maintain continuous production schedules without stock-outs, backed by direct pallet, truckload, and full containerload dispatch.
            </p>
          </div>
        </div>

        {/* Facility & Infrastructure Photo Tour */}
        <section className="my-12">
          <div className="mb-6">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-primary-green">
              Infrastructure & Operations
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-charcoal tracking-tight mt-1">
              Inside Our Certified Food Ingredient Facilities
            </h2>
            <p className="text-xs sm:text-sm text-secondary-text mt-1 max-w-2xl">
              Take a visual tour through our pharmaceutical-grade cleanroom bioreactors, analytical testing laboratories, and climate-controlled multi-hub warehousing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl border border-border-subtle overflow-hidden shadow-xs group">
              <div className="relative h-52 overflow-hidden bg-slate-100">
                <img
                  src="/images/hero-facility.jpg"
                  alt="Modern cleanroom chemical bioreactor facility"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent pointer-events-none" />
                <span className="absolute bottom-3 left-3 text-white text-xs font-mono font-bold">
                  Bioreactor Synthesis & Fermentation Plant
                </span>
              </div>
              <div className="p-4">
                <h3 className="text-sm font-bold text-charcoal">Automated Cleanroom Processing</h3>
                <p className="text-xs text-secondary-text mt-1 leading-relaxed">
                  Submerged fermentation tanks and filtration skid systems maintaining ISO Class 7 air purity and zero cross-contamination.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-border-subtle overflow-hidden shadow-xs group">
              <div className="relative h-52 overflow-hidden bg-slate-100">
                <img
                  src="/images/lab-testing.jpg"
                  alt="Food science analytical testing laboratory"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent pointer-events-none" />
                <span className="absolute bottom-3 left-3 text-white text-xs font-mono font-bold">
                  Analytical QC & Titration Laboratory
                </span>
              </div>
              <div className="p-4">
                <h3 className="text-sm font-bold text-charcoal">HPLC & ICP-MS Lot Release</h3>
                <p className="text-xs text-secondary-text mt-1 leading-relaxed">
                  On-site food scientists verify purity assays, heavy metal thresholds, and microbial clearance for every production batch.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-border-subtle overflow-hidden shadow-xs group">
              <div className="relative h-52 overflow-hidden bg-slate-100">
                <img
                  src="/images/warehouse-logistics.jpg"
                  alt="Climate-controlled B2B chemical warehouse"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent pointer-events-none" />
                <span className="absolute bottom-3 left-3 text-white text-xs font-mono font-bold">
                  Regional Climate-Controlled Hubs
                </span>
              </div>
              <div className="p-4">
                <h3 className="text-sm font-bold text-charcoal">Logistical Redundancy & Buffer Stocks</h3>
                <p className="text-xs text-secondary-text mt-1 leading-relaxed">
                  Humidity-monitored pallet racking holding 12,000+ Metric Tons of critical food ingredients for guaranteed 24hr dispatch.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Quality Management Dossier */}
        <section className="bg-white rounded-lg border border-border-subtle p-6 sm:p-8 my-10 space-y-6">
          <div className="border-b border-border-subtle pb-4">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-primary-green">
              Compliance Governance
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-charcoal tracking-tight mt-1">
              Quality Assurance & Compliance Framework
            </h2>
            <p className="text-xs sm:text-sm text-secondary-text mt-1">
              Our quality infrastructure adheres to internationally recognized regulatory frameworks for food additives and processing chemicals.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-4 rounded bg-warm-white border border-border-subtle">
              <span className="font-bold text-charcoal block text-sm">ISO 22000:2018</span>
              <p className="text-secondary-text mt-1">Comprehensive food safety management systems across handling, packaging, and logistics.</p>
            </div>
            <div className="p-4 rounded bg-warm-white border border-border-subtle">
              <span className="font-bold text-charcoal block text-sm">HACCP Principles</span>
              <p className="text-secondary-text mt-1">Systematic preventive approach to physical, chemical, and biological hazard controls.</p>
            </div>
            <div className="p-4 rounded bg-warm-white border border-border-subtle">
              <span className="font-bold text-charcoal block text-sm">FCC 12 / 13 Standard</span>
              <p className="text-secondary-text mt-1">Monograph criteria defining minimum active assays and maximum contaminant limits.</p>
            </div>
            <div className="p-4 rounded bg-warm-white border border-border-subtle">
              <span className="font-bold text-charcoal block text-sm">Halal & Kosher</span>
              <p className="text-secondary-text mt-1">Certified supply chains adhering to religious dietary requirements with valid documentation.</p>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <div className="bg-[#133227] text-white rounded-xl p-8 text-center space-y-4 my-10 border border-[#215140]">
          <h2 className="text-xl sm:text-2xl font-bold">
            Audit PureBlend as Your Food Chemical Supply Partner
          </h2>
          <p className="text-xs sm:text-sm text-[#a3c5b5] max-w-lg mx-auto leading-relaxed">
            Request our vendor qualification packet, including standard COA templates, HACCP flow diagrams, and insurance credentials.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Button
              variant="secondary"
              onClick={() => setIsRfqOpen(true)}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Request Vendor Packet & RFQ
            </Button>
            <Link href="/contact">
              <Button variant="outline" className="bg-transparent text-white border-white/30 hover:bg-white/10">
                Contact Technical Sales
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <RFQModal isOpen={isRfqOpen} onClose={() => setIsRfqOpen(false)} />
    </PublicLayout>
  );
}
