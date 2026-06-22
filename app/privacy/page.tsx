import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "../_components/site-header";
import { absoluteUrl, SITE_NAME } from "../site-config";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Oryvelle stores your data on your device. No accounts, no analytics, no ads.",
  alternates: {
    canonical: absoluteUrl("/privacy"),
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    url: absoluteUrl("/privacy"),
    title: "Privacy Policy - Oryvelle",
    description:
      "Oryvelle stores your data on your device. No accounts, no analytics, no ads.",
    siteName: SITE_NAME,
  },
};

const DATA_ROWS = [
  {
    data: "Journal entries (rating, duration, mood tags, notes)",
    purpose: "Show your relaxation history and trends",
    where: "Local device storage",
  },
  {
    data: "Playback sessions (sounds played, duration, timer used)",
    purpose: "Power local personalization and weekly insights",
    where: "Local device storage",
  },
  {
    data: "Onboarding preferences (relaxation goals, sound categories, routine choices)",
    purpose: "Personalize recommendations",
    where: "Local device storage",
  },
  {
    data: "Saved mixes and last-played mix",
    purpose: "Let you resume or replay your sounds",
    where: "Local device storage",
  },
  {
    data: "App settings (timer defaults, volume, crossfade)",
    purpose: "Remember your preferences",
    where: "Local device storage",
  },
  {
    data: "Cached audio files (up to 650 MB)",
    purpose: "Play sounds without re-downloading",
    where: "Local device cache — automatically managed; can be cleared via Android Settings → Apps → Oryvelle → Storage",
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#080510] text-[#EDEAF5]">
      <SiteHeader activePage="privacy" />

      <main
        id="main-content"
        className="mx-auto w-full max-w-2xl px-5 pt-28 pb-24 sm:px-8"
      >
        {/* Page header */}
        <div className="mb-10 border-b border-white/[0.08] pb-8">
          <p className="mb-3 text-xs font-medium tracking-[0.28em] text-[#00E0C7] uppercase">
            Legal
          </p>
          <h1 className="text-3xl font-semibold text-[#F7F3FF] sm:text-4xl">
            Privacy Policy
          </h1>
          <dl className="mt-5 grid gap-1.5 text-sm sm:grid-cols-2">
            <div>
              <dt className="inline text-[#7C8094]">App </dt>
              <dd className="inline text-[#B8B5C7]">Oryvelle</dd>
            </div>
            <div>
              <dt className="inline text-[#7C8094]">Developer </dt>
              <dd className="inline">
                <a
                  href="https://aziz-manaa.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#B8B5C7] underline-offset-2 hover:text-[#00E0C7] hover:underline"
                >
                  NekoDesk — Aziz Manaa
                </a>
              </dd>
            </div>
            <div>
              <dt className="inline text-[#7C8094]">Contact </dt>
              <dd className="inline">
                <a
                  href="mailto:nekodesk.dev@gmail.com"
                  className="text-[#00E0C7] underline-offset-2 hover:underline"
                >
                  nekodesk.dev@gmail.com
                </a>
              </dd>
            </div>
            <div>
              <dt className="inline text-[#7C8094]">Effective date </dt>
              <dd className="inline text-[#B8B5C7]">June 9, 2026</dd>
            </div>
          </dl>
        </div>

        <div className="space-y-10 text-sm leading-7 text-[#B8B5C7]">
          {/* Overview */}
          <section>
            <p>
              Oryvelle is for ambient soundscapes, guided breathing, wind-down
              routines, and private notes. It stores your data on your device.
              It does not run user accounts, does not collect analytics, and
              does not serve ads. Google Sign-In and Google Drive backup are
              optional features you can use to protect your journal — neither is
              required to use the app.
            </p>
          </section>

          {/* What data */}
          <section aria-labelledby="what-data">
            <h2
              id="what-data"
              className="mb-4 text-base font-semibold text-[#F7F3FF]"
            >
              What data the app stores
            </h2>

            <h3 className="mb-3 font-medium text-[#EDEAF5]">
              On your device (always)
            </h3>
            <div className="mb-5 overflow-x-auto rounded-xl border border-white/[0.07]">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-white/[0.07]">
                    <th className="px-4 py-3 text-left font-medium text-[#7C8094]">
                      Data
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-[#7C8094]">
                      Purpose
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-[#7C8094]">
                      Where stored
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.05]">
                  {DATA_ROWS.map((row) => (
                    <tr key={row.data}>
                      <td className="px-4 py-3 align-top text-[#B8B5C7]">
                        {row.data}
                      </td>
                      <td className="px-4 py-3 align-top text-[#9A9CAF]">
                        {row.purpose}
                      </td>
                      <td className="px-4 py-3 align-top text-[#9A9CAF]">
                        {row.where}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p>
              All of this data stays on your device. It is never sent to our
              servers, never used for advertising, and never shared with third
              parties.
            </p>

            <h3 className="mb-3 mt-6 font-medium text-[#EDEAF5]">
              With Google — only if you choose to sign in
            </h3>
            <p className="mb-3">
              If you tap{" "}
              <strong className="font-medium text-[#EDEAF5]">
                Sign in with Google
              </strong>{" "}
              in Settings, the app stores your Google account display name and
              email address on your device so your account appears in the
              Settings screen. No other Google account data is accessed.
            </p>
            <p className="mb-3">
              If you also enable{" "}
              <strong className="font-medium text-[#EDEAF5]">
                Drive backup
              </strong>
              , the app saves a copy of your journal entries to a private
              folder in your own Google Drive (
              <code className="rounded bg-white/[0.06] px-1 py-0.5 font-mono text-[#B8B5C7]">
                appDataFolder
              </code>
              ). This folder is:
            </p>
            <ul className="mb-3 list-disc space-y-1 pl-5">
              <li>Visible only to you and to Oryvelle</li>
              <li>
                Not accessible to other apps or visible in your main Drive file
                list
              </li>
              <li>
                Controlled entirely by you — you can delete it at any time
                through your Google account settings
              </li>
            </ul>
            <p>
              Signing in and Drive backup are independent. You can sign out or
              disable backup at any time in Settings without losing local data.
            </p>
          </section>

          {/* Third-party services */}
          <section aria-labelledby="third-party">
            <h2
              id="third-party"
              className="mb-4 text-base font-semibold text-[#F7F3FF]"
            >
              Third-party services
            </h2>

            <h3 className="mb-2 font-medium text-[#EDEAF5]">
              Google Sign-In and Google Drive
            </h3>
            <p className="mb-5">
              When you use Sign-In or Drive backup, your data is handled under
              Google&apos;s Privacy Policy:{" "}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#00E0C7] underline-offset-2 hover:underline"
              >
                policies.google.com/privacy
              </a>
            </p>

            <h3 className="mb-2 font-medium text-[#EDEAF5]">Sound catalog</h3>
            <p>
              The app fetches a list of available sounds from our server (
              <code className="rounded bg-white/[0.06] px-1 py-0.5 font-mono text-[#B8B5C7]">
                assets.aziz-manaa.com
              </code>
              ) and streams audio files when you play them. This requires a
              standard internet connection. No personal data is sent with these
              requests — they are anonymous file downloads.
            </p>
          </section>

          {/* What we do not do */}
          <section aria-labelledby="do-not">
            <h2
              id="do-not"
              className="mb-4 text-base font-semibold text-[#F7F3FF]"
            >
              What we do not do
            </h2>
            <ul className="list-disc space-y-2 pl-5">
              <li>We do not collect analytics or usage data.</li>
              <li>
                We do not use crash reporting, error analytics, or any
                third-party monitoring SDK.
              </li>
              <li>We do not serve ads or share data with advertisers.</li>
              <li>We do not sell your data to anyone.</li>
              <li>
                We do not create user accounts or store your data on our
                servers.
              </li>
              <li>
                We do not access your microphone, camera, contacts, or
                location.
              </li>
              <li>
                We do not transfer data to third parties except as described
                above (Google, when you explicitly enable those features).
              </li>
            </ul>
          </section>

          {/* OS backup */}
          <section aria-labelledby="os-backup">
            <h2
              id="os-backup"
              className="mb-4 text-base font-semibold text-[#F7F3FF]"
            >
              Android OS backup
            </h2>
            <p>
              Android&apos;s automatic backup is intentionally disabled in
              Oryvelle. Your data is protected through the explicit options in
              the app — Drive backup or manual JSON export — not through
              OS-level backup. This gives you full control over when and where
              copies of your data exist.
            </p>
          </section>

          {/* Data retention */}
          <section aria-labelledby="retention">
            <h2
              id="retention"
              className="mb-4 text-base font-semibold text-[#F7F3FF]"
            >
              Data retention and deletion
            </h2>
            <p className="mb-3">
              <strong className="font-medium text-[#EDEAF5]">
                On-device data:
              </strong>{" "}
              You can delete your notes individually from the journal
              screen, or clear all saved mixes from Settings. Uninstalling the
              app removes all locally stored data.
            </p>
            <p className="mb-3">
              <strong className="font-medium text-[#EDEAF5]">
                Drive backup data:
              </strong>{" "}
              If you have enabled Drive backup, your backup files remain in your
              Google Drive until you delete them. You can remove them through
              Google Drive settings under{" "}
              <strong className="font-medium text-[#EDEAF5]">
                Storage → Manage storage → Oryvelle
              </strong>
              .
            </p>
            <p>
              <strong className="font-medium text-[#EDEAF5]">
                Google account:
              </strong>{" "}
              Sign out from Settings to remove your account information from the
              app. This does not delete your Drive backup files — you must
              delete those separately if you want them removed.
            </p>
          </section>

          {/* Children */}
          <section aria-labelledby="children">
            <h2
              id="children"
              className="mb-4 text-base font-semibold text-[#F7F3FF]"
            >
              Children&apos;s privacy
            </h2>
            <p>
              Oryvelle is not directed at children under 13. We do not knowingly
              collect personal information from children under 13. If you
              believe a child has provided personal information through the app,
              please contact us at{" "}
              <a
                href="mailto:nekodesk.dev@gmail.com"
                className="text-[#00E0C7] underline-offset-2 hover:underline"
              >
                nekodesk.dev@gmail.com
              </a>{" "}
              and we will take steps to remove that information.
            </p>
          </section>

          {/* Your rights */}
          <section aria-labelledby="rights">
            <h2
              id="rights"
              className="mb-4 text-base font-semibold text-[#F7F3FF]"
            >
              Your rights (EEA, UK, and California residents)
            </h2>
            <p>
              If you are in the European Economic Area (GDPR), United Kingdom,
              or California (CCPA), you have rights regarding your personal
              data, including the right to access, correct, or delete it.
              Because Oryvelle stores data locally on your device and does not
              transmit it to our servers, you exercise most of these rights
              directly through the app. For any data held by Google (account
              display info, Drive backup), exercise your rights through your
              Google account settings.
            </p>
            <p className="mt-3">
              For any other requests, contact us at{" "}
              <a
                href="mailto:nekodesk.dev@gmail.com"
                className="text-[#00E0C7] underline-offset-2 hover:underline"
              >
                nekodesk.dev@gmail.com
              </a>
              .
            </p>
          </section>

          {/* Security */}
          <section aria-labelledby="security">
            <h2
              id="security"
              className="mb-4 text-base font-semibold text-[#F7F3FF]"
            >
              Security
            </h2>
            <p>
              Audio cache files and preferences are stored in the app&apos;s
              private storage directory, which is not accessible to other apps
              on a standard Android device. Drive backup data is transmitted
              over HTTPS and stored in your private Google Drive folder.
            </p>
          </section>

          {/* Changes */}
          <section aria-labelledby="changes">
            <h2
              id="changes"
              className="mb-4 text-base font-semibold text-[#F7F3FF]"
            >
              Changes to this policy
            </h2>
            <p>
              If we make material changes to this policy, we will update the
              effective date above and, where appropriate, notify you within the
              app. Continued use of Oryvelle after changes take effect
              constitutes acceptance of the updated policy.
            </p>
          </section>

          {/* Contact */}
          <section
            aria-labelledby="contact"
            className="rounded-xl border border-white/[0.07] bg-white/[0.03] p-6"
          >
            <h2
              id="contact"
              className="mb-3 text-base font-semibold text-[#F7F3FF]"
            >
              Contact
            </h2>
            <p className="mb-4">
              Questions or concerns about this privacy policy:
            </p>
            <div className="space-y-1 text-sm">
              <p>
                <span className="text-[#7C8094]">Email </span>
                <a
                  href="mailto:nekodesk.dev@gmail.com"
                  className="text-[#00E0C7] underline-offset-2 hover:underline"
                >
                  nekodesk.dev@gmail.com
                </a>
              </p>
              <p>
                <span className="text-[#7C8094]">Developer </span>
                <a
                  href="https://aziz-manaa.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#B8B5C7] underline-offset-2 hover:text-[#00E0C7] hover:underline"
                >
                  NekoDesk — Aziz Manaa, Barcelona, Spain
                </a>
              </p>
            </div>
          </section>
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
