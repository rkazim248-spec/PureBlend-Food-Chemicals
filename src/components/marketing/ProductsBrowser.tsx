"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { ProductGrid } from "./ProductGrid";
import { EmptyState } from "@/components/ui/EmptyState";
import type { Product } from "@/lib/api/types";

/* UI-only filter/search; data comes from props (fixtures now, API later). */
export function ProductsBrowser({ products }: { products: Product[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");

  const categories = useMemo(
    () => Array.from(new Set(products.map((p) => p.category?.slug).filter(Boolean))) as string[],
    [products],
  );

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesQuery = p.name.toLowerCase().includes(query.toLowerCase()) || p.description.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = category === "all" || p.category?.slug === category;
      return matchesQuery && matchesCategory;
    });
  }, [products, query, category]);

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Search products" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name…" />
        <Select label="Category" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="all">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>{products.find((p) => p.category?.slug === c)?.category?.name ?? c}</option>
          ))}
        </Select>
      </div>
      <div className="mt-8">
        {filtered.length === 0 && (query || category !== "all") ? (
          <EmptyState title="No matching products" description="Try a different search or category." />
        ) : (
          <ProductGrid products={filtered} />
        )}
      </div>
    </div>
  );
}
