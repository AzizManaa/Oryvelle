# Gate 02 — Opening chapter reconstruction

Date: 2026-10-03. Route: **http://localhost:3000/new**. Branch: `feat/flowty-fidelity-redesign`.

## Status: opening implemented and submitted for visual review

The complete opening is implemented and inspected in Brave: hero → first physical turn → changed returning screen → second physical rear/diagonal turn → landscape → layered stand settlement → natural sticky release. Gate 01's persistent renderer architecture is preserved. Implementation stops here; no Section 02 or later landing sections were built.

This is a reviewable reconstruction of the opening grammar, not a claim of pixel fidelity or final production artwork. Temporary screens, stand artwork and poster, plus limitations in the supplied phone geometry, remain explicit fidelity gaps below.

## Git / preservation

Initial Gate 02 state:

```
 M package-lock.json
 M package.json
?? app/new/
?? components/
?? docs/
?? public/assests/
?? public/renderer-proof/
?? scripts/
```

Branch was already `feat/flowty-fidelity-redesign`; Gate 01 code and report were present. No reset, discard, clean, stash, source-asset rewrite or unrelated cleanup was performed. Existing production home, legal routes, deployment configuration and root styling remain untouched. Gate 01 proof components are retained but no longer imported by normal `/new`; the shared renderer was extended rather than rebuilt. One proof screen-key helper and its model-contract test were updated for the semantic screen API.

New work is confined to the opening chapter, runtime device presentation, opening assets and `/new`. No dependencies were added in Gate 02. Model attribution is retained in the minimal release boundary rather than placed over the hero.

Original master assets remain byte-identical:

- `public/assests/oryvelle-phone.glb`, 555,804 bytes. SHA-256 `5a9f29ab225394e92cbb1604360edb2ad29c1df4ce2db79e6ae35310dcb1ed34`.
- `public/assests/phone-source.blend`. SHA-256 `5221a06bfa719d4c4f3fc69c44791ff2da204e0b40808ca3643abb2a3a62a566`.

## Reference comparison

Re-observed Flowty in the existing Brave tab, at a 2560 × 1330 page viewport (2560 × 1410 browser window). Inspected initial composition, incremental forward movement, first edge/back/return, returning front, second edge/diagonal back, landscape approach, stand settlement and opening release. Also moved backward from the release. Distances inferred from native scroll gestures are approximate, not measurements of Flowty's internal timeline.

Observed grammar:

- Outfit light display type at approximately 8–9vw; pale lavender on near-black; left inset around 2.6vw.
- Initial phone dominates the lower middle, extends below the viewport, and sits in front of oversized type. Supporting copy and a compact action occupy the lower left.
- A broad blurred purple/indigo diagonal light field forms one persistent atmosphere.
- Hero type exits upward as the phone rises and travels right. Device remains large through the actual first edge/back reveal.
- First back exposure is appreciable, rather than a quick wiggle. Returning front holds to the right of another large two-line statement, displaying changed content.
- The second turn includes a rear-facing diagonal phase. Stand enters before the physical rotation finishes.
- Landscape approaches obliquely, levels out, and settles centrally into a ribbed support. Foreground grips overlap the bottom edge. Phone remains a real rendered object; UI in the reference continues independently while scrolling pauses.
- Settled product/environment subsequently leave upward together, followed by a dark breathing interval.

Our copy, model and temporary screen/stand artwork are original or supplied/licensed, not copied reference assets. Reference companion/watch artwork and exact screen UI are absent. Our compact bottom action establishes only opening navigation; a full menu is not built in this gate.

### Static composition and continuous comparison loop

Created development-only composition URLs (`?pose=hero`, `front`, `quarter`, `edge`, `back`, `return`, `second`, `approach`, `stand`). Inspected those compositions before connecting the continuous timeline, then compared the normal journey through the same checkpoints. Revisited Flowty's settled stand/release and second turn at a shorter desktop viewport (approximately 2560 × 776 with DevTools open).

