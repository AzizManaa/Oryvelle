# Gate 02.5 — Global opening entry

Date: 2026-10-03. Review route: http://localhost:3000/new

Status: implemented and browser inspected; awaiting visual approval. Scope ends at the existing Gate 02 opening. No Section 02 or screen/video production work.

## Flowty refresh inspection

Personally inspected https://flowty.co/ in Brave before implementation: normal reload, hard reload, repeated refreshes, DevTools Disable cache, desktop, and 390 × 844 responsive emulation.

### Directly observed behavior

- The first visible field is near-black. A dedicated entry composition precedes the full hero.
- Large pale/lavender rolling, cropped numerals occupy the upper-left; a small Flowty wordmark sits upper-right. Quiet supporting copy sits lower-left and a small F mark lower-right.
- A central rectangular preview cycles product/feature imagery, including phone, watch, and cards. This is not evidence that the preview is the actual hero WebGL canvas.
- The entry reappears on cached refreshes. The inspected runs lasted several seconds, approximately 5–7 seconds by observation, not a precision timing measurement.
- Narrow layout retains the same corner-based composition and central preview with adjusted sizes.
- A narrow exit frame showed 99 and corner branding still above the emerging hero. The dark cover clears upward, exposing the hero underneath. Hero type emerges with the opening; the visible phone appears already prepared, with no observed material/bezel initialization snap.
- Attempted scrolling during a reference entry did not visibly advance its narrative; the released hero started at its intended opening.
- No generic spinner was observed. No independently moving segmented shutter panels were established.

### Public implementation evidence

- The accessibility tree exposed repeated numeral strips and hero content while entry content was still present. The underlying hero DOM therefore existed during entry.
- DevTools Network showed document milestones completing before the entry finished: one inspected reload had DOMContentLoaded around 659 ms and Load around 833 ms, while counter progression remained visible afterward.
- Inspection was limited to normally delivered UI/DOM/network information. No proprietary code, scene coordinates, models, preview artwork, or loader assets were copied.

### Inference and unknowns

- The entry combines authored motion with initialization time; the displayed number cannot be assumed to be truthful byte/download percentage.
- The upward clearing reads as a moving cover over an existing hero. The exact implementation, its readiness criteria, full asset list, and whether the central preview is video/canvas/images remain unknown in this gate.
- Our shorter, readiness-driven entry intentionally differs from Flowty's longer counter/montage presentation.

## Our design

A server-rendered fixed near-black cover, centered Oryvelle wordmark, subtle CSS lavender light, and one small underline. No additional asset, font, renderer, percentage counter, video, particle system, or dependency is introduced.

The underline's 280 ms introduction is a minimum presentation beat, not simulated loading progress. It can complete while the phone loads. Once actual readiness is satisfied, the entire opaque cover travels upward over 760 ms with `power3.inOut`, uncovering the existing stationary hero from the bottom. Hero scale, placement, typography, lighting and transforms are not animated by entry logic.

Cached visitors wait only for actual initialization plus this restrained motion. There is no fixed 2–4 second splash, timer claiming readiness, or autoplay of chapter choreography.

A small keyboard-accessible “View static version” escape is available immediately after hydration for an indefinitely pending request. It explicitly selects the fallback; it never claims the renderer succeeded.

## Readiness and lifecycle

Normal release requires:

1. Responsive and reduced-motion preferences have been resolved.
2. The existing opening layout/timeline setup has applied the initial composition.
3. Existing opening fonts have settled through `document.fonts.ready`.
4. GLB and all initial screen textures have resolved through the existing loaders.
5. `preparePhone()` has completed mesh visibility, duplicate/front-surface handling, display remapping, material and glass preparation.
6. `onReady` has applied the initial responsive pose and `portraitA` through the existing controller.
7. The existing local R3F frame counter and `addAfterEffect` contract have reported a completed prepared render with a live context through `onPresented`.
8. The short underline introduction has completed.

`entryReady = preferencesReady && layoutReady && (fallback ? posterReady : ready && fontsReady)`.

Normal lifecycle:

