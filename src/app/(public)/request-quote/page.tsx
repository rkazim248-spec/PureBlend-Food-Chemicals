import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { QuoteForm } from "@/components/forms/QuoteForm";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Request a Quote",
  description: "Request a product quote from PureBlend Food Chemicals.",
  path: "/request-quote",
});

export default function RequestQuotePage() {
  return (
    <Section>
      <Container className="max-w-2xl">
        <Heading level={1}>Request a Quote</Heading>
        <p className="mt-3 text-foreground-muted">Tell us what you need and our team will respond with pricing and availability.</p>
        <div className="mt-8">
          <QuoteForm />
        </div>
      </Container>
    </Section>
  );
}