Adjusted scale/anchor, type hierarchy, atmosphere, screen orientation, material response and stand contact. Changed physical Euler order to `ZYX` so diagonal roll remains consistent through the rear phase. Returning type now enters earlier; upcoming type remains hidden before its entrance. On mobile, support copy moves above the hero phone. A bottom atmospheric fade removes the rectangular seam at release. Foreground grips fade at their contact position late in arrival rather than rising visibly below the device.

The final continuous journey was inspected slowly forward/backward and with rapid reversals. Our atmosphere is softer and less blue than Flowty's; the supplied phone and SVG stand have less geometric/photographic detail. Scroll distances and poses are independently authored, not measurements copied from reference internals.

## Opening structure / authored choreography

`OpeningChapter` owns one sticky stage inside a **660svh** chapter: **560svh of scroll travel** followed by natural sticky release. Minimum next boundary is a blank **75svh** dark interval with small required model attribution. There is no Section 02 content.

Normalized travel:

| Progress | Physical composition | Display | Typography / environment |
|---|---|---|---|
| 0 | Large tilted front, partly below viewport | portraitA | Oversized hero, lower-left support/action |
| 10% | Dominant front rises | portraitA | Hero starts leaving; wordmark recedes |
| 19% | First three-quarter | portraitA | Hero continues upward |
| 24% | First edge | portraitA | Hero leaves |
| 32% | Full physical back | portraitB, swapped while hidden | Second statement entering from below |
| 39% | Back exposure continues | portraitB | Type progresses into its composition |
| 47% | Returning edge | portraitB | Type settles |
| 55–63% | Returning front, right anchor | portraitB | Readable type/product hold |
| 70% | Second edge / diagonal roll | portraitB | Second statement exits |
| 77% | Second full rear / diagonal | landscapeC, swapped while hidden | Final statement enters; rear stand rising |
| 84% | Oblique landscape approach | landscapeC | Rear environment established |
| 90.5–93% | Arrival and contact | landscapeC | Foreground grips fade at contact; atmosphere softens |
| 91–100% | Stable landscape in stand | landscapeC | Final statement and supporting copy; short settling hold |
| >100% | Whole stage leaves in normal document flow | landscapeC | Dark release boundary |

Coordinates are our authored normalized values, not reference internals. Angle values remain unwrapped through two complete rotations (`0 → 2π → 4π`); no shortest-path rotation bypasses either full back. Landscape roll ends at `−π/2`.

Native scrolling; one scrubbed GSAP timeline; `scrub: true`; no snap, autoplay or per-frame React state. Each pose field uses monotone cubic Hermite easing expressed through GSAP segment ease functions. Neighbor-derived tangents preserve velocity across checkpoints, retain exact edge/back poses and avoid angular overshoot. This adds no scheduler. Pacing was checked against representative reference compositions; it is not an exact reconstruction of the reference timing.

CSS sticky owns viewport occupation. ScrollTrigger maps chapter travel to a normalized timeline and uses measured chapter-minus-stage height. GSAP owns DOM translation/visibility, atmosphere, stand entry and the pose object. R3F owns actual physical rotation/rendering. Font readiness triggers a bounded refresh; no per-frame measurement or refresh.

Canvas framing is translated horizontally through the enclosing DOM product layer by GSAP. Physical vertical translation, scale and orientation remain on the persistent 3D pivot. This avoids an off-axis camera skew at the right anchor and avoids clipping tall geometry in a vertically translated render buffer. Both layers remain explicitly owned by the same chapter.

## Renderer / phone presentation

Preserved Gate 01 model loader, cloned runtime instance, UV adaptation, independent existing display/glass, duplicate hiding, PMREM lifecycle, context-loss handling, demand renderer and DPR cap.

