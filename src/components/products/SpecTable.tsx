import React from 'react';
import { Product } from '@/types';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';

export function SpecTable({ product }: { product: Product }) {
  const specs = [
    { label: 'Chemical Identity', value: product.name },
    { label: 'Internal Product Code', value: product.code },
    { label: 'Chemical Formula', value: product.chemicalFormula },
    { label: 'Molecular Weight', value: product.molecularWeight },
    { label: 'CAS Registry Number', value: product.casNumber },
    { label: 'INS / Food Additive Code', value: product.insNumber },
    { label: 'Pharmacopeia Grade', value: product.grade },
    { label: 'Physical Appearance', value: product.appearance },
    { label: 'Assay (Purity Specification)', value: product.purity, highlight: true },
    ...(product.phValue ? [{ label: 'pH Profile', value: product.phValue }] : []),
    ...(product.moistureContent ? [{ label: 'Moisture / Loss on Drying', value: product.moistureContent }] : []),
    ...(product.meshSize ? [{ label: 'Particle Granulometry (Mesh)', value: product.meshSize }] : []),
    ...(product.heavyMetals ? [{ label: 'Heavy Metals Limit', value: product.heavyMetals }] : []),
    { label: 'Standard Shelf Life', value: product.shelfLife },
    { label: 'Storage & Warehousing', value: product.storageCondition }
  ];

  return (
    <div className="space-y-6">
      {/* Spec Table */}
      <div className="overflow-x-auto rounded-lg border border-border-subtle bg-white">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-warm-white border-b border-border-subtle text-[11px] font-semibold text-charcoal uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4 sm:px-6 w-1/3">Parameter</th>
              <th className="py-3 px-4 sm:px-6">Monograph Specification Limit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {specs.map((spec) => (
              <tr key={spec.label} className="hover:bg-warm-white/60 transition-colors">
                <td className="py-3 px-4 sm:px-6 font-medium text-secondary-text">
                  {spec.label}
                </td>
                <td className={`py-3 px-4 sm:px-6 font-mono text-xs sm:text-sm ${spec.highlight ? 'font-bold text-forest' : 'text-charcoal'}`}>
                  {spec.value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Packaging & Logistics Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-lg border border-border-subtle bg-white space-y-2">
          <h4 className="text-xs font-bold text-charcoal uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-forest" />
            <span>Industrial Packaging Formats</span>
          </h4>
          <ul className="text-xs text-secondary-text space-y-1.5 pt-1">
            {product.packagingOptions.map((opt, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-primary-green shrink-0">▪</span>
                <span>{opt}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-4 rounded-lg border border-border-subtle bg-white space-y-2">
          <h4 className="text-xs font-bold text-charcoal uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-primary-green" />
            <span>Quality Accreditations</span>
          </h4>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {product.certifications.map((cert) => (
              <span
                key={cert}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded border border-[#cfe0d5] bg-soft-green text-forest font-medium text-xs"
              >
                <CheckCircle2 className="w-3 h-3 text-primary-green" />
                <span>{cert}</span>
              </span>
            ))}
          </div>
          <p className="text-[11px] text-secondary-text pt-2 border-t border-border-subtle">
            Minimum Commercial Order: <strong className="text-charcoal">{product.minOrderQuantity}</strong> · Standard Lead Time: <strong className="text-charcoal">{product.standardLeadTime}</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
