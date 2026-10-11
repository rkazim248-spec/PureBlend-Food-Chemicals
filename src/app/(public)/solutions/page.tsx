'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Button } from '@/components/ui/Button';
import { RFQModal } from '@/components/forms/RFQModal';
import { SOLUTIONS_DATA, PRODUCTS_DATA } from '@/data/mockData';
import { 
  ArrowRight, 
  FlaskConical, 
  CheckCircle2, 
  Layers, 
  Sparkles, 
  ShieldCheck, 
  FileText 
} from 'lucide-react';

export default function SolutionsPage() {
  const [isRfqOpen, setIsRfqOpen] = useState(false);

  return (
    <PublicLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs items={[{ label: 'Application Solutions' }]} />

        {/* Page Header */}
        <div className="my-6 max-w-3xl">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-primary-green">
            Application Systems & Formulations
          </span>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-charcoal tracking-tight mt-1">
            Food Industry Ingredient Formulation Systems
          </h1>
          <p className="text-xs sm:text-sm text-secondary-text mt-2 leading-relaxed">
            In industrial food processing, individual ingredients must function synergistically. PureBlend engineers complementary acidulant, antimycotic, and hydrocolloid systems designed to solve specific processing challenges across commercial beverage, bakery, meat, and culinary emulsion operations.
          </p>
        </div>

        {/* Application System Cards */}
        <div className="space-y-12 my-10">
          {SOLUTIONS_DATA.map((solution, index) => (
            <article
              key={solution.id}
              id={solution.id}
              className="bg-white rounded-lg border border-border-subtle overflow-hidden shadow-xs scroll-mt-24"
            >
              {/* Solution Banner Image */}
              <div className="relative h-48 sm:h-64 w-full bg-slate-100 overflow-hidden">
                <img
                  src={solution.imageUrl || '/images/lab-testing.jpg'}
                  alt={solution.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                <div className="absolute bottom-4 left-6 right-6 text-white">
                  <div className="flex items-center gap-2 text-xs font-mono mb-1">
                    <span className="text-emerald-300 font-bold uppercase">{solution.categoryTag}</span>
                    <span className="text-white/40">·</span>
                    <span className="text-white/80">System {index + 1} of {SOLUTIONS_DATA.length}</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    {solution.title}
                  </h2>
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-6">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-border-subtle pb-4">
                  <div>
                    <p className="text-sm font-semibold text-forest">
                      {solution.subtitle}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsRfqOpen(true)}
                    className="shrink-0"
                  >
                    Request Technical Consultation
                  </Button>
                </div>

              {/* Overview Prose */}
              <p className="text-xs sm:text-sm text-secondary-text leading-relaxed">
                {solution.description}
              </p>

              {/* Functional Benefits Grid */}
              <div className="bg-warm-white p-5 rounded-lg border border-border-subtle">
                <h3 className="text-xs font-bold text-charcoal uppercase tracking-wider mb-3">
                  Key Processing & Quality Benefits
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-secondary-text">
                  {solution.functionalBenefits.map((benefit, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary-green shrink-0 mt-0.5" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Ingredients Table */}
              <div>
                <h3 className="text-xs font-bold text-charcoal uppercase tracking-wider mb-3">
                  Synergistic Ingredient Matrix
                </h3>
                <div className="overflow-x-auto rounded border border-border-subtle">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-warm-white border-b border-border-subtle font-semibold text-charcoal">
                      <tr>
                        <th className="py-2.5 px-4 w-1/3">Target Ingredient</th>
                        <th className="py-2.5 px-4">Functional Contribution in Recipe</th>
                        <th className="py-2.5 px-4 text-right">Datasheet</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-subtle">
                      {solution.recommendedIngredients.map((item) => (
                        <tr key={item.productId} className="hover:bg-warm-white/60">
                          <td className="py-3 px-4 font-bold text-charcoal">
                            {item.productName}
                          </td>
                          <td className="py-3 px-4 text-secondary-text">
                            {item.role}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <Link
                              href={`/products/${item.productId}`}
                              className="text-forest hover:text-forest-light font-semibold inline-flex items-center gap-1"
                            >
                              <span>Specs</span>
                              <ArrowRight className="w-3 h-3" />
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Processing Consideration Notice */}
              <div className="p-4 rounded bg-[#eff5f1] border border-[#d3e5d9] text-xs text-forest flex items-start gap-3">
                <ShieldCheck className="w-4 h-4 text-primary-green shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-charcoal font-semibold">Factory Blending & Handling Protocol:</strong>
                  <span className="mt-0.5 block leading-relaxed">{solution.processConsiderations}</span>
                </div>
              </div>
            </div>
            </article>
          ))}
        </div>

        {/* Bottom CTA Banner */}
        <div className="bg-[#15342a] text-white rounded-xl p-8 text-center space-y-4 my-10 border border-[#235343]">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            Require Custom Formulation Guidance or Acid-Buffer Calculations?
          </h2>
          <p className="text-xs sm:text-sm text-[#a6c7b7] max-w-xl mx-auto leading-relaxed">
            PureBlend technical application specialists work directly with food development scientists and plant managers to optimize batch yields and pH curves.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <Button
              variant="secondary"
              onClick={() => setIsRfqOpen(true)}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Request Application Consultation
            </Button>
            <Link href="/products">
              <Button variant="outline" className="bg-transparent text-white border-white/30 hover:bg-white/10">
                Browse Full Catalog
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <RFQModal isOpen={isRfqOpen} onClose={() => setIsRfqOpen(false)} />
    </PublicLayout>
  );
}
