import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { MobileNav } from "./MobileNav";

export const publicNav = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/solutions", label: "Solutions" },
  { href: "/offers", label: "Offers" },
  { href: "/about", label: "About" },
  { href: "/faqs", label: "FAQs" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-[#F8FAF7]/90 backdrop-blur-md">
      <Container className="flex h-14 items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-2 font-extrabold text-brand-600">
          <Image src="/pureblend-light-mode-logo.svg" alt="PureBlend Food Chemicals" width={240} height={60} priority className="h-8 w-auto" />
        </Link>
        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-1 rounded-full bg-surface-muted px-1 py-1 text-sm font-semibold text-neutral-700">
            {publicNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="rounded-full px-3 py-1.5 transition-colors hover:bg-white hover:text-brand-600 focus-visible:outline-2 focus-visible:outline-brand-600">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="hidden md:flex items-center gap-2">
          <Link href="/sign-in" className="rounded-full px-3 py-2 text-sm font-semibold text-brand-700 transition-colors hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-brand-600">
            <span aria-hidden="true">↪</span> Sign in
          </Link>
          <Link href="/create-account" className="rounded-full border border-brand-200 px-3 py-2 text-sm font-semibold text-brand-700 transition-colors hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-brand-600">
            <span aria-hidden="true">+</span> Create account
          </Link>
        </div>
        <MobileNav
          items={publicNav}
          extraItems={[
            { href: "/sign-in", label: "Sign in" },
            { href: "/create-account", label: "Create account" },
          ]}
        />
      </Container>
    </header>
  );
}
