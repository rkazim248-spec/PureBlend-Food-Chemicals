import Link from "next/link";
import type { Offer } from "@/lib/api/types";

/** Full-width highlight banner for a single offer. */
export function OfferBanner({ offer }: { offer: Offer }) {
  return (
    <div className="rounded-lg bg-brand-600 p-6 text-white sm:p-10">
      <p className="text-sm font-bold uppercase tracking-widest text-accent-300">{offer.discountText}</p>
      <p className="mt-2 text-2xl font-extrabold">{offer.title}</p>
      {offer.description && <p className="mt-2 max-w-xl text-brand-100">{offer.description}</p>}
      <Link href="/offers" className="mt-4 inline-block font-semibold underline underline-offset-4">See all offers</Link>
    </div>
  );
}
