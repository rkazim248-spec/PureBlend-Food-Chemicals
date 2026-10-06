import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { ProductsBrowser } from "@/components/marketing/ProductsBrowser";
import { getProducts } from "@/lib/api";
import { ErrorState } from "@/components/ui/ErrorState";
import { pageMetadata } from "@/lib/metadata";
import type { Product } from "@/lib/api/types";

export const metadata = pageMetadata({
  title: "Products",
  description: "Explore the PureBlend product catalog.",
  path: "/products",
});

export default async function ProductsPage() {
  let products: Product[] = [];
  let loadError = false;
  try {
    products = await getProducts();
  } catch {
    loadError = true;
  }

  return (
    <Section>
      <Container>
        <Heading level={1}>Products</Heading>
        <p className="mt-3 text-neutral-600">Browse our catalog.</p>
        <div className="mt-8">
          {loadError ? (
            <ErrorState message="Unable to load products right now. Please try again later." />
          ) : (
            <ProductsBrowser products={products} />
          )}
        </div>
      </Container>
    </Section>
  );
}
