import { Badge } from "@/components/ui/Badge";

export function OfferBadge({ discountText }: { discountText: string }) {
  return <Badge tone="warning">{discountText}</Badge>;
}
