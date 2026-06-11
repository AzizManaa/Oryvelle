import type { Metadata } from "next";
import Link from "next/link";
import {
  ParallaxLandingExperience,
  type ParallaxMoment,
} from "./_components/parallax-landing-experience";
import { SiteHeader } from "./_components/site-header";
import {
  absoluteUrl,
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_NAME,
} from "./site-config";

export const metadata: Metadata = {
  title: "Oryvelle - Ambient Sleep Sounds, Timer, and Private Journal",
  description:
    "Build a softer path into sleep with Oryvelle: ambient soundscapes, a gentle fade timer, guided breathing, and a private sleep journal for Android.",
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
    title: "Oryvelle - Ambient Sleep Sounds and Private Sleep Journal",
    description:
      "A calm Android sleep companion for ambient soundscapes, fade timers, guided breathing, and private sleep notes.",
    siteName: SITE_NAME,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Oryvelle ambient sleep app landing experience",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Oryvelle - Ambient Sleep Sounds and Private Sleep Journal",
    description:
      "Ambient soundscapes, gentle fade timers, guided breathing, and private sleep notes for Android.",
    images: ["/twitter-image"],
  },
};

const moments: ParallaxMoment[] = [
  {
    id: "arrival",
    label: "Arrival",
    eyebrow: "Obsidian Sleep",
    title: "Build a softer path into sleep.",
    body: "Layer calming sounds, set a gentle timer, and leave a small note for morning. Oryvelle keeps the ritual quiet.",
    accent: "#00E0C7",
    secondary: "#B89AFF",
    cue: "Enter the night",
    panelBody: "The first layer is atmosphere: dark space, a living orb, and a ritual that does not rush you.",
  },
  {
    id: "constellations",
    label: "Constellations",
    eyebrow: "Layer the night",
    title: "Sound becomes a small constellation.",
    body: "Rain, cabin air, forest hush, and soft noise connect into a sky you can shape without opening another control panel.",
    accent: "#67D7FF",
    secondary: "#8F82E8",
    cue: "Stars align",
    panelBody: "Each sound is treated like a point in the night, close enough to guide you and quiet enough to disappear.",
  },
  {
    id: "mix",
    label: "Active Mix",
    eyebrow: "Mix without friction",
    title: "The ritual gathers around the orb.",
    body: "A living mix sits in reach while the rest of the page keeps its distance: visible, calm, and never crowded.",
    accent: "#00E0C7",
    secondary: "#67D7FF",
    cue: "Active mix",
    panelBody: "A soft glass preview comes forward only when it matters, then lets the night stay spacious.",
  },
  {
    id: "fade",
    label: "Fade Timer",
    eyebrow: "Fade without fuss",
    title: "Let the night close itself.",
    body: "Set a timer, let the mix fade, and leave the phone alone. The ritual keeps moving softly in the background.",
    accent: "#FFB87A",
    secondary: "#00E0C7",
    cue: "45 min fade",
    panelBody: "The constellation bends into time, then loosens its grip as the soundscape settles.",
  },
  {
    id: "final",
    label: "Invite",
    eyebrow: "First night soon",
    title: "Start with one softer night.",
    body: "Oryvelle is still arriving. The landing page should leave the same feeling as the app: quiet, curious, and close enough to return to.",
    accent: "#FF6B9D",
    secondary: "#B89AFF",
    cue: "Coming soon",
    panelBody: "No hard sell. Just a doorway into a calmer night ritual when the app is ready.",
  },
];

const seoHighlights = [
  {
    title: "Ambient sleep soundscapes",
    body: "Layer rain, cabin air, forest hush, and soft noise into a calm mix designed for winding down without a crowded dashboard.",
  },
  {
    title: "Gentle fade timer",
    body: "Set a timer and let the soundscape fade softly in the background, so the phone can stay out of the way once the ritual starts.",
  },
  {
    title: "Private sleep journal",
    body: "Leave a short morning note, track sleep ratings and mood tags, and keep the record on your device by default.",
  },
  {
    title: "Optional Drive backup",
    body: "Use Oryvelle without an account, or choose Google Sign-In and Drive backup when you want an extra copy of your journal.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": absoluteUrl("/#organization"),
      name: "NekoDesk",
      url: "https://nekodesk.com",
      email: "support@nekodesk.com",
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
      offers: {
        "@type": "Offer",
        availability: "https://schema.org/PreOrder",
        price: "0",
        priceCurrency: "USD",
      },
      publisher: {
        "@id": absoluteUrl("/#organization"),
      },
      featureList: [
        "Ambient sleep soundscapes",
        "Gentle fade timer",
        "Guided breathing",
        "Private sleep journal",
        "Optional Google Drive backup",
      ],
    },
  ],
};

