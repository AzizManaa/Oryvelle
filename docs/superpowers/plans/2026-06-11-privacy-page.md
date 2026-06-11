# Privacy Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build `/privacy` as a static, readable page with the full Oryvelle privacy policy, extract a shared `SiteHeader` component, and activate the Privacy nav link site-wide.

**Architecture:** Extract the inline header from `app/page.tsx` into `app/_components/site-header.tsx` so all pages share one header. Create `app/privacy/page.tsx` as a server component with no animation — just clean dark typography. The Privacy link in the header activates (becomes a real `<Link>`) now that the page exists; Support and Terms remain disabled spans until their pages are built.

**Tech Stack:** Next.js 16 App Router / React 19 / TypeScript / Tailwind CSS v4. No new dependencies.

---

## File Map

| File | Change |
|---|---|
| `app/_components/site-header.tsx` | Create — shared header with Oryvelle wordmark, Privacy link, disabled Support/Terms, Coming soon CTA |
| `app/page.tsx` | Modify — replace inline header JSX with `<SiteHeader />` |
| `app/privacy/page.tsx` | Create — static privacy policy page |

---

## Task 1: Create `SiteHeader` component

**Files:**
- Create: `app/_components/site-header.tsx`

- [ ] **Step 1: Create the file**

```tsx
import Link from "next/link";

type SiteHeaderProps = {
  activePage?: "privacy";
};

export function SiteHeader({ activePage }: SiteHeaderProps) {
  return (
    <header className="fixed inset-x-0 top-0 z-30">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-3 px-5 sm:px-8">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-3 transition-opacity hover:opacity-75"
        >
          <span className="h-2.5 w-2.5 rounded-full bg-[#00E0C7] shadow-[0_0_18px_rgba(0,224,199,0.8)]" />
          <span className="text-sm font-medium tracking-[0.18em] text-[#EDEAF5] uppercase drop-shadow-[0_2px_10px_rgba(0,0,0,0.55)]">
            Oryvelle
          </span>
        </Link>

        <nav
          aria-label="Site pages"
          className="hidden items-center gap-6 text-sm drop-shadow-[0_2px_10px_rgba(0,0,0,0.55)] md:flex"
        >
          {activePage === "privacy" ? (
            <span className="text-[#EDEAF5]">Privacy</span>
          ) : (
            <Link
              href="/privacy"
              className="text-[#9A9CAF] transition-colors hover:text-[#B8B5C7]"
            >
              Privacy
            </Link>
          )}
          <span
            aria-disabled="true"
            className="cursor-not-allowed select-none text-[#9A9CAF] transition-colors hover:text-[#B8B5C7]"
          >
            Support
          </span>
          <span
            aria-disabled="true"
            className="cursor-not-allowed select-none text-[#9A9CAF] transition-colors hover:text-[#B8B5C7]"
          >
            Terms
          </span>
        </nav>

        <div className="flex shrink-0 items-center gap-3">
          {activePage === "privacy" ? (
            <span className="text-xs font-medium text-[#EDEAF5] drop-shadow-[0_2px_10px_rgba(0,0,0,0.55)] md:hidden">
              Privacy
            </span>
          ) : (
            <Link
              href="/privacy"
              className="text-xs font-medium text-[#9A9CAF] drop-shadow-[0_2px_10px_rgba(0,0,0,0.55)] transition-colors hover:text-[#B8B5C7] md:hidden"
            >
              Privacy
            </Link>
          )}
          <button
            type="button"
            disabled
            className="h-9 rounded-full border border-[#00E0C7]/30 bg-[#00E0C7]/10 px-3 text-xs font-medium text-[#EDEAF5] shadow-[0_0_24px_rgba(0,224,199,0.1)] sm:px-4"
          >
            <span className="hidden sm:inline">Coming soon</span>
            <span className="sm:hidden">Soon</span>
          </button>
        </div>
      </div>
    </header>
  );
}
```

- [ ] **Step 2: Type-check**

```bash
cd /Users/yami/Documents/Next/noxelle && npx tsc --noEmit 2>&1
```
Expected: no errors (file is standalone, no existing code changed yet).

- [ ] **Step 3: Commit**

```bash
git add app/_components/site-header.tsx
git commit -m "feat: add shared SiteHeader component with active Privacy link"
```

---

## Task 2: Update `app/page.tsx` to use `SiteHeader`

**Files:**
- Modify: `app/page.tsx`

The home page currently has an inline `<header>` block (lines 69–110) and a `trustItems` const. Both get replaced by `<SiteHeader />`.

- [ ] **Step 1: Replace the header in `app/page.tsx`**

Replace the entire file with:

```tsx
import {
  ParallaxLandingExperience,
  type ParallaxMoment,
} from "./_components/parallax-landing-experience";
import { SiteHeader } from "./_components/site-header";

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

export default function Home() {
  return (
    <main className="relative min-h-[100svh] bg-background text-foreground">
      <SiteHeader />
      <ParallaxLandingExperience moments={moments} />
    </main>
  );
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit 2>&1
```
Expected: no errors.

- [ ] **Step 3: Verify home page still renders**

```bash
npm run dev
```
Open `http://localhost:3000`. The header should look identical to before. Click "Privacy" — it should navigate to `/privacy` (will 404 until Task 3).

- [ ] **Step 4: Commit**

