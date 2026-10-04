# Gate 03B — Balanced hero supporting UI

## Result and scope

Implemented only the approved availability/desktop QR unit and the typography-only evening-mix card on `/new`. Review: http://localhost:3000/new. Branch: `feat/flowty-fidelity-redesign`. Existing dirty work was preserved. No navigation or Section 02 was added.

The headline, paragraph, Download Oryvelle CTA, wordmark, bottom O ↗ anchor, chapter geometry, pose values, screen thresholds, camera, materials, lighting, float, stand and entry remain unchanged.

## Final composition and eligibility

| Unit | Eligibility | Placement |
|---|---|---|
| Android · Google Play | All layouts, including static fallback | Desktop/tablet: 10px below the unchanged CTA group. Mobile ≤760px: beside the existing CTA, avoiding the phone directly below it. |
| Scan / QR utility | Width ≥1100px **and** height ≥700px **and** hover-capable fine pointer | Small subordinate icon/text button adjacent to availability. |
| Your evening mix | Width ≥1400px **and** height ≥800px **and** aspect ratio ≥3:2 **and** hover-capable fine pointer | Far lower-right, 2.6vw from the right and 7svh from the bottom. 240px wide, 150px minimum height, 24px padding. |

The card uses an opaque dark surface, a faint 1px border and 18px corners. Heading is 19px; body is 15px. It contains only “Your evening mix”, “Combine ambient sounds.” and “Set a sleep timer.” No icon, CTA, illustration, preview or internal animation.

Deliberate omissions: card absent on 1440×640, tablet 820×1180, mobile 390×844, widths below 1400px, tall/narrow aspect ratios and touch/coarse-pointer layouts. QR absent below its width/height requirements and on touch/coarse-pointer layouts. Availability remains. These are conservative composition gates, not device-name detection.

At 1440×900 and 1920×1080 desktop the card was separated from the initial floating phone and early-turn silhouette. Initial mobile testing found that a below-CTA label could be occluded by the phone. Only the new label moved beside the CTA at the existing mobile breakpoint; no approved element moved. Its width can wrap on narrower screens.

## Entry and departure ownership

Both support units are children of the existing `.hero`. Availability is absolutely positioned inside the existing `.support`; the card is absolutely positioned inside `.hero`. Neither changes its parent's flow size or the chapter's height.

They already exist beneath the approved entry cover. No separate intro animation was added. They inherit the existing hero's yPercent departure over progress .02–.30 and hidden state at .30. They leave the viewport before the full rear composition, stay absent through returning-front/second-turn/stand scenes and restore with the hero on reverse. `opening.timeline.ts` was not edited. No new ScrollTrigger, ticker, animation loop or chapter-progress owner.

The IntersectionObserver in the QR component owns only dialog eligibility: if its trigger leaves the viewport while the dialog is open, it closes the dialog. It does not animate anything or calculate timeline progress.

## QR behavior

`HeroAvailability.tsx` owns a native `<dialog>` and trigger refs; there is no redundant React open-state or portal dependency. The trigger supports Enter/Space, has a visible focus outline, `aria-haspopup="dialog"` and `aria-controls`. The dialog has a named heading, description, explicit close button, Escape dismissal and direct Google Play fallback link. Close receives initial focus; the browser makes surrounding page content inert while modal. Normal closing returns focus to Scan with `preventScroll`; if resize/departure removes the trigger, the existing bottom download anchor receives focus instead. Media-query listener and observer disconnect on unmount; open dialog closes during cleanup.

No body overflow, padding, width, scroll lock, fake scroll container or scrollbar changes are introduced. Measurement while opening and closing at 1920px: viewport and document client widths both remained 1920px; scroll remained 0; the hero heading rectangle stayed identical (x 49.9140625, y 36.71875, width 1382.3984375, height 314.03125). A separate 1440px check also showed equal viewport/document widths and unchanged scroll 0.

