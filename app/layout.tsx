import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { absoluteUrl, SITE_DESCRIPTION, SITE_NAME } from "./site-config";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(absoluteUrl()),
  applicationName: SITE_NAME,
  title: {
    default: "Oryvelle - Privacy-First Sleep Companion",
    template: "%s | Oryvelle",
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    url: absoluteUrl(),
    siteName: SITE_NAME,
    title: "Oryvelle - Privacy-First Sleep Companion",
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Oryvelle sleep companion in a calm night field",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Oryvelle - Privacy-First Sleep Companion",
    description: SITE_DESCRIPTION,
    images: ["/twitter-image"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:border focus:border-[#00E0C7]/40 focus:bg-[#080510] focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-[#EDEAF5]"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
