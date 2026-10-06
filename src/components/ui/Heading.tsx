import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

const levelClasses = {
  1: "text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight",
  2: "text-2xl sm:text-3xl font-bold tracking-tight",
  3: "text-xl sm:text-2xl font-bold",
  4: "text-lg font-bold",
} as const;

interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4;
}

export function Heading({ level = 2, className, ...props }: HeadingProps) {
  const Tag = `h${level}` as "h1" | "h2" | "h3" | "h4";
  return <Tag className={cn("text-neutral-900", levelClasses[level], className)} {...props} />;
}