- One perspective camera: position `[0,0,10]`, FOV 32°, near 0.1, far 50.
- One persistent GLB, normalized from asset front `−Z` using an inner Y half-turn.
- Outer physical rotation now uses Euler `ZYX` to keep screen-space roll consistent during back poses.
- Base size uses min(78% viewport height, 82% viewport width), divided by the model's 4.9612-unit long dimension. Narrow composition applies a 0.88 scale multiplier.
- RoomEnvironment-generated PMREM; global environment intensity 0.26; exposure 0.95.
- Restrained ambient 0.15, lavender key 1.0, rim 0.75, white fill 0.28. No postprocessing, custom shader, extra canvas or animation scheduler.
- Cloned chassis/rim materials darkened, roughness raised and reflection intensity reduced. Camera island and rings/lenses darkened and blue response suppressed. Samsung geometry remains, with subdued material rather than destructive removal.
- Original filled glass surface preserved, opacity 0.018, roughness 0.24, reduced clearcoat; independently above the UI surface.
- Original border surface gets a 0.0015 local-normal separation to reduce depth noise from coplanar chassis faces. Existing glass separation remains 0.003. No floating plane or HTML display workaround.

Runtime chassis/rim now use dark `#0d0d11`, metalness 0.12, roughness 0.6 and environment intensity 0.03. Rear panel uses metalness 0.18, roughness 0.6 and environment intensity 0.06. Lens/ring materials use dark `#08090d`, metalness 0.08, roughness 0.42 and environment intensity 0.04. These reduce the previous white perimeter and blue lens response without simply strengthening the lights.

**Visual limitations:** edge readability is improved, but enlarged bevel faceting and some perimeter speckling remain visible at certain angles. Rear finish lacks authored texture/physical detail; camera materials and glass are restrained approximations of a premium device. No behavior blocker requiring Blender modification was found. A production normals/bevel/material export may still be useful after visual review; the original master was not modified.

## Screen system

Semantic keys and source metadata live in `device/screen-sources.ts`, independently of authored phone poses:

- `portraitA`: temporary home/wind-down screen.
- `portraitB`: temporary breathing/evening screen.
- `landscapeC`: deliberate temporary sleep timer; content counter-rotated in the portrait UV texture so it is upright after physical landscape roll.

SVGs are clearly replaceable visual placeholders, not approved current Oryvelle UI. No TEST A/B, inversion markers or proof labels remain in the normal page.

Current textures: 600 × 1266, cloned, `flipY=false`, sRGB, linear mipmap filtering, anisotropy 4. Existing filled rounded display geometry supplies the actual boundary. Independent matching glass remains physically above it.

Renderer contract:

```ts
apply(pose, semanticScreenState)
setScreen(texture: THREE.Texture)
setScreenSource(state, texture: THREE.Texture)
invalidate()
```

`setScreen` replaces the active semantic source, not only its material for one frame; subsequent pose updates retain it. `setScreenSource` registers independently produced textures for future states. `VideoTexture` satisfies the same Texture contract. External playback owns externally supplied textures and their disposal; renderer disposes only its own cloned static textures/materials/geometries.

A future video adapter can continue playback while scroll is stationary and invoke `invalidate()` on visible video-frame delivery. There is no scroll-bound playback scheduler or actual video implementation in this gate. Screen selection reverses at the same 32% and 77% thresholds; tests verify the authored normals are rear-facing at both swaps. Slow forward/backward scrolling and reversals through both hidden thresholds showed no visible texture pop. Landscape content was observed upright; screen boundaries remain attached to the physical model.

## Stand / atmosphere / depth

`Stand.tsx` is independently authored, replaceable SVG artwork: ribbed rear plate, dark upright/foot, foreground grip silhouettes and restrained highlight/contact cues. It is not final photography. Rear and foreground render as separate DOM layers using the same size and position contract as the settled phone.

Depth order: atmosphere 0 → typography 10 → rear stand 20 → R3F product 30 → foreground grips 40 → wordmark/action 60 → development-only diagnostics 80. Stage isolates its stacking context.

CSS `--device-span` agrees with the renderer sizing formula. Desktop settled center is 50% horizontal / 53.5% vertical; narrow settled center 50% / 57.4%. Grips cross the existing lower device edge, not an approximate HTML screen. Stand rises through scroll; foreground enters close to physical arrival. Final artwork should use matched rear/front renders or photographs against these camera/framing anchors.

Persistent near-black field; diagonal blurred CSS lighting and a separate subtle desk glow interpolate rather than changing rectangular section backgrounds. No old orb, constellation, portal or night/dawn systems are used.

## Responsive strategy and browser QA

