import type { Metadata } from "next";
import { absoluteUrl, SITE_NAME } from "./site-config";

export function informationMetadata(
  path: "/privacy" | "/support" | "/terms",
  title: string,
  description: string,
): Metadata {
  const shareTitle = `${title} | ${SITE_NAME}`;

  return {
    title,
    description,
    alternates: { canonical: absoluteUrl(path) },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      url: absoluteUrl(path),
      siteName: SITE_NAME,
      title: shareTitle,
      description,
      images: [{
        url: absoluteUrl("/opengraph-image"),
        width: 1200,
        height: 630,
        alt: "Oryvelle Android sleep companion preview",
      }],
    },
    twitter: {
      card: "summary_large_image",
      title: shareTitle,
      description,
      images: [absoluteUrl("/twitter-image")],
    },
  };
}
