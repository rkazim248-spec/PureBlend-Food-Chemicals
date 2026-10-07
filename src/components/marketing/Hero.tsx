import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import Image from "next/image";
import type { Banner } from "@/lib/api/types";

export function Hero({ banner }: { banner?: Banner | null }) {
  if (!banner) {
    return (
      <section className="bg-[#F8FAF7] py-20 text-foreground">
        <Container>
          <Heading level={1} className="max-w-2xl text-brand-600">PureBlend Food Chemicals</Heading>
          <p className="mt-4 max-w-xl text-foreground-muted">Reliable food-ingredient solutions for modern manufacturers.</p>
          <ButtonLink href="/products" className="mt-8">Browse products</ButtonLink>
        </Container>
      </section>
    );
  }

  return (
    <section className="relative bg-[#F8FAF7] py-16 lg:py-24 text-foreground">
      <Container className="relative">
        <div className="grid items-center gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7 space-y-6">
            <p className="inline-flex items-center gap-2 rounded-full bg-surface-muted px-4 py-1.5 text-xs font-semibold tracking-wide text-brand-600">
              <span className="h-2 w-2 rounded-full bg-brand-500 animate-pulse" aria-hidden="true" />
              FOOD CHEMICALS &amp; INGREDIENT SOLUTIONS
            </p>
            <Heading level={1} className="max-w-2xl text-brand-600">{banner.title}</Heading>
            {banner.description && <p className="max-w-2xl text-foreground-muted">{banner.description}</p>}
            <div className="flex flex-wrap gap-3">
              <ButtonLink href={banner.linkUrl ?? "/products"}>{banner.linkLabel ?? "Explore Products"}</ButtonLink>
              <ButtonLink href="/request-quote" variant="secondary">Request a Quote</ButtonLink>
            </div>
          </div>
          <div className="lg:col-span-5 relative rounded-xl overflow-hidden border border-brand-800 bg-brand-900 p-2">
            <Image src={banner.imageUrl} alt={banner.imageAlt} width={800} height={560} priority className="w-full h-[420px] object-cover rounded-lg" />
          </div>
        </div>
      </Container>
    </section>
  );
}
