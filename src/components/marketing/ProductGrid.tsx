import { EmptyState } from "@/components/ui/EmptyState";
import { ProductCard } from "./ProductCard";
import type { Product } from "@/lib/api/types";

export function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return <EmptyState title="No products yet" description="Check back soon — our catalog is being updated." />;
  }
  return (
    <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((p) => (
        <li key={p.id}>
          <ProductCard product={p} />
        </li>
      ))}
    </ul>
  );
}
