import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { OfferSection } from "@/components/marketing/OfferSection";
import { devOffers } from "@/data/dev-fixtures";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Offers",
  description: "Current offers from PureBlend.",
  path: "/offers",
});

export default function OffersPage() {
  return (
    <Section>
      <Container>
        <Heading level={1}>Offers</Heading>
        <div className="mt-8">
          <OfferSection offers={devOffers} />
        </div>
      </Container>
    </Section>
  );
}
