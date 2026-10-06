import { cn } from "@/lib/utils";

type Tone = "info" | "success" | "warning" | "danger";

const tones: Record<Tone, string> = {
  info: "border-info-600/30 bg-sky-50 text-sky-900",
  success: "border-green-600/30 bg-green-50 text-green-900",
  warning: "border-amber-600/30 bg-amber-50 text-amber-900",
  danger: "border-danger-600/30 bg-red-50 text-red-900",
};

export function Alert({ tone = "info", title, children }: { tone?: Tone; title?: string; children: React.ReactNode }) {
  return (
    <div role={tone === "danger" ? "alert" : "status"} className={cn("rounded-md border p-4 text-sm", tones[tone])}>
      {title && <p className="font-semibold">{title}</p>}
      <div className={title ? "mt-1" : ""}>{children}</div>
    </div>
  );
}
