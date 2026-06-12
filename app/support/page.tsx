import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "../_components/site-header";
import { absoluteUrl, SITE_NAME } from "../site-config";

export const metadata: Metadata = {
  title: "Support",
  description:
    "Get help with Oryvelle. Answers to common questions about sounds, playback, journal, backup, and more.",
  alternates: {
    canonical: absoluteUrl("/support"),
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    url: absoluteUrl("/support"),
    title: "Support - Oryvelle",
    description:
      "Get help with Oryvelle. Answers to common questions about sounds, playback, journal, backup, and more.",
    siteName: SITE_NAME,
  },
};

const FAQ_SECTIONS = [
  {
    id: "getting-started",
    heading: "Getting started",
    items: [
      {
        q: "Do I need an account to use Oryvelle?",
        a: "No. All core features — sounds, fade timer, guided breathing, and your private notes — work without signing in. Google Sign-In is optional and only needed if you want to back up your journal to Google Drive.",
      },
      {
        q: "The app asks for notification permission. What is it used for?",
        a: "Oryvelle can send a gentle morning reminder to log how you slept, after a session of at least 5 minutes. You can decline the permission and the rest of the app works normally. You can also control reminders from your device's notification settings at any time.",
      },
    ],
  },
  {
    id: "sounds",
    heading: "Sounds and playback",
    items: [
      {
        q: "Do sounds require an internet connection?",
        a: "The first time you play a sound, the app downloads it over the internet. After that, it is cached on your device (up to 650 MB) so it plays faster and works offline. If you have cleared the cache or are playing a sound for the first time, an internet connection is required.",
      },
      {
        q: "A sound I used before is no longer available.",
        a: "The sound catalog is updated periodically. Sounds that are removed from the catalog will no longer play, but they will remain visible as coming-soon placeholders until replaced. Saved mixes that include a removed sound will load the remaining sounds.",
      },
      {
        q: "Playback stops when I lock my phone.",
        a: "Make sure the app has permission to run in the background. On some devices (especially Xiaomi, Samsung, or Huawei), battery optimisation settings may kill background audio. Go to Settings → Battery → App launch (or similar) and set Oryvelle to manage itself manually.",
      },
      {
        q: "I can hear sound but nothing shows in the notification or lock screen.",
        a: "Check that notification permission is granted for Oryvelle in Android Settings → Apps → Oryvelle → Notifications.",
      },
    ],
  },
  {
    id: "journal",
    heading: "Journal and notes",
    items: [
      {
        q: "Can I edit or delete a past journal entry?",
        a: "Yes. Open Notes, tap the day you want to change, then use the edit or delete action. Deleting an entry is permanent and will ask for confirmation first.",
      },
      {
        q: "I accidentally deleted an entry. Can I recover it?",
        a: "If you have a Drive backup or a local JSON export that includes the deleted entry, you can restore it from Settings → Back up & restore → Restore. The restore adds missing dates and updates existing ones, so it will not overwrite entries that are already there.",
      },
    ],
  },
  {
    id: "backup",
    heading: "Google Sign-In and Drive backup",
    items: [
      {
        q: "Why does Google show a warning when I try to back up?",
        a: "Oryvelle is going through Google's app verification process. Until that is complete, Google shows a warning for the Drive permission. You can proceed safely by tapping Advanced → Go to Oryvelle. This warning will disappear once verification is complete.",
      },
      {
        q: "Where is my backup stored in Google Drive?",
        a: "Your backup is stored in a private app folder that only Oryvelle can access. It does not appear in your main Drive file list. You can find and delete it through Google Drive → Storage → Manage storage → Oryvelle.",
      },
      {
        q: "I signed out of Google. Did I lose my data?",
        a: "No. Signing out only removes your account information from the app. All journal entries, mixes, and settings stay on your device. Your Drive backup files also remain in Google Drive until you delete them.",
      },
      {
        q: "Drive backup says it failed. What should I try?",
        a: null,
        steps: [
          "Sign out and sign back in from Settings to refresh your Drive permission.",
          "Check your internet connection.",
          "Make sure you have enough storage in your Google account (the backup is typically a few KB to a few MB).",
          "Try again — Drive can occasionally return a temporary error.",
        ],
      },
    ],
  },
  {
    id: "data",
    heading: "Data and privacy",
    items: [
      {
        q: "How do I export my journal?",
        a: "Go to Settings → Back up & restore → Export journal. This saves a JSON file to a location you choose on your device.",
      },
      {
        q: "How do I delete all my data?",
        a: "You can clear your notes and saved mixes individually from Settings. To remove everything, uninstall the app — this removes all locally stored data. If you also want to remove your Drive backup, delete it from Google Drive → Storage → Manage storage → Oryvelle.",
      },
      {
        q: "Does Oryvelle collect analytics or share my data?",
        a: null,
        link: { text: "Privacy Policy", href: "/privacy" },
      },
    ],
  },
  {
    id: "settings",
    heading: "Account and settings",
    items: [
      {
        q: "How do I reset the onboarding questionnaire?",
        a: "Go to Settings → Personalization profile → Reset profile. This clears your onboarding answers and relaxation profile. Your journal entries and saved mixes are not affected.",
      },
      {
        q: "How do I reset my wind-down routine?",
        a: "Go to Settings → Wind-down routine → Reset routine. This clears only the routine setup. It does not stop active playback, delete journal entries, or change your timer defaults.",
      },
    ],
  },
] as const;

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-[#080510] text-[#EDEAF5]">
      <SiteHeader activePage="support" />

      <main
        id="main-content"
        className="mx-auto w-full max-w-2xl px-5 pt-28 pb-24 sm:px-8"
      >
        {/* Page header */}
        <div className="mb-10 border-b border-white/[0.08] pb-8">
          <p className="mb-3 text-xs font-medium tracking-[0.28em] text-[#00E0C7] uppercase">
            Help
          </p>
          <h1 className="text-3xl font-semibold text-[#F7F3FF] sm:text-4xl">
            Support
          </h1>
          <p className="mt-3 text-sm leading-6 text-[#B8B5C7]">
            App: Oryvelle &nbsp;·&nbsp; Developer:{" "}
            <a
              href="https://aziz-manaa.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline-offset-2 hover:text-[#00E0C7] hover:underline"
            >
              NekoDesk — Aziz Manaa
            </a>
          </p>
        </div>

        {/* Contact card */}
        <div className="mb-12 rounded-xl border border-[#00E0C7]/20 bg-[#00E0C7]/[0.04] p-6">
          <h2 className="mb-2 text-base font-semibold text-[#F7F3FF]">
            Contact us
          </h2>
          <p className="mb-4 text-sm leading-6 text-[#B8B5C7]">
            If you have a question, found a bug, or need help with anything not
            covered below, email us. We aim to respond within 2 business days.
          </p>
          <a
            href="mailto:support@nekodesk.com"
            className="inline-flex items-center gap-2 rounded-full border border-[#00E0C7]/30 bg-[#00E0C7]/10 px-4 py-2 text-sm font-medium text-[#00E0C7] transition-colors hover:bg-[#00E0C7]/15"
          >
            support@nekodesk.com
          </a>
        </div>

        {/* FAQ */}
        <div className="space-y-12 text-sm leading-7 text-[#B8B5C7]">
          {FAQ_SECTIONS.map((section) => (
            <section key={section.id} aria-labelledby={section.id}>
              <h2
                id={section.id}
                className="mb-5 text-base font-semibold text-[#F7F3FF]"
              >
                {section.heading}
              </h2>
              <div className="space-y-6">
                {section.items.map((item) => (
                  <div key={item.q}>
                    <p className="mb-1.5 font-medium text-[#EDEAF5]">
                      {item.q}
                    </p>
                    {"steps" in item && item.steps ? (
                      <ol className="list-decimal space-y-1 pl-5 text-[#9A9CAF]">
                        {item.steps.map((step) => (
                          <li key={step}>{step}</li>
                        ))}
                      </ol>
                    ) : "link" in item && item.link ? (
                      <p className="text-[#9A9CAF]">
                        No. See our{" "}
                        <Link
                          href={item.link.href}
                          className="text-[#00E0C7] underline-offset-2 hover:underline"
                        >
                          {item.link.text}
                        </Link>{" "}
                        for full details.
                      </p>
                    ) : (
                      <p className="text-[#9A9CAF]">{item.a}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Still need help */}
        <div className="mt-14 rounded-xl border border-white/[0.07] bg-white/[0.03] p-6">
          <h2 className="mb-3 text-base font-semibold text-[#F7F3FF]">
            Still need help?
          </h2>
          <p className="mb-4 text-sm leading-6 text-[#B8B5C7]">
            Email us at{" "}
            <a
              href="mailto:support@nekodesk.com"
              className="text-[#00E0C7] underline-offset-2 hover:underline"
            >
              support@nekodesk.com
            </a>{" "}
            and include:
          </p>
          <ul className="mb-5 list-disc space-y-1 pl-5 text-sm text-[#9A9CAF]">
            <li>Your device model and Android version</li>
            <li>
              A description of what you expected to happen and what happened
              instead
            </li>
            <li>Whether the issue is consistent or intermittent</li>
          </ul>
          <p className="text-sm text-[#7C8094]">
            We read every message and will get back to you as soon as we can.
          </p>
        </div>

        {/* Footer nav */}
        <div className="mt-12 border-t border-white/[0.08] pt-8 text-center">
          <Link
            href="/"
            className="text-sm text-[#9A9CAF] transition-colors hover:text-[#B8B5C7]"
          >
            ← Back to Oryvelle
          </Link>
        </div>
      </main>
    </div>
  );
}
