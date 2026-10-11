'use client';

import React, { useState, useEffect } from 'react';
import { Globe, Save, Sparkles, CheckCircle2, ShieldCheck, Tag, FileText } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';

export default function AdminSeoPage() {
  const { showToast } = useToast();
  const [seoConfig, setSeoConfig] = useState(() => {
    try {
      const stored = typeof window !== 'undefined' ? localStorage.getItem('pureblend_seo_settings') : null;
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // fallback
    }
    return {
      metaTitle: 'PureBlend Food Chemicals | Industrial Food Ingredients & Chemicals',
      metaDescription: 'B2B food chemicals, acidulants, antimicrobial preservatives, hydrocolloids, and specialty ingredient solutions for industrial food and beverage manufacturing.',
      keywords: 'food chemicals, acidulants, preservatives, hydrocolloids, FCC grade ingredients, industrial food ingredients, Xanthan Gum, Citric Acid',
      ogTitle: 'PureBlend Food Chemicals | Industrial Food Ingredients & Chemicals',
      ogDescription: 'B2B food chemicals, acidulants, antimicrobial preservatives, hydrocolloids, and specialty ingredient solutions for industrial food and beverage manufacturing.',
      ogImage: '/images/hero-facility.jpg',
      robots: 'index, follow',
      canonicalUrl: 'https://pureblend-chemicals.com'
    };
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem('pureblend_seo_settings', JSON.stringify(seoConfig));
      showToast({
        title: 'SEO Settings Saved',
        description: 'Global search engine metadata and OpenGraph tags successfully updated.',
        type: 'success'
      });
    } catch {
      showToast({
        title: 'Save Failed',
        description: 'Unable to save SEO settings to local storage.',
        type: 'error'
      });
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-bold text-primary-green uppercase tracking-wider">
            SEARCH ENGINE OPTIMIZATION &amp; METADATA
          </span>
          <h1 className="text-2xl font-black text-charcoal tracking-tight mt-0.5">
            Global SEO &amp; OpenGraph Settings
          </h1>
          <p className="text-xs text-secondary-text mt-1">
            Configure search engine indexing, meta titles, descriptions, keywords, and social sharing cards for your storefront.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={handleSave}
            leftIcon={<Save className="w-4 h-4" />}
            className="bg-[#12372A] hover:bg-[#1F7A5A] text-xs font-semibold"
          >
            Save SEO Settings
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-border-subtle shadow-xs overflow-hidden">
        <div className="p-5 border-b border-border-subtle bg-warm-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-primary-green" />
            <h2 className="text-sm font-bold text-charcoal">Metadata &amp; Search Engine Indexing</h2>
          </div>
          <span className="text-[10px] font-mono bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded font-semibold">
            ACTIVE ON PUBLIC STOREFRONT
          </span>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-charcoal block mb-1">
                  Global Meta Title (&lt;title&gt;)
                </label>
                <input
                  type="text"
                  required
                  value={seoConfig.metaTitle}
                  onChange={(e) => setSeoConfig({ ...seoConfig, metaTitle: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded-md border border-[#D8E2DC] bg-[#F8FAF7] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1F7A5A]"
                />
                <p className="text-[11px] text-secondary-text mt-1">Recommended length: 50–60 characters.</p>
              </div>

              <div>
                <label className="text-xs font-semibold text-charcoal block mb-1">
                  Meta Description
                </label>
                <textarea
                  rows={3}
                  required
                  value={seoConfig.metaDescription}
                  onChange={(e) => setSeoConfig({ ...seoConfig, metaDescription: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded-md border border-[#D8E2DC] bg-[#F8FAF7] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1F7A5A]"
                />
                <p className="text-[11px] text-secondary-text mt-1">Recommended length: 150–160 characters for optimal SERP snippets.</p>
              </div>

              <div>
                <label className="text-xs font-semibold text-charcoal block mb-1">
                  Meta Keywords (Comma separated)
                </label>
                <input
                  type="text"
                  value={seoConfig.keywords}
                  onChange={(e) => setSeoConfig({ ...seoConfig, keywords: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded-md border border-[#D8E2DC] bg-[#F8FAF7] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1F7A5A]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-charcoal block mb-1">
                  Robots Directive
                </label>
                <select
                  value={seoConfig.robots}
                  onChange={(e) => setSeoConfig({ ...seoConfig, robots: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded-md border border-[#D8E2DC] bg-[#F8FAF7] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1F7A5A]"
                >
                  <option value="index, follow">index, follow (Recommended)</option>
                  <option value="noindex, nofollow">noindex, nofollow (Private/Staging)</option>
                  <option value="index, nofollow">index, nofollow</option>
                </select>
              </div>
            </div>

            <div className="space-y-4 bg-[#F8FAF7] p-5 rounded-lg border border-border-subtle">
              <h3 className="text-xs font-bold text-charcoal uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-primary-green" />
                <span>OpenGraph (Social Share Cards)</span>
              </h3>

              <div>
                <label className="text-xs font-semibold text-charcoal block mb-1">
                  OG Title
                </label>
                <input
                  type="text"
                  value={seoConfig.ogTitle}
                  onChange={(e) => setSeoConfig({ ...seoConfig, ogTitle: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded-md border border-[#D8E2DC] bg-white focus:outline-none focus:ring-1 focus:ring-[#1F7A5A]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-charcoal block mb-1">
                  OG Description
                </label>
                <textarea
                  rows={2}
                  value={seoConfig.ogDescription}
                  onChange={(e) => setSeoConfig({ ...seoConfig, ogDescription: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded-md border border-[#D8E2DC] bg-white focus:outline-none focus:ring-1 focus:ring-[#1F7A5A]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-charcoal block mb-1">
                  OG Image URL (Banner / Social Preview)
                </label>
                <input
                  type="text"
                  value={seoConfig.ogImage}
                  onChange={(e) => setSeoConfig({ ...seoConfig, ogImage: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded-md border border-[#D8E2DC] bg-white focus:outline-none focus:ring-1 focus:ring-[#1F7A5A]"
                />
                <p className="text-[11px] text-secondary-text mt-1">Recommended size: 1200x630px image URL.</p>
              </div>

              <div>
                <label className="text-xs font-semibold text-charcoal block mb-1">
                  Canonical URL
                </label>
                <input
                  type="text"
                  value={seoConfig.canonicalUrl}
                  onChange={(e) => setSeoConfig({ ...seoConfig, canonicalUrl: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded-md border border-[#D8E2DC] bg-white focus:outline-none focus:ring-1 focus:ring-[#1F7A5A]"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end pt-4 border-t border-border-subtle">
            <Button
              type="submit"
              variant="primary"
              size="sm"
              className="bg-[#12372A] hover:bg-[#1F7A5A] text-xs font-semibold"
            >
              Save &amp; Apply Changes Live
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
