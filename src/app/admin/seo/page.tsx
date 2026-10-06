"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";
import { Heading } from "@/components/ui/Heading";
import { admin } from "@/lib/api";

export default function AdminSeoPage() {
  const [entityId, setEntityId] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Guidance only — character hints are not a guarantee of SERP rendering.
  const titleCount = metaTitle.length;
  const descCount = metaDescription.length;

  async function load() {
    if (!entityId.trim()) return;
    setError(null);
    try {
      const rec = await admin.adminGetSeo("product", entityId.trim());
      setMetaTitle(rec?.metaTitle ?? "");
      setMetaDescription(rec?.metaDescription ?? "");
    } catch {
      setError("Unable to load SEO settings for this entity.");
    }
  }

  async function save() {
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      await admin.adminSaveSeo({ entityType: "product", entityId: entityId.trim(), metaTitle, metaDescription });
      setSaved(true);
    } catch {
      setError("Unable to save SEO settings.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <Heading level={1}>SEO</Heading>
      <p className="mt-2 text-sm text-neutral-600">Manage per-entity meta title and description.</p>
      <div className="mt-6 max-w-2xl space-y-4">
        <div className="flex items-end gap-3">
          <div className="flex-1">
            <Input label="Entity ID (product)" value={entityId} onChange={(e) => setEntityId(e.target.value)} placeholder="product-id" />
          </div>
          <Button variant="secondary" onClick={load}>Load</Button>
        </div>
        <Input label={`SEO title (${titleCount} chars — aim ≤ 60)`} value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} />
        <Input label={`Meta description (${descCount} chars — aim ≤ 160)`} value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} />
        <Button loading={saving} onClick={save} disabled={!entityId.trim()}>Save SEO</Button>
        {saved && <Alert tone="success">SEO settings saved.</Alert>}
        {error && <Alert tone="danger">{error}</Alert>}
      </div>
    </div>
  );
}
