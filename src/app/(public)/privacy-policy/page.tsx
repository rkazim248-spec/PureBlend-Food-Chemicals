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
  Clock, 
  Lock, 
  Eye, 
  Mail, 
  Phone, 
  MapPin, 
  UserCheck, 
  Database, 
  Globe2,
  Scale
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const markdownContent = `# Privacy Policy

**Last Updated:** October 11, 2026

## 1. Introduction

PureBlend Food Chemicals (“PureBlend,” “we,” “our,” or “us”) respects your privacy and is committed to handling personal information responsibly.

This Privacy Policy explains how we collect, use, store, disclose, and protect information when you visit our website, contact us, request a quotation, submit a product inquiry, or interact with our business services.

By using our website, you acknowledge that you have had the opportunity to read this policy. Where consent is legally required, we will request it separately.

## 2. Information We Collect

Depending on how you interact with us, we may collect the following categories of information:

### Personal and contact information

- Name and job title.
- Business or organization name.
- Email address.
- Telephone number.
- Business address and delivery address.
- Information you provide when contacting our team.

### Business and inquiry information

- Product interests and requirements.
- Quotation and order details.
- Requested quantities and delivery preferences.
- Technical questions and product specifications you submit.
- Communications and correspondence with our team.

### Technical information

When you visit the website, certain technical information may be collected, depending on the services and tools enabled, including:

- IP address.
- Browser and device information.
- Pages visited and approximate interaction data.
- Referring pages and diagnostic information.
- Cookies or similar technologies, where used.

### Information from third parties

We may receive relevant business contact or transaction information from authorized service providers, business partners, or other sources where permitted by applicable law.

We do not intentionally request sensitive personal information unless it is necessary for a legitimate purpose and can lawfully be collected.

## 3. How We Use Information

We may use collected information to:

- Respond to product inquiries and quotation requests.
- Prepare quotations and process orders.
- Communicate about deliveries, documentation, and customer support.
- Provide relevant product specifications and certificates where applicable.
- Maintain and improve our website and services.
- Diagnose errors, prevent abuse, and protect website security.
- Maintain business, accounting, and transaction records.
- Meet legal, regulatory, and contractual obligations.
- Send business updates or marketing communications where permitted and, when required, with your consent.

We will not use personal information for purposes that are incompatible with the reasons it was collected unless permitted by law or otherwise appropriately authorized.

## 4. Legal Grounds for Processing

Where applicable data protection law requires a legal basis, we may process personal information on one or more of the following grounds:

- **Contract:** To respond to requests, prepare or perform a contract, or take steps requested before entering a contract.
- **Legitimate interests:** To operate our business, manage customer relationships, maintain security, and improve our services, provided those interests do not override applicable individual rights.
- **Consent:** Where you have provided consent for a specific purpose, such as certain marketing communications or optional cookies.
- **Legal obligations:** To comply with applicable laws, regulations, and lawful requests.

The legal basis will depend on the specific processing activity and the laws applicable to the individual and transaction.

## 5. Cookies and Similar Technologies

Our website may use essential cookies and similar technologies to support core functionality, security, and user preferences.

If analytics, advertising, or other nonessential tracking technologies are enabled, we will handle them in accordance with applicable consent and disclosure requirements.

You may be able to control cookies through your browser settings or the website's cookie preferences, where available. Disabling certain cookies may affect website functionality.

## 6. How We Share Information

We do not sell personal information as part of our ordinary business practices.

We may share information with the following categories of recipients when necessary and permitted by law:

- Hosting and website infrastructure providers.
- Email, communication, and customer-support services.
- Business, accounting, and order-management service providers.
- Delivery, shipping, and logistics partners.
- Professional advisers, auditors, and insurers.
- Regulators, courts, law enforcement, or other authorities where legally required.
- A successor or relevant party involved in a business restructuring or transfer, subject to applicable legal safeguards.

Service providers should receive only the information reasonably necessary for their assigned purposes and be subject to appropriate contractual or legal safeguards.

## 7. Data Retention

We retain personal information only for as long as reasonably necessary for the purposes described in this policy, including providing services, maintaining business records, resolving disputes, and complying with legal obligations.

Retention periods may differ depending on the type of information and applicable requirements.

When information is no longer required, we will take reasonable steps to delete it, anonymize it, or securely dispose of it, subject to applicable law and legitimate recordkeeping needs.

## 8. Data Security

We use reasonable technical and organizational safeguards designed to protect personal information from unauthorized access, loss, alteration, disclosure, or misuse.

No internet transmission or electronic storage system can be guaranteed to be completely secure. We therefore cannot promise absolute security.

If a data incident occurs, we will take appropriate steps in accordance with applicable legal requirements.

## 9. International Data Transfers

Our website or service providers may process information in countries other than the country where you are located.

Where applicable law requires safeguards for international transfers, we will take appropriate measures intended to protect the information and support lawful transfers.

## 10. Your Privacy Rights

Depending on your location and applicable law, you may have the right to:

- Request access to personal information we hold about you.
- Request correction of inaccurate information.
- Request deletion of certain information.
- Object to or request restrictions on certain processing.
- Withdraw consent where processing relies on consent.
- Request a copy of certain information in a portable format.
- Opt out of marketing communications.
- Submit a complaint to a relevant data protection authority where applicable.

These rights are subject to legal conditions and exceptions.

To submit a request, contact us using the details below. We may need to verify your identity before processing the request.

## 11. Marketing Communications

We may send business-related communications about products, services, quotations, and relevant updates where permitted by law.

You can opt out of promotional emails using the unsubscribe instructions included in the message or by contacting us directly.

Even after opting out, we may still send essential non-promotional communications about existing inquiries, transactions, orders, or legal obligations.

## 12. Third-Party Websites and Services

Our website may contain links to external websites or use third-party services.

Those websites and services may have their own privacy policies and practices. We are not responsible for the privacy practices of independent third parties.

We encourage you to review their privacy notices before providing information directly to them.

## 13. Children's Privacy

Our website and business services are intended for business customers and general adult audiences, not specifically for children.

We do not knowingly collect children's personal information in circumstances where doing so would violate applicable law. If you believe a child has provided personal information improperly, contact us so we can assess and address the matter.

## 14. Changes to This Privacy Policy

We may update this Privacy Policy when our business practices, technologies, service providers, or legal requirements change.

Updates will be published on this page with a revised “Last Updated” date. Where required by law, we will provide additional notice or seek consent for material changes.

## 15. Contact Us

For privacy questions, requests, or concerns, contact:

**PureBlend Food Chemicals**  
Privacy Contact: PureBlend Data Protection & Legal Compliance Desk  
Email: privacy@pureblendchem.com  
Phone: +1 800-555-PURE  
Address: 450 Innovation Parkway, Bioscience Industrial Park, Suite 400, Chicago, IL 60611  
Website: https://pureblend-food-chemicals.ai.studio`;

