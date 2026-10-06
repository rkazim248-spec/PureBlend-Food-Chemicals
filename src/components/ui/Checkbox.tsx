import { cn } from "@/lib/utils";
import { forwardRef, useId, type InputHTMLAttributes } from "react";

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, id, className, ...props },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <div className="flex items-center gap-2">
      <input
        ref={ref}
        type="checkbox"
        id={inputId}
        className={cn(
          "h-5 w-5 rounded border-neutral-300 text-brand-600 accent-brand-600 focus-visible:outline-2 focus-visible:outline-brand-600",
          className,
        )}
        {...props}
      />
      {label && <label htmlFor={inputId} className="text-sm text-neutral-800">{label}</label>}
    </div>
  );
});
