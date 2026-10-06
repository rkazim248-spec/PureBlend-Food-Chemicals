import { cn } from "@/lib/utils";
import { forwardRef, useId, type TextareaHTMLAttributes } from "react";
import { Label } from "./Label";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, error, id, className, ...props },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;

  return (
    <div className="flex flex-col gap-1.5">
      {label && <Label htmlFor={inputId}>{label}</Label>}
      <textarea
        ref={ref}
        id={inputId}
        className={cn(
          "min-h-28 w-full rounded-md border bg-white px-3 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400",
          "focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-brand-600 focus-visible:border-brand-600",
          "disabled:bg-neutral-100 disabled:text-neutral-500",
          error ? "border-danger-600" : "border-neutral-300",
          className,
        )}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        {...props}
      />
      {error && (
        <p id={errorId} role="alert" className="text-sm text-danger-600">
          {error}
        </p>
      )}
    </div>
  );
});
