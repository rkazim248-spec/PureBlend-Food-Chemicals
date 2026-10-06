import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { ProductsBrowser } from "@/components/marketing/ProductsBrowser";
import { devProducts } from "@/data/dev-fixtures";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Products",
  description: "Explore the PureBlend product catalog.",
  path: "/products",
});

export default function ProductsPage() {
  return (
    <Section>
      <Container>
        <Heading level={1}>Products</Heading>
        <p className="mt-3 text-neutral-600">Browse our catalog. Data will come from the products API once available.</p>
        <div className="mt-8">
          <ProductsBrowser products={devProducts} />
        </div>
      </Container>
    </Section>
  );
}
