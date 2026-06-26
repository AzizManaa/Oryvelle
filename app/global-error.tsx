"use client";

import Link from "next/link";
import "./globals.css";

export default function GlobalError({
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <main className="relative min-h-screen overflow-hidden bg-background px-5 py-24 text-foreground sm:px-8">
          <title>Signal Interrupted | Oryvelle</title>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_22%_24%,rgba(255,184,122,0.13),transparent_22rem),radial-gradient(circle_at_68%_54%,rgba(0,224,199,0.14),transparent_26rem),radial-gradient(circle_at_82%_82%,rgba(184,154,255,0.1),transparent_22rem)]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:100%_34px] opacity-20"
          />

          <div className="relative mx-auto grid min-h-[calc(100vh-12rem)] w-full max-w-6xl items-center gap-12 lg:grid-cols-[minmax(320px,1fr)_minmax(0,0.85fr)]">
            <div
              aria-hidden="true"
              className="relative mx-auto aspect-square w-full max-w-[420px]"
            >
              <div className="absolute inset-0 rounded-full border border-white/[0.08] bg-[#100B1D]/70 shadow-[0_0_120px_rgba(255,184,122,0.11)] backdrop-blur" />
              <div className="absolute inset-[14%] rounded-full border border-amber/20" />
              <div className="absolute inset-[28%] rounded-full border border-teal/20" />

              <div className="absolute top-1/2 left-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full border border-amber/45 bg-[radial-gradient(circle,rgba(255,184,122,0.24),rgba(255,184,122,0.05)_58%,transparent_72%)] shadow-[0_0_70px_rgba(255,184,122,0.26)]" />
              <div className="absolute top-1/2 left-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground shadow-[0_0_24px_rgba(237,234,245,0.55)]" />

              <div className="absolute top-[18%] right-[18%] rounded-full border border-teal/25 px-3 py-1 text-[10px] font-medium tracking-[0.22em] text-teal uppercase">
                retry
              </div>

              <div className="absolute right-[10%] bottom-[18%] left-[10%] rounded-[8px] border border-white/[0.1] bg-background/85 p-4">
                <div className="mb-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-medium tracking-[0.24em] text-amber uppercase">
                      Signal interrupted
                    </p>
                    <p className="mt-1 text-sm font-medium text-ink">
                      Session paused
                    </p>
                  </div>
                  <div className="h-2.5 w-2.5 rounded-full bg-amber shadow-[0_0_18px_rgba(255,184,122,0.7)]" />
                </div>
                <div className="flex h-12 items-center gap-1.5">
                  {[8, 16, 24, 38, 22, 12, 4, 4, 12, 26, 18, 10].map(
                    (height, index) => (
                      <span
                        key={`${height}-${index}`}
                        className="block flex-1 rounded-full bg-white/[0.14]"
                        style={{ height }}
                      />
                    ),
                  )}
                </div>
              </div>
            </div>

            <div>
              <p className="mb-4 text-xs font-medium tracking-[0.28em] text-amber uppercase">
                Quiet glitch
              </p>
              <h1 className="text-balance text-4xl leading-tight font-semibold text-ink sm:text-6xl">
                The calm hit a bad note.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-8 text-muted">
                Something interrupted Oryvelle before the page could settle in.
                Try again, or head home and start from a clean mix.
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
                  href="/"
                  className="rounded-full border border-white/[0.12] px-5 py-3 text-sm font-medium text-muted transition-colors hover:border-white/[0.22] hover:text-ink"
                >
                  Home
                </Link>
              </div>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