export default function Home() {
  return (
    <main
      id="main-content"
      className="relative min-h-[100svh] bg-background text-foreground"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <SiteHeader />
      <ParallaxLandingExperience moments={moments} />
      <SeoContent />
    </main>
  );
}

function SeoContent() {
  return (
    <>
      <section
        aria-labelledby="about-oryvelle"
        className="relative border-t border-white/[0.08] bg-[#080510] px-5 py-20 sm:px-8 lg:py-28"
      >
        <div className="mx-auto grid w-full max-w-7xl gap-12 lg:grid-cols-[0.78fr_1.22fr]">
          <div>
            <p className="mb-4 text-xs font-medium tracking-[0.3em] text-[#00E0C7] uppercase">
              Sleep companion for Android
            </p>
            <h2
              id="about-oryvelle"
              className="max-w-xl text-3xl leading-tight font-semibold text-[#F7F3FF] sm:text-4xl"
            >
              Ambient sounds, a fade timer, and private notes for softer nights.
            </h2>
          </div>

          <div className="space-y-6 text-sm leading-7 text-[#B8B5C7] sm:text-base">
            <p>
              Oryvelle is a privacy-first sleep companion for building a calmer
              night ritual. It helps you layer ambient sounds, start guided
              breathing, set a gentle timer, and leave a simple sleep note in
              the morning.
            </p>
            <p>
              The app is designed to stay quiet: no advertising, no analytics,
              no required account, and no medical claims. Your journal, mixes,
              and preferences stay on your device unless you explicitly choose
              Google Drive backup.
            </p>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="sleep-features"
        className="bg-[#0B0715] px-5 py-18 sm:px-8 lg:py-24"
      >
        <div className="mx-auto w-full max-w-7xl">
          <div className="max-w-2xl">
            <p className="mb-4 text-xs font-medium tracking-[0.3em] text-[#67D7FF] uppercase">
              What Oryvelle does
            </p>
            <h2
              id="sleep-features"
              className="text-3xl leading-tight font-semibold text-[#F7F3FF] sm:text-4xl"
            >
              A focused toolkit for winding down.
            </h2>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {seoHighlights.map((highlight) => (
              <article
                key={highlight.title}
                className="rounded-lg border border-white/[0.08] bg-white/[0.035] p-6"
              >
                <h3 className="text-lg font-semibold text-[#F7F3FF]">
                  {highlight.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-[#A8A5B8]">
                  {highlight.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        aria-labelledby="privacy-first"
        className="bg-[#080510] px-5 py-18 sm:px-8 lg:py-24"
      >
        <div className="mx-auto grid w-full max-w-7xl gap-10 border-y border-white/[0.08] py-12 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="max-w-3xl">
            <p className="mb-4 text-xs font-medium tracking-[0.3em] text-[#00E0C7] uppercase">
              Privacy-first by default
            </p>
            <h2
              id="privacy-first"
              className="text-3xl leading-tight font-semibold text-[#F7F3FF] sm:text-4xl"
            >
              No ads, no analytics, no account required.
            </h2>
            <p className="mt-5 text-sm leading-7 text-[#B8B5C7] sm:text-base">
              Oryvelle keeps its core sleep features available offline after
              sounds are cached. Google Sign-In and Drive backup are optional,
              and the privacy policy explains exactly what stays local and what
              only happens when you choose it.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 lg:justify-end">
            <Link
              href="/privacy"
              className="rounded-full border border-[#00E0C7]/30 bg-[#00E0C7]/10 px-5 py-3 text-sm font-medium text-[#EDEAF5] transition-colors hover:bg-[#00E0C7]/15"
            >
              Privacy Policy
            </Link>
            <Link
              href="/support"
              className="rounded-full border border-white/[0.12] px-5 py-3 text-sm font-medium text-[#B8B5C7] transition-colors hover:border-white/[0.22] hover:text-[#F7F3FF]"
            >
              Support
            </Link>
          </div>
        </div>
      </section>

      <footer className="bg-[#080510] px-5 pb-10 text-sm text-[#7C8094] sm:px-8">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 border-t border-white/[0.08] pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p>Oryvelle by NekoDesk. Coming soon for Android.</p>
          <nav aria-label="Footer pages" className="flex flex-wrap gap-5">
            <Link
              href="/privacy"
              className="transition-colors hover:text-[#B8B5C7]"
            >
              Privacy
            </Link>
            <Link
              href="/support"
              className="transition-colors hover:text-[#B8B5C7]"
            >
              Support
            </Link>
            <Link
              href="/terms"
              className="transition-colors hover:text-[#B8B5C7]"
            >
              Terms
            </Link>
          </nav>
        </div>
      </footer>
    </>
  );
}
