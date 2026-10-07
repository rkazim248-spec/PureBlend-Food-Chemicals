import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Solutions",
  description: "Industry and application solutions from PureBlend Food Chemicals.",
  path: "/solutions",
});

const applications = [
  "Bakery & Dough Conditioning",
  "Beverage Formulation",
  "Dairy & Alternative Dairy",
  "Confectionery & Fillings",
  "Prepared Foods & Sauces",
  "Nutraceutical & Functional Foods",
];

export default function SolutionsPage() {
  return (
    <Section>
      <Container>
        <Heading level={1}>Solutions</Heading>
        <p className="mt-4 max-w-2xl text-foreground-muted">
          Application areas where PureBlend ingredient systems can be specified. Detailed application data will be loaded from the backend when available.
        </p>
        <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {applications.map((a) => (
            <li key={a} className="rounded-lg border border-border bg-white p-6 font-semibold text-brand-600 shadow-card">
              {a}
            </li>
          ))}
        </ul>
        <div className="mt-12 rounded-xl bg-brand-950 p-8 text-white">
          <Heading level={2} className="text-white">Need a formulation recommendation?</Heading>
          <p className="mt-3 max-w-xl text-brand-100">Talk to the PureBlend AI Assistant or request a quote from our team.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <ButtonLink href="/ai-assistant">Ask the AI Assistant</ButtonLink>
            <ButtonLink href="/request-quote" variant="secondary">Request a Quote</ButtonLink>
          </div>
        </div>
      </Container>
    </Section>
  );
}
