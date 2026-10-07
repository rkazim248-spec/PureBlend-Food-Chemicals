import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { AiAssistantPanel } from "@/components/chat/AiAssistantPanel";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "AI Assistant",
  description: "Ask the PureBlend AI Assistant about products and solutions.",
  path: "/ai-assistant",
});

export default function AiAssistantPage() {
  return (
    <Section>
      <Container className="max-w-3xl">
        <Heading level={1}>PureBlend AI Assistant</Heading>
        <p className="mt-3 text-foreground-muted">
          Ask about our products, offers, FAQs, and contact options. Answers come only from approved PureBlend knowledge.
        </p>
        <div className="mt-8 rounded-xl border border-border bg-white shadow-card">
          <AiAssistantPanel />
        </div>
      </Container>
    </Section>
  );
}
