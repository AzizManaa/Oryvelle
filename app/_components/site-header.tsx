import Link from "next/link";

type SiteHeaderProps = {
  activePage?: "privacy" | "support" | "terms";
};

export function SiteHeader({ activePage }: SiteHeaderProps) {
  return (
    <header className="fixed inset-x-0 top-0 z-30">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-3 px-5 sm:px-8">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-3 transition-opacity hover:opacity-75"
        >
          <span className="h-2.5 w-2.5 rounded-full bg-[#00E0C7] shadow-[0_0_18px_rgba(0,224,199,0.8)]" />
          <span className="text-sm font-medium tracking-[0.18em] text-[#EDEAF5] uppercase drop-shadow-[0_2px_10px_rgba(0,0,0,0.55)]">
            Oryvelle
          </span>
        </Link>

        <nav
          aria-label="Site pages"
          className="hidden items-center gap-6 text-sm drop-shadow-[0_2px_10px_rgba(0,0,0,0.55)] md:flex"
        >
          {activePage === "privacy" ? (
            <span className="text-[#EDEAF5]">Privacy</span>
          ) : (
            <Link
              href="/privacy"
              className="text-[#9A9CAF] transition-colors hover:text-[#B8B5C7]"
            >
              Privacy
            </Link>
          )}
          {activePage === "support" ? (
            <span className="text-[#EDEAF5]">Support</span>
          ) : (
            <Link
              href="/support"
              className="text-[#9A9CAF] transition-colors hover:text-[#B8B5C7]"
            >
              Support
            </Link>
          )}
          {activePage === "terms" ? (
            <span className="text-[#EDEAF5]">Terms</span>
          ) : (
            <Link
              href="/terms"
              className="text-[#9A9CAF] transition-colors hover:text-[#B8B5C7]"
            >
              Terms
            </Link>
          )}
        </nav>

        <div className="flex shrink-0 items-center gap-3">
          {activePage === "privacy" ? (
            <span className="text-xs font-medium text-[#EDEAF5] drop-shadow-[0_2px_10px_rgba(0,0,0,0.55)] md:hidden">
              Privacy
            </span>
          ) : (
            <Link
              href="/privacy"
              className="text-xs font-medium text-[#9A9CAF] drop-shadow-[0_2px_10px_rgba(0,0,0,0.55)] transition-colors hover:text-[#B8B5C7] md:hidden"
            >
              Privacy
            </Link>
          )}
          <button
            type="button"
            disabled
            className="h-9 rounded-full border border-[#00E0C7]/30 bg-[#00E0C7]/10 px-3 text-xs font-medium text-[#EDEAF5] shadow-[0_0_24px_rgba(0,224,199,0.1)] sm:px-4"
          >
            <span className="hidden sm:inline">Coming soon</span>
            <span className="sm:hidden">Soon</span>
          </button>
        </div>
      </div>
    </header>
  );
}
