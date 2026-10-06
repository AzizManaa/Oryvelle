import type { Metadata } from "next";
import InformationLayout from "../_components/information/InformationLayout";
import { absoluteUrl, SITE_NAME } from "../site-config";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Oryvelle stores your data on your device. No accounts, no behavioral analytics, no ads. Uses Firebase Crashlytics for crash reporting only.",
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
      "Oryvelle stores your data on your device. No accounts, no behavioral analytics, no ads. Uses Firebase Crashlytics for crash reporting only.",
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
    data: "Public cached audio files (up to 72 MiB)",
    purpose: "Play sounds without re-downloading",
    where: "Local device cache — automatically managed; can be cleared via Android Settings → Apps → Oryvelle → Storage",
  },
  {
    data: "Premium audio for the active session (up to 64 MiB)",
    purpose: "Play authorized premium sounds during the current session",
    where: "Temporary local cache — cleared when the premium session ends",
  },
  {
    data: "Premium entitlement status and verification timestamps",
    purpose: "Remember recently verified Premium access for up to 72 hours",
    where: "Encrypted local app storage",
  },
  {
    data: "Google Play reviewer session token and expiry",
    purpose: "Restore temporary reviewer access after an app restart",
    where: "Encrypted local app storage until expiry, access is ended, or uninstall",
  },
];

