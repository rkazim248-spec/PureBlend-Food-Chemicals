import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { config } from "@/lib/config";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-neutral-200 bg-neutral-950 text-neutral-300">
      <Container className="grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-extrabold text-white">PureBlend</p>
          <p className="mt-2 text-sm text-neutral-400">Food chemicals and food-ingredient solutions.</p>
        </div>
        <nav aria-label="Footer">
          <h2 className="text-sm font-bold uppercase tracking-wide text-white">Company</h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link href="/about" className="hover:text-white">About</Link></li>
            <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
          </ul>
        </nav>
        <nav aria-label="Products">
          <h2 className="text-sm font-bold uppercase tracking-wide text-white">Explore</h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link href="/products" className="hover:text-white">Products</Link></li>
            <li><Link href="/offers" className="hover:text-white">Offers</Link></li>
            <li><Link href="/faqs" className="hover:text-white">FAQs</Link></li>
          </ul>
        </nav>
        <nav aria-label="Legal">
          <h2 className="text-sm font-bold uppercase tracking-wide text-white">Legal</h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link href="/privacy-policy" className="hover:text-white">Privacy Policy</Link></li>
            <li><Link href="/terms-and-conditions" className="hover:text-white">Terms &amp; Conditions</Link></li>
          </ul>
        </nav>
        {config.socials.length > 0 && (
          <nav aria-label="Social">
            <h2 className="text-sm font-bold uppercase tracking-wide text-white">Follow</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {config.socials.map((s) => (
                <li key={s.href}><a href={s.href} target="_blank" rel="noopener noreferrer" className="hover:text-white">{s.label}</a></li>
              ))}
            </ul>
          </nav>
        )}
      </Container>
      <div className="border-t border-neutral-800 py-4">
        <Container>
          <p className="text-xs text-neutral-500">© {new Date().getFullYear()} PureBlend Food Chemicals. All rights reserved.</p>
        </Container>
      </div>
    </footer>
  );
}
