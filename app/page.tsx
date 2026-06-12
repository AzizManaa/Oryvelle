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
  title: "Oryvelle - Ambient Sounds, Breathing, Timer, and Private Notes",
  description:
    "Use Oryvelle anytime you want to slow down: ambient soundscapes, breathing, fade timers, and private notes for Android.",
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
    title: "Oryvelle - Ambient Sounds, Breathing, and Private Notes",
    description:
      "Ambient soundscapes, breathing, fade timers, and private notes for quiet breaks, focus, rest, and sleep.",
    siteName: SITE_NAME,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Oryvelle ambient sounds app landing experience",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Oryvelle - Ambient Sounds, Breathing, and Private Notes",
    description:
      "Ambient soundscapes, breathing, fade timers, and private notes for quiet breaks, focus, rest, and sleep.",
    images: ["/twitter-image"],
  },
};

const moments: ParallaxMoment[] = [
  {
    id: "arrival",
    label: "Arrival",
    eyebrow: "Ambient sounds",
    title: "Sounds for when you need to reset.",
    body: "Mix rain, cabin air, forest sounds, or soft noise. Set a timer, breathe for a bit, and write a quick note if it helps.",
    accent: "#00E0C7",
    secondary: "#B89AFF",
    cue: "Start simple",
    panelBody: "Start with the sound you need right now, whether you are winding down, focusing, or trying to sleep.",
  },
  {
    id: "constellations",
    label: "Sound Mix",
    eyebrow: "Layer sounds",
    title: "Rain, cabin air, forest hush.",
    body: "Pick a few sounds, balance the mix, and let it sit in the background instead of becoming another thing to manage.",
    accent: "#67D7FF",
    secondary: "#8F82E8",
    cue: "Pick a mix",
    panelBody: "Keep a favorite mix ready for the next break, evening, or long night.",
  },
  {
    id: "mix",
    label: "Active Mix",
    eyebrow: "Simple controls",
    title: "The mix stays easy to reach.",
    body: "The controls are there when you need them and quiet when you do not.",
    accent: "#00E0C7",
    secondary: "#67D7FF",
    cue: "Active mix",
    panelBody: "Change the sound, check the timer, then get back to whatever you were doing.",
  },
  {
    id: "fade",
    label: "Fade Timer",
    eyebrow: "Fade timer",
    title: "Let the sound end gently.",
    body: "Set a timer and let the mix fade out on its own. Useful for naps, focus sessions, reading, or sleep.",
    accent: "#FFB87A",
    secondary: "#00E0C7",
    cue: "45 min fade",
    panelBody: "No abrupt stop, no need to come back just to turn the sound off.",
  },
  {
    id: "final",
    label: "Invite",
    eyebrow: "Coming soon",
    title: "Use it for the small pauses.",
    body: "Oryvelle is still being built. The goal is simple: sound, breathing, and notes without extra noise.",
    accent: "#FF6B9D",
    secondary: "#B89AFF",
    cue: "Coming soon",
    panelBody: "No ads, no analytics, and no account required to use the core app.",
  },
];

const seoHighlights = [
  {
    cue: "01",
    title: "Ambient soundscapes",
    body: "Layer rain, cabin air, forest hush, and soft noise into a mix that can stay in the background.",
  },
  {
    cue: "02",
    title: "Fade timer",
    body: "Set a timer and let the sound fade out without coming back to stop it manually.",
  },
  {
    cue: "03",
    title: "Private notes",
    body: "Write a quick note after a session, track how you felt, and keep it on your device by default.",
  },
  {
    cue: "04",
    title: "Optional Drive backup",
    body: "Use Oryvelle without an account, or choose Google Sign-In and Drive backup when you want an extra copy of your journal.",
  },
];

const trustSignals = ["No ads", "No analytics", "No required account"];

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
        "Ambient relaxation soundscapes",
        "Gentle fade timer",
        "Guided breathing",
        "Private notes",
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
        className="relative overflow-hidden border-t border-white/[0.08] bg-[#080510] px-5 py-20 sm:px-8 lg:py-28"
      >
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(0,224,199,0.55),rgba(184,154,255,0.35),transparent)]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(103,215,255,0.035),rgba(8,5,16,0)_32%),radial-gradient(circle_at_82%_18%,rgba(255,184,122,0.075),transparent_30%)]" />

        <div className="relative mx-auto grid w-full max-w-7xl gap-14 lg:grid-cols-[minmax(0,0.9fr)_minmax(440px,1.1fr)] lg:items-start">
          <div className="lg:sticky lg:top-28">
            <p className="mb-5 text-xs font-medium tracking-[0.3em] text-[#00E0C7] uppercase">
              Built for quiet breaks
            </p>
            <h2
              id="about-oryvelle"
              className="max-w-2xl text-3xl leading-tight font-semibold text-[#F7F3FF] sm:text-5xl"
            >
              For breaks, focus, rest, and sleep.
            </h2>
            <p className="mt-6 max-w-xl text-base leading-8 text-[#B8B5C7]">
              Use Oryvelle for focus, rest, sleep, or a few minutes away from
              the noise. Mix sounds, breathe for a bit, set a timer, and leave a
              note if it helps.
            </p>

            <div className="mt-8 flex flex-wrap gap-2">
              {trustSignals.map((signal) => (
                <span
                  key={signal}
                  className="rounded-full border border-white/[0.08] bg-white/[0.035] px-4 py-2 text-xs font-medium tracking-[0.14em] text-[#D8D4E8]/75 uppercase"
                >
                  {signal}
                </span>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
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

          <div className="relative">
            <div className="absolute left-3 top-3 bottom-3 w-px bg-[linear-gradient(180deg,rgba(0,224,199,0),rgba(0,224,199,0.34),rgba(184,154,255,0.18),rgba(0,224,199,0))]" />
            <div className="space-y-3">
              {seoHighlights.map((highlight) => (
                <article
                  key={highlight.title}
                  className="relative grid gap-4 rounded-lg border border-white/[0.075] bg-[#0D0A18]/72 p-5 pl-12 shadow-[0_18px_70px_rgba(0,0,0,0.2)] sm:grid-cols-[8rem_1fr] sm:gap-6 sm:p-6 sm:pl-14"
                >
                  <div className="absolute left-[0.7rem] top-6 grid h-5 w-5 place-items-center rounded-full border border-[#00E0C7]/40 bg-[#080510] shadow-[0_0_20px_rgba(0,224,199,0.25)]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#EDEAF5]" />
                  </div>
                  <p className="text-xs font-medium tracking-[0.28em] text-[#00E0C7] uppercase">
                    {highlight.cue}
                  </p>
                  <div>
                    <h3 className="text-lg font-semibold text-[#F7F3FF]">
                      {highlight.title}
                    </h3>
                    <p className="mt-2 text-sm leading-7 text-[#A8A5B8]">
                      {highlight.body}
                    </p>
                  </div>
                </article>
              ))}
            </div>

            <aside
              aria-label="Privacy note"
              className="mt-5 rounded-lg border border-[#67D7FF]/15 bg-[#67D7FF]/[0.045] p-5 text-sm leading-7 text-[#B8B5C7]"
            >
              Your notes, mixes, and preferences stay on your device unless you
              choose Google Drive backup. No ads, no analytics, no required
              account, and no medical claims.
            </aside>
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
