import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "./_components/site-header";

export const metadata: Metadata = {
  title: "Lost Signal",
  description: "This Oryvelle page drifted out of range.",
};

export default function NotFound() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#080510] text-[#EDEAF5]">
      <SiteHeader />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_28%,rgba(0,224,199,0.16),transparent_28rem),radial-gradient(circle_at_78%_72%,rgba(184,154,255,0.12),transparent_24rem)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:72px_72px] opacity-20"
      />

      <main
        id="main-content"
        className="relative mx-auto grid min-h-screen w-full max-w-6xl items-center gap-12 px-5 py-28 sm:px-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(320px,1fr)]"
      >
        <div>
          <p className="mb-4 text-xs font-medium tracking-[0.28em] text-[#00E0C7] uppercase">
            404 Hz
          </p>
          <h1 className="text-balance text-4xl leading-tight font-semibold text-[#F7F3FF] sm:text-6xl">
            This sound wandered off.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-8 text-[#B8B5C7]">
            We checked the rain, the cabin air, and the quiet corner behind the
            timer. Nothing here. The page may have moved, or the link may be a
            little too relaxed.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/"
              className="rounded-full border border-[#00E0C7]/30 bg-[#00E0C7]/10 px-5 py-3 text-sm font-medium text-[#EDEAF5] transition-colors hover:bg-[#00E0C7]/15"
            >
              Back to calm
            </Link>
            <Link
              href="/support"
              className="rounded-full border border-white/[0.12] px-5 py-3 text-sm font-medium text-[#B8B5C7] transition-colors hover:border-white/[0.22] hover:text-[#F7F3FF]"
            >
              Ask support
            </Link>
          </div>
        </div>

        <div
          aria-hidden="true"
          className="relative mx-auto aspect-square w-full max-w-[440px]"
        >
          <div className="absolute inset-0 rounded-full border border-white/[0.08] bg-[#100B1D]/70 shadow-[0_0_120px_rgba(0,224,199,0.14)] backdrop-blur" />
          <div className="absolute inset-[13%] rounded-full border border-[#00E0C7]/20" />
          <div className="absolute inset-[25%] rounded-full border border-[#B89AFF]/20" />
          <div className="absolute top-1/2 left-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#00E0C7]/45 bg-[radial-gradient(circle,rgba(0,224,199,0.28),rgba(0,224,199,0.04)_58%,transparent_70%)] shadow-[0_0_70px_rgba(0,224,199,0.35)]" />

          <div className="absolute top-[22%] left-1/2 flex -translate-x-1/2 items-end gap-2">
            {[22, 38, 54, 32, 68, 26, 46, 18].map((height, index) => (
              <span
                key={`${height}-${index}`}
                className="block w-2 rounded-full bg-[#00E0C7]/70 shadow-[0_0_18px_rgba(0,224,199,0.45)]"
                style={{ height }}
              />
            ))}
          </div>

          <div className="absolute right-[12%] bottom-[22%] left-[12%] rounded-[8px] border border-white/[0.1] bg-[#080510]/85 p-4">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-[10px] font-medium tracking-[0.24em] text-[#FFB87A] uppercase">
                  Missing mix
                </p>
                <p className="mt-1 text-sm font-medium text-[#F7F3FF]">
                  Page not found
                </p>
              </div>
              <p className="text-xs text-[#B8B5C7]">0:04</p>
            </div>
            <div className="flex h-12 items-center gap-1.5">
              {[12, 18, 30, 16, 8, 0, 0, 0, 20, 14, 26, 10].map(
                (height, index) => (
                  <span
                    key={`${height}-${index}`}
                    className="block flex-1 rounded-full bg-white/[0.14]"
                    style={{ height: height || 2 }}
                  />
                ),
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
