'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { CheckCircle2, Send, MailCheck } from 'lucide-react';

export function ContactForm() {
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    inquiryType: 'Commercial Sourcing & Bulk Pricing',
    message: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Full name is required';
    if (!formData.email.trim() || !formData.email.includes('@')) errs.email = 'Valid business email is required';
    if (!formData.company.trim()) errs.company = 'Company name is required';
    if (!formData.message.trim() || formData.message.length < 10) {
      errs.message = 'Please provide detailed inquiry information (min 10 characters)';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      showToast({
        title: 'Inquiry Transmitted',
        description: 'Your inquiry has been logged with PureBlend Commercial Operations.',
        type: 'success'
      });
    }, 700);
  };

  if (isSubmitted) {
    return (
      <div className="bg-white rounded-lg border border-border-subtle p-8 text-center space-y-4">
        <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
          <MailCheck className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-charcoal">Inquiry Transmitted Successfully</h3>
        <p className="text-sm text-secondary-text max-w-md mx-auto leading-relaxed">
          Thank you, <strong className="text-charcoal">{formData.name}</strong>. Our technical sales engineering team has received your communication regarding <strong className="text-charcoal">{formData.inquiryType}</strong> and will follow up at <strong className="text-charcoal">{formData.email}</strong> within 1 business day.
        </p>
        <div className="pt-4">
          <Button
            variant="outline"
            onClick={() => {
              setIsSubmitted(false);
              setFormData({
                name: '',
                email: '',
                company: '',
                phone: '',
                inquiryType: 'Commercial Sourcing & Bulk Pricing',
                message: ''
              });
            }}
          >
            Send Another Message
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-border-subtle p-6 sm:p-8 space-y-5 shadow-xs">
      <div>
        <h3 className="text-lg font-bold text-charcoal">Submit Commercial or Technical Inquiry</h3>
        <p className="text-xs text-secondary-text mt-1">
          Direct your technical specifications, trial batch inquiries, or vendor qualification audits to our operations desk.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Your Full Name"
          required
          placeholder="e.g. Dr. Arthur Vance"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          error={errors.name}
        />
        <Input
          label="Corporate Work Email"
          required
          type="email"
          placeholder="e.g. a.vance@beveragecorp.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          error={errors.email}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Company / Enterprise Name"
          required
          placeholder="e.g. Apex Food Manufacturing"
          value={formData.company}
          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
          error={errors.company}
        />
        <Input
          label="Business Phone (Optional)"
          placeholder="+1 (555) 000-0000"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />
      </div>

      <Select
        label="Inquiry Classification"
        required
        options={[
          { value: 'Commercial Sourcing & Bulk Pricing', label: 'Commercial Sourcing & Bulk Pricing' },
          { value: 'Technical Formulation Support', label: 'Technical Formulation Support' },
          { value: 'R&D Evaluation Batch Request', label: 'R&D Evaluation Batch Request' },
          { value: 'COA / Regulatory Audit Documents', label: 'COA / Regulatory Audit Documents' },
          { value: 'Contract Logistics & Consignment VMI', label: 'Contract Logistics & Consignment VMI' }
        ]}
        value={formData.inquiryType}
        onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
      />

      <Textarea
        label="Inquiry Details & Specifications"
        required
        rows={4}
        placeholder="Detail your target ingredients, projected monthly consumption volume, application requirements, or testing parameters..."
        value={formData.message}
        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
        error={errors.message}
      />

      <div className="pt-2 flex items-center justify-between flex-wrap gap-4 border-t border-border-subtle">
        <p className="text-[11px] text-secondary-text">
          Direct desk: <span className="font-mono text-charcoal">inquiries@pureblendchemicals.com</span>
        </p>
        <Button
          type="submit"
          variant="primary"
          isLoading={isSubmitting}
          rightIcon={<Send className="w-4 h-4" />}
        >
          Send Inquiry
        </Button>
      </div>
    </form>
  );
}