760px is the composition breakpoint. Narrow layout retains both backs, screen swaps and landscape narrative, uses 0.88 product scale and reduced horizontal travel, broadens copy and moves the compact action right. Hero supporting copy moves above the phone at 29svh. Stand shares the renderer span and settled vertical anchor. Mobile product scale is intentionally less dominant; large type wraps into more lines. No separate phone or narrative replacement is used.

Brave viewports inspected:

| Viewport | Inspection |
|---|---|
| 2560 × 1330 | Complete journey, representative poses, slow forward/backward, normal scroll, rapid reversals, stand/contact and release |
| 1440 × 900 | Hero and landscape approach |
| 1440 × 700 | Short desktop approach, settled contact and release |
| 1024 × 768 | Narrow desktop/tablet framing and resize into landscape approach |
| 390 × 844 | Mobile emulation: hero, returning front, stand, release and reverse; support-copy overlap corrected |

Resize preserves browser scroll offset while recalculating chapter travel and framing; the same physical offset need not correspond to the same normalized pose after height changes. No unintended essential-device clipping, detached stand or normal-route diagnostics were observed in these checks. Initial bottom hero crop is intentional. Physical mobile GPU performance and every intermediate breakpoint are not certified.

## Loading / fallback

Matched transparent desktop/narrow PNG posters remain visible until the prepared renderer completes its first draw. Environment and pose initialize before presentation; one readiness update reveals the hidden renderer wrapper and hides the poster together. No timeout or technical loading labels appear in normal presentation. See `opening-loading-handoff-fix.md` for diagnosis and repeated-refresh validation.

Error boundary / WebGL context loss, reduced motion and explicit future simplification share a static hero contract and collapse the long chapter. Development `?poster=1&debug=1` demonstrates the static fallback. Poster now captures the prepared model at the existing hero pose; regenerate it when model/material/screen artwork changes.

Observed poster before readiness on reload, then model appearance. Top reload and mid-chapter reload restored the corresponding pose/screen. Forced poster and Brave reduced-motion emulation showed the static hero and collapsed chapter. A development-only context-loss button invokes `WEBGL_lose_context`; actual loss showed the poster and reload restored the renderer. Normal-route recovery currently uses reload, not a visible retry control. Browser security protections were not weakened.

## Performance

No new model, videos, large textures or renderer dependencies. Three SVG screen textures and two matched PNG posters added; stand is inline SVG. Original 542.8KiB GLB unchanged. Geometry still excludes the two exact duplicated lens/ring meshes.

Gate 02 Brave instrumentation measured **32 draws / 12,499 triangles** for the full scene; initial cropped compositions can report fewer visible draws/triangles. Each RGBA screen at 600 × 1266 uses approximately 2.9MiB before mipmaps / 3.9MiB with mipmaps; three cloned active sources are about 11.6MiB GPU allocation, excluding environment/buffers/browser cache. Static source loader cache is bounded. No production FPS claim is made.

Demand rendering, DPR cap 1.5, hidden-document invalidation suppression and visibility restoration retained. GSAP updates imperative refs and DOM; no React state is updated per scroll frame. Once scroll stops there is no ambient continuous render loop. Idle frame counts stayed stable between observations; returning to the tab requests a visibility-restoration frame. Native DPR 1 and emulated capped DPR 1.5 were observed. Resize and rapid reversals retained the same model. Release does not start an ambient loop. No measured 60fps, Core Web Vitals or physical mobile benchmark is claimed.

## Checks / console

- `npm run lint`: pass after latest edits.
- `npx tsc --noEmit`: pass.
- `npm test`: 38 tests, 5 files passed. Includes existing real-GLB display/source-preservation contract and new hidden swap / two-back / narrow-layout contracts and monotone/velocity-continuity easing checks.
- `npm run build`: pass, Next.js 16.3.3; `/new` server-rendered on demand because development query support reads search parameters; production has no visible debug controls.
- `git diff --check`: pass for tracked diff.
- Model/master hashes: unchanged.

