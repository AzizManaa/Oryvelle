import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "../_components/site-header";
import { absoluteUrl, SITE_NAME } from "../site-config";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms of Service for Oryvelle, a relaxation app by NekoDesk.",
  alternates: {
    canonical: absoluteUrl("/terms"),
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    url: absoluteUrl("/terms"),
    title: "Terms of Service - Oryvelle",
    description:
      "Terms of Service for Oryvelle, a relaxation app by NekoDesk.",
    siteName: SITE_NAME,
  },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader activePage="terms" />

      <main
        id="main-content"
        className="mx-auto w-full max-w-2xl px-5 pt-28 pb-24 sm:px-8"
      >
        {/* Page header */}
        <div className="mb-10 border-b border-white/[0.08] pb-8">
          <p className="mb-3 text-xs font-medium tracking-[0.28em] text-teal uppercase">
            Legal
          </p>
          <h1 className="text-3xl font-semibold text-ink sm:text-4xl">
            Terms of Service
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
              <dd className="inline text-muted">July 15, 2026</dd>
            </div>
          </dl>
        </div>

        <div className="space-y-10 text-sm leading-7 text-muted">
          {/* 1 */}
          <section aria-labelledby="s1">
            <h2 id="s1" className="mb-3 text-base font-semibold text-ink">
              1. Acceptance of these terms
            </h2>
            <p className="mb-3">
              By downloading, installing, or using Oryvelle, you agree to these
              Terms of Service. If you do not agree, do not use the app.
            </p>
            <p>
              These terms apply to all versions of Oryvelle on all platforms
              where it is available.
            </p>
          </section>

          {/* 2 */}
          <section aria-labelledby="s2">
            <h2 id="s2" className="mb-3 text-base font-semibold text-ink">
              2. What Oryvelle is
            </h2>
            <p className="mb-3">
              Oryvelle is a sleep and relaxation app that provides ambient
              soundscapes, guided breathing exercises, a configurable fade
              timer, a sleep journal with mood tracking and sleep analytics,
              a bedtime routine builder, and private notes. It is designed to
              support calm, focus, wind-down routines, and rest.
            </p>
            <p className="mb-3">
              The free version of Oryvelle allows up to two sounds per mix and
              up to five saved mixes. A premium tier with expanded limits is
              planned for a future update. Feature availability and limits may
              change over time.
            </p>
            <p className="rounded-xl border border-white/[0.07] bg-white/[0.03] px-5 py-4 text-subtle">
              <strong className="font-medium text-foreground">
                Oryvelle is not a medical device.
              </strong>{" "}
              The app does not diagnose, treat, cure, or prevent any medical
              condition. Nothing in the app constitutes medical advice. If you
              have a sleep disorder or any health concern, consult a qualified
              healthcare professional.
            </p>
          </section>

          {/* 3 */}
          <section aria-labelledby="s3">
            <h2 id="s3" className="mb-3 text-base font-semibold text-ink">
              3. Eligibility
            </h2>
            <p>
              You must be at least 13 years old to use Oryvelle. By using the
              app, you confirm that you meet this requirement. If you are under
              18, you confirm that you have your parent or guardian&apos;s
              permission.
            </p>
          </section>

          {/* 4 */}
          <section aria-labelledby="s4">
            <h2 id="s4" className="mb-3 text-base font-semibold text-ink">
              4. Your account and data
            </h2>
            <p className="mb-3">
              Oryvelle works without an account. All core features — sounds,
              journal, timer, breathing — are available without signing in.
            </p>
            <p className="mb-3">
              If you choose to sign in with Google, you do so voluntarily to
              enable Drive backup. You are responsible for keeping your Google
              account secure. NekoDesk is not responsible for any loss caused by
              unauthorised access to your Google account.
            </p>
            <p>
              Your journal entries, session data, and preferences are stored
              locally on your device. You own your data. We do not access it,
              transfer it, or use it for any purpose other than running the app
              on your device, except when you choose a feature that transfers
              data yourself, such as Drive backup or manual export. See our{" "}
              <Link
                href="/privacy"
                className="text-teal underline-offset-2 hover:underline"
              >
                Privacy Policy
              </Link>{" "}
              for full details on how data is stored.
            </p>
          </section>

          {/* 5 */}
          <section aria-labelledby="s5">
            <h2 id="s5" className="mb-3 text-base font-semibold text-ink">
              5. Sound catalog and content
            </h2>
            <p className="mb-3">
              The sounds available in Oryvelle are provided or licensed by
              NekoDesk and hosted on our servers. The catalog may change over
              time — sounds may be added, modified, or removed without notice.
            </p>
            <p className="mb-3">
              You may use the sounds in Oryvelle for personal, non-commercial
              listening only. You may not:
            </p>
            <ul className="list-disc space-y-1 pl-5">
              <li>Record, extract, or redistribute the audio files.</li>
              <li>Use the sounds outside the Oryvelle app.</li>
              <li>Reverse-engineer or copy the audio content.</li>
            </ul>
          </section>

          {/* 6 */}
          <section aria-labelledby="s6">
            <h2 id="s6" className="mb-3 text-base font-semibold text-ink">
              6. Acceptable use
            </h2>
            <p className="mb-3">
              You agree to use Oryvelle only for its intended purpose and in
              compliance with applicable law. You agree not to:
            </p>
            <ul className="list-disc space-y-1 pl-5">
              <li>
                Attempt to access, reverse-engineer, or modify any part of the
                app or its backend services.
              </li>
              <li>
                Use the app in any way that could harm NekoDesk, other users,
                or third parties.
              </li>
              <li>
                Circumvent any technical measure used to protect the app or its
                content.
              </li>
            </ul>
          </section>

          {/* 7 */}
          <section aria-labelledby="s7">
            <h2 id="s7" className="mb-3 text-base font-semibold text-ink">
              7. Third-party services
            </h2>
            <p className="mb-3">
              Oryvelle integrates with Google services (Sign-In and Drive) when
              you choose to enable them. Your use of those services is governed
              by Google&apos;s{" "}
              <a
                href="https://policies.google.com/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal underline-offset-2 hover:underline"
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal underline-offset-2 hover:underline"
              >
                Privacy Policy
              </a>
              .
            </p>
            <p className="mb-3">
              Oryvelle also uses Firebase Crashlytics (Google) in release
              builds to detect app crashes. No personal or behavioral data is
              collected through Crashlytics — see the{" "}
              <Link
                href="/privacy"
                className="text-teal underline-offset-2 hover:underline"
              >
                Privacy Policy
              </Link>{" "}
              for full details.
            </p>
            <p>
              NekoDesk is not responsible for the availability, accuracy, or
              conduct of any third-party service.
            </p>
          </section>

          {/* 8 */}
          <section aria-labelledby="s8">
            <h2 id="s8" className="mb-3 text-base font-semibold text-ink">
              8. Intellectual property
            </h2>
            <p className="mb-3">
              The Oryvelle app, mixer experience, original design, graphics,
              and NekoDesk-created content are owned by NekoDesk and protected
              by copyright and other intellectual property laws. Certain audio
              recordings are licensed from third-party providers; ownership of
              those recordings remains with their respective rights holders.
              NekoDesk publishes the Oryvelle application and does not claim
              copyright ownership of third-party audio. These terms do not
              transfer any ownership or reuse rights to you.
            </p>
            <p>
              You are granted a limited, non-exclusive, non-transferable,
              revocable licence to use the app on your personal device for
              personal, non-commercial purposes.
            </p>
          </section>

          {/* 9 */}
          <section aria-labelledby="s9">
            <h2 id="s9" className="mb-3 text-base font-semibold text-ink">
              9. Disclaimer of warranties
            </h2>
            <p className="mb-3">
              Oryvelle is provided{" "}
              <strong className="font-medium text-foreground">as is</strong> and{" "}
              <strong className="font-medium text-foreground">
                as available
              </strong>
              , without warranties of any kind, express or implied. NekoDesk
              does not warrant that:
            </p>
            <ul className="mb-3 list-disc space-y-1 pl-5">
              <li>
                The app will be uninterrupted, error-free, or free of harmful
                components.
              </li>
              <li>
                The app will meet your specific requirements or expectations.
              </li>
              <li>
                Any data stored in the app will be preserved without loss.
              </li>
            </ul>
            <p>
              You are responsible for maintaining your own backups of important
              data using the export or Drive backup features provided in the
              app.
            </p>
          </section>

          {/* 10 */}
          <section aria-labelledby="s10">
            <h2
              id="s10"
              className="mb-3 text-base font-semibold text-ink"
            >
              10. Limitation of liability
            </h2>
            <p className="mb-3">
              To the fullest extent permitted by applicable law, NekoDesk and
              Aziz Manaa shall not be liable for any indirect, incidental,
              special, consequential, or punitive damages arising from your use
              of Oryvelle, including but not limited to loss of data, loss of
              rest, relaxation, sleep, or health-related outcomes.
            </p>
            <p>
              Nothing in these terms limits liability for death or personal
              injury caused by negligence, fraud, or any other liability that
              cannot be excluded under applicable law.
            </p>
          </section>

          {/* 11 */}
          <section aria-labelledby="s11">
            <h2
              id="s11"
              className="mb-3 text-base font-semibold text-ink"
            >
              11. Governing law
            </h2>
            <p className="mb-3">
              These terms are governed by the laws of Spain. Any dispute arising
              from these terms or your use of Oryvelle shall be subject to the
              exclusive jurisdiction of the courts of Barcelona, Spain, except
              where mandatory consumer protection laws in your country of
              residence grant you additional rights.
            </p>
            <p>
              If you are a consumer in the European Union, you may also be
              entitled to bring proceedings in the courts of your country of
              residence.
            </p>
          </section>

          {/* 12 */}
          <section aria-labelledby="s12">
            <h2
              id="s12"
              className="mb-3 text-base font-semibold text-ink"
            >
              12. Changes to these terms
            </h2>
            <p className="mb-3">
              We may update these terms from time to time. If we make material
              changes, we will update the effective date above and, where
              appropriate, notify you within the app. Continued use of Oryvelle
              after updated terms take effect constitutes acceptance of the new
              terms.
            </p>
            <p>
              If you do not agree to the updated terms, you should stop using
              the app and uninstall it.
            </p>
          </section>

          {/* 13 */}
          <section aria-labelledby="s13">
            <h2
              id="s13"
              className="mb-3 text-base font-semibold text-ink"
            >
              13. Termination
            </h2>
            <p className="mb-3">
              You may stop using Oryvelle at any time by uninstalling it.
              Uninstalling the app removes all locally stored data from your
              device.
            </p>
            <p>
              NekoDesk reserves the right to discontinue the app or any part of
              it at any time, with or without notice.
            </p>
          </section>

          {/* 14 — Contact */}
          <section
            aria-labelledby="s14"
            className="rounded-xl border border-white/[0.07] bg-white/[0.03] p-6"
          >
            <h2
              id="s14"
              className="mb-3 text-base font-semibold text-ink"
            >
              14. Contact
            </h2>
            <p className="mb-4">Questions about these terms:</p>
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

        {/* Footer nav */}
        <div className="mt-12 border-t border-white/[0.08] pt-8 text-center">
          <Link
            href="/"
            className="text-sm text-subtle transition-colors hover:text-muted"
          >
            ← Back to Oryvelle
          </Link>
        </div>
      </main>
    </div>
  );
}
