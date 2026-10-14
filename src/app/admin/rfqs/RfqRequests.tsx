"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Download, Eye, RefreshCw, Search } from "lucide-react";
import { adminGetRfqRequests, adminUpdateRfqStatus, type AdminRfqRequest, type AdminRfqStatus } from "@/lib/api/admin";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
import { Spinner } from "@/components/ui/Spinner";
import { useToast } from "@/components/ui/Toast";

const STATUSES: AdminRfqStatus[] = [
  "Pending Review",
  "Technical Review",
  "Quote Issued",
  "Contract Drafted",
];

const STATUS_BADGES: Record<AdminRfqStatus, "warning" | "forest" | "success"> = {
  "Pending Review": "warning",
  "Technical Review": "forest",
  "Quote Issued": "success",
  "Contract Drafted": "success",
};

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(date);
}

function csvCell(value: string) {
  const safeValue = /^[=+\-@]/.test(value) ? `'${value}` : value;
  return `"${safeValue.replace(/"/g, '""')}"`;
}

export function RfqRequests() {
  const { showToast } = useToast();
  const [requests, setRequests] = useState<AdminRfqRequest[]>([]);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedRequest, setSelectedRequest] = useState<AdminRfqRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadRequests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setRequests(await adminGetRfqRequests());
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load quotation requests.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        setRequests(await adminGetRfqRequests());
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : "Unable to load quotation requests.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredRequests = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return requests.filter((request) => {
      if (statusFilter !== "all" && request.status !== statusFilter) return false;
      if (!normalizedQuery) return true;
      return [
        request.id,
        request.companyName,
        request.contactName,
        request.email,
        request.productName,
      ].some((value) => value.toLowerCase().includes(normalizedQuery));
    });
  }, [query, requests, statusFilter]);

  async function updateStatus(id: string, status: AdminRfqStatus): Promise<boolean> {
    setUpdating(true);
    try {
      await adminUpdateRfqStatus(id, status);
      setRequests((current) => current.map((request) => request.id === id ? { ...request, status } : request));
      setSelectedRequest((current) => current?.id === id ? { ...current, status } : current);
      showToast({
        title: "Status updated",
        description: `Quotation request ${id} is now ${status}.`,
        type: "success",
      });
      return true;
    } catch (updateError) {
      showToast({
        title: "Unable to update status",
        description: updateError instanceof Error ? updateError.message : "Please try again.",
        type: "error",
      });
      return false;
    } finally {
      setUpdating(false);
    }
  }

  function exportCsv() {
    const headers = ["RFQ ID", "Company", "Contact", "Email", "Phone", "Product", "Volume", "Unit", "Packaging", "Delivery", "Incoterm", "Status", "Submitted"];
    const rows = filteredRequests.map((request) => [
      request.id,
      request.companyName,
      request.contactName,
      request.email,
      request.phone ?? "",
      request.productName,
      request.volume,
      request.volumeUnit,
      request.packaging,
      request.deliveryLocation,
      request.incoterm,
      request.status,
      request.createdAt,
    ]);
    const csv = [headers, ...rows].map((row) => row.map(csvCell).join(",")).join("\r\n");
    const url = URL.createObjectURL(new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `PureBlend_RFQs_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
    showToast({
      title: "CSV export generated",
      description: "Filtered quotation requests exported for review.",
      type: "info",
    });
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-primary-green">
            Commercial Pipeline
          </span>
          <h1 className="mt-0.5 text-2xl font-black tracking-tight text-charcoal">
            Quotation Requests &amp; Tender RFQs
          </h1>
          <p className="mt-1 text-xs text-secondary-text">
            Review product order inquiries, buyer volume, and delivery requirements.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => void loadRequests()} disabled={loading} leftIcon={<RefreshCw className="h-4 w-4" />}>
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={exportCsv} disabled={loading || filteredRequests.length === 0} leftIcon={<Download className="h-4 w-4" />}>
            Export RFQs as CSV
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-lg border border-border-subtle bg-white p-4 shadow-xs sm:flex-row">
        <div className="flex-1">
          <Input
            label="Search RFQs"
            placeholder="Company, buyer, product, or reference..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            leftIcon={<Search className="h-4 w-4" />}
          />
        </div>
        <div className="sm:w-56">
          <Select
            label="Status"
            options={[
              { value: "all", label: "All Quotation Statuses" },
              ...STATUSES.map((status) => ({ value: status, label: status })),
            ]}
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex min-h-48 items-center justify-center rounded-lg border border-border-subtle bg-white">
          <Spinner label="Loading quotation requests" />
        </div>
      ) : error ? (
        <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-5 text-sm text-red-800">
          <p className="font-semibold">Unable to load quotation requests</p>
          <p className="mt-1">{error}</p>
          <button type="button" onClick={() => void loadRequests()} className="mt-3 font-bold underline underline-offset-2">
            Try again
          </button>
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border-subtle bg-white px-6 py-14 text-center">
          <h2 className="font-bold text-charcoal">
            {requests.length === 0 ? "No quotation requests yet" : "No matching requests"}
          </h2>
          <p className="mt-2 text-sm text-secondary-text">
            {requests.length === 0
              ? "New product order and quote requests will appear here after submission."
              : "Try a different search term or status filter."}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-border-subtle bg-white shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-xs">
              <thead className="border-b border-border-subtle bg-warm-white text-[11px] font-semibold uppercase tracking-wider text-secondary-text">
                <tr>
                  <th className="px-4 py-3">Ref Number</th>
                  <th className="px-4 py-3">Logged Date</th>
                  <th className="px-4 py-3">Company &amp; Buyer</th>
                  <th className="px-4 py-3">Ingredient</th>
                  <th className="px-4 py-3">Requested Volume</th>
                  <th className="px-4 py-3">Incoterm</th>
                  <th className="px-4 py-3">Pipeline Status</th>
                  <th className="px-4 py-3 text-right">Review</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {filteredRequests.map((request) => (
                  <tr key={request.id} className="transition-colors hover:bg-warm-white/60">
                    <td className="px-4 py-3 font-mono font-bold text-charcoal">{request.id}</td>
                    <td className="whitespace-nowrap px-4 py-3 font-mono text-secondary-text">{formatDate(request.createdAt)}</td>
                    <td className="px-4 py-3">
                      <strong className="block text-charcoal">{request.companyName}</strong>
                      <span className="text-[11px] text-secondary-text">{request.contactName}</span>
                    </td>
                    <td className="px-4 py-3 font-semibold text-charcoal">{request.productName}</td>
                    <td className="px-4 py-3 font-mono font-bold text-forest">{request.volume} {request.volumeUnit}</td>
                    <td className="px-4 py-3 font-mono text-secondary-text">{request.incoterm}</td>
                    <td className="px-4 py-3">
                      <Badge variant={STATUS_BADGES[request.status]}>{request.status}</Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button variant="outline" size="sm" onClick={() => setSelectedRequest(request)} leftIcon={<Eye className="h-3.5 w-3.5" />} className="h-7 px-2.5 text-xs">
                        Inspect
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal
        isOpen={!!selectedRequest}
        onClose={() => setSelectedRequest(null)}
        title={selectedRequest ? `Quotation Dossier: ${selectedRequest.id}` : "RFQ Details"}
        subtitle={selectedRequest ? `Submitted ${formatDate(selectedRequest.createdAt)} by ${selectedRequest.companyName}` : undefined}
        maxWidth="xl"
      >
        {selectedRequest && (
          <div className="space-y-5 text-xs">
            <div className="grid grid-cols-2 gap-3 rounded border border-border-subtle bg-warm-white p-3.5">
              <div>
                <span className="block text-[11px] text-secondary-text">Requested Product</span>
                <span className="text-sm font-bold text-charcoal">{selectedRequest.productName}</span>
              </div>
              <div>
                <span className="block text-[11px] text-secondary-text">Volume &amp; Packaging</span>
                <span className="text-sm font-mono font-bold text-forest">{selectedRequest.volume} {selectedRequest.volumeUnit}</span>
                <span className="block text-[11px] text-secondary-text">{selectedRequest.packaging}</span>
              </div>
            </div>

            <div className="space-y-2 rounded border border-border-subtle bg-white p-3.5">
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-charcoal">Procurement Contact</h2>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <p><span className="block text-secondary-text">Contact</span><span className="font-semibold text-charcoal">{selectedRequest.contactName}</span></p>
                <p><span className="block text-secondary-text">Company</span><span className="font-semibold text-charcoal">{selectedRequest.companyName}</span></p>
                <p><span className="block text-secondary-text">Email</span><a href={`mailto:${selectedRequest.email}`} className="font-mono text-forest hover:underline">{selectedRequest.email}</a></p>
                <p><span className="block text-secondary-text">Phone</span><span className="font-mono text-charcoal">{selectedRequest.phone || "N/A"}</span></p>
              </div>
            </div>

            <div className="space-y-2 rounded border border-border-subtle bg-white p-3.5">
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-charcoal">Logistics &amp; Incoterms</h2>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <p><span className="block text-secondary-text">Incoterm</span><span className="font-mono font-bold text-charcoal">{selectedRequest.incoterm}</span></p>
                <p><span className="block text-secondary-text">Destination</span><span className="font-semibold text-charcoal">{selectedRequest.deliveryLocation}</span></p>
                <p><span className="block text-secondary-text">Target Delivery</span><span className="font-semibold text-charcoal">{selectedRequest.targetDate || "Standard Dispatch"}</span></p>
                <p><span className="block text-secondary-text">RFQ Reference</span><span className="font-mono font-semibold text-charcoal">{selectedRequest.id}</span></p>
              </div>
            </div>

            {selectedRequest.notes && (
              <div className="space-y-1 rounded border border-amber-200 bg-amber-50/60 p-3 text-xs text-amber-900">
                <span className="block text-[10px] font-bold uppercase">Buyer Specification Notes</span>
                <p className="whitespace-pre-wrap leading-relaxed">{selectedRequest.notes}</p>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border-subtle pt-3">
              <label className="flex items-center gap-2 font-medium text-secondary-text">
                Update Status
                <select
                  value={selectedRequest.status}
                  disabled={updating}
                  onChange={(event) => {
                    const status = STATUSES.find((candidate) => candidate === event.target.value);
                    if (status) void updateStatus(selectedRequest.id, status);
                  }}
                  className="rounded border border-border-subtle bg-white px-2.5 py-1 text-xs font-semibold text-charcoal disabled:opacity-60"
                >
                  {STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
                </select>
              </label>
              <Button
                variant="primary"
                size="sm"
                disabled={updating}
                onClick={() => void updateStatus(selectedRequest.id, "Quote Issued").then((updated) => {
                  if (updated) setSelectedRequest(null);
                })}
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
