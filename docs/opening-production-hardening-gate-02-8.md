# Gate 02.8 — Opening production hardening

Date: 2026-10-03. Branch: `feat/flowty-fidelity-redesign`.
Review: http://localhost:3000/new (development); http://localhost:3001/new (production build running for this audit).
Scope: engineering cleanup of the approved opening only. Section 02 was not implemented.

## Baseline and Git safety

The initial working tree already contained modified `package.json` / `package-lock.json` and untracked `app/new`, `components`, `docs`, `public/assests`, `public/opening`, `public/renderer-proof`, and `scripts`. No reset, stash, clean, commit or unrelated-file replacement occurred. Dependency files were not changed in this gate.

Before editing, captured `docs/captures/gate-02-8/baseline.sha`, asset byte counts, emitted-build byte counts, and hero/back/settled screenshots. After editing, the hash check confirms unchanged poses, timeline, opening CSS, entry CSS, stand, lighting, all opening assets, GLB and Blender master. The two expected hash exceptions are `phone-model.ts` (unused optional controller type member removed; runtime preparation unchanged) and `phone-float.ts` (unused `speed` variable removed; all sampled expressions unchanged).

The on-disk approved float was already larger than the earlier Gate 02.7 report: local amplitudes x .024, y .090, z .018; pitch .020, yaw .036, roll .024 radians. Those values, periods, phases, entrance ramp and .78→.905 contact attenuation remain unchanged. The unused `speed = 1.5` never affected sampling. The prior safety test retained older amplitude bounds; updated its bounds to the current approved output without changing animation.

Representative captures: `hero-before.png`, `back-before.png`, `stand-before.png`, and corresponding `*-after.png` in the capture directory. Hero/rear float phases and native-scroll versus forced-pose typography staging differ between captures; they are visual review evidence, not a pixel-exact motion comparison. The forced stand before/after uses the same viewport and `?pose=stand&debug=1`, has zero ambient strength and visibly preserves product/type/stand composition. No numerical pixel-difference claim is made.

## Architecture and classification

| Files/system | Ownership | Classification / decision |
|---|---|---|
| `app/new/page.tsx` | Server metadata, Outfit font variable, scroll-restoration bootstrap, development query gate | Production required. Read query parameters only in development; production can prerender its identical shell. |
| `OpeningChapter.tsx` | React preferences, readiness, fallback, entry release; scoped GSAP integration; markup and CSS framing | Production/fallback required. Retain distinct readiness conditions and renderer boundary. |
| `GlobalEntry.tsx`, `entry.module.css` | Immediate cover, underline minimum, upward exit, input lock, inert content, static escape | Production/accessibility required. Remove duplicate released state; parent unmount owns release. |
| `opening.timeline.ts`, `opening-poses.ts`, `pose-ease.ts` | One scroll timeline, normalized pose, monotone interpolation, screen thresholds | Production required, unchanged. |
| `PhoneCanvas.tsx` | R3F rendering, GLTF/texture loads, preparation, camera/lights, environment lifecycle, first-frame announcement | Production required. Make statistics callback optional and skip production diagnostic formatting. |
| `phone-model.ts` | Mesh visibility, display UV remapping, material calibration, glass, disposal of owned resources | Production required, runtime unchanged. Remove unused `capturePoster` interface field. |
| `phone-lighting.ts` | Temporary reflection-room resources used to produce PMREM | Production required, unchanged. It is not an unused lighting experiment. |
| `screen-sources.ts` | Three semantic static states and asset paths | Production required. Remove unused speculative source union; retain actual texture controller boundary. |
| `PhoneFloat.tsx`, `phone-float.ts` | Additive child transform and visibility-gated frame invalidation | Production required, approved behavior retained. Remove only unused variable. |
| `Stand.tsx` | Rear/front inline SVG composition | Production-used placeholder artwork, retain until separately authorized asset replacement. |
| Opening poster picture | Static/reduced-motion/no-JS/context-loss/load-error representation | Fallback required. Retain despite invisibility on successful loads. |
| Checkpoint links, native seek buttons, frame counters, context-loss control | Development QA | Intentionally retain behind server `NODE_ENV === development` and explicit `debug=1` / `pose` / `poster` parameters. Production ignores them. |
| Gate 01 proof components and proof SVGs | Unused older presentation | Obsolete; deleted after import/URL search established no active consumers. |
| `scripts/inspect-phone.mjs` | Read-only hierarchy/UV inspection | Useful development workflow; retain. |
| Historic reports/captures, Blender master, attribution | Evidence, editable source, licensing | Retain. Not runtime dead code to erase. |

