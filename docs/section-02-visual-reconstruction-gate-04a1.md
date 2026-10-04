# Gate 04A.1 — Section 02 visual reconstruction

Status: native visual foundation implemented, awaiting visual approval. No Gate 04B scroll choreography, pinning, scrub timeline or Section 03 was added.

Review: [http://localhost:3000/new](http://localhost:3000/new), after the approved opening releases. Section anchor: `your-mix`.

## Old website orb audit

The renderer was found at `app/_components/oryvelle-orb-canvas.tsx`, not in deleted shader assets. An all-history filename search for orb/black-hole/shader paths returned that same file. Relevant history:

- `5426dbd`: original RitualExperience/orb work;
- `0edb007`: external glow-strength input;
- `98b86c6`, `95bca12`: frame/visibility/reduced-motion work;
- `c1031cc`: shared canvas utility extraction.

It is **Canvas 2D**, not WebGL. Dependencies are React effects/refs and three simple local color helpers from `canvas-utils.ts`. Its 875 lines include separate rear/front accretion disk passes, event-horizon shadow, singularity, lensing arcs, sweep-gradient highlights, infall streams, debris, stars and optional palette/glow props. The old landing imports it from `parallax-landing-experience.tsx`; the renderer itself does not import that page’s scroll state.

Its own RAF runs at browser cadence. DPR is capped at 2. IntersectionObserver cancels it offscreen, and reduced motion draws a static frame. However, initialization starts the loop before the first visibility result; preference changes can restart it independently of current intersection; it has no explicit hidden-document gate; a resize clears the canvas without necessarily repainting a paused frame. Gradient/path allocations occur during drawing. These are source findings, not an old-version FPS or memory benchmark. No trustworthy isolated old-renderer performance benchmark was established.

**Reused:** the independent sweep-gradient drawing approach, flattened-ring geometry, rear → shadow/center → front ordering, soft event-horizon shadow, lensing arcs, restrained bloom and circular band drawing. The extracted renderer is 410 lines and has no dependency on the old landing directories.

**Rejected:** the old React component/lifecycle, parallax controller, external scene palette/glow ownership, red/orange debris and infall systems, jets, twinkling star system and generic shared utilities. The original component remains untouched because the existing production landing still consumes it. Restoring that landing architecture was unnecessary.

## Android comparison and product truth

Read-only source comparison used `/Users/yami/Documents/Android/AURA-Sleep`, especially `OryvelleOrbRendering.kt`, geometry responsibilities and the Explore vector motifs. The actual inspected device state in `11-tonight-mix.png` was reviewed again: a near-black center, flattened rear/front ring passes, faint curved orbital light and two small selected-sound satellites. This gate reuses that previously inspected device evidence; it does not claim a fresh exhaustive app walkthrough.

The Android renderer also uses layered Canvas-like drawing and sweep gradients. This supports adapting our own existing 2D implementation rather than introducing another Three.js scene. Android implementation code was not copied.

Exactly two layers remain:

- **Calming Rain** — previously selected/played on device; current local catalog marks audio public and availability active.
- **Brown Noise** — same verification and access class.

Both are usable public sounds, not unavailable stars or Premium-only content. Public/free access is source-derived; the inspected device was Premium-active. The 50% mix and 30-minute fade-enabled timer come from the verified mixer/timer states documented in the product inspection and Gate 04A. No sleep detection, efficacy claim or invented control was introduced.

## Chosen renderer and ownership

| Concern | Owner |
| --- | --- |
| Headline, explanatory copy, mix/timer status | Server-rendered HTML and scoped CSS |
| Constellation | Native inline SVG path geometry and HTML selected labels |
| Orb drawing | One independent Canvas 2D renderer |
| Ambient phase/time and visibility | Local effect in `MixOrb.tsx` |
| Tiny satellite drift | Two scoped CSS animations, paused by the orb visibility state |
| Opening | Existing R3F/GSAP architecture, entirely unchanged |

Canvas 2D was chosen because we already have the useful 2D drawing layers, and moving sweep-gradient highlights give the accretion surface a quality beyond rotating a static SVG picture. SVG/CSS remain simpler for the constellation, labels and timer. No shader, second WebGL context, Three/R3F scene, postprocessing, animation library or package was added.

## Native constellation

`Constellation.tsx` renders real converted rain/wave paths directly as SVG `<path>` elements through `constellation-paths.ts`. The retained converted SVG files are provenance/geometry masters, not runtime `<img>` illustrations. Native grouping allows each motif to be repositioned independently at mobile widths.

The field is spacious and deliberately sparse:

- dim, thin rain-cloud/droplet/lightning and wave geometry;
- twelve curated quiet light points, with no independent star animation;
- two bright named selected stars with restrained state rings;
- faint dotted paths toward the mix region;
- small optional desktop discovery label.

The field’s nodes and dashed relationship to the orb are an **editorial website map**, not Android catalog coordinates or a claim that Explore literally morphs into Tonight. The selected states are explanatory, not fake buttons. Selection/travel remains a future Gate 04B decision.

## Orb visual architecture

`orb-renderer.ts` draws:

1. restrained radial teal/violet light;
2. faint lensing arcs;
3. rear flattened accretion disk;
4. subtle secondary lensing bands;
5. soft event-horizon shadow and almost-black center;
6. foreground accretion passes and localized highlights;
7. a subdued partial photon/lensing rim.

The center dominates; the rings define it rather than making it a luminous sphere. Sweep-gradient highlights move around the flattened ring plane, not around a glowing planet texture. The old warm red/orange palette was replaced by muted teal/blue, violet and pale moonlight. There are no debris clouds, particles, landscape backgrounds or jets.

Two genuine 81×81 device-cropped sound avatars are HTML/image satellites. Their labels identify the same two selected layers seen above. They are not screenshots of a full app panel. A small CSS horizon/ring representation survives if JavaScript/Canvas/conic gradients are unavailable; factual text and status are always server rendered.

## Ambient motion and rendering lifecycle

Ambient life is independent of scrolling:

- disk phase: 64-second cycle; the extracted passes use different phase multipliers/offsets;
- turbulence/lensing phase: 41-second cycle;
- illumination: 17-second cycle, strength `.88 ± .045`;
- rain satellite: up to 9px horizontal / 7px vertical drift over 31 seconds;
- noise satellite: up to 7px horizontal / 9px vertical drift over 43 seconds, with a different turning point;
- constellation stars remain still.

There is one local RAF, with drawing capped at **30 draws/second**. It runs only when the orb host intersects the viewport by at least 5%, reduced motion is off and the document is visible. A resize or initialization can draw a single static frame. Time does not accumulate while paused; the resumed frame continues the same phase. CSS satellite animation play state follows the same gate.

No per-frame React state is used. React state changes only for first paint and discrete visibility/preference changes. Cleanup cancels RAF and disconnects IntersectionObserver/ResizeObserver, visibility and media-query listeners. No scroll listener or progress owner was introduced. DPR is capped at 1.5; CSS dimensions remain independent of backing-store dimensions.

Context7 guidance from `/reactjs/react.dev` was consulted for effect cleanup, observer ownership and imperative ref mutation. The implementation keeps those responsibilities local rather than introducing a generic animation hook.

### Reduced motion

`prefers-reduced-motion: reduce` disables Canvas ticking and removes both satellite animations. The current frame, sound names, mix levels and timer remain visible. Brave DevTools emulation confirmed the actual preference was true, both animation names were `none`, and the draw counter stayed at 5,633 across subsequent inspection. Closing DevTools restored normal motion emulation settings.

## Integrated mix and timer

The old mixer and timer screenshot cards were removed entirely. Native semantic labels now show:

- Calming Rain · 50%;
- Brown Noise · 50%;
- two thin half-filled level indicators;
- “Balance each layer independently.”;
- a small clock motif, “Sleep timer · 30 min” and “Fade out”.

They live within the orb figure, without separate card surfaces or feature-module backgrounds. Levels are `<dl>` content and decorative bars, not sliders. The timer is an illustrative status, not a ticking website countdown or clickable control. A quiet note clarifies that controls live in the app.

## Responsive composition

- **Above 1100px:** centered editorial heading, spacious field, orb up to 1000px and side-by-side mix levels.
- **761–1100px:** smaller simultaneous field/orb (up to 870px), reduced peripheral copy, same integrated status.
- **760px and below:** left-aligned editorial heading → recomposed constellation motifs/two selected names → substantial orb → vertically grouped mix levels → timer. The orb canvas extends beyond the content column; restrained peripheral ring tails may crop at the viewport edge, while the core and both satellite names remain legible. No pinning.
- At **320px**, the heading wraps deliberately. A clipped rain satellite label found during review was corrected by moving its mobile anchor inward. No horizontal document overflow remained.

The initial static section frame is distinct from the opening stand. The phone does not enter this chapter. The existing opening boundary remains untouched.

## Cleanup and provenance

Removed from `public/mix/` after replacement validation:

- `orb.svg`;
- `mixer-excerpt.webp`;
- `timer-excerpt.webp`.

Removed from the component/CSS: screenshot figures/cards, screenshot sizing/masks, static orb image and obsolete layout selectors. No runtime reference to those assets remains.

Retained:

- genuine `calming-rain.webp` and `brown-noise.webp` avatars;
- rain/wave converted vector masters and their Apache-2.0 notice/license;
- original device captures, UI XML and historical Gate 04A report/captures for provenance;
- exact approved Section 02 headline/supporting copy.

`public/mix/ATTRIBUTION.md` was updated to describe the inline geometry and renderer adaptation. The Android project and original old landing renderer remain unchanged.

## Captures

These are actual browser captures of the reconstructed chapter. Small Next development indicators/cursors are not product UI.

### Desktop — 1440×900

![Desktop native constellation and orb](/Users/yami/Documents/Next/noxelle/docs/captures/gate-04a1/desktop-1440.jpg)

### Tablet — 1024×900

![Tablet native composition](/Users/yami/Documents/Next/noxelle/docs/captures/gate-04a1/tablet-1024.jpg)

### Mobile — 390×844

![Mobile visual journey](/Users/yami/Documents/Next/noxelle/docs/captures/gate-04a1/mobile-390.jpg)

Additional captures: `mobile-320.jpg` and `reduced-motion.jpg` in the same folder. Full-chapter screenshots crop the document, not a second mockup route.

## Performance and validation

Measured/observed:

- Desktop Canvas backing store: **1000×1000** at observed DPR 1; configured cap is 1.5.
- Sampled Canvas draw-submission duration: roughly **0.1–0.2ms** in this Brave desktop session. This measures JavaScript drawing submission, not complete raster/GPU cost, FPS or mobile performance.
- Offscreen check: counter **3,401 → 3,401** across approximately **39 seconds**, with render state static.
- Reduced-motion counter remained static as documented above.
- Native tab switching was attempted for hidden-tab validation, but the attached browser continued reporting `document.hidden=false` and did not deliver an observable hidden transition to the diagnostics. Hidden-document cancellation is implemented and inspected in source; **a real hidden-tab pause was not empirically established in this automation session**. No battery/hidden-tab performance improvement is claimed.
- Exactly one 2D orb canvas is added. The existing phone canvas is separate; there is no additional WebGL renderer or render target.
- Runtime raster art is now just the two avatars, **4,262 source bytes combined**. Constellation geometry is in server-rendered SVG; the orb has no raster/video asset. Renderer JS is small local drawing code, not a new library.

Brave validation covered complete desktop/tablet/mobile chapter captures, 320px label clearance, forward/backward document scrolling, entry/reload, live ambient holds, offscreen pause and reduced motion. The timer clipping found during desktop review was corrected by reserving adequate scene height. Document width matched measured 1440/390/320 viewport widths. No screenshot panels or fake controls remain.

The existing opening was not retuned. `docs/captures/gate-04a1/opening-baseline-sha256.json` covers its page, chapter, CSS, timeline, renderer/materials, entry, float and stand files; **all hashes remain identical** to the pre-edit Gate 04A.1 baseline, including the Section 02 insertion boundary.

Checks: ESLint passed; TypeScript passed; all **41 tests / 6 files** passed; production build passed (`/new` prerendered); `git diff --check` and edited/new text whitespace checks passed. No new test was added for cosmetic composition. Existing opening `THREE.Clock` and local manifest origin/scope warnings were observed; they were not changed in this frozen-opening gate. No new Section 02 error was observed.

## Gate 04B opportunities — not implemented

- Reveal the quiet field, then distinguish the two selected stars.
- Detach the same two nodes along authored paths and hand them to the genuine avatar satellites.
- Bring forward the dark mix object and integrated levels without inventing more layers.
- Introduce timer status last; soften illumination into the endpoint.
- Keep mobile normal flow and reduced motion complete.

This would be an editorial story, not a literal Android screen morph. Visual approval of the constellation, orb brightness/ring weight, satellite placement and integrated status comes first. Higher-resolution original avatar covers remain a possible production asset refinement if those elements grow.

**Stop:** Gate 04B and Section 03 remain unimplemented. Section 01 remains frozen. The reconstructed foundation is ready for visual review.
