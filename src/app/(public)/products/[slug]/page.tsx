import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { ProductDetail } from "@/components/marketing/ProductDetail";
import { ProductGrid } from "@/components/marketing/ProductGrid";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getProductBySlug, getProducts } from "@/lib/api";
import { ErrorState } from "@/components/ui/ErrorState";
import { pageMetadata } from "@/lib/metadata";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  try {
    const product = await getProductBySlug(slug);
    if (!product) return pageMetadata({ title: "Product not found", description: "", path: `/products/${slug}` });
    return pageMetadata({
      title: product.seo?.metaTitle ?? product.name,
      description: product.seo?.metaDescription ?? product.description,
      path: `/products/${slug}`,
    });
  } catch {
    return pageMetadata({ title: "Product", description: "", path: `/products/${slug}` });
  }
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let product = null;
  let loadError = false;
  try {
    product = await getProductBySlug(slug);
  } catch {
    loadError = true;
  }

  if (loadError) {
    return (
      <Section>
        <Container>
          <ErrorState message="Unable to load this product right now. Please try again later." />
        </Container>
      </Section>
    );
  }

  if (!product) notFound();

  let related: Awaited<ReturnType<typeof getProducts>> = [];
  try {
    const all = await getProducts();
    related = all.filter((p) => p.slug !== slug && p.category?.slug === product.category?.slug);
  } catch {
    related = [];
  }

  return (
    <PublicLayout>
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
    </PublicLayout>
  );
}
