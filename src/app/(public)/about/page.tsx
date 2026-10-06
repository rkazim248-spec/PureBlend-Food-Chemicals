import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "About",
  description: "About PureBlend Food Chemicals.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <Section>
      <Container className="max-w-3xl">
        <Heading level={1}>About PureBlend</Heading>
        <div className="prose-neutral mt-6 space-y-4 text-neutral-700">
          <p>
            PureBlend Food Chemicals serves food manufacturers with ingredients and ingredient
            solutions. This introduction is replaceable placeholder copy — the final text will be
            managed through the admin content system.
          </p>
          <h2 className="text-xl font-bold text-neutral-900">What we do</h2>
          <p>
            We document our products clearly, publish current offers, and answer common questions
            through our FAQ and assistant.
          </p>
          <h2 className="text-xl font-bold text-neutral-900">Get in touch</h2>
          <p>
            For specifications, samples, or partnership questions, reach out through our contact page.
          </p>
        </div>
        <ButtonLink href="/contact" className="mt-8">Contact us</ButtonLink>
      </Container>
    </Section>
  );
}
