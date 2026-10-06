import { Badge } from "@/components/ui/Badge";

export function ProductBadge({ published }: { published: boolean }) {
  return <Badge tone={published ? "success" : "neutral"}>{published ? "Published" : "Draft"}</Badge>;
}
