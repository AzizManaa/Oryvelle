"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ErrorBoundary({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen bg-background px-5 py-28 text-foreground sm:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-14rem)] w-full max-w-2xl flex-col justify-center">
        <p className="mb-4 text-xs font-medium tracking-[0.28em] text-amber uppercase">
          Something went wrong
        </p>
        <h1 className="text-balance text-4xl leading-tight font-semibold text-ink sm:text-5xl">
          The page had trouble loading.
        </h1>
        <p className="mt-5 max-w-xl text-base leading-8 text-muted">
          Try loading it again. If it still fails, the support page has the best
          contact path.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => unstable_retry()}
            className="rounded-full border border-teal/30 bg-teal/10 px-5 py-3 text-sm font-medium text-foreground transition-colors hover:bg-teal/15"
          >
            Try again
          </button>
          <Link
            href="/support"
            className="rounded-full border border-white/[0.12] px-5 py-3 text-sm font-medium text-muted transition-colors hover:border-white/[0.22] hover:text-ink"
          >
            Support
          </Link>
        </div>
      </div>
    </main>
  );
}
