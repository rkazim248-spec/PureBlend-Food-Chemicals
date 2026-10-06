"use client";

export default function AdminError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-xl font-bold text-neutral-900">Something went wrong</h1>
      <p className="text-sm text-neutral-600">The admin area hit an unexpected error.</p>
      <button type="button" onClick={reset} className="rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700">
        Try again
      </button>
    </div>
  );
}
