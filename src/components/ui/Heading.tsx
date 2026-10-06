import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

const levelClasses = {
  1: "text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold tracking-tight font-display",
  2: "text-2xl sm:text-4xl font-bold tracking-tight font-display",
  3: "text-xl sm:text-2xl font-bold font-display",
  4: "text-lg font-bold font-display",
} as const;

interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4;
}

export function Heading({ level = 2, className, ...props }: HeadingProps) {
  const Tag = `h${level}` as "h1" | "h2" | "h3" | "h4";
  return <Tag className={cn("text-neutral-900", levelClasses[level], className)} {...props} />;
}
