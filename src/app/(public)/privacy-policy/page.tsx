import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Privacy Policy",
  description: "PureBlend Food Chemicals privacy policy.",
  path: "/privacy-policy",
});

export default function PrivacyPage() {
  return (
    <Section>
      <Container className="max-w-3xl">
        <Heading level={1}>Privacy Policy</Heading>
        <p className="mt-4 text-neutral-700">
          {/* TEMPORARY — replace with CMS content via /api/content in a later phase. */}
          This page will contain the PureBlend privacy policy managed through the admin content system.
        </p>
      </Container>
    </Section>
  );
}
