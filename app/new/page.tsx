import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import OpeningChapter from "@/components/landing/chapters/opening/OpeningChapter";
const outfit = Outfit({ subsets: ["latin"], weight: ["300", "400"], variable: "--font-opening", display: "swap" });
export const metadata: Metadata = { title: "A quieter evening", robots: { index: false, follow: false } };
export default async function OpeningPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const development = process.env.NODE_ENV === "development";
  const params = development ? await searchParams : {};
  return <div className={outfit.variable}>
    <script dangerouslySetInnerHTML={{ __html: `window.__openingScrollRestoration=history.scrollRestoration;history.scrollRestoration="manual";window.scrollTo(0,0);` }} />
    <OpeningChapter preview={development && typeof params.pose === "string" ? params.pose : undefined} debug={development && params.debug === "1"} posterOnly={development && params.poster === "1"} interactiveExplore />
  </div>;
}
