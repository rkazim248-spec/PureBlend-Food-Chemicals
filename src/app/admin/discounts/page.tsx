'use client';

import React, { useState, useEffect } from 'react';
import { getActiveDiscountCodes, saveDiscountCodes, DiscountCodeOffer, DEFAULT_DISCOUNT_CODES } from '@/lib/discount';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import { Badge } from '@/components/ui/Badge';
import { Plus, Trash2, Tag, Calendar, Percent, DollarSign, AlertCircle } from 'lucide-react';

export default function AdminDiscountsPage() {
  const { showToast } = useToast();
  const [codes, setCodes] = useState<Record<string, DiscountCodeOffer>>(DEFAULT_DISCOUNT_CODES);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCodes(getActiveDiscountCodes());
  }, []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCode, setEditingCode] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    code: '',
    type: 'percentage' as 'percentage' | 'fixed',
    value: 10,
    startDate: '2026-01-01',
    endDate: '2026-12-31'
  });



  const handleOpenAdd = () => {
    setEditingCode(null);
    setFormData({
      code: '',
      type: 'percentage',
      value: 10,
      startDate: new Date().toISOString().split('T')[0],
      endDate: '2026-12-31'
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = formData.code.trim().toUpperCase();
    if (!cleanCode) {
      showToast({ title: 'Error', description: 'Promo code cannot be empty.', type: 'error' });
      return;
    }

    if (formData.value <= 0) {
      showToast({ title: 'Error', description: 'Discount value must be greater than zero.', type: 'error' });
      return;
    }

    const updated = {
      ...codes,
      [cleanCode]: {
        code: cleanCode,
        type: formData.type,
        value: Number(formData.value),
        startDate: formData.startDate,
        endDate: formData.endDate
      }
    };

    saveDiscountCodes(updated);
    setCodes(updated);
    setIsModalOpen(false);
    showToast({
      title: editingCode ? 'Promo Code Updated' : 'Promo Code Created',
      description: `Discount code ${cleanCode} successfully saved.`,
      type: 'success'
    });
  };

  const handleDelete = (codeKey: string) => {
    if (confirm(`Are you sure you want to remove discount code "${codeKey}"?`)) {
      const updated = { ...codes };
      delete updated[codeKey];
      saveDiscountCodes(updated);
      setCodes(updated);
      showToast({
        title: 'Promo Code Removed',
        description: `Discount code ${codeKey} has been deleted.`,
        type: 'info'
      });
    }
  };

  const codeEntries = Object.values(codes);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-bold text-primary-green uppercase tracking-wider">
            Commercial Promotions
          </span>
          <h1 className="text-2xl font-black text-charcoal tracking-tight mt-0.5">
            Discount & Promo Code Management
          </h1>
          <p className="text-xs text-secondary-text mt-1">
            Create, schedule, and remove promotional discount codes applicable across storefront product pages and RFQ quotations.
          </p>
        </div>
        <Button
          variant="primary"
          onClick={handleOpenAdd}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add Promo Code
        </Button>
      </div>

      {/* Codes Table / Grid */}
      <div className="bg-white rounded-lg border border-border-subtle shadow-xs overflow-hidden">
        <div className="p-4 border-b border-border-subtle bg-warm-white flex items-center justify-between">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-charcoal">
            Active Promo Codes ({codeEntries.length})
          </span>
          <span className="text-xs text-secondary-text font-mono">
            Synchronized with Checkout & RFQ Engine
          </span>
        </div>

        {codeEntries.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Tag className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-sm font-semibold text-charcoal">No discount codes configured</p>
            <p className="text-xs text-secondary-text">Click &quot;Add Promo Code&quot; to create your first promotion.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-warm-white border-b border-border-subtle text-secondary-text font-mono uppercase text-[11px]">
                  <th className="p-4">Promo Code</th>
                  <th className="p-4">Discount Type</th>
                  <th className="p-4">Value</th>
                  <th className="p-4">Validity Period</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle text-charcoal">
                {codeEntries.map((offer) => {
                  const now = new Date();
                  const isExpired = offer.endDate && new Date(offer.endDate) < now;
                  const isUpcoming = offer.startDate && new Date(offer.startDate) > now;
                  const status = isExpired ? 'Expired' : isUpcoming ? 'Scheduled' : 'Active';

                  return (
                    <tr key={offer.code} className="hover:bg-warm-white/60 transition-colors">
                      <td className="p-4 font-mono font-bold text-forest">
                        {offer.code}
                      </td>
                      <td className="p-4 capitalize">
                        {offer.type === 'percentage' ? 'Percentage (%)' : 'Fixed Amount (PKR)'}
                      </td>
                      <td className="p-4 font-mono font-bold">
                        {offer.type === 'percentage' ? `${offer.value}%` : `PKR ${offer.value.toLocaleString()}`}
                      </td>
                      <td className="p-4 font-mono text-secondary-text text-[11px]">
                        {offer.startDate || 'Any'} → {offer.endDate || 'No Expiry'}
                      </td>
                      <td className="p-4">
                        <Badge
                          variant={
                            status === 'Active' ? 'success' : status === 'Scheduled' ? 'neutral' : 'error'
                          }
                        >
                          {status}
                        </Badge>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs h-7 px-2 text-rose-600 hover:bg-rose-50 border-rose-200"
                          onClick={() => handleDelete(offer.code)}
                          leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                        >
                          Remove
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Promotional Discount Code"
        subtitle="Configure discount rules, percentages or fixed rebates, and validity schedules."
        maxWidth="md"
      >
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <Input
            label="Promo Code"
            required
            placeholder="e.g. SUMMER50 or BULK2026"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-charcoal mb-1">Discount Type</label>
              <select
                className="w-full text-xs px-3 py-2 rounded border border-border-subtle bg-white focus:outline-none focus:border-primary-green"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount (PKR)</option>
              </select>
            </div>
            <Input
              label={formData.type === 'percentage' ? 'Percentage Value (e.g. 15)' : 'Fixed Amount (PKR)'}
              type="number"
              required
              min={1}
              value={formData.value}
              onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Start Date"
              type="date"
              required
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            />
            <Input
              label="End Date (Expiry)"
              type="date"
              required
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            />
          </div>

          <div className="p-3 rounded bg-warm-white border border-border-subtle text-secondary-text space-y-1">
            <span className="font-semibold text-charcoal block">Commercial Rule Notice:</span>
            <p className="text-[11px]">
              Once created, this discount code can be entered by customers on individual product pages and within the RFQ quotation submission modal.
            </p>
          </div>

          <div className="pt-3 border-t border-border-subtle flex justify-end gap-2">
            <Button
              variant="outline"
              type="button"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Promo Code
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
