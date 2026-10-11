import React from 'react';
import Link from 'next/link';
import { PureBlendLogo } from '@/components/ui/PureBlendLogo';
import { ShieldCheck, Award } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#0D211A] text-[#cbdad1] border-t border-[#1b3d32] text-sm">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <PureBlendLogo variant="dark" size="md" />
            </Link>
            <p className="text-xs text-[#9ebcb0] leading-relaxed max-w-sm">
              Reliable Ingredients for Better Food Solutions. Institutional purity engineered for global food science leaders.
            </p>

            <div className="pt-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#16382D] border border-[#235343] text-xs text-emerald-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-mono text-[11px] font-semibold">ISO 22000 & FSSC 22000 Facility</span>
              </div>
            </div>
          </div>

          {/* PRODUCTS Column */}
          <div>
            <h4 className="text-[11px] font-mono font-bold text-white uppercase tracking-wider mb-3.5">
              PRODUCTS
            </h4>
            <ul className="space-y-2 text-xs text-[#9ebcb0]">
              <li>
                <Link href="/products?category=Acidulants" className="hover:text-white transition-colors">
                  Acidulants
                </Link>
              </li>
              <li>
                <Link href="/products?category=Hydrocolloids%20%26%20Stabilizers" className="hover:text-white transition-colors">
                  Hydrocolloids & Stabilizers
                </Link>
              </li>
              <li>
                <Link href="/products?category=Preservatives" className="hover:text-white transition-colors">
                  Preservatives & Antioxidants
                </Link>
              </li>
              <li>
                <Link href="/products?category=Flavor%20Enhancers%20%26%20Sweeteners" className="hover:text-white transition-colors">
                  Emulsifiers & Phosphates
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-white transition-colors">
                  Clean Label Extracts
                </Link>
              </li>
              <li>
                <Link href="/products?category=Leavening%20%26%20Buffering%20Agents" className="hover:text-white transition-colors">
                  Phosphates & Mineral Salts
                </Link>
              </li>
            </ul>
          </div>

          {/* SOLUTIONS Column */}
          <div>
            <h4 className="text-[11px] font-mono font-bold text-white uppercase tracking-wider mb-3.5">
              SOLUTIONS
            </h4>
            <ul className="space-y-2 text-xs text-[#9ebcb0]">
              <li>
                <Link href="/solutions#bakery-preservation" className="hover:text-white transition-colors">
                  Bakery & Milling
                </Link>
              </li>
              <li>
                <Link href="/solutions#beverage-systems" className="hover:text-white transition-colors">
                  Beverage Formulations
                </Link>
              </li>
              <li>
                <Link href="/solutions" className="hover:text-white transition-colors">
                  Dairy & Plant Alternatives
                </Link>
              </li>
              <li>
                <Link href="/solutions" className="hover:text-white transition-colors">
                  Confectionery & Sweet Goods
                </Link>
              </li>
              <li>
                <Link href="/solutions#meat-processing" className="hover:text-white transition-colors">
                  Meat & Savory Processing
                </Link>
              </li>
            </ul>
          </div>

          {/* COMPANY & DIRECT CONTACT Column */}
          <div className="space-y-6">
            <div>
              <h4 className="text-[11px] font-mono font-bold text-white uppercase tracking-wider mb-3.5">
                COMPANY & RESOURCES
              </h4>
              <ul className="space-y-2 text-xs text-[#9ebcb0]">
                <li>
                  <Link href="/about" className="hover:text-white transition-colors">
                    About PureBlend
                  </Link>
                </li>
                <li>
                  <Link href="/offers" className="hover:text-white transition-colors">
                    Offers & Spot Contracts
                  </Link>
                </li>
                <li>
                  <Link href="/faqs" className="hover:text-white transition-colors">
                    FAQs
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-white transition-colors">
                    Compliance & Certifications
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-[11px] font-mono font-bold text-white uppercase tracking-wider mb-2">
                DIRECT CONTACT
              </h4>
              <div className="text-xs text-[#9ebcb0] space-y-1">
                <p>
                  <strong className="text-white block text-[11px]">Technical Sales Desk</strong>
                  <a href="mailto:technical@pureblendchem.com" className="hover:text-white font-mono">
                    technical@pureblendchem.com
                  </a>
                </p>
                <p>
                  <strong className="text-white block text-[11px] mt-1.5">Emergency Hotline</strong>
                  <span className="font-mono text-emerald-400 font-bold">+1 800-555-PURE</span>
                </p>
                <p className="text-[11px] text-[#789a8c] mt-1">
                  450 Innovation Parkway, Bioscience Park
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Legal bar */}
        <div className="mt-12 pt-8 border-t border-[#1b3d32] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#7d9e90]">
          <p>© 2026 PureBlend Food Chemicals Corp. All rights reserved.</p>
          <div className="flex items-center gap-6 text-[11px]">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms-of-supply" className="hover:text-white transition-colors">
              Terms of Supply
            </Link>
            <Link href="/admin/quality" className="hover:text-white transition-colors flex items-center gap-1 text-emerald-300">
              <Award className="w-3.5 h-3.5" />
              <span>Batch Traceability Portal</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
