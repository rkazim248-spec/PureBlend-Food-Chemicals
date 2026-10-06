import { Hero } from "@/components/marketing/Hero";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { ProductGrid } from "@/components/marketing/ProductGrid";
import { OfferSection } from "@/components/marketing/OfferSection";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { getBanners, getOffers, getProducts } from "@/lib/api";
import { ErrorState } from "@/components/ui/ErrorState";

/* Data flows exclusively through src/lib/api services — no fixtures or fetch here. */

export default async function HomePage() {
  // Parallel data fetching — no waterfalls. Errors surface as a clear state.
  const [bannersResult, productsResult, offersResult] = await Promise.allSettled([
    getBanners(),
    getProducts(),
    getOffers(),
  ]);

  const banners = bannersResult.status === "fulfilled" ? bannersResult.value : [];
  const products = productsResult.status === "fulfilled" ? productsResult.value : [];
  const offers = offersResult.status === "fulfilled" ? offersResult.value : [];
  const failed = [bannersResult, productsResult, offersResult].some((r) => r.status === "rejected");

  return (
    <>
      <Hero banner={banners[0] ?? null} />

      <Section>
        <Container className="grid items-start gap-8 lg:grid-cols-2">
          <div>
            <Heading level={2}>About PureBlend</Heading>
            <p className="mt-4 text-neutral-700">
              PureBlend Food Chemicals provides food ingredients and ingredient solutions for
              modern food production. This introductory copy is a replaceable placeholder for
              the final company profile.
            </p>
            <ButtonLink href="/about" variant="secondary" className="mt-6">Learn more</ButtonLink>
          </div>
          <div className="rounded-lg bg-brand-50 p-8">
            <Heading level={3}>Why PureBlend</Heading>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-neutral-700">
              <li>Product-focused approach and clear documentation</li>
              <li>Structured specifications for every catalog item</li>
              <li>Responsive support via our contact channel</li>
            </ul>
          </div>
        </Container>
      </Section>

      <Section className="bg-neutral-50">
        <Container>
          <div className="flex items-end justify-between gap-4">
            <Heading level={2}>Product showcase</Heading>
            <ButtonLink href="/products" variant="ghost">View all →</ButtonLink>
          </div>
          <div className="mt-8">
            {failed && productsResult.status === "rejected" ? (
              <ErrorState message="Unable to load products right now." action={<ButtonLink href="/products" variant="secondary">Browse products</ButtonLink>} />
            ) : (
              <ProductGrid products={products} />
            )}
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <Heading level={2}>Current offers</Heading>
          <div className="mt-8">
            {failed && offersResult.status === "rejected" ? (
              <ErrorState message="Unable to load offers right now." />
            ) : (
              <OfferSection offers={offers} />
            )}
          </div>
        </Container>
      </Section>

      <Section className="bg-brand-950 text-white">
        <Container className="text-center">
          <Heading level={2} className="text-white">Chat with the PureBlend assistant</Heading>
          <p className="mx-auto mt-4 max-w-xl text-brand-100">
            Ask about our products, offers, and FAQs — answers come only from approved PureBlend knowledge.
          </p>
        </Container>
      </Section>

      <Section>
        <Container className="text-center">
          <Heading level={2}>Talk to our team</Heading>
          <p className="mx-auto mt-4 max-w-xl text-neutral-600">
            Send us your inquiry and we will get back to you.
          </p>
          <ButtonLink href="/contact" className="mt-6">Contact us</ButtonLink>
        </Container>
      </Section>
    </>
  );
}
