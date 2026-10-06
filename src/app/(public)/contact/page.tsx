import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { ContactForm } from "@/components/forms/ContactForm";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Contact",
  description: "Get in touch with PureBlend Food Chemicals.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <Section>
      <Container className="max-w-2xl">
        <Heading level={1}>Contact us</Heading>
        <p className="mt-3 text-neutral-600">Send us a message and our team will get back to you.</p>
        <div className="mt-8">
          <ContactForm />
        </div>
      </Container>
    </Section>
  );
}
