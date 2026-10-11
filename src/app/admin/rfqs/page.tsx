'use client';

import React, { useState, useMemo } from 'react';
import { INITIAL_RFQS } from '@/data/mockData';
import { RFQSubmission } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import { 
  Search, 
  Eye, 
  FileCheck, 
  Mail, 
  Clock, 
  CheckCircle2, 
  FileSpreadsheet,
  Download
} from 'lucide-react';

export default function AdminRFQsPage() {
  const { showToast } = useToast();
  const [rfqs, setRfqs] = useState<RFQSubmission[]>(INITIAL_RFQS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRfq, setSelectedRfq] = useState<RFQSubmission | null>(null);

  const filteredRfqs = useMemo(() => {
    return rfqs.filter((r) => {
      if (statusFilter !== 'all' && r.status !== statusFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          r.id.toLowerCase().includes(q) ||
          r.companyName.toLowerCase().includes(q) ||
          r.contactName.toLowerCase().includes(q) ||
          r.productName.toLowerCase().includes(q) ||
          r.email.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [rfqs, searchQuery, statusFilter]);

  const handleUpdateStatus = (id: string, newStatus: any) => {
    setRfqs((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
    if (selectedRfq && selectedRfq.id === id) {
      setSelectedRfq((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
    showToast({
      title: 'Status Updated',
      description: `Quotation request ${id} updated to ${newStatus}.`,
      type: 'success'
    });
  };

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['RFQ ID,Company,Contact,Email,Product,Volume,Unit,Incoterm,Status']
        .concat(
          rfqs.map(
            (r) =>
              `${r.id},"${r.companyName}","${r.contactName}",${r.email},"${r.productName}",${r.requiredVolume},${r.volumeUnit},${r.incoterm},${r.status}`
          )
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `PureBlend_RFQs_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast({
      title: 'CSV Export Generated',
      description: 'Quotation records exported for ERP review.',
      type: 'info'
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-bold text-primary-green uppercase tracking-wider">
            Commercial Pipeline
          </span>
          <h1 className="text-2xl font-black text-charcoal tracking-tight mt-0.5">
            Quotation Requests & Tender RFQs
          </h1>
          <p className="text-xs text-secondary-text mt-1">
            Review buyer volume inquiries, calculate pricing tiers, and issue formal contract terms.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleExportCSV}
          leftIcon={<Download className="w-4 h-4" />}
        >
          Export RFQs as CSV
        </Button>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-white rounded-lg border border-border-subtle p-4 shadow-xs flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input
            placeholder="Search RFQs by company, buyer name, product, or ref..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>
        <div className="sm:w-56">
          <Select
            options={[
              { value: 'all', label: 'All Quotation Statuses' },
              { value: 'Pending Review', label: 'Pending Review' },
              { value: 'Technical Review', label: 'Technical Review' },
              { value: 'Quote Issued', label: 'Quote Issued' },
              { value: 'Contract Drafted', label: 'Contract Drafted' }
            ]}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          />
        </div>
      </div>

      {/* RFQ Table */}
      <div className="bg-white rounded-lg border border-border-subtle shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-warm-white border-b border-border-subtle text-secondary-text font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Ref Number</th>
                <th className="py-3 px-4">Logged Date</th>
                <th className="py-3 px-4">Company & Buyer</th>
                <th className="py-3 px-4">Ingredient</th>
                <th className="py-3 px-4">Requested Volume</th>
                <th className="py-3 px-4">Incoterm</th>
                <th className="py-3 px-4">Pipeline Status</th>
                <th className="py-3 px-4 text-right">Review</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {filteredRfqs.map((rfq) => {
                const badgeVariant = {
                  'Pending Review': 'warning',
                  'Technical Review': 'forest',
                  'Quote Issued': 'success',
                  'Contract Drafted': 'success'
                }[rfq.status] as any;

                return (
                  <tr key={rfq.id} className="hover:bg-warm-white/60 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-charcoal">
                      {rfq.id}
                    </td>
                    <td className="py-3 px-4 font-mono text-secondary-text">
                      {rfq.createdAt}
                    </td>
                    <td className="py-3 px-4">
                      <strong className="text-charcoal block">{rfq.companyName}</strong>
                      <span className="text-[11px] text-secondary-text">{rfq.contactName}</span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-charcoal">
                      {rfq.productName}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-forest">
                      {rfq.requiredVolume} {rfq.volumeUnit}
                    </td>
                    <td className="py-3 px-4 font-mono text-secondary-text">
                      {rfq.incoterm}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={badgeVariant || 'neutral'}>
                        {rfq.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedRfq(rfq)}
                        leftIcon={<Eye className="w-3.5 h-3.5" />}
                        className="text-xs h-7 px-2.5"
                      >
                        Inspect
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* RFQ Detail Drawer / Modal */}
      <Modal
        isOpen={!!selectedRfq}
        onClose={() => setSelectedRfq(null)}
        title={selectedRfq ? `Quotation Dossier: ${selectedRfq.id}` : 'RFQ Details'}
        subtitle={`Submitted on ${selectedRfq?.createdAt} by ${selectedRfq?.companyName}`}
        maxWidth="xl"
      >
        {selectedRfq && (
          <div className="space-y-5 text-xs">
            {/* Quick Summary Grid */}
            <div className="grid grid-cols-2 gap-3 p-3.5 rounded bg-warm-white border border-border-subtle">
              <div>
                <span className="text-secondary-text block text-[11px]">Requested Product:</span>
                <span className="font-bold text-charcoal text-sm">{selectedRfq.productName}</span>
              </div>
              <div>
                <span className="text-secondary-text block text-[11px]">Volume & Packaging:</span>
                <span className="font-mono font-bold text-forest text-sm">
                  {selectedRfq.requiredVolume} {selectedRfq.volumeUnit}
                </span>
                <span className="text-[11px] text-secondary-text block">{selectedRfq.preferredPackaging}</span>
              </div>
            </div>

            {/* Buyer Details */}
            <div className="p-3.5 rounded bg-white border border-border-subtle space-y-2">
              <h4 className="font-bold text-charcoal uppercase tracking-wider text-[11px]">
                Procurement Authority Contacts
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-secondary-text block">Contact Name:</span>
                  <span className="font-semibold text-charcoal">{selectedRfq.contactName}</span>
                </div>
                <div>
                  <span className="text-secondary-text block">Company:</span>
                  <span className="font-semibold text-charcoal">{selectedRfq.companyName}</span>
                </div>
                <div>
                  <span className="text-secondary-text block">Email:</span>
                  <a href={`mailto:${selectedRfq.email}`} className="font-mono text-forest hover:underline">
                    {selectedRfq.email}
                  </a>
                </div>
                <div>
                  <span className="text-secondary-text block">Phone:</span>
                  <span className="font-mono text-charcoal">{selectedRfq.phone || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Logistics & Delivery Destination */}
            <div className="p-3.5 rounded bg-white border border-border-subtle space-y-2">
              <h4 className="font-bold text-charcoal uppercase tracking-wider text-[11px]">
                Logistics & Incoterms
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-secondary-text block">Incoterm:</span>
                  <span className="font-mono font-bold text-charcoal">{selectedRfq.incoterm}</span>
                </div>
                <div>
                  <span className="text-secondary-text block">Destination:</span>
                  <span className="font-semibold text-charcoal">{selectedRfq.deliveryLocation}</span>
                </div>
                <div>
                  <span className="text-secondary-text block">Target Delivery Window:</span>
                  <span className="font-semibold text-charcoal">{selectedRfq.targetDeliveryDate || 'Standard Dispatch'}</span>
                </div>
                {selectedRfq.estimatedValue && (
                  <div>
                    <span className="text-secondary-text block">Estimated Order Value:</span>
                    <span className="font-mono font-bold text-emerald-700">{selectedRfq.estimatedValue}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Special Instructions */}
            {selectedRfq.specialRequirements && (
              <div className="p-3 rounded bg-amber-50/60 border border-amber-200 text-xs text-amber-900 space-y-1">
                <span className="font-bold block uppercase text-[10px]">Buyer Specification Notes:</span>
                <p className="leading-relaxed">{selectedRfq.specialRequirements}</p>
              </div>
            )}

            {/* Change Status Workflow */}
            <div className="pt-3 border-t border-border-subtle flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-secondary-text font-medium">Update Status:</span>
                <select
                  value={selectedRfq.status}
                  onChange={(e) => handleUpdateStatus(selectedRfq.id, e.target.value as any)}
                  className="rounded border border-border-subtle bg-white px-2.5 py-1 text-xs font-semibold text-charcoal"
                >
                  <option value="Pending Review">Pending Review</option>
                  <option value="Technical Review">Technical Review</option>
                  <option value="Quote Issued">Quote Issued</option>
                  <option value="Contract Drafted">Contract Drafted</option>
                </select>
              </div>

              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  handleUpdateStatus(selectedRfq.id, 'Quote Issued');
                  setSelectedRfq(null);
                }}
              >
                Dispatch Quote to Buyer
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