Brave console inspection showed no application, hydration or WebGL rendering exception during the normal journey. Remaining warnings include R3F's `THREE.Clock` deprecation, inherited manifest start/scope origin warnings, unused root-font preloads and unsupported `browsing-topics` header; a DevTools CSP issue was also present. These were not addressed through unrelated root-application changes. A failed manual diagnostic console entry generated `ReferenceError: h is not defined`; this was a QA input error, not application code. The browser's self-XSS paste warning was respected. Intentional WebGL context loss is a fallback test, not a spontaneous renderer failure.

## Implementation ownership

```
app/new/page.tsx                   route metadata, scoped Outfit, dev query contract
chapters/opening/OpeningChapter    lifecycle, semantic HTML, poster/fallback, chapter refs
chapters/opening/opening-poses     normalized compositions, deterministic screen thresholds
chapters/opening/opening.timeline  GSAP/ScrollTrigger choreography owner
chapters/opening/pose-ease        velocity-continuous interpolation at authored poses
chapters/opening/Stand             replaceable rear/foreground artwork
chapters/opening/opening.module.css composition, depth, typography, atmosphere, responsive rules
device/PhoneCanvas                R3F lifecycle, camera/light/environment, demand invalidation
device/phone-model                asset adaptation, independent screen/glass/materials
device/screen-sources             replaceable semantic screen source contract
```

Development-only `?debug=1` exposes render stats and native scroll checkpoints. `?pose=NAME` is for static composition comparison and intentionally reloads the preview, rather than evidence of a persistent scroll journey. Normal `/new` never exposes these controls; production ignores them.

## Observed opening results

| Requirement | Result |
|---|---|
| Initial hero/front, three-quarter, near edge | Working; intentional lower hero crop |
| First full physical back | Working; actual chassis/cameras visible |
| Returning front with portraitB | Working |
| Hidden reversible A → B swap | Working; no visible pop observed |
| Second rear-facing diagonal turn | Working; same persistent phone |
| LandscapeC orientation and arrival | Working; deliberate upright timer content |
| Rear stand / phone / foreground occlusion | Working layering/contact; artwork remains temporary |
| Slow backward scrub and rapid reversals | Working in inspected desktop/mobile-emulation paths |
| Sticky release | Working; composition leaves together into blank dark boundary |
| Loading/reduced motion/WebGL loss poster | Working; reload recovery tested |
| Reference-level asset/material finish | Partially achieved; gaps below require review/final assets |

No extra phone instances, source-asset edits, animated screen playback or later sections were added. The final foreground timing was rechecked forward/backward into settlement and release after adjustment.

## Known fidelity / final asset gaps

- Temporary stand lacks photographic material detail and final physical contact/shadows. Replace rear/front art together.
- Temporary screens are not final Oryvelle screenshots/videos; final landscape content and ambient screen playback pending.
- Poster now matches the prepared hero; regenerate when final model/material/screen assets change.
- Samsung source branding cleanup is a production-asset decision; geometry is retained/subdued and there is no affiliation claim.
- Supplied model's bevel faceting, rear finish and camera ring/lens response need final visual review; possible normal/material re-export only if runtime corrections prove inadequate.
- Our lighting is softer/less blue than the reference and our authored pacing is approximate; final visual approval is required before further choreography work.
- SVG stand cannot match photographic environmental depth/contact shadows. Placeholder UI has no independent ambient playback yet. These gaps prevent a claim of full reference production quality.

## Current documentation consulted

Primary source-of-truth docs and Gate 01 report retained. Context7 resolve/query used for GSAP, Three.js and Next.js during this gate:

- GSAP chapter timelines / scrub / responsive cleanup: https://gsap.com/docs/v3/Plugins/ScrollTrigger/ and https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/
- Three.js physically based material environment response: https://threejs.org/docs/#MeshStandardMaterial
- Next.js scoped font loading: https://nextjs.org/docs/app/getting-started/fonts

No overlapping animation library was introduced.

## Stop gate / review

Open **http://localhost:3000/new** in Brave, with no debug query parameters. Development diagnostics remain opt-in only. The normal page is ready for opening-only visual review. Implementation is stopped at the release boundary; Section 02 and all later sections await user approval.
