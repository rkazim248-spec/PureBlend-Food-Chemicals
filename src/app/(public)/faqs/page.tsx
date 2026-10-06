import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { FaqAccordion } from "@/components/marketing/FaqAccordion";
import { getFaqs } from "@/lib/api";
import { ErrorState } from "@/components/ui/ErrorState";
import { pageMetadata } from "@/lib/metadata";
import type { Faq } from "@/lib/api/types";

export const metadata = pageMetadata({
  title: "FAQs",
  description: "Frequently asked questions about PureBlend.",
  path: "/faqs",
});

export default async function FaqsPage() {
  let faqs: Faq[] = [];
  let loadError = false;
  try {
    faqs = await getFaqs();
  } catch {
    loadError = true;
  }

  return (
    <Section>
      <Container className="max-w-3xl">
        <Heading level={1}>FAQs</Heading>
        <div className="mt-8">
          {loadError ? (
            <ErrorState message="Unable to load FAQs right now. Please try again later." />
          ) : (
            <FaqAccordion faqs={faqs} />
          )}
        </div>
      </Container>
    </Section>
  );
}
