import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { FaqAccordion } from "@/components/marketing/FaqAccordion";
import { devFaqs } from "@/data/dev-fixtures";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "FAQs",
  description: "Frequently asked questions about PureBlend.",
  path: "/faqs",
});

export default function FaqsPage() {
  return (
    <Section>
      <Container className="max-w-3xl">
        <Heading level={1}>FAQs</Heading>
        <div className="mt-8">
          <FaqAccordion faqs={devFaqs} />
        </div>
      </Container>
    </Section>
  );
}
