import { EmptyState } from "@/components/ui/EmptyState";
import { OfferCard } from "./OfferCard";
import type { Offer } from "@/lib/api/types";

export function OfferSection({ offers, emptyTitle = "No active offers" }: { offers: Offer[]; emptyTitle?: string }) {
  if (offers.length === 0) return <EmptyState title={emptyTitle} description="We are preparing new promotions. Check back soon." />;
  return (
    <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {offers.map((o) => (
        <li key={o.id}><OfferCard offer={o} /></li>
      ))}
    </ul>
  );
}
