import { cn } from "@/lib/utils";

export function Spinner({ className, label = "Loading" }: { className?: string; label?: string }) {
  return (
    <span role="status" aria-label={label} className={cn("inline-flex", className)}>
      <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-brand-600 border-t-transparent" aria-hidden="true" />
    </span>
  );
}
