import { PublicLayout } from "@/components/layout/PublicLayout";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Terms & Conditions",
  description: "PureBlend Food Chemicals terms and conditions.",
  path: "/terms-and-conditions",
});

export default function TermsPage() {
  return (
    <PublicLayout>
      <Section>
        <Container className="max-w-3xl">
          <Heading level={1}>Terms &amp; Conditions</Heading>
          <p className="mt-4 text-neutral-700">
            {/* TEMPORARY — replace with CMS content via /api/content in a later phase. */}
            This page will contain the PureBlend terms and conditions managed through the admin content system.
          </p>
        </Container>
      </Section>
    </PublicLayout>
  );
}
