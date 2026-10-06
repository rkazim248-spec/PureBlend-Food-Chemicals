import type { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="rounded-lg border border-dashed border-neutral-300 bg-neutral-50 p-8 text-center">
      <p className="font-semibold text-neutral-800">{title}</p>
      {description && <p className="mt-1 text-sm text-neutral-600">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
