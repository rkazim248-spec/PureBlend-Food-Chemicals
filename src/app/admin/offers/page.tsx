'use client';

import React, { useState } from 'react';
import { OFFERS_DATA, PRODUCTS_DATA } from '@/data/mockData';
import { B2BOffer } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import { Plus, Tag, Edit3, Trash2, CheckCircle2, Clock } from 'lucide-react';

export default function AdminOffersPage() {
  const { showToast } = useToast();
  const [offers, setOffers] = useState<B2BOffer[]>(OFFERS_DATA);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<B2BOffer | null>(null);

  const [formData, setFormData] = useState<{
    title: string;
    badge: string;
    description: string;
    volumeTier: string;
    validityDate: string;
    status: B2BOffer['status'];
    inquiryCode: string;
  }>({
    title: '',
    badge: 'Volume Price Lock',
    description: '',
    volumeTier: 'Minimum 10 Metric Tons',
    validityDate: 'Valid through Q4 2026',
    status: 'Active',
    inquiryCode: 'OFFER-VOL-NEW'
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    if (editingOffer) {
      setOffers((prev) =>
        prev.map((o) =>
          o.id === editingOffer.id ? { ...o, ...formData } : o
        )
      );
      showToast({
        title: 'Program Updated',
        description: `${formData.title} terms updated.`,
        type: 'success'
      });
      setEditingOffer(null);
    } else {
      const newOffer: B2BOffer = {
        id: `offer-${Date.now()}`,
        ...formData,
        terms: [
          'Fixed pricing benchmark index',
          'Dedicated safety stock buffer in regional hub',
          'Free analytical batch testing dossier'
        ],
        targetProducts: ['citric-acid-anhydrous', 'potassium-sorbate-granular']
      };
      setOffers([newOffer, ...offers]);
      showToast({
        title: 'Contract Program Created',
        description: `${formData.title} published to commercial offerings.`,
        type: 'success'
      });
      setIsAddModalOpen(false);
    }
  };

  const handleToggleStatus = (id: string, current: string) => {
    const nextStatus = current === 'Active' ? 'Upcoming' : 'Active';
    setOffers((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: nextStatus as any } : o))
    );
    showToast({
      title: 'Status Toggled',
      description: `Program status set to ${nextStatus}`,
      type: 'info'
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-bold text-primary-green uppercase tracking-wider">
            Commercial Frameworks
          </span>
          <h1 className="text-2xl font-black text-charcoal tracking-tight mt-0.5">
            Supply Contracts & Volume Programs
          </h1>
          <p className="text-xs text-secondary-text mt-1">
            Configure index-linked price locks, pilot trial batch qualifications, and consignment VMI programs.
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => {
            setFormData({
              title: '',
              badge: 'Volume Price Lock',
              description: '',
              volumeTier: 'Minimum 10 Metric Tons',
              validityDate: 'Valid through Q4 2026',
              status: 'Active',
              inquiryCode: `OFFER-${Math.floor(100 + Math.random() * 900)}`
            });
            setIsAddModalOpen(true);
          }}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Create Supply Program
        </Button>
      </div>

      {/* Offers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {offers.map((offer) => (
          <div
            key={offer.id}
            className="bg-white rounded-lg border border-border-subtle p-5 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-mono text-[11px] font-bold text-forest bg-soft-green px-2 py-0.5 rounded border border-[#cfe0d5]">
                  {offer.badge}
                </span>
                <span className="font-mono text-secondary-text">{offer.inquiryCode}</span>
              </div>

              <h3 className="text-base font-bold text-charcoal mt-1">
                {offer.title}
              </h3>

              <p className="text-xs text-secondary-text mt-2 leading-relaxed">
                {offer.description}
              </p>

              <div className="mt-4 p-2.5 rounded bg-warm-white border border-border-subtle text-xs">
                <span className="text-secondary-text block text-[11px]">Volume Threshold:</span>
                <span className="font-mono font-bold text-forest mt-0.5 block">{offer.volumeTier}</span>
              </div>

              <div className="mt-3 text-[11px] text-secondary-text flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{offer.validityDate}</span>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-border-subtle flex items-center justify-between">
              <button
                type="button"
                onClick={() => handleToggleStatus(offer.id, offer.status)}
                className="cursor-pointer"
              >
                <Badge variant={offer.status === 'Active' ? 'success' : 'neutral'}>
                  {offer.status}
                </Badge>
              </button>

              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditingOffer(offer);
                    setFormData({
                      title: offer.title,
                      badge: offer.badge,
                      description: offer.description,
                      volumeTier: offer.volumeTier,
                      validityDate: offer.validityDate,
                      status: offer.status,
                      inquiryCode: offer.inquiryCode
                    });
                  }}
                  className="text-xs h-7 px-2"
                >
                  Edit
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Offer Modal */}
      <Modal
        isOpen={isAddModalOpen || !!editingOffer}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingOffer(null);
        }}
        title={editingOffer ? `Edit Program: ${editingOffer.title}` : 'Create Commercial Supply Program'}
        subtitle="Establish volume parameters and contractual frameworks for industrial food processors."
        maxWidth="md"
      >
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <Input
            label="Program Title"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g. Q4 Buffer-Stock Price Lock"
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Badge / Classification"
              required
              value={formData.badge}
              onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
              placeholder="e.g. Supply Security"
            />
            <Input
              label="Inquiry Code"
              required
              value={formData.inquiryCode}
              onChange={(e) => setFormData({ ...formData, inquiryCode: e.target.value })}
            />
          </div>

          <Input
            label="Volume Commitment Tier"
            required
            value={formData.volumeTier}
            onChange={(e) => setFormData({ ...formData, volumeTier: e.target.value })}
            placeholder="e.g. Minimum 20 Metric Tons annual"
          />

          <Input
            label="Validity Date Statement"
            required
            value={formData.validityDate}
            onChange={(e) => setFormData({ ...formData, validityDate: e.target.value })}
            placeholder="e.g. Valid through Q4 2026"
          />

          <Input
            label="Description"
            required
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Summarize contractual buffer stocks and terms..."
          />

          <div className="pt-3 border-t border-border-subtle flex justify-end gap-2">
            <Button
              variant="outline"
              type="button"
              onClick={() => {
                setIsAddModalOpen(false);
                setEditingOffer(null);
              }}
            >
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {editingOffer ? 'Save Changes' : 'Publish Program'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
