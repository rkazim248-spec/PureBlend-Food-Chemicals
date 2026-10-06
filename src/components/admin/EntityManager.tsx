"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { TableSkeleton } from "@/components/ui/TableSkeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Badge } from "@/components/ui/Badge";
import { Checkbox } from "@/components/ui/Checkbox";
import { Textarea } from "@/components/ui/Textarea";

export interface FieldDef {
  key: string;
  label: string;
  type: "text" | "textarea" | "checkbox" | "number";
  required?: boolean;
  placeholder?: string;
}

interface EntityManagerProps<T extends { id: string }> {
  title: string;
  description: string;
  entityName: string;
  fields: FieldDef[];
  columns: { label: string; render: (item: T) => React.ReactNode }[];
  searchText: (item: T) => string;
  fetchAll: () => Promise<T[]>;
  create: (input: Record<string, unknown>) => Promise<T>;
  update: (id: string, input: Record<string, unknown>) => Promise<T>;
  remove: (id: string) => Promise<void>;
  toggleStatus?: {
    label: (item: T) => boolean;
    set: (id: string, value: boolean) => Promise<T>;
  };
}

/** Generic admin CRUD manager: list, search, create/edit modal, delete confirm, status toggle. */
export function EntityManager<T extends { id: string }>({
  title, description, entityName, fields, columns, searchText, fetchAll, create, update, remove, toggleStatus,
}: EntityManagerProps<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<T | null | "new">(null);
  const [deleting, setDeleting] = useState<T | null>(null);
  const [form, setForm] = useState<Record<string, unknown>>({});
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setItems(await fetchAll());
    } catch {
      setError(`Unable to load ${entityName.toLowerCase()}s.`);
    } finally {
      setLoading(false);
    }
  }, [fetchAll, entityName]);

  useEffect(() => {
    const t = setTimeout(() => { load(); }, 0);
    return () => clearTimeout(t);
  }, [load]);

  const filtered = useMemo(
    () => items.filter((i) => searchText(i).toLowerCase().includes(query.toLowerCase())),
    [items, query, searchText],
  );

  function openNew() {
    setForm(Object.fromEntries(fields.map((f) => [f.key, f.type === "checkbox" ? false : ""])));
    setFormError(null);
    setEditing("new");
  }
  function openEdit(item: T) {
    setForm(Object.fromEntries(fields.map((f) => [f.key, (item as Record<string, unknown>)[f.key] ?? (f.type === "checkbox" ? false : "")])));
    setFormError(null);
    setEditing(item);
  }

  async function save() {
    for (const f of fields) {
      if (f.required && (form[f.key] === "" || form[f.key] === undefined)) {
        setFormError(`${f.label} is required.`);
        return;
      }
    }
    setSaving(true);
    setFormError(null);
    try {
      if (editing === "new") await create(form);
      else if (editing) await update(editing.id, form);
      setEditing(null);
      await load();
    } catch {
      setFormError(`Unable to save this ${entityName.toLowerCase()}. Please try again.`);
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    if (!deleting) return;
    setBusyId(deleting.id);
    try {
      await remove(deleting.id);
      setDeleting(null);
      await load();
    } catch {
      setError(`Unable to delete this ${entityName.toLowerCase()}.`);
    } finally {
      setBusyId(null);
    }
  }

  async function toggle(item: T) {
    if (!toggleStatus) return;
    setBusyId(item.id);
    try {
      await toggleStatus.set(item.id, !toggleStatus.label(item));
      await load();
    } catch {
      setError(`Unable to update status.`);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-neutral-900">{title}</h1>
          <p className="mt-1 text-sm text-neutral-600">{description}</p>
        </div>
        <Button onClick={openNew}>Add {entityName}</Button>
      </div>

      <div className="mt-6 max-w-sm">
        <Input label={`Search ${entityName.toLowerCase()}s`} value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Type to filter…" />
      </div>

      <div className="mt-6">
        {loading ? (
          <TableSkeleton />
        ) : error ? (
          <ErrorState message={error} onRetry={load} />
        ) : filtered.length === 0 ? (
          <EmptyState title={`No ${entityName.toLowerCase()}s yet`} description={`Create your first ${entityName.toLowerCase()} to get started.`} action={<Button onClick={openNew}>Add {entityName}</Button>} />
        ) : (
          <div className="overflow-x-auto rounded-lg border border-neutral-200 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-neutral-200 bg-neutral-50 text-neutral-600">
                <tr>
                  {columns.map((c) => <th key={c.label} className="px-4 py-3 font-semibold">{c.label}</th>)}
                  {toggleStatus && <th className="px-4 py-3 font-semibold">Status</th>}
                  <th className="px-4 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filtered.map((item) => (
                  <tr key={item.id} className="transition-colors hover:bg-neutral-50">
                    {columns.map((c) => <td key={c.label} className="px-4 py-3 text-neutral-800">{c.render(item)}</td>)}
                    {toggleStatus && (
                      <td className="px-4 py-3">
                        <Badge tone={toggleStatus.label(item) ? "success" : "neutral"}>{toggleStatus.label(item) ? "Active" : "Inactive"}</Badge>
                      </td>
                    )}
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        {toggleStatus && (
                          <Button variant="ghost" size="sm" disabled={busyId === item.id} onClick={() => toggle(item)}>
                            {toggleStatus.label(item) ? "Deactivate" : "Activate"}
                          </Button>
                        )}
                        <Button variant="secondary" size="sm" onClick={() => openEdit(item)}>Edit</Button>
                        <Button variant="danger" size="sm" disabled={busyId === item.id} onClick={() => setDeleting(item)}>Delete</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal open={editing !== null} onClose={() => setEditing(null)} title={editing === "new" ? `Add ${entityName}` : `Edit ${entityName}`} footer={<>
        <Button variant="ghost" onClick={() => setEditing(null)}>Cancel</Button>
        <Button loading={saving} onClick={save}>Save</Button>
      </>}>
        <div className="flex flex-col gap-4">
          {fields.map((f) => (
            f.type === "textarea" ? (
              <Textarea key={f.key} label={f.label} value={String(form[f.key] ?? "")} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} />
            ) : f.type === "checkbox" ? (
              <Checkbox key={f.key} label={f.label} checked={Boolean(form[f.key])} onChange={(e) => setForm({ ...form, [f.key]: e.target.checked })} />
            ) : (
              <Input key={f.key} label={f.label} type={f.type === "number" ? "number" : "text"} value={String(form[f.key] ?? "")} onChange={(e) => setForm({ ...form, [f.key]: f.type === "number" ? Number(e.target.value) : e.target.value })} placeholder={f.placeholder} />
            )
          ))}
          {formError && <p role="alert" className="text-sm text-danger-600">{formError}</p>}
        </div>
      </Modal>

      <Modal open={deleting !== null} onClose={() => setDeleting(null)} title={`Delete ${entityName}`} footer={<>
        <Button variant="ghost" onClick={() => setDeleting(null)}>Cancel</Button>
        <Button variant="danger" loading={busyId === deleting?.id} onClick={confirmDelete}>Delete</Button>
      </>}>
        This will permanently remove this {entityName.toLowerCase()}. This action cannot be undone.
      </Modal>
    </div>
  );
}
