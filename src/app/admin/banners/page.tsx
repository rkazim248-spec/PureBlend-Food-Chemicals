'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  SlidersHorizontal, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  ArrowUp, 
  ArrowDown, 
  Eye, 
  RotateCcw,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { compressAndResizeImage } from '@/lib/utils';
import { BANNER_SLIDES } from '@/data/mockData';
import { BannerSlide } from '@/types';

export default function AdminBannersPage() {
  const { showToast } = useToast();
  const [slides, setSlides] = useState<BannerSlide[]>(BANNER_SLIDES);
  const [editingSlide, setEditingSlide] = useState<BannerSlide | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load from localStorage if present
  useEffect(() => {
    const syncSlides = () => {
      try {
        const stored = localStorage.getItem('pureblend_banner_slides');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setSlides(parsed);
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

  const saveSlides = (newSlides: BannerSlide[]) => {
    setSlides(newSlides);
    if (typeof window !== 'undefined') {
      localStorage.setItem('pureblend_banner_slides', JSON.stringify(newSlides));
    }
  };

  const handleToggleActive = (id: string) => {
    const updated = slides.map((s) => (s.id === id ? { ...s, active: !s.active } : s));
    saveSlides(updated);
    showToast({
      title: 'Status Updated',
      description: 'Slide visibility updated on homepage.',
      type: 'success'
    });
  };

  const handleDelete = (id: string) => {
    if (slides.length <= 1) {
      showToast({
        title: 'Action Prevented',
        description: 'You must keep at least one slide active.',
        type: 'warning'
      });
      return;
    }
    const updated = slides.filter((s) => s.id !== id);
    saveSlides(updated);
    showToast({
      title: 'Slide Deleted',
      description: 'Banner slide removed from carousel.',
      type: 'info'
    });
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= slides.length) return;

    const copy = [...slides];
    const [moved] = copy.splice(index, 1);
    copy.splice(targetIndex, 0, moved);

    // Reassign order
    const updated = copy.map((s, idx) => ({ ...s, order: idx + 1 }));
    saveSlides(updated);
    showToast({
      title: 'Order Updated',
      description: 'Carousel slide sequence modified.',
      type: 'success'
    });
  };

  const handleResetDefaults = () => {
    saveSlides(BANNER_SLIDES);
    showToast({
      title: 'Restored Defaults',
      description: 'Reset to factory banner slides.',
      type: 'info'
    });
  };

  const handleSaveSlide = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSlide) return;

    if (slides.some((s) => s.id === editingSlide.id)) {
      // Edit existing
      const updated = slides.map((s) => (s.id === editingSlide.id ? editingSlide : s));
      saveSlides(updated);
      showToast({
        title: 'Slide Saved',
        description: 'Banner changes saved and published live.',
        type: 'success'
      });
    } else {
      // Add new
      const updated = [...slides, { ...editingSlide, order: slides.length + 1 }];
      saveSlides(updated);
      showToast({
        title: 'Slide Created',
        description: 'New hero slide added to homepage carousel.',
        type: 'success'
      });
    }

    setIsModalOpen(false);
    setEditingSlide(null);
  };

  const openNewSlideModal = () => {
    setEditingSlide({
      id: `slide-${Date.now().toString().slice(-4)}`,
      kicker: 'COMMERCIAL INGREDIENT INNOVATION',
      title: 'Next-Generation Functional Food Chemicals',
      description: 'Engineered specifically for commercial processors requiring certified batch consistency, tight heavy-metal thresholds, and dependable supply.',
      ctaText: 'Explore Solutions',
      ctaLink: '/products',
      secondaryCtaText: 'Request a Quote',
      secondaryCtaLink: '/rfq',
      badgeText: 'FCC MONOGRAPH',
      badgeValue: 'Lot Certified',
      chemicalCode: 'PB-NEW-01',
      chemicalPurity: '99.8% Standard',
      active: true,
      order: slides.length + 1
    });
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-bold text-primary-green uppercase tracking-wider">
            HOMEPAGE HERO MANAGEMENT
          </span>
          <h1 className="text-2xl font-black text-charcoal tracking-tight mt-0.5">
            Homepage Hero Banners &amp; Carousel
          </h1>
          <p className="text-xs text-secondary-text mt-1">
            Create, edit, reorder, and activate/deactivate responsive slides that appear live on the PureBlend homepage hero section.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleResetDefaults}
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
            className="text-xs"
          >
            Reset Defaults
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={openNewSlideModal}
            leftIcon={<Plus className="w-4 h-4" />}
            className="bg-[#12372A] hover:bg-[#1F7A5A] text-xs font-semibold"
          >
            Add New Slide
          </Button>
        </div>
      </div>

      {/* Slide List */}
      <div className="space-y-4">
        {slides.map((slide, idx) => (
          <div
            key={slide.id}
            className={`bg-white rounded-xl border p-5 transition-all ${
              slide.active
                ? 'border-[#D8E2DC] shadow-xs'
                : 'border-dashed border-slate-300 opacity-60 bg-slate-50'
            }`}
          >
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                {/* Reorder Buttons */}
                <div className="flex flex-col gap-1 pt-1">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => handleMove(idx, 'up')}
                    className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Move slide up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={idx === slides.length - 1}
                    onClick={() => handleMove(idx, 'down')}
                    className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Move slide down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Slide Details */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#1F7A5A] bg-[#EAF3EE] px-2 py-0.5 rounded">
                      SLIDE {idx + 1}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      ID: {slide.id}
                    </span>
                    {slide.active ? (
                      <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-semibold">
                        LIVE ON HOMEPAGE
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono bg-slate-200 text-slate-600 px-2 py-0.5 rounded">
                        INACTIVE / DRAFT
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-charcoal">
                    {slide.title}
                  </h3>
                  <p className="text-xs text-secondary-text max-w-2xl line-clamp-2">
                    {slide.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-2 text-[11px] font-mono text-slate-500">
                    <span>CTA: <strong className="text-charcoal">{slide.ctaText}</strong> ({slide.ctaLink})</span>
                    <span>•</span>
                    <span>Purity: <strong className="text-emerald-700">{slide.chemicalPurity || 'N/A'}</strong></span>
                    <span>•</span>
                    <span>Code: <strong className="text-charcoal">{slide.chemicalCode || 'N/A'}</strong></span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleToggleActive(slide.id)}
                  className="text-xs"
                >
                  {slide.active ? 'Deactivate' : 'Activate'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditingSlide(slide);
                    setIsModalOpen(true);
                  }}
                  leftIcon={<Edit3 className="w-3.5 h-3.5" />}
                  className="text-xs"
                >
                  Edit
                </Button>
                <button
                  type="button"
                  onClick={() => handleDelete(slide.id)}
                  className="p-2 rounded text-red-500 hover:bg-red-50 transition-colors"
                  title="Delete slide"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Add Modal */}
      {isModalOpen && editingSlide && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-xl border border-[#D8E2DC] max-w-2xl w-full p-6 space-y-4 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#D8E2DC]">
              <h2 className="text-base font-bold text-charcoal">
                {slides.some((s) => s.id === editingSlide.id) ? 'Edit Carousel Slide' : 'Add New Carousel Slide'}
              </h2>
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingSlide(null);
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveSlide} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-charcoal block mb-1">
                  Kicker Pill Label
                </label>
                <input
                  type="text"
                  required
                  value={editingSlide.kicker}
                  onChange={(e) => setEditingSlide({ ...editingSlide, kicker: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded-md border border-[#D8E2DC] bg-[#F8FAF7] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1F7A5A]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-charcoal block mb-1">
                  Headline Title
                </label>
                <input
                  type="text"
                  required
                  value={editingSlide.title}
                  onChange={(e) => setEditingSlide({ ...editingSlide, title: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded-md border border-[#D8E2DC] bg-[#F8FAF7] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1F7A5A]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-charcoal block mb-1">
                  Slide Description
                </label>
                <textarea
                  rows={3}
                  required
                  value={editingSlide.description}
                  onChange={(e) => setEditingSlide({ ...editingSlide, description: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded-md border border-[#D8E2DC] bg-[#F8FAF7] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1F7A5A]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-charcoal block mb-1">
                  Banner Background Image URL or File Upload
                </label>
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={editingSlide.imageUrl || ''}
                    onChange={(e) => setEditingSlide({ ...editingSlide, imageUrl: e.target.value })}
                    placeholder="/images/hero-facility.jpg or https://..."
                    className="w-full text-xs px-3 py-2 rounded-md border border-[#D8E2DC] bg-[#F8FAF7] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1F7A5A] flex-1"
                  />
                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 bg-[#F0F4F1] hover:bg-[#E2ECE7] text-forest text-xs font-semibold rounded border border-[#D8E2DC] transition-colors shrink-0">
                    <span>Upload File</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        try {
                          const compressedDataUrl = await compressAndResizeImage(file, 1920, 1080, 0.85);
                          setEditingSlide({ ...editingSlide, imageUrl: compressedDataUrl });
                          showToast({
                            title: 'Banner Image Compressed & Loaded',
                            description: `${file.name} optimized for hero backdrop.`,
                            type: 'success'
                          });
                        } catch {
                          showToast({
                            title: 'Upload Error',
                            description: 'Failed to compress or read banner image.',
                            type: 'error'
                          });
                        }
                      }}
                    />
                  </label>
                </div>
                {editingSlide.imageUrl && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="relative w-16 h-10 rounded border border-border-subtle overflow-hidden bg-warm-white">
                      <img
                        src={editingSlide.imageUrl}
                        alt="Banner Preview"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <span className="text-[11px] text-secondary-text">Banner backdrop preview loaded</span>
                  </div>
                )}
                <p className="text-[11px] text-secondary-text mt-1">Provide an image URL or upload a file (PNG, JPG, WebP) for the banner backdrop.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-charcoal block mb-1">
                    Primary CTA Button Text
                  </label>
                  <input
                    type="text"
                    required
                    value={editingSlide.ctaText}
                    onChange={(e) => setEditingSlide({ ...editingSlide, ctaText: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-md border border-[#D8E2DC] bg-[#F8FAF7] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1F7A5A]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-charcoal block mb-1">
                    Primary CTA Link
                  </label>
                  <input
                    type="text"
                    required
                    value={editingSlide.ctaLink}
                    onChange={(e) => setEditingSlide({ ...editingSlide, ctaLink: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-md border border-[#D8E2DC] bg-[#F8FAF7] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1F7A5A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-charcoal block mb-1">
                    Secondary CTA Text (Optional)
                  </label>
                  <input
                    type="text"
                    value={editingSlide.secondaryCtaText || ''}
                    onChange={(e) => setEditingSlide({ ...editingSlide, secondaryCtaText: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-md border border-[#D8E2DC] bg-[#F8FAF7] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1F7A5A]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-charcoal block mb-1">
                    Secondary CTA Link (Optional)
                  </label>
                  <input
                    type="text"
                    value={editingSlide.secondaryCtaLink || ''}
                    onChange={(e) => setEditingSlide({ ...editingSlide, secondaryCtaLink: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-md border border-[#D8E2DC] bg-[#F8FAF7] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1F7A5A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-charcoal block mb-1">
                    Chemical Code Badge
                  </label>
                  <input
                    type="text"
                    value={editingSlide.chemicalCode || ''}
                    onChange={(e) => setEditingSlide({ ...editingSlide, chemicalCode: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-md border border-[#D8E2DC] bg-[#F8FAF7] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1F7A5A]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-charcoal block mb-1">
                    Purity Assay Metric
                  </label>
                  <input
                    type="text"
                    value={editingSlide.chemicalPurity || ''}
                    onChange={(e) => setEditingSlide({ ...editingSlide, chemicalPurity: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-md border border-[#D8E2DC] bg-[#F8FAF7] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1F7A5A]"
                  />
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="active-toggle"
                    checked={editingSlide.active}
                    onChange={(e) => setEditingSlide({ ...editingSlide, active: e.target.checked })}
                    className="rounded border-[#D8E2DC] text-[#1F7A5A] focus:ring-[#1F7A5A]"
                  />
                  <label htmlFor="active-toggle" className="text-xs font-semibold text-charcoal">
                    Publish Live
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#D8E2DC]">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingSlide(null);
                  }}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  className="bg-[#12372A] hover:bg-[#1F7A5A] text-xs font-semibold"
                >
                  Save and Publish
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
