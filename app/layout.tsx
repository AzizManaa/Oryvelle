import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
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

export const viewport: Viewport = {
  themeColor: "#080510",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(absoluteUrl()),
  applicationName: SITE_NAME,
  title: {
    default: "Oryvelle - Ambient Sounds for Relaxing",
    template: "%s | Oryvelle",
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    url: absoluteUrl(),
    siteName: SITE_NAME,
    title: "Oryvelle - Ambient Sounds for Relaxing",
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Oryvelle ambient sounds app preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Oryvelle - Ambient Sounds for Relaxing",
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
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:border focus:border-teal/40 focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-foreground"
        >
          Skip to content
        </a>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
