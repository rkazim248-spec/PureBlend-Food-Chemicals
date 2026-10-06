import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { OfferSection } from "@/components/marketing/OfferSection";
import { getOffers } from "@/lib/api";
import { ErrorState } from "@/components/ui/ErrorState";
import { pageMetadata } from "@/lib/metadata";
import type { Offer } from "@/lib/api/types";

export const metadata = pageMetadata({
  title: "Offers",
  description: "Current offers from PureBlend.",
  path: "/offers",
});

export default async function OffersPage() {
  let offers: Offer[] = [];
  let loadError = false;
  try {
    offers = await getOffers();
  } catch {
    loadError = true;
  }

  return (
    <Section>
      <Container>
        <Heading level={1}>Offers</Heading>
        <div className="mt-8">
          {loadError ? (
            <ErrorState message="Unable to load offers right now. Please try again later." />
          ) : (
            <OfferSection offers={offers} />
          )}
        </div>
      </Container>
    </Section>
  );
}
