import { Hero } from "@/components/marketing/Hero";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { ProductGrid } from "@/components/marketing/ProductGrid";
import { OfferSection } from "@/components/marketing/OfferSection";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { devBanner, devOffers, devProducts } from "@/data/dev-fixtures";

/*
 * NOTE: Sections use isolated development fixtures while backend APIs are not
 * wired. Copy marked as placeholder is replaceable — no invented business facts.
 */
export default function HomePage() {
  return (
    <>
      <Hero banner={devBanner} />

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
            <ProductGrid products={devProducts} />
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <Heading level={2}>Current offers</Heading>
          <div className="mt-8">
            <OfferSection offers={devOffers} />
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
