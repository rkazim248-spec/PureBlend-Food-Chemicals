'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { PRODUCTS_DATA } from '@/data/mockData';
import { ShieldCheck, CheckCircle2, FileText, ArrowRight, Truck, Clock } from 'lucide-react';

function RFQContent() {
  const searchParams = useSearchParams();
  const initialProductParam = searchParams.get('product') || 'citric-acid-anhydrous';
  const { showToast } = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [generatedRfqId, setGeneratedRfqId] = useState('');

  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    country: 'United States',
    productId: initialProductParam,
    volume: '20',
    volumeUnit: 'Metric Tons (MT)',
    packaging: '25 kg bags palletized',
    targetDeliveryDate: '',
    deliveryLocation: '',
    incoterm: 'DDP',
    specialRequirements: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.companyName.trim()) errs.companyName = 'Company name is required';
    if (!formData.contactName.trim()) errs.contactName = 'Contact name is required';
    if (!formData.email.trim() || !formData.email.includes('@')) errs.email = 'Valid corporate email required';
    if (!formData.volume.trim() || isNaN(Number(formData.volume)) || Number(formData.volume) <= 0) {
      errs.volume = 'Please specify valid numeric quantity';
    }
    if (!formData.deliveryLocation.trim()) errs.deliveryLocation = 'Destination facility or port is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    const rfqNumber = `PB-RFQ-${Math.floor(1000 + Math.random() * 9000)}`;

    setTimeout(() => {
      setIsSubmitting(false);
      setGeneratedRfqId(rfqNumber);
      setIsSubmitted(true);
      showToast({
        title: 'Quotation Request Registered',
        description: `Reference ${rfqNumber} logged for commercial engineering pricing.`,
        type: 'success'
      });
    }, 850);
  };

  const selectedProduct = PRODUCTS_DATA.find((p) => p.id === formData.productId);

  return (
    <PublicLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs items={[{ label: 'Request for Quotation (RFQ)' }]} />



        {isSubmitted ? (
          <div className="bg-white rounded-lg border border-border-subtle p-8 sm:p-12 text-center space-y-6 shadow-xs my-8">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono font-bold text-forest bg-soft-green px-3 py-1 rounded border border-[#cfe0d5]">
                {generatedRfqId}
              </span>
              <h2 className="text-2xl font-bold text-charcoal">
                Commercial RFQ Successfully Logged
              </h2>
              <p className="text-sm text-secondary-text max-w-lg mx-auto leading-relaxed">
                Thank you, <strong className="text-charcoal">{formData.contactName}</strong> of <strong className="text-charcoal">{formData.companyName}</strong>. Our commercial pricing team is reviewing your volume request for <strong className="text-charcoal">{formData.volume} {formData.volumeUnit}</strong> of <strong className="text-charcoal">{selectedProduct?.name}</strong>.
              </p>
            </div>

            <div className="bg-warm-white p-5 rounded-lg border border-border-subtle max-w-md mx-auto text-left text-xs space-y-2.5">
              <div className="flex justify-between border-b border-border-subtle pb-1.5">
                <span className="text-secondary-text">Item Requested:</span>
                <span className="font-semibold text-charcoal">{selectedProduct?.name} ({selectedProduct?.code})</span>
              </div>
              <div className="flex justify-between border-b border-border-subtle pb-1.5">
                <span className="text-secondary-text">Volume & Packaging:</span>
                <span className="font-semibold text-charcoal">{formData.volume} {formData.volumeUnit} · {formData.packaging}</span>
              </div>
              <div className="flex justify-between border-b border-border-subtle pb-1.5">
                <span className="text-secondary-text">Incoterm & Destination:</span>
                <span className="font-semibold text-charcoal">{formData.incoterm} · {formData.deliveryLocation}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-text">Notification Recipient:</span>
                <span className="font-semibold text-charcoal">{formData.email}</span>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap justify-center gap-3">
              <Link href="/products">
                <Button variant="primary">
                  Browse Product Catalogue
                </Button>
              </Link>
              <Button
                variant="outline"
                onClick={() => {
                  setIsSubmitted(false);
                  setFormData({
                    companyName: '',
                    contactName: '',
                    email: '',
                    phone: '',
                    country: 'United States',
                    productId: 'citric-acid-anhydrous',
                    volume: '20',
                    volumeUnit: 'Metric Tons (MT)',
                    packaging: '25 kg bags palletized',
                    targetDeliveryDate: '',
                    deliveryLocation: '',
                    incoterm: 'DDP',
                    specialRequirements: ''
                  });
                }}
              >
                Submit Another Quotation Request
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-border-subtle p-6 sm:p-8 space-y-6 shadow-xs my-8">
            {/* Regulatory Assurance Callout */}
            <div className="p-4 rounded bg-soft-green/60 border border-[#d2e2d8] flex items-start gap-3 text-xs text-forest">
              <ShieldCheck className="w-5 h-5 text-primary-green shrink-0 mt-0.5" />
              <div>
                <strong className="block text-charcoal font-semibold">Verified Food Chemical Supply Guarantee:</strong>
                <span className="text-secondary-text mt-0.5 block leading-relaxed">
                  Quotations include pharmacopeial monograph compliance verification (FCC / USP), freight index calculations, batch Certificate of Analysis (COA) testing, and standard palletization.
                </span>
              </div>
            </div>

            {/* Section 1: Product Selection & Volumes */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-charcoal uppercase tracking-wider border-b border-border-subtle pb-2">
                1. Product & Volume Specifications
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  label="Select Food Chemical Ingredient"
                  required
                  options={PRODUCTS_DATA.map((p) => ({
                    value: p.id,
                    label: `${p.name} (${p.code}) — ${p.grade}`
                  }))}
                  value={formData.productId}
                  onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
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
                    label="Volume Unit"
                    options={[
                      { value: 'Metric Tons (MT)', label: 'Metric Tons (MT)' },
                      { value: 'kg', label: 'kg' },
                      { value: 'Pallets', label: 'Pallets (1,000kg)' },
                      { value: 'FCL (20ft Container)', label: 'FCL (20ft Container)' }
                    ]}
                    value={formData.volumeUnit}
                    onChange={(e) => setFormData({ ...formData, volumeUnit: e.target.value as any })}
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Logistics & Packaging */}
            <div className="space-y-4 pt-2">
              <h3 className="text-xs font-bold text-charcoal uppercase tracking-wider border-b border-border-subtle pb-2">
                2. Packaging & Delivery Terms
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Select
                  label="Packaging Configuration"
                  options={[
                    { value: '25 kg bags palletized', label: '25 kg Kraft Bags (Palletized)' },
                    { value: '1,000 kg FIBC jumbo bulk bags', label: '1,000 kg FIBC Bulk Totes' },
                    { value: 'Custom Packaging Format', label: 'Custom Specification' }
                  ]}
                  value={formData.packaging}
                  onChange={(e) => setFormData({ ...formData, packaging: e.target.value })}
                />
                <Select
                  label="Incoterm Preference"
                  options={[
                    { value: 'DDP', label: 'DDP (Delivered Duty Paid)' },
                    { value: 'CIF', label: 'CIF (Port of Discharge)' },
                    { value: 'FOB', label: 'FOB (Port of Origin)' },
                    { value: 'EXW', label: 'EXW (PureBlend Facility)' }
                  ]}
                  value={formData.incoterm}
                  onChange={(e) => setFormData({ ...formData, incoterm: e.target.value as any })}
                />
                <Input
                  label="Destination Port / City"
                  required
                  placeholder="e.g. Port of Rotterdam / Chicago, IL"
                  value={formData.deliveryLocation}
                  onChange={(e) => setFormData({ ...formData, deliveryLocation: e.target.value })}
                  error={errors.deliveryLocation}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Target Delivery Window (Optional)"
                  placeholder="e.g. November 2026 / Immediate dispatch"
                  value={formData.targetDeliveryDate}
                  onChange={(e) => setFormData({ ...formData, targetDeliveryDate: e.target.value })}
                />
                <Input
                  label="Destination Country"
                  placeholder="e.g. United States / Germany"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                />
              </div>
            </div>

            {/* Section 3: Company & Authorized Contact Information */}
            <div className="space-y-4 pt-2">
              <h3 className="text-xs font-bold text-charcoal uppercase tracking-wider border-b border-border-subtle pb-2">
                3. Company & Procurement Authority Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Company / Enterprise Name"
                  required
                  placeholder="e.g. Premier Beverage Bottlers LLC"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  error={errors.companyName}
                />
                <Input
                  label="Contact Person & Job Title"
                  required
                  placeholder="e.g. Katherine Hayes, Sourcing Director"
                  value={formData.contactName}
                  onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                  error={errors.contactName}
                />
                <Input
                  label="Corporate Email Address"
                  required
                  type="email"
                  placeholder="k.hayes@premierbeverage.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  error={errors.email}
                />
                <Input
                  label="Business Direct Telephone"
                  placeholder="+1 (555) 432-8900"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <Textarea
                label="Custom Monograph Criteria / Special Notes"
                rows={3}
                placeholder="Include custom mesh distribution requirements, heavy metals ICP-MS limits, delivery cadence (e.g. 1 FCL every 3 weeks), or QA audit requirements..."
                value={formData.specialRequirements}
                onChange={(e) => setFormData({ ...formData, specialRequirements: e.target.value })}
              />
            </div>

            <div className="pt-4 border-t border-border-subtle flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-secondary-text flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-primary-green shrink-0" />
                <span>Commercial response SLA: Within 24 business hours</span>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Link href="/products" className="w-full sm:w-auto">
                  <Button variant="outline" className="w-full justify-center">
                    Cancel
                  </Button>
                </Link>
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={isSubmitting}
                  className="w-full sm:w-auto"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Generate & Submit Official RFQ
                </Button>
              </div>
            </div>
          </form>
        )}
      </div>
    </PublicLayout>
  );
}

export default function RFQPage() {
  return (
    <Suspense
      fallback={
        <PublicLayout>
          <div className="max-w-4xl mx-auto px-4 py-16 text-center text-xs text-secondary-text">
            Loading quotation request form...
          </div>
        </PublicLayout>
      }
    >
      <RFQContent />
    </Suspense>
  );
}

