'use client';

import React, { useState } from 'react';
import { QUALITY_BATCH_DOCS, PRODUCTS_DATA } from '@/data/mockData';
import { QualityBatchDoc } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import { 
  FileCheck2, 
  Plus, 
  Search, 
  Download, 
  ShieldCheck, 
  CheckCircle2, 
  Printer, 
  FlaskConical 
} from 'lucide-react';

export default function AdminQualityPage() {
  const { showToast } = useToast();
  const [docs, setDocs] = useState<QualityBatchDoc[]>(QUALITY_BATCH_DOCS);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [inspectingDoc, setInspectingDoc] = useState<QualityBatchDoc | null>(null);

  const [newBatch, setNewBatch] = useState({
    batchNumber: 'LOT-PB-2610-101',
    productId: 'citric-acid-anhydrous',
    manufacturingDate: '2026-10-01',
    expiryDate: '2029-09-30',
    releaseDate: '2026-10-05',
    testingLab: 'PureBlend Central Analytical Laboratory (ISO 17025 Accredited)',
    assayResult: '99.92% (FCC Limit 99.5 – 100.0%)',
    status: 'Released' as const
  });

  const filteredDocs = docs.filter((d) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      d.batchNumber.toLowerCase().includes(q) ||
      d.productName.toLowerCase().includes(q) ||
      d.id.toLowerCase().includes(q)
    );
  });

  const handleCreateBatch = (e: React.FormEvent) => {
    e.preventDefault();
    const productObj = PRODUCTS_DATA.find((p) => p.id === newBatch.productId);
    const newDocItem: QualityBatchDoc = {
      id: `COA-2026-${Math.floor(8000 + Math.random() * 2000)}`,
      batchNumber: newBatch.batchNumber,
      productId: newBatch.productId,
      productName: productObj ? productObj.name : 'Food Chemical',
      manufacturingDate: newBatch.manufacturingDate,
      expiryDate: newBatch.expiryDate,
      releaseDate: newBatch.releaseDate,
      testingLab: newBatch.testingLab,
      assayResult: newBatch.assayResult,
      status: newBatch.status
    };

    setDocs([newDocItem, ...docs]);
    setIsAddModalOpen(false);
    showToast({
      title: 'Batch COA Released',
      description: `Certificate for ${newBatch.batchNumber} published to traceability registry.`,
      type: 'success'
    });
  };

  const handleSimulateDownload = (batch: QualityBatchDoc) => {
    showToast({
      title: 'COA PDF Generating',
      description: `Downloading authenticated analytical dossier for ${batch.batchNumber}...`,
      type: 'info'
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-bold text-primary-green uppercase tracking-wider">
            Quality Assurance & Traceability
          </span>
          <h1 className="text-2xl font-black text-charcoal tracking-tight mt-0.5">
            Batch Certificates of Analysis (COA) Registry
          </h1>
          <p className="text-xs text-secondary-text mt-1">
            GS1-compliant production lot releases, multi-parameter assay logs, and ISO 17025 test archives.
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setIsAddModalOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Register New Lot Release
        </Button>
      </div>

      {/* Search Input */}
      <div className="bg-white rounded-lg border border-border-subtle p-4 shadow-xs">
        <Input
          placeholder="Search by lot number (e.g. LOT-PB-2610-014), product name, or COA ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          leftIcon={<Search className="w-4 h-4" />}
        />
      </div>

      {/* COA Batch Table */}
      <div className="bg-white rounded-lg border border-border-subtle shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-warm-white border-b border-border-subtle text-secondary-text font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">COA Doc ID</th>
                <th className="py-3 px-4">Production Lot</th>
                <th className="py-3 px-4">Product Name</th>
                <th className="py-3 px-4">Mfg / Expiry</th>
                <th className="py-3 px-4">Analytical Assay</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Certificate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {filteredDocs.map((doc) => (
                <tr key={doc.id} className="hover:bg-warm-white/60 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-charcoal">
                    {doc.id}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-forest">
                    {doc.batchNumber}
                  </td>
                  <td className="py-3 px-4 font-semibold text-charcoal">
                    {doc.productName}
                  </td>
                  <td className="py-3 px-4 font-mono text-secondary-text text-[11px]">
                    Mfg: {doc.manufacturingDate} · Exp: {doc.expiryDate}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-charcoal">
                    {doc.assayResult}
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant={doc.status === 'Released' ? 'success' : 'warning'}>
                      {doc.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-right space-x-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setInspectingDoc(doc)}
                      className="text-xs h-7 px-2.5"
                    >
                      View Dossier
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSimulateDownload(doc)}
                      className="text-xs h-7 px-2"
                      title="Download PDF"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspect COA Modal */}
      <Modal
        isOpen={!!inspectingDoc}
        onClose={() => setInspectingDoc(null)}
        title={inspectingDoc ? `Certificate of Analysis: ${inspectingDoc.batchNumber}` : 'COA Dossier'}
        subtitle="PureBlend Food Chemicals Quality Control & Analytical Laboratory"
        maxWidth="lg"
      >
        {inspectingDoc && (
          <div className="space-y-4 text-xs">
            <div className="bg-[#112921] text-white p-4 rounded-lg flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-emerald-300 font-mono block">Certificate #</span>
                <span className="font-mono font-bold text-base">{inspectingDoc.id}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase tracking-widest text-[#88aa9a] font-mono block">Release Date</span>
                <span className="font-mono text-xs">{inspectingDoc.releaseDate}</span>
              </div>
            </div>

            <div className="p-3.5 rounded bg-warm-white border border-border-subtle space-y-2">
              <div className="flex justify-between border-b border-border-subtle pb-1">
                <span className="text-secondary-text">Product Item:</span>
                <span className="font-bold text-charcoal">{inspectingDoc.productName}</span>
              </div>
              <div className="flex justify-between border-b border-border-subtle pb-1">
                <span className="text-secondary-text">Production Lot #:</span>
                <span className="font-mono font-bold text-forest">{inspectingDoc.batchNumber}</span>
              </div>
              <div className="flex justify-between border-b border-border-subtle pb-1">
                <span className="text-secondary-text">Testing Laboratory:</span>
                <span className="font-semibold text-charcoal">{inspectingDoc.testingLab}</span>
              </div>
              <div className="flex justify-between border-b border-border-subtle pb-1">
                <span className="text-secondary-text">Measured Assay Result:</span>
                <span className="font-mono font-bold text-emerald-700">{inspectingDoc.assayResult}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-text">Monograph Compliance:</span>
                <span className="font-semibold text-charcoal">FCC 12 / 13 & USP Standard Validated</span>
              </div>
            </div>

            <div className="p-3 bg-emerald-50 text-emerald-900 rounded border border-emerald-200 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Lot passed all physical appearance, heavy metals (Pb ≤ 2 mg/kg), moisture, and microbiological standards.</span>
            </div>

            <div className="pt-3 border-t border-border-subtle flex justify-end gap-2">
              <Button variant="outline" onClick={() => setInspectingDoc(null)}>
                Close
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  handleSimulateDownload(inspectingDoc);
                  setInspectingDoc(null);
                }}
                leftIcon={<Printer className="w-3.5 h-3.5" />}
              >
                Print Official COA
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Add New Batch Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Register New Laboratory Lot Release"
        subtitle="Log analytical test results from batch production for QA certification."
        maxWidth="lg"
      >
        <form onSubmit={handleCreateBatch} className="space-y-4 text-xs">
          <Input
            label="Batch / Lot Number"
            required
            value={newBatch.batchNumber}
            onChange={(e) => setNewBatch({ ...newBatch, batchNumber: e.target.value })}
          />

          <Select
            label="Product Item"
            required
            options={PRODUCTS_DATA.map((p) => ({
              value: p.id,
              label: `${p.name} (${p.code})`
            }))}
            value={newBatch.productId}
            onChange={(e) => setNewBatch({ ...newBatch, productId: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Manufacturing Date"
              type="date"
              required
              value={newBatch.manufacturingDate}
              onChange={(e) => setNewBatch({ ...newBatch, manufacturingDate: e.target.value })}
            />
            <Input
              label="Expiry Date"
              type="date"
              required
              value={newBatch.expiryDate}
              onChange={(e) => setNewBatch({ ...newBatch, expiryDate: e.target.value })}
            />
          </div>

          <Input
            label="Analytical Lab Testing Facility"
            required
            value={newBatch.testingLab}
            onChange={(e) => setNewBatch({ ...newBatch, testingLab: e.target.value })}
          />

          <Input
            label="Measured Assay Specification"
            required
            value={newBatch.assayResult}
            onChange={(e) => setNewBatch({ ...newBatch, assayResult: e.target.value })}
          />

          <div className="pt-3 border-t border-border-subtle flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Publish Released COA
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