export default function PrivacyPage() {
  return (
    <InformationLayout page="privacy">

      <main
        id="main-content"
        className="information-content"
      >
        {/* Page header */}
        <div className="information-hero">
          <p className="mb-3 text-xs font-medium tracking-[0.28em] text-teal uppercase">
            Legal
          </p>
          <h1 className="text-3xl font-semibold text-ink sm:text-4xl">
            Privacy Policy
          </h1>
          <dl className="mt-5 grid gap-1.5 text-sm sm:grid-cols-2">
            <div>
              <dt className="inline text-faint">App </dt>
              <dd className="inline text-muted">Oryvelle</dd>
            </div>
            <div>
              <dt className="inline text-faint">Developer </dt>
              <dd className="inline">
                <a
                  href="https://aziz-manaa.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted underline-offset-2 hover:text-teal hover:underline"
                >
                  NekoDesk — Aziz Manaa
                </a>
              </dd>
            </div>
            <div>
              <dt className="inline text-faint">Contact </dt>
              <dd className="inline">
                <a
                  href="mailto:nekodesk.dev@gmail.com"
                  className="text-teal underline-offset-2 hover:underline"
                >
                  nekodesk.dev@gmail.com
                </a>
              </dd>
            </div>
            <div>
              <dt className="inline text-faint">Effective date </dt>
              <dd className="inline text-muted">August 29, 2026</dd>
            </div>
          </dl>
        </div>

        <div className="space-y-10 text-sm leading-7 text-muted">
          {/* Overview */}
          <section>
            <p>
              Oryvelle is for ambient soundscapes, guided breathing, wind-down
              routines, and private notes. It stores your data on your device.
              It does not run user accounts, does not collect behavioral
              analytics, and does not serve ads. It uses Firebase Crashlytics
              for crash reporting to keep the app stable — see{" "}
              <a href="#third-party" className="text-teal underline-offset-2 hover:underline">
                Third-party services
              </a>{" "}
              below. Google Drive Backup and Restore are optional features you
              can use to protect your journal — neither is required to use the
              app, and Oryvelle does not create a Google profile. An optional
              Google Play subscription unlocks Premium sounds. Google Play
              reviewers can use a non-personal reusable review code to evaluate
              those same features without an account, purchase, or free trial.
            </p>
          </section>

          {/* What data */}
          <section aria-labelledby="what-data">
            <h2
              id="what-data"
              className="mb-4 text-base font-semibold text-ink"
            >
              What data the app stores
            </h2>

            <h3 className="mb-3 font-medium text-foreground">
              On your device (always)
            </h3>
            <div className="mb-5 overflow-x-auto rounded-xl border border-white/[0.07]">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-white/[0.07]">
                    <th className="px-4 py-3 text-left font-medium text-faint">
                      Data
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-faint">
                      Purpose
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-faint">
                      Where stored
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.05]">
                  {DATA_ROWS.map((row) => (
                    <tr key={row.data}>
                      <td className="px-4 py-3 align-top text-muted">
                        {row.data}
                      </td>
                      <td className="px-4 py-3 align-top text-subtle">
                        {row.purpose}
                      </td>
                      <td className="px-4 py-3 align-top text-subtle">
                        {row.where}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p>
              These stored values stay on your device unless you explicitly use
              Drive backup or manual transfer. Subscription verification is the
              limited exception described below. None of this data is used for
              advertising or behavioral analytics.
            </p>

            <h3 className="mb-3 mt-6 font-medium text-foreground">
              With Google Drive — only when you choose Backup or Restore
            </h3>
            <p className="mb-3">
              When you choose Backup or Restore, Google may ask you to select an
              account and grant access to Oryvelle&apos;s private Drive app-data
              folder. Oryvelle receives a short-lived access token for that
              operation. It does not store your Google display name, email
              address, or a persistent Google profile.
            </p>
            <p className="mb-3">
              If you choose{" "}
              <strong className="font-medium text-foreground">
                Drive backup
              </strong>
              , the app uploads a copy of your sleep journal content to a
              private folder in your own Google Drive (
              <code className="rounded bg-white/[0.06] px-1 py-0.5 font-mono text-muted">
                appDataFolder
              </code>
              ). The backup includes:
            </p>
            <ul className="mb-3 list-disc space-y-1 pl-5">
              <li>The free-text notes you write for each journal entry</li>
              <li>Your sleep rating</li>
              <li>The sleep duration</li>
              <li>Your mood tags</li>
            </ul>
            <p className="mb-3">
              This{" "}
              <code className="rounded bg-white/[0.06] px-1 py-0.5 font-mono text-muted">
                appDataFolder
              </code>{" "}
              is:
            </p>
            <ul className="mb-3 list-disc space-y-1 pl-5">
              <li>Visible only to you and to Oryvelle</li>
              <li>Not accessible to other apps</li>
              <li>Not visible in your main Drive file list</li>
              <li>
                Controlled entirely by you — you can delete it at any time
                through your Google account settings
              </li>
            </ul>
            <p className="mb-3">
              <strong className="font-medium text-foreground">
                Backup encryption.
              </strong>{" "}
              Oryvelle does not apply its own client-side encryption to the
              backup before uploading it. Your journal content is transmitted
              to Google Drive over HTTPS and is stored in your own Google
              Drive account. Because Oryvelle does not encrypt the backup
              with a separate key before upload, anyone who can access your
              Google account or Drive backup data could read your backed-up
              journal entries.
            </p>
            <p className="mb-3">
              <strong className="font-medium text-foreground">
                What is not backed up.
              </strong>{" "}
              Drive backup covers only your sleep journal content. Your
              playback sessions, onboarding preferences, saved mixes, and app
              settings are <strong className="font-medium text-foreground">not</strong>{" "}
              uploaded to Drive backup — they remain on your device.
            </p>
            <p>
              You can disconnect Google Drive at any time without losing local
              data. Disconnecting revokes Oryvelle&apos;s Drive permission and
              clears pending authorization state, but does not delete an existing
              backup. The next Backup or Restore will request permission again.
            </p>
          </section>

          {/* Google Play reviewer access */}
          <section aria-labelledby="reviewer-access">
            <h2
              id="reviewer-access"
              className="mb-4 text-base font-semibold text-ink"
            >
              Google Play reviewer access
            </h2>
            <p className="mb-3">
              Google Play reviewers can enter a reusable, non-personal review
              code to access all Premium features without creating an account,
              purchase, free trial, or permanent entitlement. The app sends the
              code over HTTPS to the NekoDesk service only to authorize reviewer
              access. The raw code is cleared from the screen after submission,
              is never written to app storage, and is not stored or logged by
              the service.
            </p>
            <p className="mb-3">
              After successful activation, the service returns a signed reviewer
              session valid for 30 days and a short-lived Premium media grant.
              The session contains protocol and expiry claims only; it does not
              contain a name, email address, Google account, user ID, device or
              installation identifier, or location. The app stores the session
              token and expiry in encrypted app-private storage so reviewer access
              can be restored after a restart. Premium media grants remain in
              memory only. Ending reviewer access or uninstalling the app removes
              the local session; an expired or invalid session is also cleared.
            </p>
            <p>
              Reviewer credentials are used only to authorize and secure reviewer
              access. They are not used for advertising, analytics,
              personalization, or account creation. Application-generated logs
              contain only the route, outcome code, and HTTP status; request
              bodies, credentials, authorization headers, session tokens, media
              grants, and IP addresses are excluded.
            </p>
          </section>

          {/* Third-party services */}
          <section aria-labelledby="third-party">
            <h2
              id="third-party"
              className="mb-4 text-base font-semibold text-ink"
            >
              Third-party services
            </h2>

            <h3 className="mb-2 font-medium text-foreground">
              Google Drive authorization
            </h3>
            <p className="mb-5">
              When you authorize Drive Backup or Restore, your data is handled under
              Google&apos;s Privacy Policy:{" "}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal underline-offset-2 hover:underline"
              >
                policies.google.com/privacy
              </a>
            </p>

            <h3 className="mb-2 font-medium text-foreground">
              Google Play Billing and Premium verification
            </h3>
            <p className="mb-5">
              Purchases are processed by Google Play. To verify Premium access,
              Oryvelle sends the Google Play purchase token over HTTPS to{" "}
              <code className="rounded bg-white/[0.06] px-1 py-0.5 font-mono text-muted">
                api.oryvelle.app/v1/entitlements/exchange
              </code>
              . The raw token is not logged or stored by Oryvelle&apos;s server;
              a SHA-256-derived lookup key and entitlement result may be cached
              there for up to five minutes. The app stores an encrypted Premium
              status snapshot for up to 72 hours. A short-lived content access
              grant remains in memory only.
            </p>

            <h3 className="mb-2 font-medium text-foreground">
              Cloudflare delivery and abuse protection
            </h3>
            <p className="mb-5">
              Cloudflare delivers requests to{" "}
              <code className="rounded bg-white/[0.06] px-1 py-0.5 font-mono text-muted">
                cdn.oryvelle.app and api.oryvelle.app
              </code>{" "}
              and protects the service from abuse. Ordinary request metadata,
              including the request-origin IP address and standard HTTP headers,
              may be processed for delivery, security, and short-window rate
              limiting. Reviewer-access rate limiting uses request-origin
              information only to limit repeated activation or refresh attempts,
              not to infer location, build a profile, or support advertising or
              analytics. NekoDesk does not write IP addresses or reviewer
              credentials to application-generated logs or durable application
              storage.
            </p>

            <h3 className="mb-2 font-medium text-foreground">Sound catalog</h3>
            <p className="mb-5">
              The app fetches catalogs and public media from our CDN (
              <code className="rounded bg-white/[0.06] px-1 py-0.5 font-mono text-muted">
                cdn.oryvelle.app
              </code>
              ); Premium media is authorized through{" "}
              <code className="rounded bg-white/[0.06] px-1 py-0.5 font-mono text-muted">
                api.oryvelle.app
              </code>
              . This requires a standard internet connection when content is not
              cached. Public catalog and free-audio requests do not include
              app-provided personal data. A Premium cache miss includes only the
              short-lived entitlement grant described above; that credential is
              not stored with cached audio.
            </p>

            <h3 className="mb-2 font-medium text-foreground">
              Firebase Crashlytics (crash reporting)
            </h3>
            <p className="mb-3">
              Oryvelle uses Firebase Crashlytics, provided by Google, to detect
              and diagnose app crashes. Crashlytics is active in release builds
              only — it does not run during development.
            </p>
            <p className="mb-3">What Crashlytics collects:</p>
            <ul className="mb-3 list-disc space-y-1 pl-5">
              <li>Device model and manufacturer</li>
              <li>Android OS version</li>
              <li>App version and build number</li>
              <li>
                A randomly generated installation ID (not linked to your
                identity)
              </li>
              <li>Crash stack traces and exception details</li>
              <li>Timestamps of crashes</li>
            </ul>
            <p className="mb-3">
              This data is used only to identify and fix stability issues. It
              is not used for behavioral tracking, advertising, or product
              analytics.
            </p>
            <p className="mb-5">
              Data is handled by Google under the Firebase Privacy Policy:{" "}
              <a
                href="https://firebase.google.com/support/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal underline-offset-2 hover:underline"
              >
                firebase.google.com/support/privacy
              </a>
            </p>

            <h3 className="mb-2 font-medium text-foreground">
              Google Play In-App Updates
            </h3>
            <p>
              The app uses the Google Play In-App Update API to check whether a
              newer version of Oryvelle is available. This is handled by the
              Google Play Store on your device and governed by{" "}
              <a
                href="https://policies.google.com/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal underline-offset-2 hover:underline"
              >
                Google&apos;s Terms of Service
              </a>
              . No personal data from within Oryvelle is sent during update
              checks.
            </p>
          </section>

          {/* What we do not do */}
          <section aria-labelledby="do-not">
            <h2
              id="do-not"
              className="mb-4 text-base font-semibold text-ink"
            >
              What we do not do
            </h2>
            <ul className="list-disc space-y-2 pl-5">
              <li>We do not collect behavioral or product analytics.</li>
              <li>We do not serve ads or share data with advertisers.</li>
              <li>We do not sell your data to anyone.</li>
              <li>
                We do not create NekoDesk user accounts or store your sleep
                journal on our servers.
              </li>
              <li>
                We do not use Google Play reviewer credentials to identify
                reviewers or create accounts.
              </li>
              <li>
                We do not access your microphone, camera, contacts, or
                location.
              </li>
              <li>
                We do not transfer data to third parties except as described
                above (Google Drive, Google Play, Premium verification,
                reviewer authorization, Cloudflare, and Firebase Crashlytics).
              </li>
            </ul>
          </section>

          {/* OS backup */}
          <section aria-labelledby="os-backup">
            <h2
              id="os-backup"
              className="mb-4 text-base font-semibold text-ink"
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
              className="mb-4 text-base font-semibold text-ink"
            >
              Data retention and deletion
            </h2>
            <p className="mb-3">
              <strong className="font-medium text-foreground">
                On-device data:
              </strong>{" "}
              You can delete your notes individually from the journal
              screen, or clear all saved mixes from Settings. Uninstalling the
              app removes all locally stored data.
            </p>
            <p className="mb-3">
              <strong className="font-medium text-foreground">
                Drive backup data:
              </strong>{" "}
              If you have enabled Drive backup, your backup files remain in your
              Google Drive until you delete them. You can remove them through
              Google Drive settings under{" "}
              <strong className="font-medium text-foreground">
                Storage → Manage storage → Oryvelle
              </strong>
              .
            </p>
            <p className="mb-3">
              <strong className="font-medium text-foreground">
                Google Drive authorization:
              </strong>{" "}
              Disconnect from Settings to revoke Oryvelle&apos;s Drive access. This
              does not delete your Drive backup files — you must delete those
              separately if you want them removed.
            </p>
            <p className="mb-3">
              <strong className="font-medium text-foreground">
                Google Play reviewer data:
              </strong>{" "}
              The reusable review code is not stored by the app or NekoDesk
              service. The encrypted reviewer session remains on the device
              until it expires, reviewer access is ended, or the app is
              uninstalled. Reviewer rate-limit state is short-lived and used
              only for security and abuse prevention.
            </p>
            <p>
              <strong className="font-medium text-foreground">
                Crashlytics data:
              </strong>{" "}
              Crash reports are associated with a randomly generated
              installation ID, not your identity. To request deletion of crash
              data, contact us at{" "}
              <a
                href="mailto:nekodesk.dev@gmail.com"
                className="text-teal underline-offset-2 hover:underline"
              >
                nekodesk.dev@gmail.com
              </a>{" "}
              and we will submit a deletion request to Firebase on your behalf.
            </p>
          </section>

          {/* Children */}
          <section aria-labelledby="children">
            <h2
              id="children"
              className="mb-4 text-base font-semibold text-ink"
            >
              Children&apos;s privacy
            </h2>
            <p>
              Oryvelle is intended for adults aged 18 and over. We do not
              knowingly collect personal information from anyone under 18. If
              you believe a minor has provided personal information through the app,
              please contact us at{" "}
              <a
                href="mailto:nekodesk.dev@gmail.com"
                className="text-teal underline-offset-2 hover:underline"
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
              className="mb-4 text-base font-semibold text-ink"
            >
              Your rights (EEA, UK, and California residents)
            </h2>
            <p>
              If you are in the European Economic Area (GDPR), United Kingdom,
              or California (CCPA), you have rights regarding your personal
              data, including the right to access, correct, or delete it.
              Because Oryvelle stores data locally on your device and does not
              transmit it to our servers, you exercise most of these rights
              directly through the app. For data held by Google (Drive backup
              or Google Play purchase data), exercise your rights through your
              Google account settings. For crash data held by Firebase
              Crashlytics or a request concerning the NekoDesk reviewer service,
              contact us and we will handle the request.
            </p>
            <p className="mt-3">
              For any other requests, contact us at{" "}
              <a
                href="mailto:nekodesk.dev@gmail.com"
                className="text-teal underline-offset-2 hover:underline"
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
              className="mb-4 text-base font-semibold text-ink"
            >
              Security
            </h2>
            <p>
              Your journal database is encrypted with SQLCipher. Serialized
              preferences, saved mixes, Premium entitlement state, and reviewer
              session values are encrypted with a key protected by Android
              Keystore. Cached audio remains inside Android&apos;s app sandbox.
              Google authorization tokens stay in memory for the requested Drive
              operation and are not persisted by Oryvelle. Data sent to Google
              Drive, Google services, Firebase, or the NekoDesk service is
              transmitted over HTTPS. Oryvelle does not apply client-side
              encryption to Drive backups, so once uploaded the backup content
              is protected by your Google account and Google Drive&apos;s controls,
              not by a separate Oryvelle encryption key.
            </p>
          </section>

          {/* Changes */}
          <section aria-labelledby="changes">
            <h2
              id="changes"
              className="mb-4 text-base font-semibold text-ink"
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
              className="mb-3 text-base font-semibold text-ink"
            >
              Contact
            </h2>
            <p className="mb-4">
              Questions or concerns about this privacy policy:
            </p>
            <div className="space-y-1 text-sm">
              <p>
                <span className="text-faint">Email </span>
                <a
                  href="mailto:nekodesk.dev@gmail.com"
                  className="text-teal underline-offset-2 hover:underline"
                >
                  nekodesk.dev@gmail.com
                </a>
              </p>
              <p>
                <span className="text-faint">Developer </span>
                <a
                  href="https://aziz-manaa.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted underline-offset-2 hover:text-teal hover:underline"
                >
                  NekoDesk — Aziz Manaa, Barcelona, Spain
                </a>
              </p>
            </div>
          </section>
        </div>

      </main>
    </InformationLayout>
  );
}
