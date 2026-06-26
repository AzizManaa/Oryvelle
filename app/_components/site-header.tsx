import Image from "next/image";
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
          aria-label="Oryvelle home"
          className="flex min-w-0 items-center gap-1.5 transition-opacity hover:opacity-75"
        >
          <span className="relative h-7 w-7 overflow-hidden rounded-full border border-white/[0.12] bg-background shadow-[0_0_22px_rgba(184,154,255,0.25)]">
            <Image
              src="/icons/web-app-manifest-192x192.png"
              alt="O"
              width={28}
              height={28}
              className="h-full w-full object-cover"
              priority
            />
          </span>
          <span className="text-sm font-medium tracking-[0.18em] text-foreground uppercase drop-shadow-[0_2px_10px_rgba(0,0,0,0.55)]">
            Ryvelle
          </span>
        </Link>

        <nav
          aria-label="Site pages"
          className="hidden items-center gap-6 text-sm drop-shadow-[0_2px_10px_rgba(0,0,0,0.55)] md:flex"
        >
          {activePage === "privacy" ? (
            <span className="text-foreground">Privacy</span>
          ) : (
            <Link
              href="/privacy"
              className="text-subtle transition-colors hover:text-muted"
            >
              Privacy
            </Link>
          )}
          {activePage === "support" ? (
            <span className="text-foreground">Support</span>
          ) : (
            <Link
              href="/support"
              className="text-subtle transition-colors hover:text-muted"
            >
              Support
            </Link>
          )}
          {activePage === "terms" ? (
            <span className="text-foreground">Terms</span>
          ) : (
            <Link
              href="/terms"
              className="text-subtle transition-colors hover:text-muted"
            >
              Terms
            </Link>
          )}
        </nav>

        <div className="flex shrink-0 items-center gap-3">
          <nav
            aria-label="Site pages"
            className="flex items-center gap-4 text-xs drop-shadow-[0_2px_10px_rgba(0,0,0,0.55)] md:hidden"
          >
            {activePage === "privacy" ? (
              <span className="font-medium text-foreground">Privacy</span>
            ) : (
              <Link
                href="/privacy"
                className="font-medium text-subtle transition-colors hover:text-muted"
              >
                Privacy
              </Link>
            )}
            {activePage === "support" ? (
              <span className="font-medium text-foreground">Support</span>
            ) : (
              <Link
                href="/support"
                className="font-medium text-subtle transition-colors hover:text-muted"
              >
                Support
              </Link>
            )}
            {activePage === "terms" ? (
              <span className="font-medium text-foreground">Terms</span>
            ) : (
              <Link
                href="/terms"
                className="font-medium text-subtle transition-colors hover:text-muted"
              >
                Terms
              </Link>
            )}
          </nav>
          <button
            type="button"
            disabled
            className="h-9 rounded-full border border-teal/30 bg-teal/10 px-3 text-xs font-medium text-foreground shadow-[0_0_24px_rgba(0,224,199,0.1)] sm:px-4"
          >
            <span className="hidden sm:inline">Coming soon</span>
            <span className="sm:hidden">Soon</span>
          </button>
        </div>
      </div>
    </header>
  );
}
