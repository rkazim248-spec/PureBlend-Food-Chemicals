import Image from "next/image";
import { Badge } from "@/components/ui/Badge";
import { Heading } from "@/components/ui/Heading";
import { ButtonLink } from "@/components/ui/ButtonLink";
import type { Product } from "@/lib/api/types";

export function ProductDetail({ product }: { product: Product }) {
  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-neutral-100">
        {product.images[0] && (
          <Image src={product.images[0].url} alt={product.images[0].alt} fill priority sizes="(min-width:1280px) 50vw, 100vw" className="object-cover" />
        )}
      </div>
      <div>
        {product.category && <Badge tone="brand">{product.category.name}</Badge>}
        <Heading level={1} className="mt-3">{product.name}</Heading>
        <p className="mt-4 text-neutral-700">{product.description}</p>
        <ButtonLink href="/contact" className="mt-6">Request specifications</ButtonLink>

        {product.specifications && product.specifications.length > 0 && (
          <section className="mt-8" aria-labelledby="specs-heading">
            <h2 id="specs-heading" className="text-lg font-bold text-neutral-900">Specifications</h2>
            <dl className="mt-4 divide-y divide-neutral-200 rounded-lg border border-neutral-200">
              {product.specifications.map((spec) => (
                <div key={spec.label} className="grid grid-cols-2 gap-4 px-4 py-3 text-sm">
                  <dt className="font-semibold text-neutral-600">{spec.label}</dt>
                  <dd className="text-neutral-900">{spec.value}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}
      </div>
    </div>
  );
}