`SSR entry → hydrate/layout/preferences/fonts → hidden R3F/model/screens/prepare/pose → prepared rendered frame → readiness + minimum beat → upward cover release → unlock → approved native-scroll chapter`.

The renderer wrapper retains its existing first-frame visibility gate in addition to the cover. Removing entry does not remount the phone or canvas. R3F retains demand rendering; GSAP retains choreography ownership. No per-frame React state or second frame scheduler was added.

Files:

- `components/landing/entry/GlobalEntry.tsx`: minimum beat, readiness-controlled release, inert content, scroll/input lock, cleanup and escape.
- `components/landing/entry/entry.module.css`: minimal entry styling and scoped root scroll lock.
- `components/landing/chapters/opening/OpeningChapter.tsx`: lifecycle integration, fallback image readiness and debug-only readiness attributes.
- `components/landing/device/PhoneCanvas.tsx`: context-loss listener moved outside model-loading Suspense so loss during loading can report failure too. The original preparation and first-frame logic remains intact.
- `app/new/page.tsx`: tiny initial script disables browser scroll restoration and anchors the new chapter before hydration where possible. It does not mutate server-rendered HTML attributes.

## Scroll handling

The cover establishes `overflow:hidden` and disabled overscroll through a scoped `html:has(...)` rule as soon as its HTML/CSS is delivered. During hydration, main content becomes inert; wheel/touchmove and scroll keys cannot accumulate chapter travel. Scroll/pageshow events reanchor at zero. History restoration is manual while entry is active and its previous setting is restored on cleanup.

The lock remains through the exit transition, then disappears with the cover. It does not use fixed-body offsets or translate the page. Native scrolling resumes normally. Under throttled streaming, a previously retained browser scroll offset was observable before initialization; hydration corrected it to zero while still covered, and the hero released at progress `0.0000`. No restored halfway-through chapter was exposed.

The static escape remains accessible. Entry status is announced politely; underlying navigation/content is inert only while entry is mounted. A no-JavaScript style path hides the cover and exposes the static hero/content rather than trapping the page.

## Failure and fallback

- GLB/texture errors and renderer creation exceptions propagate to the existing React renderer boundary, select fallback, and release after fallback image readiness.
- Context loss is observed independently of GLB loading, outside Suspense. After release, context loss switches to the same static usable hero without showing entry again.
- Cached poster readiness checks `HTMLImageElement.complete` in addition to load/error events, since SSR images may finish before React attaches handlers.
- If the fallback image itself fails, its error releases the cover so real HTML copy and CTA remain usable.
- A indefinitely pending request offers the explicit static escape. There is no blind timeout pretending successful WebGL readiness.
- The R3F Canvas fallback is passive DOM content. It must not run an effect that reports failure merely by mounting: in the installed R3F implementation it is canvas fallback children and can mount even when WebGL works. An early integration attempt exposed that distinction and was corrected before acceptance checks.

## Reduced motion

Preferences are resolved before mounting WebGL. Reduced motion uses the existing matched static phone, omits the 280 ms underline movement, and uses a 120 ms opacity release with no upward travel. Copy and CTA remain available. No canvas is allocated in that path.

## Normal-load poster usage

**The matched phone poster is excluded from the visible successful normal-load path.** Its picture remains available and loads as a fallback resource, but is `visibility:hidden` regardless of renderer readiness whenever fallback is false. It is no longer assigned high fetch priority. The entry reveals the actual prepared canvas directly.

Poster assets were retained unchanged. No old thick-bezel SVG was reintroduced.

## Browser validation

Brave desktop with DevTools responsive emulation against the local development server:

| Check | Result / evidence |
| --- | --- |
| Normal reload | Entry followed by correct prepared phone; no visible poster handoff. |
| Hard reload | Cover, prepared renderer, upward reveal inspected, including an exit frame with already-correct phone underneath. |
| Disable cache | Repeated hard/reload checks with Network Disable cache enabled; cover remained coherent. |
| Repeated cached reload | Cache re-enabled; model 304 responses observed; entry still released normally without a long artificial wait. |
| Slow 4G | Uncached entry remained visible while initialization proceeded; completed into real hero. |
| Refresh after scrolling | Tested around progress 0.775; released at scrollY 0 / progress 0.0000. |
| Wheel/keyboard attempts around entry | Wheel, ArrowDown and Space attempted during throttled refresh; covered initialization returned to start before reveal. Post-release inputs scrolled normally. |
| Wide desktop | 1920 × 900, entry and settled hero inspected. |
| Normal desktop | 1440 × 900, normal/cached refresh and upward reveal inspected. |
| Short desktop | 1366 × 600, entry and settled hero inspected. |
| Tablet/narrow | 820 × 900, entry and settled hero inspected. |
| Mobile emulation | 390 × 844, entry, real hero, throttled refresh and fallback inspected. |
| Reverse scrolling | Forward/back wheel movement after release and a full-back checkpoint inspected; demand renderer updated without another intro. |
| Context loss | Existing debug button forced `WEBGL_lose_context`; matched static hero replaced canvas and remained usable. Retested after moving lifecycle listener. |
| Load failure | DevTools blocked only `/assests/oryvelle-phone.glb`; request failed, boundary selected static hero, cover released. Blocking pattern removed afterward. |
| Reduced motion | DevTools emulation + hard refresh: `reduced:true`, no canvas, poster visible, no remaining entry. Emulation restored afterward. |
| Console | No hydration or runtime errors on successful loads. Existing Permissions-Policy/manifest-local-origin/THREE.Clock warnings remain. Forced blocked request and context loss produced expected diagnostic messages. |

Testing limits: responsive emulation is not physical mobile-device testing; resizing between loads was tested, but a separate resize-during-entry stress test was not recorded. GPU-disabled browser startup and no-JavaScript behavior were reviewed in code rather than exercised in this run. Scroll input timing before hydration cannot be perfectly synchronized through native UI; the critical observed outcome was the zero-progress release after attempted input and restored-scroll refresh.

No pixel-by-pixel automated movie comparison was performed. The successful handoff was visually inspected in Brave and supported by DOM readiness/visibility checks: real canvas prepared, normal poster hidden, entry removed, scrollY zero.

## Performance and static verification

- Same single canvas/model, demand rendering, DPR cap 1.5, existing lights/environment, no postprocessing or new dependencies.
- Debug initial desktop frame: 30 draws, 12,419 visible triangles, two demand frames. Other poses/narrow framing reported 32 draws / 12,499 triangles. Variation is visibility/framing, not changed geometry.
- The entry uses only CSS fields and two short GSAP transform animations, with no idle animation loop after minimum presentation.
- `npm run lint`: passed.
- `npx tsc --noEmit`: passed.
- `npm test`: 38 tests / 5 files passed (existing geometry/pose/easing and application tests; these are not browser entry tests).
- `npm run build`: passed after final lifecycle change.
- `git diff --check`: passed.

## Regressions and Git preservation

Branch: `feat/flowty-fidelity-redesign`. Existing dirty tracked package files and untracked Gate 01/02 work were preserved. No reset, stash, clean, source asset modification, package installation, or dependency removal.

Before/after hashes match for `opening-poses.ts`, `opening.timeline.ts`, and `phone-model.ts`; the authored opening composition CSS is unchanged apart from the scoped root scrollbar rules documented below. Gate 02 physical turns, screen thresholds, camera, materials, lighting, phone scale, typography choreography, environment, stand and release distances were not changed.

Only the initial entry contract and preference-before-canvas mount were integrated. The matched static fallback infrastructure remains. Existing Gate 02 asset/fidelity gaps remain outside this gate.

## Review stop

Review http://localhost:3000/new with a refresh. No Section 02 was implemented. Await visual approval before further work.


## Presentation correction — typography handoff and native scrollbar

Date: 2026-10-03. Only two CSS changes; temporary measurement instrumentation was removed after diagnosis. Entry motion, lifecycle and approved phone/typography choreography remain unchanged.

### Root cause established before editing

