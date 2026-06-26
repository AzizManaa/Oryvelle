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
    <main className="min-h-screen bg-[#080510] px-5 py-28 text-[#EDEAF5] sm:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-14rem)] w-full max-w-2xl flex-col justify-center">
        <p className="mb-4 text-xs font-medium tracking-[0.28em] text-[#FFB87A] uppercase">
          Something went wrong
        </p>
        <h1 className="text-balance text-4xl leading-tight font-semibold text-[#F7F3FF] sm:text-5xl">
          The page had trouble loading.
        </h1>
        <p className="mt-5 max-w-xl text-base leading-8 text-[#B8B5C7]">
          Try loading it again. If it still fails, the support page has the best
          contact path.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => unstable_retry()}
            className="rounded-full border border-[#00E0C7]/30 bg-[#00E0C7]/10 px-5 py-3 text-sm font-medium text-[#EDEAF5] transition-colors hover:bg-[#00E0C7]/15"
          >
            Try again
          </button>
          <Link
            href="/support"
            className="rounded-full border border-white/[0.12] px-5 py-3 text-sm font-medium text-[#B8B5C7] transition-colors hover:border-white/[0.22] hover:text-[#F7F3FF]"
          >
            Support
          </Link>
        </div>
      </div>
    </main>
  );
}
