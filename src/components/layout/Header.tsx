import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { MobileNav } from "./MobileNav";

export const publicNav = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/products", label: "Products" },
  { href: "/offers", label: "Offers" },
  { href: "/faqs", label: "FAQs" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/95 backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 font-extrabold text-brand-700">
          <span className="inline-block h-8 w-8 rounded-md bg-brand-600" aria-hidden="true" />
          <span className="text-lg tracking-tight">PureBlend</span>
        </Link>
        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-6 text-sm font-semibold text-neutral-700">
            {publicNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="rounded hover:text-brand-700 focus-visible:outline-2 focus-visible:outline-brand-600">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="hidden md:block">
          <ButtonLink href="/contact" size="sm">Get in touch</ButtonLink>
        </div>
        <MobileNav items={publicNav} />
      </Container>
    </header>
  );
}
