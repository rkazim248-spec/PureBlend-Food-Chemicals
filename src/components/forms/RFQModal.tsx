'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { PRODUCTS_DATA } from '@/data/mockData';
import { CheckCircle2, ShieldCheck, Tag, Check, AlertCircle } from 'lucide-react';
import { validatePromoCode } from '@/lib/discount';
import { submitRfq, type RfqSubmissionInput } from '@/lib/api/services';
import { ApiError } from '@/lib/api/types';

interface RFQModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedProductId?: string;
  initialProductId?: string;
  initialDiscountCode?: string;
}

export function RFQModal({ isOpen, onClose, preselectedProductId, initialProductId, initialDiscountCode }: RFQModalProps) {
  const defaultProduct = initialProductId || preselectedProductId;
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [rfqReference, setRfqReference] = useState('');

  const [formData, setFormData] = useState<RfqSubmissionInput>({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    productId: defaultProduct || 'citric-acid-anhydrous',
    volume: '',
    volumeUnit: 'Metric Tons (MT)',
    packaging: '25 kg bags palletized',
    targetDate: '',
    deliveryLocation: '',
    incoterm: 'CIF',
    notes: ''
  });

  // Discount code state
  const [couponCode, setCouponCode] = useState(initialDiscountCode || '');
  const [appliedDiscount, setAppliedDiscount] = useState<{ code: string; percent: number } | null>(() => {
    if (initialDiscountCode) {
      const val = validatePromoCode(initialDiscountCode);
      if (val.valid && val.offer) {
        return { code: val.offer.code, percent: val.offer.value };
      }
    }
    return null;
  });
  const [couponError, setCouponError] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});

  const [userProductId, setUserProductId] = useState<string | null>(null);
  const effectiveProductId = userProductId || defaultProduct || 'citric-acid-anhydrous';

  const handleApplyCoupon = () => {
    setCouponError('');
    const validation = validatePromoCode(couponCode);
    if (!validation.valid || !validation.offer) {
      setCouponError(validation.error || 'Invalid or expired discount code.');
      return;
    }

    setAppliedDiscount({ code: validation.offer.code, percent: validation.offer.value });
    showToast({
      title: 'Discount Code Applied',
      description: `Promo code ${validation.offer.code} successfully applied for ${validation.offer.value}% commercial order rebate.`,
      type: 'success'
    });
    setCouponCode('');
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.companyName.trim()) newErrors.companyName = 'Company name is required';
    if (!formData.contactName.trim()) newErrors.contactName = 'Contact name is required';
    if (!formData.email.trim() || !formData.email.includes('@')) newErrors.email = 'Valid corporate email is required';
    if (!formData.volume.trim() || isNaN(Number(formData.volume)) || Number(formData.volume) <= 0) {
      newErrors.volume = 'Valid numeric volume required';
    }
    if (!formData.deliveryLocation.trim()) newErrors.deliveryLocation = 'Destination port or city is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const submission = await submitRfq({
        ...formData,
        productId: effectiveProductId,
        phone: formData.phone || undefined,
        targetDate: formData.targetDate || undefined,
        notes: formData.notes || undefined,
      });
      setRfqReference(submission.id);
      setIsSuccess(true);
      showToast({
        title: 'Quotation Request Registered',
        description: `RFQ reference generated for ${formData.companyName} ${appliedDiscount ? `with ${appliedDiscount.percent}% discount` : ''}.`,
        type: 'success'
      });
    } catch (error) {
      let message = 'Please try again.';
      if (error instanceof ApiError) {
        message = error.message;
      } else if (error instanceof Error) {
        message = error.message;
      }
      showToast({
        title: 'Unable to submit quotation request',
        description: message,
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setIsSuccess(false);
    setRfqReference('');
    setAppliedDiscount(null);
    setCouponCode('');
    onClose();
  };

  const selectedProduct = PRODUCTS_DATA.find((p) => p.id === effectiveProductId);

  return (
    <Modal
      isOpen={isOpen}
      onClose={isSuccess ? handleReset : onClose}
      title={isSuccess ? 'Quotation Request Received' : 'Request Commercial Quotation (RFQ)'}
      subtitle={
        isSuccess
          ? `PureBlend Commercial Operations Reference #PB-RFQ-${rfqReference}`
          : 'Submit your technical specifications, required volume, and delivery terms for volume pricing.'
      }
      maxWidth="2xl"
    >
      {isSuccess ? (
        <div className="py-6 text-center space-y-4">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-charcoal">RFQ Submitted Successfully</h3>
            <p className="text-sm text-secondary-text max-w-md mx-auto mt-2 leading-relaxed">
              Thank you, <strong className="text-charcoal">{formData.contactName}</strong>. A commercial quote for{' '}
              <strong className="text-charcoal">{formData.volume} {formData.volumeUnit}</strong> of{' '}
              <strong className="text-charcoal">{selectedProduct?.name}</strong> has been logged {appliedDiscount ? `with a ${appliedDiscount.percent}% discount rebate (${appliedDiscount.code})` : ''}. A regional technical sales engineer will email your formal pricing dossier to{' '}
              <strong className="text-charcoal">{formData.email}</strong> within 24 business hours.
            </p>
          </div>

          <div className="bg-warm-white p-4 rounded-lg border border-border-subtle max-w-md mx-auto text-left text-xs space-y-2">
            <div className="flex justify-between border-b border-border-subtle pb-1">
              <span className="text-secondary-text">Item Requested:</span>
              <span className="font-semibold text-charcoal">{selectedProduct?.name} ({selectedProduct?.code})</span>
            </div>
            <div className="flex justify-between border-b border-border-subtle pb-1">
              <span className="text-secondary-text">Volume & Terms:</span>
              <span className="font-semibold text-charcoal">{formData.volume} {formData.volumeUnit} ({formData.incoterm})</span>
            </div>
            {appliedDiscount && (
              <div className="flex justify-between border-b border-border-subtle pb-1 text-emerald-700 font-medium">
                <span>Applied Discount:</span>
                <span>{appliedDiscount.percent}% OFF ({appliedDiscount.code})</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-secondary-text">Delivery Destination:</span>
              <span className="font-semibold text-charcoal">{formData.deliveryLocation}</span>
            </div>
          </div>

          <div className="pt-4">
            <Button variant="primary" onClick={handleReset} className="w-full sm:w-auto">
              Close & Return to Browsing
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-soft-green/60 p-3 rounded border border-[#d2e2d8] flex items-center gap-2.5 text-xs text-forest">
            <ShieldCheck className="w-4 h-4 shrink-0 text-primary-green" />
            <span>PureBlend operates direct manufacturer-to-plant supply contracts with complete batch traceability and verified FCC monograph adherence.</span>
          </div>

          {/* Product Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Product Item"
              required
              options={PRODUCTS_DATA.map((p) => ({
                value: p.id,
                label: `${p.name} (${p.code})`
              }))}
              value={effectiveProductId}
              onChange={(e) => {
                setUserProductId(e.target.value);
                setFormData((prev) => ({ ...prev, productId: e.target.value }));
              }}
            />
            <div className="grid grid-cols-2 gap-2">
              <Input
                label="Target Volume"
                required
                type="number"
                min="1"
                placeholder="e.g. 20"
                value={formData.volume}
                onChange={(e) => setFormData({ ...formData, volume: e.target.value })}
                error={errors.volume}
              />
              <Select
                label="Unit"
                options={[
                  { value: 'Metric Tons (MT)', label: 'Metric Tons (MT)' },
                  { value: 'kg', label: 'kg' },
                  { value: 'Pallets', label: 'Pallets (1,000kg)' },
                  { value: 'FCL (20ft Container)', label: 'FCL (20ft Container)' }
                ]}
                value={formData.volumeUnit}
                onChange={(e) => setFormData({ ...formData, volumeUnit: e.target.value as RfqSubmissionInput["volumeUnit"] })}
              />
            </div>
          </div>

          {/* Discount / Coupon Code Section */}
          <div className="p-3 bg-slate-50 rounded-lg border border-border-subtle space-y-2">
            <label className="block text-xs font-bold text-charcoal uppercase tracking-wider flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-forest" />
              <span>Commercial Discount / Promo Code</span>
            </label>
            <div className="flex gap-2">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="e.g. PUREBLEND10"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded border border-border-subtle bg-white focus:outline-none focus:border-forest font-mono uppercase"
                />
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleApplyCoupon}
                className="text-xs shrink-0"
              >
                Apply Code
              </Button>
            </div>
            {couponError && (
              <p className="text-[11px] text-rose-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {couponError}
              </p>
            )}
            {appliedDiscount && (
              <div className="flex items-center justify-between text-xs bg-emerald-50 text-emerald-800 p-2 rounded border border-emerald-200">
                <span className="flex items-center gap-1.5 font-mono font-bold">
                  <Check className="w-3.5 h-3.5 text-emerald-600" /> {appliedDiscount.code} ({appliedDiscount.percent}% Rebate Active)
                </span>
                <button
                  type="button"
                  onClick={() => setAppliedDiscount(null)}
                  className="text-xs text-rose-600 hover:underline font-medium"
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          {/* Logistics & IncoTerms */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select
              label="Packaging Format"
              options={[
                { value: '25 kg bags palletized', label: '25 kg Kraft Bags (Palletized)' },
                { value: '1,000 kg FIBC jumbo bulk bags', label: '1,000 kg FIBC Bulk Totes' },
                { value: 'Standard Manufacturer Export Pack', label: 'Standard Export Pack' }
              ]}
              value={formData.packaging}
              onChange={(e) => setFormData({ ...formData, packaging: e.target.value })}
            />
            <Select
              label="Incoterm Preference"
              options={[
                { value: 'CIF', label: 'CIF (Port of Entry)' },
                { value: 'DDP', label: 'DDP (Delivered Duty Paid)' },
                { value: 'FOB', label: 'FOB (Origin Port)' },
                { value: 'EXW', label: 'EXW (Ex Works Facility)' }
              ]}
              value={formData.incoterm}
              onChange={(e) => setFormData({ ...formData, incoterm: e.target.value as RfqSubmissionInput["incoterm"] })}
            />
            <Input
              label="Delivery Port / City"
              required
              placeholder="e.g. Port of Rotterdam / Chicago, IL"
              value={formData.deliveryLocation}
              onChange={(e) => setFormData({ ...formData, deliveryLocation: e.target.value })}
              error={errors.deliveryLocation}
            />
          </div>

          {/* Company & Contact Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-border-subtle">
            <Input
              label="Company / Enterprise Name"
              required
              placeholder="e.g. Global Beverage Manufacturing LLC"
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              error={errors.companyName}
            />
            <Input
              label="Contact Person & Title"
              required
              placeholder="e.g. Sarah Miller, Procurement Mgr."
              value={formData.contactName}
              onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
              error={errors.contactName}
            />
            <Input
              label="Corporate Email"
              required
              type="email"
              placeholder="procurement@company.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              error={errors.email}
            />
            <Input
              label="Business Phone"
              placeholder="+1 (555) 000-0000"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          {/* Notes */}
          <Textarea
            label="Additional Specifications / Requirements"
            rows={2}
            placeholder="Specify mesh size, special COA testing criteria, scheduled delivery cadence, or contract length..."
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          />

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border-subtle">
            <Button variant="outline" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button variant="primary" type="submit" isLoading={isSubmitting}>
              Submit RFQ for Official Quote
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
