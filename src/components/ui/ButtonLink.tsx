import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";

const variantClasses: Record<Variant, string> = {
  primary: "bg-brand-600 text-white hover:bg-brand-700",
  secondary: "bg-white text-brand-700 border border-brand-600 hover:bg-brand-50",
  ghost: "text-brand-700 hover:underline underline-offset-4",
  danger: "bg-danger-600 text-white hover:bg-red-800",
};

export interface ButtonLinkProps extends ComponentProps<typeof Link> {
  variant?: Variant;
  size?: "sm" | "md" | "lg";
}

export function ButtonLink({ variant = "primary", size = "md", className, ...props }: ButtonLinkProps) {
  const sizeClasses = size === "sm" ? "h-9 px-3 text-sm" : size === "lg" ? "h-12 px-6 text-base" : "h-11 px-5 text-sm";
  return (
    <Link
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600",
        variantClasses[variant],
        variant === "ghost" ? "h-auto px-0" : sizeClasses,
        className,
      )}
      {...props}
    />
  );
}
