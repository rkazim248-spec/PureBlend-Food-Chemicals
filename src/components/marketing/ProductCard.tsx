import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import type { Product } from "@/lib/api/types";

export function ProductCard({ product }: { product: Product }) {
  const image = product.images[0];
  return (
    <Card className="flex h-full flex-col gap-3 transition-shadow duration-200 hover:shadow-raised">
      {image && (
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-md bg-neutral-100">
          <Image src={image.url} alt={image.alt} fill sizes="(min-width:1024px) 33vw, 100vw" className="object-cover" />
        </div>
      )}
      {product.category && <Badge tone="brand">{product.category.name}</Badge>}
      <h3 className="text-lg font-bold text-neutral-900">
        <Link href={`/products/${product.slug}`} className="hover:text-brand-700 focus-visible:outline-2 focus-visible:outline-brand-600">
          {product.name}
        </Link>
      </h3>
      <p className="line-clamp-3 text-sm text-neutral-600">{product.description}</p>
      <Link href={`/products/${product.slug}`} className="mt-auto text-sm font-semibold text-brand-700 hover:underline">
        View details →
      </Link>
    </Card>
  );
}
