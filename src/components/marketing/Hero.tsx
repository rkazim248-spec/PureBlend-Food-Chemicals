import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import Image from "next/image";
import type { Banner } from "@/lib/api/types";

export function Hero({ banner }: { banner?: Banner | null }) {
  if (!banner) {
    return (
      <section className="bg-brand-950 py-20 text-white">
        <Container>
          <Heading level={1} className="max-w-2xl text-white">PureBlend Food Chemicals</Heading>
          <p className="mt-4 max-w-xl text-brand-100">Reliable food-ingredient solutions for modern manufacturers.</p>
          <ButtonLink href="/products" className="mt-8">Browse products</ButtonLink>
        </Container>
      </section>
    );
  }

  return (
    <section className="relative bg-brand-950 py-20 text-white">
      <Image src={banner.imageUrl} alt={banner.imageAlt} fill priority sizes="100vw" className="object-cover opacity-30" />
      <Container className="relative">
        <Heading level={1} className="max-w-2xl text-white">{banner.title}</Heading>
        {banner.description && <p className="mt-4 max-w-xl text-brand-100">{banner.description}</p>}
        {banner.linkUrl && (
          <ButtonLink href={banner.linkUrl} className="mt-8">{banner.linkLabel ?? "Learn more"}</ButtonLink>
        )}
      </Container>
    </section>
  );
}
