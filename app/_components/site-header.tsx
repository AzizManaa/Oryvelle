"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { PLAY_STORE_URL } from "../site-config";

type SiteHeaderProps = {
  activePage?: "privacy" | "support" | "terms";
};

export function SiteHeader({ activePage }: SiteHeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const updateHeader = () => setIsScrolled(window.scrollY > 12);
    const initialFrame = window.requestAnimationFrame(updateHeader);

    window.addEventListener("scroll", updateHeader, { passive: true });

    return () => {
      window.cancelAnimationFrame(initialFrame);
      window.removeEventListener("scroll", updateHeader);
    };
  }, []);

  return (
    <header
      className={[
        "fixed inset-x-0 top-0 z-30 border-b transition-[background-color,border-color,box-shadow,backdrop-filter] duration-300",
        isScrolled
          ? "border-white/[0.08] bg-[#080510]/88 shadow-[0_14px_40px_rgba(3,1,8,0.28)] backdrop-blur-xl"
          : "border-transparent bg-transparent",
      ].join(" ")}
    >
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-3 px-5 sm:px-8">
        <Link
          href="/"
          aria-label="Oryvelle home"
          className="flex shrink-0 items-center gap-1.5 transition-opacity hover:opacity-75"
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
          <span className="hidden text-sm font-medium tracking-[0.18em] text-foreground uppercase drop-shadow-[0_2px_10px_rgba(0,0,0,0.55)] sm:inline">
            Oryvelle
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
            className="flex items-center gap-4 text-xs drop-shadow-[0_2px_10px_rgba(0,0,0,0.55)] max-[359px]:hidden md:hidden"
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
          <a
            href={PLAY_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Get Oryvelle on Google Play"
            className="block shrink-0 transition-opacity hover:opacity-85"
          >
            <Image
              src="/google-play-badge.png"
              alt="Get it on Google Play"
              width={646}
              height={250}
              className="h-auto w-28 sm:w-32"
            />
          </a>
        </div>
      </div>
    </header>
  );
}
