/** Join class names, dropping falsy values. (Install `clsx`+`tailwind-merge` later if needed.) */
export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}
