import React from 'react';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { ContactForm } from '@/components/forms/ContactForm';
import { Mail, Phone, Clock, MapPin, ShieldCheck, FileCheck2 } from 'lucide-react';

export default function ContactPage() {
  return (
    <PublicLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs items={[{ label: 'Contact Commercial Desk' }]} />



        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 my-8 items-start">
          {/* Left Column: Form */}
          <div className="lg:col-span-7">
            <ContactForm />
          </div>

          {/* Right Column: Verified Office & Logistics Information */}
          <div className="lg:col-span-5 space-y-6">
            {/* Direct Contact Information Box */}
            <div className="bg-white rounded-lg border border-border-subtle p-6 space-y-4 shadow-xs">
              <h3 className="text-sm font-bold text-charcoal uppercase tracking-wider">
                Commercial Operations Desk
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-primary-green shrink-0 mt-0.5" />
                  <div>
                    <span className="text-secondary-text block">Commercial Inquiries & RFQs:</span>
                    <a
                      href="mailto:inquiries@pureblendchemicals.com"
                      className="font-mono font-bold text-forest hover:underline"
                    >
                      inquiries@pureblendchemicals.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-primary-green shrink-0 mt-0.5" />
                  <div>
                    <span className="text-secondary-text block">Technical Support Desk:</span>
                    <span className="font-mono font-bold text-charcoal">+1 (800) 555-PBCHEM</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-primary-green shrink-0 mt-0.5" />
                  <div>
                    <span className="text-secondary-text block">Commercial Office Hours:</span>
                    <span className="text-charcoal font-medium">Monday – Friday, 08:00 – 17:00 EST</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-primary-green shrink-0 mt-0.5" />
                  <div>
                    <span className="text-secondary-text block">Regional Distribution Facilities:</span>
                    <span className="text-charcoal font-medium">North American Midwest & European Continental Logistics Hubs</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quality & Sample Request Guidance */}
            <div className="bg-warm-white rounded-lg border border-border-subtle p-6 space-y-3">
              <h4 className="text-xs font-bold text-charcoal uppercase tracking-wider flex items-center gap-1.5">
                <FileCheck2 className="w-4 h-4 text-primary-green" />
                <span>R&D Sample Dispatch Protocol</span>
              </h4>
              <p className="text-xs text-secondary-text leading-relaxed">
                Qualified commercial food manufacturing plants and research laboratories can request 100g – 500g analytical lab samples accompanied by batch-specific Certificates of Analysis. Specify your lot testing requirements in the inquiry form.
              </p>
            </div>

            {/* Data Handling Notice */}
            <div className="p-4 rounded border border-[#d6e3db] bg-[#edf4f0] text-xs text-forest space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-charcoal">
                <ShieldCheck className="w-3.5 h-3.5 text-primary-green" />
                <span>Confidentiality & Procurement Privacy</span>
              </div>
              <p className="text-[11px] text-secondary-text leading-relaxed">
                All proprietary formulation inquiries, projected volume forecasts, and technical parameters are handled in strict commercial confidence.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
