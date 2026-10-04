# Gate 02 — loading phone handoff correction

2026-10-03 · `feat/flowty-fidelity-redesign` · http://localhost:3000/new

## Root cause established before editing

The mismatching visible phone was the hand-authored `/opening/poster.svg`, not a second GLB. Forced poster mode in Brave reproduced the user's thick rounded bezel and small flat/missing-looking camera treatment. The SVG's nested screen was inset from the chassis and its silhouette/pose were approximate CSS artwork. The prepared model has a much thinner front boundary and an actual ring/lens. Their replacement was visibly discontinuous.

Inspection of loading/preparation established:

- `useLoader(GLTFLoader)` suspends until the GLB exists; screen TextureLoader also suspends until its sources exist.
- `preparePhone()` executes synchronously in `useMemo` on a cloned GLB. The clone is the only object attached as the primitive. The source GLB is never attached and then progressively modified.
- Duplicate visibility (61/63), material clones/overrides, display 6 UV remapping and initial map, independent glass 44, border 46 separation and centering all finish before `preparePhone()` returns. No asynchronous material-preparation path was found.
- However, pose/environment were assigned in passive effects. The canvas had no visibility gate. `onReady` meant controller registration, and immediately removed the poster, rather than confirming a completed prepared draw. This was a real lifecycle weakness even though the reproduced thick-bezel image came from the poster.

No raw-GLB frame was directly observed. The poster mismatch is directly reproduced; the lifecycle weakness is established from code, not asserted as the observed bezel's cause.

## Exact correction

1. Environment initialization and initial imperative pose/screen assignment run in layout effects, before presentation.
2. Controller registration remains `onReady(controller)` for existing consumers. Opening registration applies the existing authored/current responsive pose and semantic screen, but no longer sets visual readiness.
3. Added `onPresented()`: an R3F `addAfterEffect` callback announces readiness only after this phone's local `useFrame` counter advances and R3F completes its draw, with a valid WebGL context. Another canvas's global callback cannot satisfy the local-frame condition. Subscription cleans up on unmount.
4. An absolutely positioned renderer wrapper stays `visibility:hidden` during initialization. It remains measurable, so demand rendering and viewport sizing work while hidden.
5. One React readiness update changes the wrapper to visible and the poster to hidden together. No timeout, crossfade ghost, autoplay, competing RAF or React scroll-frame state was added.
6. Replaced the unrelated SVG with transparent PNG captures of the fully prepared phone, current camera/light/materials and portraitA, at the existing hero pose. Camera view-offset capture extended below the viewport to retain the full phone without changing the original projection; the temporary export utility was removed afterward.
7. `<picture>` selects narrow artwork in CSS at the existing 760px breakpoint before client readiness. Eager/high-priority loading; intrinsic dimensions reserved. CSS anchors/size derive from the existing device span and hero translation; the 3D composition was not retuned.

Assets: desktop `2545 × 2658`, 858 KB; narrow `390 × 1688`, 82.5 KB (browser download units). Desktop capture corresponds to a 2545 × 1329 stage; narrow to 390 × 844. Transparent extended frames retain the camera's projected hero silhouette, bezel, lens and screen. Matching is close at tested viewports; raster filtering may differ from live antialiasing. This is a static hero fallback, not a poster for every possible restored mid-scroll pose.

## Browser validation

Brave native UI / DevTools, not build-only validation:

- Existing forced SVG poster reproduced the bug before modification.
- New forced narrow poster compared with prepared narrow hero: matching camera ring, thin bezel, silhouette, screen and orientation.
- Two repeated cache-disabled hard refreshes at 390 × 844: poster during loading → prepared frame. Network confirmed GLB 200 response instead of cache reuse. No different-phone flash observed.
- Cache-disabled hard refresh at short desktop (approximately 2545 × 777): captured loading and prepared states matched visually.
- Further full-height desktop hard refresh at approximately 2545 × 1329: no thick-bezel/camera switch observed.
- Normal desktop refresh after actual simulated context loss restored the renderer.
- `WEBGL_lose_context` via existing development control: matched poster retained, long chapter collapsed. Reload recovered.
- Actual Brave `prefers-reduced-motion: reduce` emulation: matched static poster, no cinematic renderer needed; restored browser emulation afterward.
- Landscape checkpoint → native backward scrolling into portraitB; full-back checkpoint → backward scrolling restored the initial portraitA hero. Persistent renderer and screen contract remain intact. No choreography data, GSAP keyframes, easing, typography or stand artwork changed.
- Idle instrumentation remained at 2 frames after loading, with 30 draws/12,419 visible triangles in cropped desktop hero and 32 draws/12,499 in narrow/full scenes. Scroll/resize/tab visibility requests additional demand frames. No continuous animation loop introduced.
- Browser cache disabling was restored to off; device/reduced-motion emulation was cleared; normal `/new` left open with DevTools closed.

Artificial bandwidth throttling was not used: disabled-cache loading already exposed the poster/prepared handoff. Checks are visual/manual rather than a frame-by-frame filmstrip or physical-device performance certification.

## Verification / preservation

Lint, TypeScript, 38 tests in 5 files and production build pass. Existing mesh/display tests still pass. No source GLB/Blender edits, dependencies, later sections or changes to authored choreography. Original dirty working-tree work remains preserved. The old unused opening SVG was removed; renderer-proof's separate legacy poster remains outside this route.

Remaining pre-existing console warnings are documented in the Gate 02 report; no new application error was observed during this correction. Context loss was intentional QA.

Stop: loading fix only. Review http://localhost:3000/new before further work.
