import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { ProductDetail } from "@/components/marketing/ProductDetail";
import { ProductGrid } from "@/components/marketing/ProductGrid";
import { notFound } from "next/navigation";
import Link from "next/link";
import { devProducts } from "@/data/dev-fixtures";
import { pageMetadata } from "@/lib/metadata";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = devProducts.find((p) => p.slug === slug);
  if (!product) return pageMetadata({ title: "Product not found", description: "", path: `/products/${slug}` });
  return pageMetadata({
    title: product.seo?.metaTitle ?? product.name,
    description: product.seo?.metaDescription ?? product.description,
    path: `/products/${slug}`,
  });
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  // TODO: replace with getProductBySlug(slug) API call when backend is available.
  const product = devProducts.find((p) => p.slug === slug);
  if (!product) notFound();

  const related = devProducts.filter((p) => p.slug !== slug && p.category?.slug === product.category?.slug);

  return (
    <Section>
      <Container>
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-neutral-500">
          <ol className="flex flex-wrap gap-1">
            <li><Link href="/" className="hover:text-brand-700">Home</Link> /</li>
            <li><Link href="/products" className="hover:text-brand-700">Products</Link> /</li>
            <li aria-current="page" className="text-neutral-800">{product.name}</li>
          </ol>
        </nav>
        <ProductDetail product={product} />
        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="text-xl font-bold text-neutral-900">Related products</h2>
            <div className="mt-6">
              <ProductGrid products={related} />
            </div>
          </div>
        )}
      </Container>
    </Section>
  );
}
