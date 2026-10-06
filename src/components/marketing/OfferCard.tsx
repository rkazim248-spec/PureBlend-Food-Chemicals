import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import type { Offer } from "@/lib/api/types";

export function OfferCard({ offer }: { offer: Offer }) {
  return (
    <Card className="flex h-full flex-col gap-2">
      <div className="flex items-center justify-between">
        <Badge tone="warning">{offer.discountText}</Badge>
        {offer.validTo && <span className="text-xs text-neutral-500">Until {new Date(offer.validTo).toLocaleDateString()}</span>}
      </div>
      <h3 className="text-lg font-bold text-neutral-900">{offer.title}</h3>
      {offer.description && <p className="text-sm text-neutral-600">{offer.description}</p>}
    </Card>
  );
}
