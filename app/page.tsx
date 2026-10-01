import type { Metadata } from "next";
import Link from "next/link";
import {
  ParallaxLandingExperience,
  type ParallaxMoment,
} from "./_components/parallax-landing-experience";
import { SiteHeader } from "./_components/site-header";
import {
  absoluteUrl,
  PLAY_STORE_URL,
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_NAME,
} from "./site-config";

export const metadata: Metadata = {
  title: "Oryvelle - Sounds, Meditation, Routines, and Sleep Insights",
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

const moments: ParallaxMoment[] = [
  {
    id: "arrival",
    label: "Arrival",
    eyebrow: "Your bedtime companion",
    title: "A calmer path into sleep.",
    body: "Oryvelle brings layered ambient sounds, guided meditation, breathing, bedtime routines, and private sleep reflection into one quiet Android app.",
    accent: "#00E0C7",
    secondary: "#B89AFF",
    cue: "Start simple",
    panelBody: "Start with Tonight’s Path or choose the sound, practice, or routine that fits this evening.",
  },
  {
    id: "constellations",
    label: "Sound Mix",
    eyebrow: "Layer sounds",
    title: "Rain, cabin air, forest hush.",
    body: "Layer rain, nature, noise, and atmospheric sounds. Balance each layer, save a favorite mix, and let it continue in the background.",
    accent: "#67D7FF",
    secondary: "#8F82E8",
    cue: "Pick a mix",
    panelBody: "Use two sounds together for free, or build richer five-layer soundscapes with Premium.",
  },
  {
    id: "mix",
    label: "Guided Calm",
    eyebrow: "Meditation and breathing",
    title: "Give a busy mind somewhere softer to land.",
    body: "Follow guided programs for winding down, overthinking, and closing the day, or settle into Box and 4-7-8 breathing.",
    accent: "#00E0C7",
    secondary: "#67D7FF",
    cue: "Guided calm",
    panelBody: "Try the opening session in each meditation program, then continue the full journey with Premium.",
  },
  {
    id: "fade",
    label: "Bedtime Routine",
    eyebrow: "Make the evening yours",
    title: "Turn a few quiet steps into a routine.",
    body: "Combine a sound mix, breathing, a sleep timer, gentle fade-out, and an optional morning reminder into a reusable bedtime path.",
    accent: "#FFB87A",
    secondary: "#00E0C7",
    cue: "Your routine",
    panelBody: "Set it once, return each evening, and let the app carry you from winding down toward sleep.",
  },
  {
    id: "final",
    label: "Sleep Insights",
    eyebrow: "Private reflection",
    title: "Notice what helps, night by night.",
    body: "Rate your sleep, record duration and mood, and discover local trends connecting your nights with the sounds and mixes you use.",
    accent: "#FF6B9D",
    secondary: "#B89AFF",
    cue: "Google Play",
    panelBody: "Available now on Google Play, with no ads, no behavioral tracking, and no account required for the core app.",
  },
];

const seoHighlights = [
  {
    cue: "01",
    title: "Ambient soundscapes",
    body: "Layer rain, nature, noise, and atmospheric sounds, tune each layer, save favorite mixes, and keep listening in the background.",
  },
  {
    cue: "02",
    title: "Guided meditation and breathing",
    body: "Follow multi-session programs for winding down and overthinking, or use Box and 4-7-8 breathing whenever you need a quieter moment.",
  },
  {
    cue: "03",
    title: "Bedtime routines",
    body: "Build a repeatable path with your mix, breathing, timer, fade-out, and an optional morning sleep-note reminder.",
  },
  {
    cue: "04",
    title: "Sleep journal and insights",
    body: "Record a rating, duration, mood tags, and an optional note. Explore trends and locally generated insights as your journal grows.",
  },
  {
    cue: "05",
    title: "A timer that ends gently",
    body: "Choose a preset or custom sleep timer, then let your soundscape fade instead of stopping abruptly.",
  },
  {
    cue: "06",
    title: "Private by design",
    body: "Use the core app without an account. Your journal and personalization stay on your device, with optional journal backup to Oryvelle’s private Google Drive app folder.",
  },
];

const trustSignals = ["No ads", "No behavioral tracking", "No required account"];

const jsonLd = {
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
        className="relative overflow-hidden border-t border-white/[0.08] bg-background px-5 py-20 sm:px-8 lg:py-28"
      >
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(0,224,199,0.55),rgba(184,154,255,0.35),transparent)]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(103,215,255,0.035),rgba(8,5,16,0)_32%),radial-gradient(circle_at_82%_18%,rgba(255,184,122,0.075),transparent_30%)]" />

        <div className="relative mx-auto grid w-full max-w-7xl gap-14 lg:grid-cols-[minmax(0,0.9fr)_minmax(440px,1.1fr)] lg:items-start">
          <div className="lg:sticky lg:top-28">
            <p className="mb-5 text-xs font-medium tracking-[0.3em] text-teal uppercase">
              More than a sound mixer
            </p>
            <h2
              id="about-oryvelle"
              className="max-w-2xl text-3xl leading-tight font-semibold text-ink sm:text-5xl"
            >
              Build the bedtime rhythm that works for you.
            </h2>
            <p className="mt-6 max-w-xl text-base leading-8 text-muted">
              Explore soundscapes, guided meditation, breathing, and bedtime
              routines. In the morning, capture how you slept and let your own
              patterns shape more useful suggestions over time.
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
                className="rounded-full border border-teal/30 bg-teal/10 px-5 py-3 text-sm font-medium text-foreground transition-colors hover:bg-teal/15"
              >
                Privacy Policy
              </Link>
              <Link
                href="/support"
                className="rounded-full border border-white/[0.12] px-5 py-3 text-sm font-medium text-muted transition-colors hover:border-white/[0.22] hover:text-ink"
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
                  <div className="absolute left-[0.7rem] top-6 grid h-5 w-5 place-items-center rounded-full border border-teal/40 bg-background shadow-[0_0_20px_rgba(0,224,199,0.25)]">
                    <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
                  </div>
                  <p className="text-xs font-medium tracking-[0.28em] text-teal uppercase">
                    {highlight.cue}
                  </p>
                  <div>
                    <h3 className="text-lg font-semibold text-ink">
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
              className="mt-5 rounded-lg border border-sky/15 bg-sky/[0.045] p-5 text-sm leading-7 text-muted"
            >
              Your journal, mixes, routines, and preferences stay on your
              device. Optional Google Drive backup covers journal entries only.
              No ads, no behavioral tracking, no required account, and no
              medical claims.
            </aside>
          </div>
        </div>
      </section>

      <footer className="bg-background px-5 pb-10 text-sm text-faint sm:px-8">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 border-t border-white/[0.08] pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p>
            Oryvelle by{" "}
            <a
              href="https://aziz-manaa.com"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-muted"
            >
              NekoDesk
            </a>
            . Available now on{" "}
            <a
              href={PLAY_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal transition-colors hover:text-foreground"
            >
              Google Play
            </a>
            .
          </p>
          <nav aria-label="Footer pages" className="flex flex-wrap gap-5">
            <Link
              href="/privacy"
              className="transition-colors hover:text-muted"
            >
              Privacy
            </Link>
            <Link
              href="/support"
              className="transition-colors hover:text-muted"
            >
              Support
            </Link>
            <Link
              href="/terms"
              className="transition-colors hover:text-muted"
            >
              Terms
            </Link>
          </nav>
        </div>
      </footer>
    </>
  );
}
