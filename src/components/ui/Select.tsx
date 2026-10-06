import { cn } from "@/lib/utils";
import { forwardRef, useId, type SelectHTMLAttributes } from "react";
import { Label } from "./Label";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, error, id, className, children, ...props },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;

  return (
    <div className="flex flex-col gap-1.5">
      {label && <Label htmlFor={inputId}>{label}</Label>}
      <select
        ref={ref}
        id={inputId}
        className={cn(
          "h-11 w-full rounded-md border bg-white px-3 text-sm text-neutral-900",
          "focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-brand-600",
          "disabled:bg-neutral-100 disabled:text-neutral-500",
          error ? "border-danger-600" : "border-neutral-300",
          className,
        )}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        {...props}
      >
        {children}
      </select>
      {error && (
        <p id={errorId} role="alert" className="text-sm text-danger-600">
          {error}
        </p>
      )}
    </div>
  );
});