const SECTIONS = [
  { id: '1-introduction', title: '1. Introduction' },
  { id: '2-information-we-collect', title: '2. Information We Collect' },
  { id: '3-how-we-use-information', title: '3. How We Use Information' },
  { id: '4-legal-grounds-for-processing', title: '4. Legal Grounds' },
  { id: '5-cookies-and-similar-technologies', title: '5. Cookies & Tracking' },
  { id: '6-how-we-share-information', title: '6. Information Sharing' },
  { id: '7-data-retention', title: '7. Data Retention' },
  { id: '8-data-security', title: '8. Data Security' },
  { id: '9-international-data-transfers', title: '9. International Transfers' },
  { id: '10-your-privacy-rights', title: '10. Your Privacy Rights' },
  { id: '11-marketing-communications', title: '11. Communications' },
  { id: '12-third-party-websites-and-services', title: '12. Third-Party Services' },
  { id: '13-childrens-privacy', title: "13. Children's Privacy" },
  { id: '14-changes-to-this-privacy-policy', title: '14. Policy Updates' },
  { id: '15-contact-us', title: '15. Contact Us' }
];

export default function PrivacyPolicyPage() {
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
        <Breadcrumbs items={[{ label: 'Legal & Compliance', href: '/terms-of-supply' }, { label: 'Privacy Policy' }]} />

        {/* Page Header Hero */}
        <div className="my-6 pb-6 border-b border-border-subtle">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-primary-green bg-soft-green px-2.5 py-0.5 rounded border border-[#cbe2d4]">
                  DATA PRIVACY & COMPLIANCE
                </span>
                <span className="text-xs font-mono text-secondary-text">
                  Doc Ref: PB-PRV-2026-V2
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-charcoal tracking-tight">
                Privacy Policy
              </h1>
              <p className="text-sm text-secondary-text mt-2 max-w-3xl leading-relaxed">
                Information handling, confidentiality, data security protocols, and international privacy rights for enterprise procurement agents, formulation engineers, and website visitors.
              </p>
            </div>

            {/* Quick Actions & Document Toggle */}
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <Link
                href="/terms-of-supply"
                className="text-xs font-semibold px-3 py-2 rounded-lg border border-border-subtle bg-white text-charcoal hover:bg-soft-green/50 hover:text-forest transition-colors"
              >
                View Terms of Supply
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
              <Lock className="w-4 h-4 text-emerald-600 shrink-0" />
              <div>
                <p className="text-[10px] font-mono text-secondary-text uppercase">Data Protection</p>
                <p className="text-xs font-bold text-charcoal">GDPR / CCPA Compliant</p>
              </div>
            </div>
            <div className="bg-white p-3 rounded-lg border border-border-subtle flex items-center gap-2.5">
              <UserCheck className="w-4 h-4 text-primary-green shrink-0" />
              <div>
                <p className="text-[10px] font-mono text-secondary-text uppercase">Third-Party Sale</p>
                <p className="text-xs font-bold text-charcoal">No Data Selling</p>
              </div>
            </div>
            <div className="bg-white p-3 rounded-lg border border-border-subtle flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-primary-green shrink-0" />
              <div>
                <p className="text-[10px] font-mono text-secondary-text uppercase">Infrastructure</p>
                <p className="text-xs font-bold text-charcoal">TLS 1.3 & AES-256</p>
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

            {/* Direct Data Officer Contact Card */}
            <div className="bg-forest text-white rounded-xl p-4 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider font-mono text-emerald-300">
                Privacy Officer Desk
              </h4>
              <p className="text-xs text-[#cbdad1] leading-relaxed">
                Submit data subject access requests (DSAR) or enterprise confidentiality questions directly to our compliance officer.
              </p>
              <a
                href="mailto:privacy@pureblendchem.com"
                className="w-full text-xs font-semibold py-2 px-3 rounded-lg bg-primary-green hover:bg-emerald-600 text-white flex items-center justify-center gap-1.5 transition-colors"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>privacy@pureblendchem.com</span>
              </a>
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
                    <h3 className="text-sm font-bold text-charcoal mt-5 mb-2">
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
                    Data Controller & Governance
                  </p>
                  <p className="text-xs text-secondary-text">
                    PureBlend Food Chemicals Legal & Compliance Division. Chicago, IL, United States.
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <a
                    href="mailto:privacy@pureblendchem.com"
                    className="text-xs font-bold text-forest bg-white px-3 py-1.5 rounded border border-[#cbe2d4] hover:bg-forest hover:text-white transition-colors"
                  >
                    Submit Data Request
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