All live links use `PLAY_STORE_URL` from `app/site-config.ts`. `public/opening/google-play-qr.svg` is a locally generated static QR derived from that constant, medium error correction, four-module quiet zone. No external QR service or runtime QR dependency. The generated matrix **and the QR captured from the actual Brave dialog screenshot** independently decoded to the authoritative destination. The SVG is 11,302 bytes. If the store constant changes, regenerate and decode-check this static asset too. Temporary Python generation/decoding tooling lived outside the repository; project dependencies and lockfile were not changed by this gate.

## Preservation evidence

`docs/captures/gate-03b/baseline.sha` records pre-edit hashes of `app/new`, `components/landing` and `public/opening`.

Only existing `OpeningChapter.tsx` and `opening.module.css` differ: additive import/JSX and appended support CSS. Removing those exact additions in memory reconstructs their pre-edit hashes. All other baseline files match, including renderer, model preparation, poses, screen sources, float, entry, stand and timeline. New files are the QR component, QR SVG, this report and validation captures.

## Browser validation

Brave against the actual local `/new` development route:

- Normal and hard refresh: entry covers initialization, then existing real-phone hero reveals with support units; no separate support entrance.
- Hero idle float observed; early motion and full rear inspected with native wheel scrolling. Reverse wheel restores both units.
- 1440×900 checkpoint checks at .12, .23, .30, .53, .78 and .96: support clears before full rear, stays absent through returning front/second turn/landscape/stand, restores on reverse. No support/phone overlap observed in eligible desktop compositions.
- Wide 1920×1080, normal 1440×900, short 1440×640, tablet 820×1180 and mobile 390×844 inspected; deliberate omissions confirmed. Final refreshed mobile frame confirms label beside CTA without phone occlusion.
- Keyboard Enter and Space open QR. Close and Escape dismiss, focus returns to Scan; close and direct-link keyboard access verified. Native modal allows browser-chrome focus; underlying page controls remain inert.
- Reduced-motion emulation: preference true, no canvas, matched poster visible, availability usable. Cleared emulation afterward.
- Forced actual WebGL context loss: canvas removed, matched poster visible, availability retained. Normal refresh recovers renderer. No fallback lifecycle source was edited.
- Native scrollbar remained hidden. No new viewport width, heading-layout or chapter-progress change on dialog open/close.

Captures: `hero-1440-900.png`, `qr-dialog.png`, `early-turn.png`, `rear.png`, `short-1440-640.png`, `tablet-820-1180.png`, `mobile-390-844.png`, `wide-1920-1080.png`, `turn-1440-900.png`, `near-rear-1440-900.png`, `rear-1440-900.png`, `stand-1440-900.png`, `reduced-motion.png`, `context-loss.png` in this gate's capture folder. DevTools/browser chrome may be present in QA captures.

No physical Android/touch-device, screen-reader or full cross-browser audit is claimed. No new FPS/GPU performance claim: this gate adds static DOM, a small SVG and lifecycle listeners, not rendering work on each animation frame. Existing localhost manifest/font-preload warnings, Three.Clock deprecation and browser Permissions-Policy warning were observed; intentional context-loss testing emitted expected renderer messages. No new support-UI application error was observed.

## Documentation and checks

Context7 official React documentation consulted for native-dialog lifecycle/cleanup and avoiding redundant state: [Synchronizing with Effects](https://react.dev/learn/synchronizing-with-effects), [useEffect](https://react.dev/reference/react/useEffect). Native dialog keyboard, focus and top-layer behavior checked against [MDN dialog documentation](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog). Installed React 19.2.4; no framework upgrade.

- ESLint passed.
- TypeScript `npx tsc --noEmit` passed.
- Complete existing Vitest suite: 6 files / 41 tests passed.
- Production build passed; `/new` statically prerendered.
- `git diff --check` passed.
- Baseline reconstruction/hash check passed; QR screenshot decode passed.

No new implementation-mirroring tests were added for these presentation changes; native dialog behavior was validated in the browser. Final visual judgment remains for review. Stop here: no later section or new navigation is authorized.