Transform chain remains **GSAP-authored outer pivot → R3F ambient child pivot → original model orientation → prepared GLB scene**. CSS translates the page-level product framing. GSAP never writes the ambient pivot; float never writes the authored pivot, camera, lights or screen. React updates lifecycle state, not per-frame progress. Screen selection and future playback remain separate from pose.

## Context7 guidance consulted

Installed: React/DOM 19.2.4, Next 16.3.3, Three 0.186.1, R3F 9.8.1, GSAP 3.15.0, `@gsap/react` 2.1.2. Resolved each library and queried relevant current documentation through Context7. Exact installed version indexes were not available for every library, so these are current main documentation checks, **not claims of exact-version-pinned documentation**. Also inspected installed R3F source for the actual canvas fallback/error lifecycle.

- [React effect cleanup source](https://github.com/react/react/blob/main/packages/react-reconciler/src/ReactFiberCommitEffects.js): symmetric setup/cleanup and Strict Mode replay. Keep event registrations paired and font promises guarded against disposal.
- [Next client-only dynamic import guidance](https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/migrating/from-vite.mdx): retain the server shell and client-only WebGL import; no new framework boundary needed.
- [R3F demand rendering](https://github.com/pmndrs/react-three-fiber/blob/master/docs/advanced/scaling-performance.mdx): invalidate requests a frame; imperative animation should mutate refs, avoiding per-frame state. Retain demand mode and active-float invalidation.
- [R3F object lifecycle](https://github.com/pmndrs/react-three-fiber/blob/master/docs/API/objects.mdx): loader caching and explicit ownership for primitives. Retain `dispose={null}` and owned cleanup rather than disposing cached geometry.
- [Three Mesh copy](https://github.com/mrdoob/three.js/blob/dev/src/objects/Mesh.js), [Texture contract](https://github.com/mrdoob/three.js/blob/dev/docs/pages/Texture.html), [resource cleanup example](https://github.com/mrdoob/three.js/blob/dev/manual/examples/cleanup-simple.html): cloning an object does not create independently owned geometry or image data; dispose only owned GPU resources.
- [GSAP context](https://gsap.com/docs/v3/GSAP/gsap.context/), [ScrollTrigger refresh](https://gsap.com/docs/v3/Plugins/ScrollTrigger/static.refresh/): scoped revert, deliberate refresh after layout/fonts, not per-frame refresh. Existing `useGSAP` architecture fits.

No Drei, Spline, Lenis, Motion, postprocessing, new shader framework, store or RAF scheduler was added.

## Changes / deletion evidence

Deleted exactly:

- `components/landing/chapters/renderer-proof/RendererProof.tsx`
- `components/landing/chapters/renderer-proof/proof-poses.ts`
- `components/landing/chapters/renderer-proof/proof.module.css`
- `public/renderer-proof/poster.svg`
- `public/renderer-proof/screen-a.svg`
- `public/renderer-proof/screen-b.svg`

Search established that the proof component, proof poses and CSS had only internal proof references, with no `/new` or other active route consumer. The three SVGs belonged exclusively to the removed proof component. Current semantic screens, PNG fallbacks, original assets, inspection script, historical evidence and license links remain.

Simplifications:

1. Statistics formatting and its extra diagnostic demand frame now run only with the explicit development callback. The local frame counter remains for prepared-first-frame readiness.
2. Per-scroll `data-progress` formatting/write is debug-only. `data-phase` remains because it selects static checkpoint typography/environment; removing it would break useful previews.
3. Entry release has one parent owner; removed redundant child `released` state and unconsumed diagnostic readiness attributes. The cover remains active until parent unmount, preserving unlock timing.
4. Removed unused controller field, unused source type/import and unused float variable.
5. Production no longer awaits debug-only search parameters. Build output changed `/new` from dynamic to static without changing approved markup/composition.
6. Extended the existing model test to assert disposal isolation: owned display geometry/material are disposed; cached source geometry/material and caller-owned replacement texture are not.
7. Updated existing float safety bounds to the already approved on-disk values; retained continuity/attenuation checks.

A proposed unsupported-canvas effect was rejected during browser validation: R3F mounts fallback content inside the canvas on successful loads too. Its effect falsely selected the poster. Removed that proposal before final validation. Canvas keeps inert fallback text; R3F configure failures are forwarded to the surrounding React error boundary, and context-loss listeners are mounted outside model Suspense. No timeout-based success path was introduced.

## Resource ownership findings

| Resource | Owner / cleanup |
|---|---|
| Loaded GLB scene and source geometry | R3F loader URL cache. Do not dispose via prepared instance. |
| Cloned prepared scene | Per Phone lifetime; original hierarchy cloned, geometry shared except display. |
| Per-mesh cloned materials / replacement display and glass | `preparePhone`; tracked/disposed together. Separate instances permit object-specific calibration. |
| Display UV geometry clone | `preparePhone`; disposed on teardown. Original geometry remains intact. |
| Generated finish texture | `preparePhone`; one 128×128 RGBA data texture, disposed with phone. |
| Loaded SVG texture images | Loader cache; not disposed as owned clones. |
| Three screen texture clones | Phone lifetime; created once per loaded set, disposed by Phone. Shared decoded image sources, independent sampling/color-space settings. |
| Caller-supplied static/video replacement texture | Caller/playback owner; `setScreen` / `setScreenSource` borrow it. Phone disposal must not destroy it. |
| PMREM environment target | Environment layout effect; detached from scene and disposed on cleanup. |
| Reflection-room geometry/materials/canvas texture and PMREM generator | Temporary construction resources, disposed immediately after PMREM generation. |
| WebGL renderer/canvas/root | R3F Canvas lifecycle. Context listener and global after-effect subscription separately unsubscribe. |

No screen texture is recreated at A/B/C thresholds. Sources and owned clones are deliberately separate so a future borrowed VideoTexture does not inherit disposal ownership. Some replaced material clones stay in the tracked disposal list; they never become an ongoing extra GPU render cost. Leave this small one-time preparation bookkeeping rather than rewriting approved material adaptation.

Memoized resources are stable across normal React rerenders. Development Strict Mode can replay cleanup/setup; observed reload/HMR remains usable. This audit does not claim a heap/GPU leak stress benchmark across thousands of mounts.

## Render loop and GSAP lifecycle

One R3F scheduler. No independent RAF, GSAP ambient ticker, React per-frame state or per-frame ScrollTrigger refresh.

Float eligibility requires entry release, intersection, visible document, valid WebGL context, no reduced motion, and positive attenuation. Below the cover the renderer still needs initialization/first-frame work; it does **not** run the ambient chain. At stand contact the child returns identity and stops invalidating. Hidden/offscreen phase freezes; resuming uses capped delta, preserving continuity. Visibility/preference/observer callbacks can request a single wake frame; these are not continuous loops.

Observer disconnect, media-query cleanup, visibility cleanup, context listener removal and first-frame after-effect unsubscription are symmetrical. Canvas unmount is owned by R3F. Context loss or fallback removes Canvas/PhoneFloat entirely.

One opening timeline, scoped `useGSAP` with `revertOnUpdate`. Explicit timeline/trigger kills and context revert are idempotent; kept for clear lifetime ownership. Recreation depends on preview, actual narrow breakpoint change, fallback, or debug mode—not scroll progress. Native CSS sticky owns pinning. ScrollTrigger reads travel after font/layout readiness and its own resize refresh. Deterministic screen thresholds, pose interpolation, easing and travel remain untouched.

## React / CSS / dependency findings

Readiness state is intentional: preferences, layout, fonts, prepared first frame and poster load have different failure/race conditions. Entry release and renderer failure are different transitions; merging all into one boolean would obscure fallback correctness. Mutable pose/progress/controller refs are intentional. Font promise guards prevent post-unmount updates. Cached poster completion check handles load-before-hydration.

No CSS was changed. Scoped `html:has([data-opening-content])` hides native scrollbars only while `/new` exists; entry `html:has(active)` locking disappears on unmount. No fake scroller. No `!important` or `will-change` residue found. Blur/gradients, stacking contexts and separate rear/foreground stand layers visibly contribute to approved output. The 760px breakpoint is shared conceptually between CSS, media query and picture selection; introducing a runtime token system would add complexity without fixing a measured bug. Stable `svh` geometry remains.

Required dependencies: Next/React/TypeScript application infrastructure; Three/R3F renderer; GSAP/ScrollTrigger choreography; `@gsap/react` lifecycle. Tailwind/PostCSS belong to existing project infrastructure, not a reason to rewrite this CSS. Vitest/ESLint remain project validation tools. No project-wide package removed merely because `/new` does not import it.

## Asset inventory

| Asset | Bytes | Role |
|---|---:|---|
| `public/assests/oryvelle-phone.glb` | 555,804 | Production model; 70 nodes, 34 GLTF meshes, 34 material definitions, no embedded images/textures. |
| `public/assests/phone-source.blend` | 2,476,380 | Editable master; not requested by runtime, intentionally retained. |
| `public/opening/portrait-a.svg` | 1,876 | Production-used replaceable screen, 600×1266. |
| `public/opening/portrait-b.svg` | 1,934 | Production-used replaceable screen, 600×1266. |
| `public/opening/landscape-c.svg` | 1,070 | Production-used landscape content authored in rotated 600×1266 texture coordinates. |
| `public/opening/poster-desktop.png` | 878,963 | Fallback-only visual, 2545×2658; eagerly fetched on successful load too for immediate failure/no-JS recovery. |
| `public/opening/poster-narrow.png` | 84,447 | Narrow fallback-only visual, 390×1688. Picture selects the appropriate source. |
| Inline Stand SVG | In component | Production-used temporary rear/front artwork; not a network asset. |
| Generated environment/finish | No transfer | Small runtime textures, scoped ownership above. |
| Outfit 300/400 | Next-generated local font assets | Approved typography; retain. |
| Gate reports/captures/inspection script | Development only | Evidence/workflow, not route imports. |

No remaining completely unused assets identified within these opening-specific directories. Source/model attribution retained in the chapter boundary. PNG fallback compression is a reasonable future optimization; eager loading is intentional, not a poster-to-WebGL handoff.

## Measured performance

| Measurement | Before | After |
|---|---:|---:|
| All app emitted JS chunks, raw | 1,792,340 B / 15 files | 1,792,250 B / 15 files |
| All app emitted JS chunks, local gzip estimate | 521,569 B | 521,540 B |
| GLB resource | 555,804 B | unchanged |
| Rear / settled draw calls | 32 | 32 |
| Rear / settled rendered triangles | 12,499 | 12,499 |
| Desktop DPR | 1.00 on this display | 1.00 |
| Emulated narrow DPR | — | 1.50 capped |
| Forced settled checkpoint counter | 2, stable | 2, stable |

These emitted totals include the whole application, not `/new` transfer. The byte difference is negligible; no meaningful bundle-performance gain claimed.

Production Brave Resource Timing after final build: 15 chunk requests, 488,621 B encoded bodies / 1,709,775 B decoded bodies. Cached request transfer values were zero; these are resource body sizes, not a cold-network benchmark. One GLB request and three SVG screen requests; no proof SVG, Blender, video, external Spline/Lenis, or extra canvas. Desktop poster still fetched 878,963 B intentionally. Canvas count 1; debug output/range count 0 even with `?debug=1&pose=back&poster=1` on production.

Hero counter increases while idle float is active. At normal-scroll stand counter held at 2408 across subsequent observation; wheel changes requested finite new frames as expected. Context loss counter stopped at 2477 and static hero appeared. Hidden-tab instrumentation recorded **2300 frames at hide and 2300 at return**, over **12.603 seconds**. One-shot browser instrumentation was removed by its listener after return; none was added to source. An independent offscreen observer test temporarily translated the canvas outside the viewport through DevTools: the counter stayed at **983** between 23.619 s and 36.162 s (**12.543 seconds**), then resumed after restoring the canvas. This transient DOM manipulation was removed; no source transform changed. Reduced motion produces no canvas. No FPS, battery, heap, Core Web Vitals or real-device mobile performance claim.

## Accessibility / fallback / regression validation

Brave tested current-source development and final production build. Desktop 2560px width/full and shorter viewport with bottom-docked DevTools; 390×844 device emulation. Inspected hero entry, idle motion, first three-quarter/full rear, changed returning front, second rear, landscape approach and settled stand. Native wheel forward/back, reversals and keyboard ArrowUp/Down, PageUp/Down, Space, Home and End were exercised. End reached the released chapter boundary and Home restored the hero. Scrollbar stayed hidden. Normal and hard refresh repeated, including after scrolling; entry restored intended beginning. Production query parameters do not force poses or fallback.

Reduced-motion emulation: quick static hero, no renderer/float. Context-loss button: renderer removed, matched poster visible. Cache-disabled hard refresh with GLB URL blocked in Network: request explicitly `(blocked:devtools)`, error boundary selected static fallback, entry released and CTA remained available. Removed blocking rule and restored cache/JavaScript/media emulation afterward. JavaScript-disabled reload: entry hidden via noscript CSS and static hero/CTA visible, no canvas initialization. Default reload restored prepared real phone.

Loading status, accessible static escape, semantic headings, skip link, CTA labels, focus styles and inert-covered content retained. Decorative product/environment layers remain aria-hidden; screen content is not the sole source of page meaning. No full assistive-technology audit or physical touch-device test claimed.

Console: no unexpected application exception in normal successful path. Intentional blocked-model/context-loss tests emit expected errors. Observed existing Three.Clock deprecation from R3F's installed scheduler; do not replace R3F's clock with a competing loop. Localhost manifest start_url/scope warnings reflect existing production-origin manifest configuration. Permissions-Policy `browsing-topics` warning and occasional extension import failures are outside opening code. Root-font preload warnings appeared during dev tooling/failed loading; no font/layout retuning performed.

## Automated checks

- ESLint: passed, no warnings after removing unused speed variable.
- TypeScript `npx tsc --noEmit`: passed.
- Complete Vitest suite: **6 files, 41 tests passed**.
- Production build: passed; `/new` statically prerendered.
- `git diff --check`: passed.
- Read-only `scripts/inspect-phone.mjs`: passed; source hierarchy/UV findings intact.
- Baseline hashes: all approved visual/asset files match except the two explicitly explained nonbehavioral edits above.

## Final classification

### Must fix before Section 02

No unresolved implementation blocker found for the opening. The false unsupported-canvas effect discovered during this gate was removed and successful WebGL, reduced-motion, model failure and context-loss paths revalidated. Further sections remain unauthorized.

### Safe to defer to final polish

Fallback PNG compression; final approved screen/video assets; final stand art; branding cleanup in a separately authorized asset task; root font/manifest launch audit; physical-device and assistive-technology QA; long-session GPU/heap profiling. Track R3F's Three.Clock warning upstream rather than framework churn in this gate.

### Intentional complexity — retain

Distinct readiness/failure conditions; first-prepared-frame barrier; matched poster/no-JS path; server development gate and explicit QA controls; separate screen-source ownership; per-object material calibration; display UV clone; separate glass; PMREM environment ownership; nested float pivot with visibility gating; monotone pose interpolation and deterministic reverse screen thresholds; scoped GSAP cleanup; CSS rear/foreground occlusion. These mechanisms protect approved behavior and are not iteration residue.
