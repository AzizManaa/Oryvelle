import type { Metadata } from "next";
import { absoluteUrl, PLAY_STORE_URL, SITE_DESCRIPTION, SITE_KEYWORDS, SITE_NAME } from "./site-config";

export const metadata: Metadata = {
  title: { absolute: "Oryvelle - Sounds, Meditation, and Sleep" },
  description:
    "Wind down with layered ambient sounds, guided meditation, breathing, bedtime routines, a fade timer, private sleep notes, and local insights on Android.",
  keywords: SITE_KEYWORDS,
  alternates: {
    canonical: absoluteUrl(),
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    url: absoluteUrl(),
    title: "Oryvelle - A Calmer Path to Sleep",
    description:
      "Mix ambient sounds, follow guided meditations, build a bedtime routine, and reflect with private sleep notes and local insights.",
    siteName: SITE_NAME,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Oryvelle sounds, meditation, and sleep routine app",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Oryvelle - A Calmer Path to Sleep",
    description:
      "Mix ambient sounds, follow guided meditations, build a bedtime routine, and reflect with private sleep notes and local insights.",
    images: ["/twitter-image"],
  },
};

export const homeJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": absoluteUrl("/#organization"),
      name: "NekoDesk",
      url: "https://aziz-manaa.com",
      email: "nekodesk.dev@gmail.com",
    },
    {
      "@type": "WebSite",
      "@id": absoluteUrl("/#website"),
      name: SITE_NAME,
      url: absoluteUrl(),
      description: SITE_DESCRIPTION,
      publisher: {
        "@id": absoluteUrl("/#organization"),
      },
      inLanguage: "en",
    },
    {
      "@type": "MobileApplication",
      "@id": absoluteUrl("/#app"),
      name: SITE_NAME,
      applicationCategory: "HealthApplication",
      operatingSystem: "Android",
      description: SITE_DESCRIPTION,
      url: absoluteUrl(),
      installUrl: PLAY_STORE_URL,
      offers: {
        "@type": "Offer",
        availability: "https://schema.org/InStock",
        price: "0",
        priceCurrency: "USD",
      },
      publisher: {
        "@id": absoluteUrl("/#organization"),
      },
      featureList: [
        "Ambient relaxation soundscapes",
        "Layered sound mixing with up to five sounds with Premium",
        "Gentle fade timer",
        "Guided breathing exercises",
        "Guided meditation programs",
        "Sleep journal with mood tracking",
        "Sleep analytics and weekly insights",
        "Bedtime routine builder",
        "Private notes",
        "Optional Google Drive backup",
      ],
    },
  ],
};

