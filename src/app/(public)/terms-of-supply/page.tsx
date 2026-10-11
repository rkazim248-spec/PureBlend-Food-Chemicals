'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Button } from '@/components/ui/Button';
import { RFQModal } from '@/components/forms/RFQModal';
import { 
  FileText, 
  ShieldCheck, 
  Printer, 
  Download, 
  Scale, 
  Clock, 
  Truck, 
  Mail, 
  Phone, 
  MapPin, 
  ExternalLink,
  ChevronRight,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const markdownContent = `# Terms of Supply

**Last Updated:** October 11, 2026

## 1. Introduction

Welcome to PureBlend Food Chemicals (“PureBlend,” “we,” “our,” or “us”). These Terms of Supply govern the sale and supply of food ingredients, food chemicals, raw materials, and related products to our customers.

By requesting a quotation, placing an order, or purchasing products from us, you agree to these terms, together with any applicable quotation, purchase confirmation, product specification, or separate written agreement.

If a separate written agreement conflicts with these terms, the separate agreement will take precedence to the extent of the conflict.

## 2. Products and Specifications

We aim to provide accurate product descriptions, technical information, specifications, and availability details. Product information displayed on our website is provided for general informational purposes and may be updated periodically.

Customers are responsible for confirming that a product meets their intended application, technical requirements, applicable regulations, and manufacturing processes before ordering or using it.

Product images are illustrative and may not represent the exact packaging, batch, or appearance of the supplied product.

Certificates of Analysis (CoAs), technical data sheets, safety data sheets, and other documentation will be provided where applicable and available for the relevant product or batch.

## 3. Quotations and Orders

Website inquiries and quotation requests do not constitute a confirmed order or a binding commitment to supply.

Quotations are subject to the validity period, product availability, quantity, specifications, delivery terms, and pricing stated in the quotation.

An order is considered accepted only when confirmed by PureBlend through an authorized written confirmation or another agreed ordering process.

We reserve the right to decline or request clarification on an order where necessary, including where product availability, compliance, payment, or delivery requirements cannot be satisfied.

## 4. Pricing and Taxes

Prices are based on the quotation or order confirmation provided to the customer.

Unless expressly stated otherwise, prices may exclude applicable taxes, duties, transportation, insurance, customs charges, and other additional costs.

Any discount, promotional offer, volume-based price, or special commercial arrangement is subject to its stated conditions and written confirmation where applicable.

We will communicate material pricing changes before confirming an affected order. Confirmed orders will be handled according to their agreed commercial terms, subject to applicable law.

## 5. Payment Terms

Payment methods, deposits, credit arrangements, due dates, and any applicable credit limits will be specified in the relevant quotation, invoice, or written agreement.

Customers agree to pay invoices in accordance with the agreed payment schedule.

Where legally permitted and applicable to the agreed terms, overdue payments may result in delayed shipments, suspension of further supply, or other contractual remedies.

Any dispute regarding an invoice should be communicated promptly with sufficient information to identify the disputed amount and reason.

## 6. Delivery and Shipping

Estimated delivery dates and lead times are provided in good faith and may depend on product availability, production schedules, transportation, customs clearance, and other circumstances beyond our reasonable control.

Delivery arrangements, shipping costs, transfer of risk, and responsibility for transportation will be determined by the relevant quotation or order confirmation.

Customers must provide accurate delivery details and ensure that the receiving location is suitable for the products ordered.

If a delivery delay or supply disruption occurs, we will communicate material updates as reasonably practicable.

## 7. Inspection and Reporting Issues

Customers should inspect delivered products and packaging promptly upon receipt.

Any visible damage, shortage, incorrect item, or apparent discrepancy should be reported to legal@pureblendchem.com within 5 business days of delivery, with supporting photographs and relevant order or batch details where appropriate.

Issues that could not reasonably have been identified during initial inspection should be reported promptly after discovery.

Nothing in this section limits rights that cannot lawfully be excluded under applicable law.

## 8. Product Quality and Handling

Products will be supplied in accordance with the applicable agreed specifications and documentation, subject to any stated tolerances and applicable legal requirements.

Customers are responsible for following the relevant storage, handling, transportation, shelf-life, and usage instructions supplied with the product.

Products must be used only for suitable applications and in accordance with applicable food safety requirements, product documentation, and local regulations.

Unless expressly agreed in writing, customers are responsible for independently validating product suitability within their own formulations, processes, and finished products.

## 9. Returns, Replacements, and Claims

Returns require prior authorization from PureBlend. Customers should not return products without receiving return instructions.

Where a verified supply defect, incorrect shipment, or nonconformity is established, the available remedy may include replacement, correction, credit, refund, or another appropriate solution, subject to the agreed contract and applicable law.

Opened, altered, improperly stored, contaminated, or incorrectly handled products may not qualify for return unless required by law or agreed in writing.

This section does not exclude remedies available under applicable consumer or commercial law.

## 10. Cancellations and Changes

Requests to cancel or modify an order must be submitted in writing and are subject to acceptance by PureBlend.

Orders involving customized specifications, specially sourced materials, production commitments, or goods already dispatched may be subject to additional restrictions or reasonable costs where permitted by law and agreed contractual terms.

Any accepted cancellation or modification will be confirmed in writing.

## 11. Limitation of Liability

To the extent permitted by applicable law, neither party will be liable to the other for indirect or consequential losses arising from a supply transaction, including loss of anticipated profits or business opportunities.

Nothing in these terms excludes or limits liability for fraud, willful misconduct, death or personal injury where exclusion is prohibited, or any other liability that cannot lawfully be excluded or limited.

Any additional liability limits must be expressly agreed in a valid written contract and comply with applicable law.

## 12. Force Majeure

Neither party will be responsible for a delay or failure to perform an obligation to the extent caused by circumstances beyond its reasonable control, such as natural disasters, epidemics, government restrictions, transportation disruptions, shortages of raw materials, or major utility failures.

The affected party should notify the other party as reasonably practicable and take reasonable steps to reduce the impact.

If the disruption continues for an extended period, the parties will discuss an appropriate solution under the applicable agreement and law.

## 13. Confidentiality

Commercially sensitive information exchanged during quotations, negotiations, and supply arrangements should be treated confidentially where the information is identified as confidential or should reasonably be understood to be confidential.

Confidential information may be disclosed where required by law or to professional advisers, service providers, or other authorized recipients who need it for legitimate business purposes and are subject to appropriate confidentiality obligations.

## 14. Intellectual Property

All trademarks, logos, website content, graphics, and other materials owned by PureBlend remain the property of their respective owners.

No intellectual property rights are transferred through a product inquiry, quotation, or purchase unless expressly agreed in writing.

## 15. Governing Law and Disputes

These terms and any related supply transaction will be governed by the laws of the State of Delaware and Federal Laws of the United States, subject to mandatory legal requirements.

The parties will first attempt to resolve disputes through good-faith discussions. If a dispute cannot be resolved informally, it will be handled by the competent courts or dispute-resolution process specified in the applicable agreement and governing law.

## 16. Changes to These Terms

We may update these terms periodically to reflect changes in our business practices, products, or legal obligations.

The version applicable to an order will be determined by the agreed contractual terms and applicable law. The latest version will be published on this website with its revision date.

## 17. Contact Us

For questions about these Terms of Supply, quotations, orders, or product-related concerns, contact:

**PureBlend Food Chemicals**  
Email: orders@pureblendchem.com  
Phone: +1 800-555-PURE  
Address: 450 Innovation Parkway, Bioscience Industrial Park, Suite 400, Chicago, IL 60611  
Website: https://pureblend-food-chemicals.ai.studio`;

const SECTIONS = [
  { id: '1-introduction', title: '1. Introduction' },
  { id: '2-products-and-specifications', title: '2. Products & Specifications' },
  { id: '3-quotations-and-orders', title: '3. Quotations & Orders' },
  { id: '4-pricing-and-taxes', title: '4. Pricing & Taxes' },
  { id: '5-payment-terms', title: '5. Payment Terms' },
  { id: '6-delivery-and-shipping', title: '6. Delivery & Shipping' },
  { id: '7-inspection-and-reporting-issues', title: '7. Inspection & Claims' },
  { id: '8-product-quality-and-handling', title: '8. Quality & Handling' },
  { id: '9-returns-replacements-and-claims', title: '9. Returns & Remedies' },
  { id: '10-cancellations-and-changes', title: '10. Cancellations' },
  { id: '11-limitation-of-liability', title: '11. Limitation of Liability' },
  { id: '12-force-majeure', title: '12. Force Majeure' },
  { id: '13-confidentiality', title: '13. Confidentiality' },
  { id: '14-intellectual-property', title: '14. Intellectual Property' },
  { id: '15-governing-law-and-disputes', title: '15. Governing Law' },
  { id: '16-changes-to-these-terms', title: '16. Amendments' },
  { id: '17-contact-us', title: '17. Contact Information' }
];

export default function TermsOfSupplyPage() {
  const [isRfqOpen, setIsRfqOpen] = useState(false);

  const slugify = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <PublicLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs items={[{ label: 'Legal & Compliance', href: '/terms-of-supply' }, { label: 'Terms of Supply' }]} />

        {/* Page Header Hero */}
        <div className="my-6 pb-6 border-b border-border-subtle">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-primary-green bg-soft-green px-2.5 py-0.5 rounded border border-[#cbe2d4]">
                  COMMERCIAL GOVERNANCE
                </span>
                <span className="text-xs font-mono text-secondary-text">
                  Doc Ref: PB-TOS-2026-V2
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-charcoal tracking-tight">
                Terms of Supply
              </h1>
              <p className="text-sm text-secondary-text mt-2 max-w-3xl leading-relaxed">
                General commercial terms, lot certification requirements, order confirmations, and regulatory standards for industrial raw food ingredients supplied by PureBlend Food Chemicals.
              </p>
            </div>

            {/* Quick Actions & Document Toggle */}
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <Link
                href="/privacy-policy"
                className="text-xs font-semibold px-3 py-2 rounded-lg border border-border-subtle bg-white text-charcoal hover:bg-soft-green/50 hover:text-forest transition-colors"
              >
                View Privacy Policy
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrint}
                leftIcon={<Printer className="w-3.5 h-3.5" />}
                className="text-xs"
              >
                Print / Save PDF
              </Button>
            </div>
          </div>

          {/* Key Summary Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
            <div className="bg-white p-3 rounded-lg border border-border-subtle flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-primary-green shrink-0" />
              <div>
                <p className="text-[10px] font-mono text-secondary-text uppercase">Effective Date</p>
                <p className="text-xs font-bold text-charcoal">October 11, 2026</p>
              </div>
            </div>
            <div className="bg-white p-3 rounded-lg border border-border-subtle flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <div>
                <p className="text-[10px] font-mono text-secondary-text uppercase">Quality Standard</p>
                <p className="text-xs font-bold text-charcoal">FCC XIII / USP Monograph</p>
              </div>
            </div>
            <div className="bg-white p-3 rounded-lg border border-border-subtle flex items-center gap-2.5">
              <Truck className="w-4 h-4 text-primary-green shrink-0" />
              <div>
                <p className="text-[10px] font-mono text-secondary-text uppercase">Inspection Window</p>
                <p className="text-xs font-bold text-charcoal">5 Business Days</p>
              </div>
            </div>
            <div className="bg-white p-3 rounded-lg border border-border-subtle flex items-center gap-2.5">
              <Scale className="w-4 h-4 text-primary-green shrink-0" />
              <div>
                <p className="text-[10px] font-mono text-secondary-text uppercase">Jurisdiction</p>
                <p className="text-xs font-bold text-charcoal">State of Delaware, US</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Layout with Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start my-8">
          {/* Sticky Table of Contents (Desktop) */}
          <aside className="hidden lg:block lg:col-span-3 sticky top-28 space-y-4">
            <div className="bg-white rounded-xl border border-border-subtle p-4 shadow-xs">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-charcoal mb-3 flex items-center gap-1.5 pb-2 border-b border-border-subtle">
                <FileText className="w-3.5 h-3.5 text-primary-green" />
                Table of Contents
              </h3>
              <nav className="space-y-1 max-h-[60vh] overflow-y-auto pr-1">
                {SECTIONS.map((sec) => (
                  <a
                    key={sec.id}
                    href={`#${sec.id}`}
                    className="block text-xs py-1.5 px-2 rounded hover:bg-soft-green/70 hover:text-forest text-secondary-text transition-colors truncate"
                  >
                    {sec.title}
                  </a>
                ))}
              </nav>
            </div>

            {/* Direct Support Box */}
            <div className="bg-forest text-white rounded-xl p-4 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider font-mono text-emerald-300">
                Commercial Inquiries
              </h4>
              <p className="text-xs text-[#cbdad1] leading-relaxed">
                Need enterprise MSA adjustments, standing FTL contract riders, or custom COA requirements?
              </p>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsRfqOpen(true)}
                className="w-full text-xs justify-center bg-primary-green hover:bg-emerald-600 text-white font-bold"
              >
                Request Custom Quotation
              </Button>
            </div>
          </aside>

          {/* Main Legal Document Body */}
          <main className="lg:col-span-9">
            <div className="bg-white rounded-xl border border-border-subtle p-6 sm:p-10 shadow-xs">
              <ReactMarkdown
                components={{
                  h1: ({ children }) => (
                    <div className="pb-4 mb-6 border-b border-border-subtle">
                      <h1 className="text-2xl sm:text-3xl font-black text-forest tracking-tight">
                        {children}
                      </h1>
                    </div>
                  ),
                  h2: ({ children }) => {
                    const text = String(children);
                    const id = slugify(text);
                    return (
                      <div id={id} className="scroll-mt-28 mt-8 mb-4 pt-6 border-t border-border-subtle/70">
                        <h2 className="text-lg sm:text-xl font-bold text-forest tracking-tight flex items-center gap-2">
                          <span className="w-1.5 h-5 bg-primary-green rounded-full shrink-0 inline-block" />
                          <span>{children}</span>
                        </h2>
                      </div>
                    );
                  },
                  h3: ({ children }) => (
                    <h3 className="text-sm font-bold text-charcoal mt-4 mb-2">
                      {children}
                    </h3>
                  ),
                  p: ({ children }) => (
                    <p className="text-sm text-secondary-text leading-relaxed mb-3.5">
                      {children}
                    </p>
                  ),
                  ul: ({ children }) => (
                    <ul className="space-y-1.5 mb-4 pl-5 list-disc text-sm text-secondary-text marker:text-primary-green">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="space-y-1.5 mb-4 pl-5 list-decimal text-sm text-secondary-text marker:text-primary-green">
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => (
                    <li className="leading-relaxed pl-1">{children}</li>
                  ),
                  strong: ({ children }) => (
                    <strong className="text-charcoal font-bold">{children}</strong>
                  ),
                  a: ({ href, children }) => (
                    <a
                      href={href}
                      className="text-primary-green hover:underline font-semibold"
                      target={href?.startsWith('http') ? '_blank' : undefined}
                      rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                    >
                      {children}
                    </a>
                  )
                }}
              >
                {markdownContent}
              </ReactMarkdown>

              {/* Bottom Sign-off Box */}
              <div className="mt-10 p-5 rounded-lg bg-soft-green/60 border border-[#cbe2d4] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-xs font-bold text-forest uppercase tracking-wider font-mono">
                    Official Document Dispatch
                  </p>
                  <p className="text-xs text-secondary-text">
                    PureBlend Food Chemicals Legal & Regulatory Division. ISO 22000 & FSSC 22000 Certified Supplier.
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <a
                    href="mailto:orders@pureblendchem.com"
                    className="text-xs font-bold text-forest bg-white px-3 py-1.5 rounded border border-[#cbe2d4] hover:bg-forest hover:text-white transition-colors"
                  >
                    Contact Legal Desk
                  </a>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      <RFQModal isOpen={isRfqOpen} onClose={() => setIsRfqOpen(false)} />
    </PublicLayout>
  );
}
