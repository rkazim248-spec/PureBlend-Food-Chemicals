'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Package, 
  FileSpreadsheet, 
  FileCheck2, 
  Tag, 
  ArrowUpRight, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  ShieldCheck,
  TrendingUp,
  Download
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/components/ui/Toast';
import { PRODUCTS_DATA, INITIAL_RFQS, QUALITY_BATCH_DOCS, OFFERS_DATA } from '@/data/mockData';

export default function AdminDashboardPage() {
  const { showToast } = useToast();
  const [rfqs, setRfqs] = useState(INITIAL_RFQS);

  const handleUpdateStatus = (id: string, newStatus: any) => {
    setRfqs((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
    showToast({
      title: 'Status Updated',
      description: `${id} transitioned to "${newStatus}"`,
      type: 'success'
    });
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Overview Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-bold text-primary-green uppercase tracking-wider">
            Commercial & Operations Control
          </span>
          <h1 className="text-2xl font-black text-charcoal tracking-tight mt-0.5">
            Operations & Sourcing Overview
          </h1>
          <p className="text-xs text-secondary-text mt-1">
            Real-time status of catalog SKUs, commercial RFQ submissions, and laboratory release logs.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/admin/products">
            <Button variant="outline" size="sm" className="text-xs">
              Manage Products
            </Button>
          </Link>
          <Link href="/admin/rfqs">
            <Button variant="primary" size="sm" className="text-xs">
              View All RFQs
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-border-subtle p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-secondary-text uppercase tracking-wider">Active SKUs</span>
            <div className="w-8 h-8 rounded bg-soft-green text-forest flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-charcoal font-mono">{PRODUCTS_DATA.length}</span>
            <span className="text-xs font-medium text-emerald-600">FCC Standard</span>
          </div>
          <p className="text-[11px] text-secondary-text mt-1">All monographs published & verified</p>
        </div>

        <div className="bg-white rounded-lg border border-border-subtle p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-secondary-text uppercase tracking-wider">Open RFQs</span>
            <div className="w-8 h-8 rounded bg-amber-50 text-amber-700 flex items-center justify-center">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-charcoal font-mono">{rfqs.length}</span>
            <span className="text-xs font-medium text-amber-700">Requires Review</span>
          </div>
          <p className="text-[11px] text-secondary-text mt-1">Avg quotation turn: 14 hours</p>
        </div>

        <div className="bg-white rounded-lg border border-border-subtle p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-secondary-text uppercase tracking-wider">Released Lots</span>
            <div className="w-8 h-8 rounded bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <FileCheck2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-charcoal font-mono">{QUALITY_BATCH_DOCS.length}</span>
            <span className="text-xs font-medium text-emerald-600">100% Passed</span>
          </div>
          <p className="text-[11px] text-secondary-text mt-1">ICP-MS and assay compliance verified</p>
        </div>

        <div className="bg-white rounded-lg border border-border-subtle p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-secondary-text uppercase tracking-wider">Volume Contracts</span>
            <div className="w-8 h-8 rounded bg-purple-50 text-purple-700 flex items-center justify-center">
              <Tag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-charcoal font-mono">{OFFERS_DATA.length}</span>
            <span className="text-xs font-medium text-purple-700">Active Terms</span>
          </div>
          <p className="text-[11px] text-secondary-text mt-1">Q4 index pricing locked</p>
        </div>
      </div>

      {/* Recent RFQs Pipeline Table */}
      <div className="bg-white rounded-lg border border-border-subtle shadow-xs overflow-hidden">
        <div className="p-5 border-b border-border-subtle flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-charcoal">Recent Commercial Quotation Requests</h2>
            <p className="text-xs text-secondary-text mt-0.5">Incoming RFQ inquiries pending sales engineering calculations.</p>
          </div>
          <Link href="/admin/rfqs" className="text-xs font-semibold text-forest hover:underline flex items-center gap-1">
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-warm-white border-b border-border-subtle text-secondary-text font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">RFQ Ref</th>
                <th className="py-3 px-4">Company & Buyer</th>
                <th className="py-3 px-4">Ingredient Requested</th>
                <th className="py-3 px-4">Target Volume</th>
                <th className="py-3 px-4">Incoterm</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {rfqs.map((rfq) => {
                const statusStyles = {
                  'Pending Review': 'warning',
                  'Technical Review': 'forest',
                  'Quote Issued': 'success',
                  'Contract Drafted': 'success'
                }[rfq.status] as any;

                return (
                  <tr key={rfq.id} className="hover:bg-warm-white/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-charcoal">
                      {rfq.id}
                    </td>
                    <td className="py-3 px-4">
                      <strong className="text-charcoal block">{rfq.companyName}</strong>
                      <span className="text-secondary-text text-[11px]">{rfq.contactName} ({rfq.email})</span>
                    </td>
                    <td className="py-3 px-4 font-medium text-charcoal">
                      {rfq.productName}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-forest">
                      {rfq.requiredVolume} {rfq.volumeUnit}
                    </td>
                    <td className="py-3 px-4 font-mono text-secondary-text">
                      {rfq.incoterm}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={statusStyles || 'neutral'}>
                        {rfq.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <select
                        value={rfq.status}
                        onChange={(e) => handleUpdateStatus(rfq.id, e.target.value)}
                        className="text-[11px] rounded border border-border-subtle bg-white px-2 py-1 font-medium text-charcoal hover:border-slate-400 focus:outline-none"
                      >
                        <option value="Pending Review">Pending</option>
                        <option value="Technical Review">Tech Review</option>
                        <option value="Quote Issued">Quote Issued</option>
                        <option value="Contract Drafted">Contract</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quality Release & Lab Verification Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-border-subtle p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-border-subtle pb-3">
            <div className="flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-primary-green" />
              <h3 className="text-sm font-bold text-charcoal">Latest Lot COA Releases</h3>
            </div>
            <Link href="/admin/quality" className="text-xs font-semibold text-primary-green hover:underline">
              Registry →
            </Link>
          </div>

          <div className="space-y-3">
            {QUALITY_BATCH_DOCS.map((doc) => (
              <div key={doc.id} className="p-3 rounded bg-warm-white border border-border-subtle text-xs flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-charcoal">{doc.batchNumber}</span>
                    <Badge variant="success">Passed</Badge>
                  </div>
                  <p className="text-secondary-text mt-0.5">{doc.productName}</p>
                  <p className="text-[11px] font-mono text-forest mt-0.5">{doc.assayResult}</p>
                </div>
                <div className="text-right text-[11px] text-secondary-text">
                  <span>Released: {doc.releaseDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Operations & Compliance Status */}
        <div className="bg-white rounded-lg border border-border-subtle p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-border-subtle pb-3">
            <ShieldCheck className="w-4 h-4 text-primary-green" />
            <h3 className="text-sm font-bold text-charcoal">Quality & Regulatory Audit Checklist</h3>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between p-2 rounded bg-emerald-50/50 border border-emerald-200/50">
              <span className="font-medium text-emerald-900">FCC 13 Monograph Verification</span>
              <span className="font-mono font-bold text-emerald-700">COMPLIANT</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-emerald-50/50 border border-emerald-200/50">
              <span className="font-medium text-emerald-900">Heavy Metals ICP-MS Screening</span>
              <span className="font-mono font-bold text-emerald-700">VERIFIED</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-emerald-50/50 border border-emerald-200/50">
              <span className="font-medium text-emerald-900">ISO 22000 Warehouse Audits</span>
              <span className="font-mono font-bold text-emerald-700">ACTIVE</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-emerald-50/50 border border-emerald-200/50">
              <span className="font-medium text-emerald-900">GS1 Barcode Pallet Traceability</span>
              <span className="font-mono font-bold text-emerald-700">ONLINE</span>
            </div>
          </div>

          <p className="text-[11px] text-secondary-text pt-2 leading-relaxed">
            All records archived in compliance with FDA Food Safety Modernization Act (FSMA) Section 204 traceability recordkeeping requirements.
          </p>
        </div>
      </div>
    </div>
  );
}
