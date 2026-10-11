'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Accordion } from '@/components/ui/Accordion';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { RFQModal } from '@/components/forms/RFQModal';
import { FAQS_DATA } from '@/data/mockData';
import { Search, X, HelpCircle, ArrowRight, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function FAQsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isRfqOpen, setIsRfqOpen] = useState(false);

  const categories = [
    'all',
    'Product Specifications',
    'Ordering & MOQs',
    'Quality & Compliance',
    'Logistics & Packaging'
  ];

  const filteredFaqs = useMemo(() => {
    return FAQS_DATA.filter((faq) => {
      // Category filter
      if (selectedCategory !== 'all' && faq.category !== selectedCategory) {
        return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesQ = faq.question.toLowerCase().includes(query);
        const matchesA = faq.answer.toLowerCase().includes(query);
        if (!matchesQ && !matchesA) return false;
      }
      return true;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <PublicLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs items={[{ label: 'Frequently Asked Questions' }]} />

        {/* Page Header */}
        <div className="my-6">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-primary-green">
            Technical & Commercial Knowledge Base
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-charcoal tracking-tight mt-1">
            Frequently Asked Questions
          </h1>
          <p className="text-xs sm:text-sm text-secondary-text mt-1.5 leading-relaxed">
            Find immediate answers concerning Food Chemicals Codex compliance, minimum order quantities (MOQs), Certificates of Analysis (COA), packaging configurations, and shipping logistics.
          </p>
        </div>

        {/* Search & Category Filter */}
        <div className="bg-white rounded-lg border border-border-subtle p-4 sm:p-5 mb-8 shadow-xs space-y-4">
          <Input
            placeholder="Search FAQs by topic (e.g. COA, MOQ, Kosher, Incoterms, 25 kg bags)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
            rightIcon={
              searchQuery ? (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="pointer-events-auto p-1 hover:text-charcoal"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              ) : undefined
            }
          />

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-md whitespace-nowrap font-medium transition-colors ${
                    isActive
                      ? 'bg-forest text-white font-bold'
                      : 'bg-warm-white text-secondary-text hover:text-charcoal border border-border-subtle'
                  }`}
                >
                  {cat === 'all' ? 'All Topics' : cat}
                </button>
              );
            })}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {filteredFaqs.length > 0 ? (
            <motion.div
              key={`${selectedCategory}-${searchQuery}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="bg-white rounded-lg border border-border-subtle p-6 shadow-xs mb-10"
            >
              <Accordion
                items={filteredFaqs.map((faq) => ({
                  id: faq.id,
                  title: faq.question,
                  content: (
                    <div>
                      <p className="text-xs text-secondary-text leading-relaxed">{faq.answer}</p>
                      <div className="mt-2 text-[10px] font-mono text-primary-green">
                        Category: {faq.category}
                      </div>
                    </div>
                  )
                }))}
                defaultOpenId={filteredFaqs[0]?.id}
                allowMultiple
              />
            </motion.div>
          ) : (
            <motion.div
              key="empty-faq"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <EmptyState
                icon={<HelpCircle className="w-7 h-7 text-forest" />}
                title="No Matching FAQ Topics Found"
                description="We could not find answers matching your search criteria. You can clear your search or ask our technical sales team directly."
                action={
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                    }}
                  >
                    Clear Filters
                  </Button>
                }
                className="mb-10"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Support Callout */}
        <div className="bg-warm-white rounded-lg border border-border-subtle p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-charcoal">Have a Specific Technical or Regulatory Question?</h3>
            <p className="text-xs text-secondary-text mt-0.5">
              Our application laboratory engineers and compliance managers are available for formulation discussions.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link href="/contact">
              <Button variant="outline" size="sm">Contact Team</Button>
            </Link>
            <Button variant="primary" size="sm" onClick={() => setIsRfqOpen(true)}>
              Submit RFQ
            </Button>
          </div>
        </div>
      </div>

      <RFQModal isOpen={isRfqOpen} onClose={() => setIsRfqOpen(false)} />
    </PublicLayout>
  );
}
