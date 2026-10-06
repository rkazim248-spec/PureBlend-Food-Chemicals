"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { Alert } from "@/components/ui/Alert";
import { ErrorState } from "@/components/ui/ErrorState";
import { admin, type ContentPage } from "@/lib/api";
import { Heading } from "@/components/ui/Heading";

const PAGES = ["about", "privacy-policy", "terms-and-conditions"];

export default function AdminContentPage() {
  const [pageKey, setPageKey] = useState(PAGES[0]);
  const [content, setContent] = useState<ContentPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [body, setBody] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function load(key: string) {
    setLoading(true);
    setError(null);
    try {
      const c = await admin.adminGetContent(key);
      setContent(c);
      setBody(c.blocks[0]?.body ?? "");
    } catch {
      setError("Unable to load this content.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const t = setTimeout(() => { load(pageKey); }, 0);
    return () => clearTimeout(t);
  }, [pageKey]);

  async function save() {
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      await admin.adminUpdateContent(pageKey, { blocks: [{ ...content?.blocks[0], body }] });
      setSaved(true);
    } catch {
      setError("Unable to save changes.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <Heading level={1}>Content</Heading>
      <p className="mt-2 text-sm text-neutral-600">Edit managed page content blocks.</p>
      <div className="mt-6 max-w-xs">
        <label htmlFor="page-key" className="block text-sm font-semibold text-neutral-800">Page</label>
        <select id="page-key" className="mt-1 h-11 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm" value={pageKey} onChange={(e) => setPageKey(e.target.value)}>
          {PAGES.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>
      <div className="mt-6 max-w-2xl">
        {loading ? (
          <div className="h-40 animate-pulse rounded-md bg-neutral-200" aria-busy="true" />
        ) : error ? (
          <ErrorState message={error} onRetry={() => load(pageKey)} />
        ) : (
          <>
            <Textarea label="Body" value={body} onChange={(e) => setBody(e.target.value)} className="min-h-48" />
            <div className="mt-4 flex items-center gap-4">
              <Button loading={saving} onClick={save}>Save</Button>
              {saved && <Alert tone="success">Saved successfully.</Alert>}
              {error && <Alert tone="danger">{error}</Alert>}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