```bash
git add app/page.tsx
git commit -m "refactor: use shared SiteHeader on home page"
```

---

## Task 3: Create `app/privacy/page.tsx`

**Files:**
- Create: `app/privacy/page.tsx`

- [ ] **Step 1: Create the directory and file**

```bash
mkdir -p /Users/yami/Documents/Next/noxelle/app/privacy
```

Create `app/privacy/page.tsx`:

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "../_components/site-header";

export const metadata: Metadata = {
  title: "Privacy Policy — Oryvelle",
  description:
    "Oryvelle stores your data on your device. No accounts, no analytics, no ads.",
};

const DATA_ROWS = [
  {
    data: "Sleep journal entries (rating, duration, mood tags, notes)",
    purpose: "Show your sleep history and trends",
    where: "Local device storage",
  },
  {
    data: "Playback sessions (sounds played, duration, timer used)",
    purpose: "Power local personalization and weekly insights",
    where: "Local device storage",
  },
  {
    data: "Onboarding preferences (sleep goals, sound categories, routine choices)",
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

      <main className="mx-auto w-full max-w-2xl px-5 pt-28 pb-24 sm:px-8">
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
              <dd className="inline text-[#B8B5C7]">NekoDesk — Aziz Manaa</dd>
            </div>
            <div>
              <dt className="inline text-[#7C8094]">Contact </dt>
              <dd className="inline">
                <a
                  href="mailto:privacy@nekodesk.com"
                  className="text-[#00E0C7] underline-offset-2 hover:underline"
                >
                  privacy@nekodesk.com
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
          <section aria-labelledby="overview">
            <p>
              Oryvelle is a sleep companion app. It stores your data on your
              device. It does not run user accounts, does not collect analytics,
              and does not serve ads. Google Sign-In and Google Drive backup are
              optional features you can use to protect your sleep journal —
              neither is required to use the app.
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
              If you tap <strong className="font-medium text-[#EDEAF5]">Sign in with Google</strong> in
              Settings, the app stores your Google account display name and
              email address on your device so your account appears in the
              Settings screen. No other Google account data is accessed.
            </p>
            <p className="mb-3">
              If you also enable{" "}
              <strong className="font-medium text-[#EDEAF5]">Drive backup</strong>,
              the app saves a copy of your sleep journal entries to a private
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
              You can delete your sleep notes individually from the journal
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
                href="mailto:privacy@nekodesk.com"
                className="text-[#00E0C7] underline-offset-2 hover:underline"
              >
                privacy@nekodesk.com
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
                href="mailto:privacy@nekodesk.com"
                className="text-[#00E0C7] underline-offset-2 hover:underline"
              >
                privacy@nekodesk.com
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
                  href="mailto:privacy@nekodesk.com"
                  className="text-[#00E0C7] underline-offset-2 hover:underline"
                >
                  privacy@nekodesk.com
                </a>
              </p>
              <p>
                <span className="text-[#7C8094]">Developer </span>
                <span className="text-[#B8B5C7]">
                  NekoDesk — Aziz Manaa, Barcelona, Spain
                </span>
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
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit 2>&1
```
Expected: no errors.

- [ ] **Step 3: Visual check**

```bash
npm run dev
```

Open `http://localhost:3000/privacy`. Verify:
- SiteHeader shows with Privacy highlighted (white text, not grey)
- "Oryvelle" wordmark links back to `/`
- Page title, meta block (App, Developer, Contact, Effective date) renders
- Data table is readable on both desktop and mobile widths
- All email links are `mailto:` links
- `policies.google.com/privacy` opens in a new tab
- "Back to Oryvelle" link returns to the homepage
- From the home page, clicking "Privacy" in the header navigates to `/privacy`

- [ ] **Step 4: Build check**

```bash
npm run build 2>&1 | tail -15
```
Expected: `✓ Compiled successfully`, route list shows `○ /privacy`.

- [ ] **Step 5: Commit**

```bash
git add app/privacy/page.tsx
git commit -m "feat: add /privacy page with full Oryvelle privacy policy"
```

---

## Self-Review

**Coverage against agreed design:**
- ✅ `app/privacy/page.tsx` — static server component
- ✅ `app/_components/site-header.tsx` — shared, Privacy link is real `<Link>`
- ✅ `app/page.tsx` — uses shared header
- ✅ "Oryvelle" everywhere, no "Noxelle"
- ✅ Drive path: "Storage → Manage storage → Oryvelle"
- ✅ Added crash reporting line to "What we do not do"
- ✅ Audio cache storage info added to table
- ✅ GDPR mentioned explicitly in rights section
- ✅ No animation — trust comes from clarity
- ✅ Contact section styled as a card (not a wall of text)
- ✅ Back-to-home link in footer
- ✅ All email addresses as `mailto:` links
- ✅ External Google policy link opens in new tab with `rel="noopener noreferrer"`
- ✅ Semantic HTML: `<section aria-labelledby>`, `<h2>`, `<h3>`, `<dl>`, `<ul>`, `<table>`
- ✅ Metadata: title + description for SEO

**No placeholders:** All code blocks complete. ✅

**Type consistency:** `SiteHeader` accepts `activePage?: "privacy"`. Home page calls `<SiteHeader />` (no activePage). Privacy page calls `<SiteHeader activePage="privacy" />`. ✅