Brave DevTools measurements immediately before entry unmount and after its layout cleanup showed a viewport-unit basis change caused by the entry-only `scrollbar-gutter:stable` rule. At 2560 × 776, the gutter reserved 15 px during the entry. On release, gutter changed to `auto` and document overflow unlocked. Although body width was 2545 px in both states, root client width changed 2560 → 2545 and the headline's `8.7vw` computed value changed 221.415 → 222.72 px. The corresponding line-height and letter-spacing changed too.

| Property | Before fix: entry active | Before fix: released |
| --- | --- | --- |
| Font family | Outfit, "Outfit Fallback", sans-serif | identical |
| Weight | 300 | 300 |
| Size | 221.415 px | 222.72 px |
| Line height | 208.13 px | 209.357 px |
| Letter spacing | −9.96367 px | −10.0224 px |
| Headline rect x / y / w / h | 66.15625 / 26.375 / 1832.390625 / 416.25 | 66.546875 / 26.375 / 1843.1875 / 418.6875 |
| Window inner width | 2560 | 2560 |
| Root client width | 2560 | 2545 |
| Body client width | 2545 | 2545 |
| Gutter / overflow | stable / hidden | auto / visible |
| Font status / font check | loaded / true | loaded / true |
| Narrow breakpoint (max-width:760px) | false | false |
| Canvas w / h | 2545 / 776 | 2545 / 776 |

This establishes gutter/viewport-unit settlement as the cause, rather than late font loading, hydration, weight changes, breakpoint switching or a GSAP font animation.

### Exact correction

- Remove the entry-only stable gutter from `entry.module.css`.
- In `opening.module.css`, scope `scrollbar-width:none; scrollbar-gutter:auto` to `html:has([data-opening-content])` for the entire route lifecycle.
- Add scoped `::-webkit-scrollbar { display:none; width:0; height:0 }` for engines needing the WebKit pseudo-element.

The root uses the same zero-gutter geometry before and after entry release. The existing entry overflow/input lock remains only during initialization. After release the native document remains scrollable; no smooth-scroll library, nested scroll container, new scheduler, fixed body, timeout or design change was introduced. Route scoping leaves other pages' scrollbar policy unchanged.

### Reference observation

Revisited the public Flowty opening in Brave, including native wheel movement through the product turn. No browser side scrollbar was visible during that inspection. Computed root scrollbar-width was `auto`; that does not establish Flowty's exact hiding mechanism. Our implementation reproduces the visible interaction principle using platform CSS rather than adopting its scrolling implementation.

### Corrected measurements and validation

- Desktop hard and normal refresh: before/after font 222.72 px, line-height 209.357 px, letter-spacing −10.0224 px; headline rect exactly 66.546875 / 26.375 / 1843.1875 / 418.6875; inner/root/body widths all 2560; canvas 2560 × 776; font loaded and gutter auto / scrollbar none throughout.
- 390 × 844 emulation hard and normal refresh: font 56 px, line-height 54.88 px, letter-spacing −2.52 px and headline width 333.4375 px unchanged across release; root/body widths 390; fonts loaded; narrow breakpoint true throughout.
- Narrow refresh after forward/back wheel movement released at scrollY 0 and chapter progress 0.0000.
- Native wheel, small forward/back wheel deltas, ArrowDown/ArrowUp, PageDown/PageUp, Space/Shift+Space, Home and End exercised. End reached actual document maximum 4928 px in the inspected desktop setup; Home returned to zero. These are wheel inputs approximating trackpad deltas, not a separate physical trackpad/touch test.
- Context loss retested in narrow emulation: canvas removed, matched narrow poster visible and scrollbar remained hidden. Expected context-loss diagnostics only.
- Final clean `/new` entry and hero inspected with diagnostics removed. Demand rendering, readiness gates, reduced-motion branching and fallback lifecycle were not changed. Reduced-motion behavior was previously browser-tested in this report; it was not separately re-emulated for this CSS-only correction.
- Cross-browser CSS support is covered by standard plus WebKit rules; runtime validation in this correction was Brave, not Firefox/Safari or a physical mobile device.

Final correction checks: lint, TypeScript, all 38 tests, production build and git diff --check passed. Approved pose, timeline and phone-model hashes remain identical to the recorded baseline. No Section 02 or unrelated cleanup was performed.
