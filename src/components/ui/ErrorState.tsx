import type { ReactNode } from "react";
import { Button } from "./Button";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  action?: ReactNode;
}

export function ErrorState({ title = "Something went wrong", message = "We could not load this content. Please try again.", onRetry, action }: ErrorStateProps) {
  return (
    <div role="alert" className="rounded-lg border border-danger-600/30 bg-red-50 p-8 text-center">
      <p className="font-semibold text-red-900">{title}</p>
      <p className="mt-1 text-sm text-red-800">{message}</p>
      <div className="mt-4">
        {onRetry ? <Button variant="secondary" onClick={onRetry}>Try again</Button> : action}
      </div>
    </div>
  );
}
