import { Heading } from "@/components/ui/Heading";
import { EmptyState } from "@/components/ui/EmptyState";

export function AdminModuleShell({ title, description }: { title: string; description: string }) {
  return (
    <div>
      <Heading level={1}>{title}</Heading>
      <p className="mt-2 text-neutral-600">{description}</p>
      <div className="mt-8">
        <EmptyState
          title={`${title} management is not connected yet`}
          description="CRUD tables and forms will be built here in a later phase using the approved API contract."
        />
      </div>
    </div>
  );
}
