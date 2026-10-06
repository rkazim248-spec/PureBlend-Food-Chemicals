import { cn } from "@/lib/utils";

type Tone = "success" | "error" | "info";

const tones: Record<Tone, string> = {
  success: "bg-green-800 text-white",
  error: "bg-red-800 text-white",
  info: "bg-neutral-900 text-white",
};

export function Toast({ tone = "info", message }: { tone?: Tone; message: string }) {
  return (
    <div role="status" className={cn("fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-md px-4 py-3 text-sm shadow-raised", tones[tone])}>
      {message}
    </div>
  );
}
