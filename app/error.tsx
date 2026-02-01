"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#060a09] px-4 text-center">
      <h2 className="text-xl font-semibold text-emerald-100">Something went wrong</h2>
      <p className="max-w-md text-sm text-emerald-200/70">
        {error.message || "An unexpected error occurred."}
      </p>
      <button
        onClick={reset}
        className="rounded-full bg-emerald-400 px-6 py-2 text-sm font-semibold text-black transition hover:-translate-y-0.5"
      >
        Try again
      </button>
    </div>
  );
}
