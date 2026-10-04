# Renderer proof — implementation gate 01

Date: 2026-10-03. Review URL: **http://localhost:3000/new** (existing local Next.js development server).

## Gate conclusion

**The supplied GLB + Three.js/R3F + GSAP architecture supports the required physical behavior.** Live Brave inspection established the complete front/edge/back/front turn, a different returning display, another rear-facing turn, landscape arrival, and foreground HTML stand occlusion on one persistent model/canvas. Backward native scroll reconstructs the same poses and screen selection.

This is a functional renderer proof, **not approval of final visual fidelity**. Materials, lighting, model silhouette details, approved Oryvelle screens, environment art, and responsive composition still need production review. Implementation stops here. No later sections or polished opening choreography were built.

## Git and scope

- Initial branch: `main`.
- Initial porcelain status: `?? docs/` and `?? public/assests/`; no tracked modifications.
- Created/switched to `feat/flowty-fidelity-redesign` before implementation. Before/after branch-switch porcelain snapshots matched byte for byte.
- Existing documents and original assets retained. No reset, clean, stash, rename, or destructive checkout. Original asset SHA-256 values match their pre-implementation values.
- Current gate adds only `/new`, renderer/chapter files, inspection script, asset-contract test, temporary test SVGs, and this report; updates dependency manifest/lockfile.
- Existing production landing, legal routes, metadata infrastructure, and existing dev server retained. No nested app, compatibility wrapper, old landing imports, orb, or constellation system introduced into `/new`.
- Changes are uncommitted for review.

## Asset evidence

| Asset | Size | Role |
|---|---:|---|
| `public/assests/oryvelle-phone.glb` | 555,804 bytes / 542.8 KiB | Runtime candidate used directly |
| `public/assests/phone-source.blend` | 2,476,380 bytes / 2.36 MiB | Untouched editable master/fallback |

SHA-256:

```text
GLB   5a9f29ab225394e92cbb1604360edb2ad29c1df4ce2db79e6ae35310dcb1ed34
BLEND 5221a06bfa719d4c4f3fc69c44791ff2da204e0b40808ca3643abb2a3a62a566
```

Direct GLB JSON/accessor inspection plus Three.js GLTFLoader world transforms:

- glTF 2.0, generator `Sketchfab-17.22.0`.
- 70 nodes, 34 meshes, 34 materials, 12,781 triangles.
- No embedded/external images, textures, animation clips, cameras, environment maps, or material extensions. No supplied video or image sequence.
- Material names are generic `Material.001`–`Material.035` with gaps; most exported as opaque, double-sided PBR materials. Raw mesh names are also generic, not a production semantic contract.
- Hierarchy: `Sketchfab_Scene` (loader scene) → `Sketchfab_model` → `root` → `GLTF_SceneRootNode` → Plane/Cylinder/Text wrappers → mesh nodes `Object_N`.
- Global dimensions: **X 2.362848 × Y 4.961181 × Z 0.361228**, arbitrary source units. Main body depth approximately 0.2457; protruding cameras/front detail increase total depth.
- Bounds: min `[-1.188382, -2.493204, -0.186395]`, max `[1.174466, 2.467978, 0.174833]`.
- Source world Y is the long axis, X width, front faces **−Z**, rear faces +Z. Nested export transforms mean child local axes differ. Export origin is near center; bounds center `[-0.006958, -0.012613, -0.005781]`.
- Renderer recenters the cloned scene by its bounds and adds a Y half-turn inside the animated pivot to make initial front face camera +Z. No arbitrary geometry rebuild.

### Relevant surfaces and physical geometry

| Surface | Node / material | Direct evidence and treatment |
|---|---|---|
| Visible display | `Object_6`, `Plane001_5`, `Material.021` | Separate filled rounded front surface, 618 vertices / 320 triangles. Independent geometry/material accepts our texture. |
| Matching front surface used as glass | `Object_44`, `Plane002_25`, `Material.023` | Separate filled rounded surface, 1,446 vertices / 736 triangles. Same boundary and plane as display in export; opaque in original GLB. Runtime transparent physical glass material, not a claim that exported glass was already correct. |
| Front rim | `Object_46`, `Plane005_26`, `Material.025` | Border only, 124 triangles. Not suitable as a display surface. Preserved. |
| Chassis | `Object_48` / `Object_49`, `Plane006_27`, `Material.026` / `.024` | Genuine half-body geometry with thickness and rounded/beveled edge silhouette. Dark runtime material calibration. |
| Back panel | `Object_4`, `Plane_4`, `Material.001` | Actual planar rear mesh bounded by physical body; not a back screenshot. Dark runtime calibration. |
| Rear camera island | `Object_8`, `Material.002` | Genuine raised geometry. |
| Rear lenses/rings/flash | `Object_10` through `Object_42` | Separate cylindrical geometry; depth, nested rings, and protruding silhouette visible in browser. Blue/silver supplied material response remains provisional. |
| Small edge/port details | `Object_51`, `53`, `55`, `57`, `59` | Separate real geometry. Generic names do not reliably identify every physical detail; export includes top/bottom details. Fine button realism requires closer production review. |
| Front camera | `Object_65` / `67`, `Material.034` / `.035` | Genuine geometry retained above display. |
| Branding | `Object_69`, `Text001_37`, `Material.022` | Flat triangulated **SAMSUNG text geometry**, visibly on back. Not a texture. Retained unchanged for this proof. |

`Object_61` duplicates `Object_22`; `Object_63` duplicates `Object_20`: matching world transforms, positions, indices, and PBR values. Only these two duplicate copies are hidden on our cloned instance. Runtime: **32 draws / 12,499 triangles** observed via renderer counters. Source remains untouched.

### UV / display contract

The export contains UV coordinates, but left and right halves share folded/mirrored coordinates; V occupies approximately 0–0.5. These are **not directly usable for a complete screenshot**.

A clean remedy is possible without Blender: clone the existing `Object_6` geometry and project its actual world X/Y positions into one full 0–1 display UV rectangle. The original cached GLTF geometry/UVs are unchanged. No added screen plane, CSS overlay, or floating HTML rectangle is used.

```text
u = (screenBounds.max.x − vertexWorld.x) / screenBounds.width
v = (screenBounds.max.y − vertexWorld.y) / screenBounds.height
```

This accounts for the initial Y half-turn. `flipY=false`, `SRGBColorSpace`, linear magnification, mipmapped linear minification, anisotropy 4. `MeshBasicMaterial`, `toneMapped=false`, `FrontSide` keeps content legible independently of lighting.

Display bounds approximately 2.3248 × 4.9046: aspect 0.474, matching test images 600 × 1266 (~0.474). No intentional crop in proof. Actual mesh boundary supplies rounded corners. TOP LEFT / BOTTOM markers were visually inspected at front, angled, returning, and landscape poses: no inversion, mirroring, visible boundary leak, or screen detachment observed.

The second existing front mesh is retained as glass: transparent `MeshPhysicalMaterial`, opacity 0.035, roughness 0.16, clearcoat 1, clearcoat roughness 0.08, `depthWrite=false`, `FrontSide`. Lifted **0.003 source units along its existing local normal** (~0.06% phone height) to resolve the exported coplanar surfaces. This is an adjustment to the exact matching supplied glass surface, not approximate overlay geometry. No visible z-fighting observed in tested poses. This is a simple reflective layer, not a production calibrated refractive-glass simulation.

`preparePhone().setScreen(texture: THREE.Texture)` is the material boundary; it can accept a later `VideoTexture`. Screen selection is separate from pose. Video playback, decoding, visibility policy, and continuous invalidation are deliberately not implemented here.

### Source comparison / Blender decision

**Blender modification is not required to unblock this gate.** The GLB contains enough separate geometry for a clean display and glass adaptation.

The `.blend` header identifies Blender 3.06; it was not modified or re-exported. Blender was not used to inspect its full node graphs. Therefore, exactly which parameters conversion lost relative to the `.blend` remains **unknown**. The GLB itself demonstrably contains no textures/transmission extension and exports both front surfaces as opaque; do not infer that the source necessarily had better glass values.

Optional production asset cleanup, if approved later: semantic mesh/material names, proper native non-overlapping display UVs, deliberate physical glass separation/material export, removing exact duplicate lens/ring copies, evaluating bevel/normal quality, and an explicit branding decision. None is silently performed on the source master.

Attribution from embedded asset metadata: **achrixx**, “samsung s 26 ultra 3d model”, **CC BY 4.0**. Source: https://sketchfab.com/3d-models/samsung-s-26-ultra-3d-model-3356099ca99d488d95a6a253d05577f7 . Attribution is included in the proof UI. Preserve attribution for adaptations.

## Renderer architecture

Installed responsibilities, current resolved versions:

| Dependency | Version | Responsibility |
|---|---|---|
| `three` | 0.186.1 | GLTFLoader, geometry/materials/textures, WebGL renderer, generated environment |
| `@react-three/fiber` | 9.8.1 | Canvas lifecycle, asset loading/Suspense, demand rendering, camera/resize integration |
| `gsap` | 3.15.0 | Imperative normalized pose interpolation |
| ScrollTrigger | bundled with GSAP | Native document scroll → reversible timeline progress |
| `@gsap/react` | 2.1.2 | Scoped setup/revert/cleanup |
| `@types/three` | 0.186.0 | TypeScript development types only |

No Drei, Spline, Lenis, Motion, postprocessing, custom shader framework, global store, or additional animation loop added. Existing framework and production infrastructure remain.

```text
app/new/page.tsx (server metadata, noindex)
└─ RendererProof (HTML atmosphere, sticky stage, GSAP chapter owner)
   ├─ rear HTML stand layer [z20]
   ├─ persistent PhoneCanvas [z30]
   │  └─ animated pivot → normalized GLB clone
   │     ├─ physical chassis/back/cameras
   │     ├─ existing display mesh → setScreen(Texture)
   │     └─ existing matching glass surface
   ├─ foreground HTML handles [z50]
   └─ proof controls/status [z60]
```

Files:

- `components/landing/device/phone-model.ts`: asset-specific adaptation and generic texture boundary.
- `components/landing/device/PhoneCanvas.tsx`: renderer/camera/environment/lighting, lifecycle, imperative controller.
- `components/landing/chapters/renderer-proof/proof-poses.ts`: authored normalized pose targets and separate screen selection.
- `RendererProof.tsx` / `proof.module.css`: chapter ownership, native-scroll seeking controls, isolated CSS.
- `scripts/inspect-phone.mjs`: reproducible loaded hierarchy/bounds/UV evidence (`node scripts/inspect-phone.mjs`).
- `phone-model.test.ts`: real GLB contract regression: independent materials, UV range, screen reassignment, cached-source preservation, duplicate visibility isolation.

### Camera and lighting

Perspective camera `[0,0,10]`, FOV 32°, near 0.1, far 50. Model fitted from available viewport width/height; orthographic flattening is not used.

Generated Three.js `RoomEnvironment` → PMREM, blur parameter 0.04, environment intensity 0.4; no external HDR download. Ambient 0.15; controlled directional key 1.4, rim 1.8, fill 0.5, neutral/lavender tones. Exposure 1.05. Simple PBR chassis/back, physical glass, no shadow-map or postprocessing cost.

This proves lighting continuity and reads the black/charcoal body, physical depth, rear and camera rings through the turn. Silver highlights and blue lens details are still too conspicuous for the final premium presentation. Runtime material values are evaluative, not final art direction.

### Pose ownership and native scroll

One CSS sticky 100svh stage inside a 700svh chapter (approximately **six viewport heights of scroll travel**). No JS pin and no scroll smoother. ScrollTrigger end is measured chapter height minus stage height, recalculated on refresh. A single **chapter-local** timeline, linear `ease:none`, `scrub:true`, durations proportional to normalized progress. No whole-site master timeline is introduced.

GSAP mutates a small ref-held pose object `{yaw,pitch,roll,scale,y}`. Timeline updates call the imperative R3F controller to transform the actual 3D pivot (`YXZ` Euler order), update display selection, and request one render. React state is used only for loading/fallback/media-query transitions, never per-frame progress. R3F owns frame scheduling; no competing requestAnimationFrame scheduler.

| Progress | Representative pose |
|---:|---|
| 0% | Front A |
| 10% | Three-quarter |
| 20% | Near edge |
| 31% | Full back; hidden A→B threshold |
| 43% | Returning edge |
| 52% | Returning three-quarter |
| 61% | Front B |
| 71% | Second turn / near edge with roll |
| 80% | Second full back, diagonal |
| 90% | Landscape approach |
| 100% | Stable landscape B |

Yaw progresses 0→2π→4π; the second turn includes 3π/full back before settling with roll −π/2. Values are our own authored proof values, not Flowty coordinates. No replacement model or CSS physical turn. The model/canvas persists throughout scroll. Diagnostic pose buttons/slider seek the actual native scroll position; they do not bypass choreography.

Screen A when progress <0.31, B otherwise. Forward and reverse both swap at the full back where the display is hidden. No visible texture pop observed. The test portrait texture rotates with the phone into landscape, so its text becomes sideways; a deliberate landscape UI state is a future content requirement.

### Hybrid environment proof

Temporary CSS ribbed stand/back/base below the canvas, metal handle shapes above the canvas. Opacity is scrubbed over 92–100%; foreground handles visibly cross over the bottom of the landscape phone/display. This establishes DOM/WebGL occlusion ownership. It does **not** establish final stand perspective, contact shadow realism, desk photography, or final environment artwork.

## Loading, failure, and reduced-motion contract

Server-rendered, dimensioned SVG poster is present before the dynamically imported canvas/model loads; observed during initial and uncached reload. Poster remains until ready, so loading does not create an empty product hole.

- Primary static mode preview was tested with **Show static fallback**, then **Enable 3D**; canvas unmounts/rebuilds and display renders correctly afterward.
- Error boundary / context-loss path retains the poster.
- Canvas WebGL-unavailable fallback also retains the underlying poster.
- `prefers-reduced-motion` selects static mode and a normal-height chapter; shared contract permits future mobile simplification.
- Actual hardware WebGL failure/context loss and OS reduced-motion setting were **not fault-injected/tested** in this gate. These code paths are established, not claimed fully validated.
- Poster is an explicitly labelled temporary vector, not a matched physical-model render. A final rendered poster is required.

## Browser validation — evidence tier: live Brave behavior

| Required behavior | Status | Observed result |
|---|---|---|
| Initial front | **Working** | Test A correctly oriented and clipped to physical screen |
| Three-quarter | **Working** | Actual thickness and foreshortening; screen remains attached |
| Near edge | **Working** | Thin physical silhouette and camera protrusions visible |
| Full back | **Working** | Entire rear, camera geometry, Samsung text visible |
| Returning edge/front | **Working** | Same model returns, correct Test B orientation |
| Screen A → B | **Working** | Swap occurs while hidden; reverse reconstructs A |
| Second turn | **Working** | Includes another actual full-back phase |
| Landscape | **Working** | Persistent object reaches stable landscape pose |
| Stand foreground occlusion | **Working** | HTML handles cross in front of landscape phone |
| Backward scrub | **Working** | Small backward/forward movements reconstruct orientation and stand fade |
| Rapid direction changes | **Working** | Forward/back page scroll changes preserve model and correct state |
| Loading/poster fallback | **Working (primary path)** | Poster during load, explicit static mode, enable/reload recovery |
| Resize/DPR | **Working for renderer** | Full desktop, docked shorter viewport, 630×680 and 390×844 emulation; DPR observed 1.0 desktop / capped 1.5 emulation |
| Final lighting/material fidelity | **Partially working** | Physical surfaces legible; finish/reflections need refinement |
| Approved Oryvelle display content | **Pending assets** | No approved screenshots reliably identified; labelled tests only |

Slow native forward/back movement, key-pose inspection, rapid reversals, reload, uncached model loading, and fallback toggling were performed. No separate canvas/model was remounted between scroll poses. Browser emulation is not physical mobile GPU validation.

Responsive diagnostic controls can overlap the phone at intermediate short/narrow viewport sizes (observed 630×680). At 390×844 the model fits with wrapped controls; final mobile composition and stand alignment are not approved by this gate.

### Browser console findings

No renderer exception, broken texture request, or animation failure observed. **Not warning-free:**

1. `THREE.Clock` deprecated in favor of `THREE.Timer` — emitted by the current R3F/Three combination (our renderer does not instantiate Clock). Resolve upstream/version compatibility before production; do not silence or monkey-patch library internals merely to hide it.
2. Existing manifest `start_url`/`scope` warnings on localhost.
3. Browser warned that poster and inherited font preloads were not used within several seconds; poster is intentionally brief/hidden once ready. Revisit final loading/preload policy.
4. DevTools Issues reported CSP blocking `eval`. Existing CSP was retained; rendering/scroll remained functional. The precise blocked caller was not established. Do not weaken CSP to suppress this issue.

## Performance sanity check

- GLB on disk/resource: **555,804 bytes**. Brave Network uncached local response: **200**, **135,391 bytes transferred** including response overhead (compressed local delivery), approximately 48ms for that request. Cached reload: 304 / ~0.8kB transfer. These are localhost observations, not CDN/mobile network benchmarks.
- Source has zero texture assets. Two test SVG images: 712 bytes each, decoded 600×1266. Approximately 2.9MiB RGBA per image; about 3.9MiB each with full mip chains, ~7.7MiB combined theoretical screen texture allocation. This is an estimate, not a measured total GPU memory figure; PMREM/framebuffer/cache also cost memory.
- Actual renderer counters: 32 draws, 12,499 triangles. No obvious excessive geometry for this proof. Draw/material count could be optimized only after profiling, not by blind merging that destroys independent screens/glass.
- `frameloop="demand"`; invalidates on scroll/resize/model readiness/environment/visibility restoration. Frame counter remained unchanged during idle inspection. No ambient auto-animation.
- Visibility listener reapplies the latest pose when visible; hidden document updates do not request frames. No separate offscreen continuous simulation exists. Offscreen canvas culling and physical-device hidden-tab testing remain production work.
- DPR `[1,1.5]` capped; browser emulation confirmed cap. Antialiasing enabled. No render targets for postprocessing; only one generated PMREM environment.
- One active canvas and one persistent GLB clone. Owned cloned materials, display geometry, screen textures and PMREM target are disposed on unmount; R3F owns renderer/context lifecycle. `useLoader` caches original GLTF/texture CPU objects intentionally; broader route-cache memory policy is not yet benchmarked.
- No claim of sustained 60fps or Core Web Vitals pass: no complete frame-time/memory/network performance benchmark was run. Visual scrolling was functional; production FPS and mobile thermal/GPU validation remain required.

## Checks — separate from browser evidence

- `npm run lint`: passed.
- `npx tsc --noEmit`: passed.
- `npm test -- --run`: 3 test files / 35 tests passed, including real GLB contract regression.
- `npm run build`: passed; `/new` prerendered server shell with client renderer.
- Original asset SHA-256 values checked after implementation and unchanged.

## Assets and fidelity gaps before the next gate

1. Approved/current Oryvelle portrait screen A/B and intended landscape content, plus any video clips; tests are not production UI.
2. Final environment rear image/desk/stand and foreground cutout(s), composed against the chosen phone camera and responsive variants.
3. Matched static model poster and fallback layout/artwork.
4. Refined dark-device lighting, reflection placement, camera-ring/lens coloration, bevel/normal review, front-glass strength and rim response. Some bevel/rim faceting and bright edges remain visible at large size.
5. Explicit product/brand decision: supplied geometry visibly says Samsung; do not silently rewrite proprietary branding or the source file.
6. Full opening spatial choreography, canvas movement, typography integration, background lighting journey and scroll pacing are deliberately absent. The proof's six-viewport travel is evaluative.
7. Production responsive composition, short-height control separation, landscape stand contact/occlusion alignment, physical mobile GPU validation.
8. Compatibility warning and CSP/preload caller investigation before production; no broad legacy infrastructure cleanup in this isolated gate.

There is **no demonstrated asset blocker requiring Blender edits to achieve the independent display/full turn**. Source material equivalence remains unknown. Optional native-asset cleanup should be separately scoped and approved after this review.

## Documentation and researched APIs

Read before implementation: `cinematic-scroll-blueprint.md`, `cinematic-reference-fidelity.md`, `cinematic-repository-audit.md`, `flowty-phone-renderer-investigation.md`. Existing renderer investigation governs this gate. Earlier frame-sequence default is not used.

Current documentation consulted through Context7 (resolve then query): `/pmndrs/react-three-fiber`, `/mrdoob/three.js`, `/websites/gsap_v3`. Relevant official references:

- R3F demand rendering / imperative invalidation: https://r3f.docs.pmnd.rs/advanced/scaling-performance
- R3F Canvas lifecycle/configuration: https://r3f.docs.pmnd.rs/api/canvas
- Three.js GLTFLoader texture orientation/color handling: https://threejs.org/docs/#GLTFLoader
- Three.js RoomEnvironment / PMREM: https://threejs.org/docs/#RoomEnvironment and https://threejs.org/docs/#PMREMGenerator
- GSAP ScrollTrigger scrub/refresh: https://gsap.com/docs/v3/Plugins/ScrollTrigger/
- GSAP React cleanup: https://gsap.com/resources/React/

## Complete delivered mesh/material inventory

Raw GLB names below; Three.js GLTFLoader sanitizes punctuation in wrapper names (e.g. `Plane.001_5` becomes `Plane001_5`). Each listed mesh has one primitive/material.

| Node | Parent | GLB mesh name | Material | Triangles |
|---|---|---|---|---:|
| `Object_4` | `Plane_4` | `Object_0` | `Material.001` | 1,730 |
| `Object_6` | `Plane.001_5` | `Object_1` | `Material.021` | 320 |
| `Object_8` | `Plane.003_6` | `Object_2` | `Material.002` | 1,230 |
| `Object_10` | `Cylinder_7` | `Object_3` | `Material.003` | 256 |
| `Object_12` | `Cylinder.001_8` | `Object_4` | `Material.004` | 256 |
| `Object_14` | `Cylinder.002_9` | `Object_5` | `Material.005` | 256 |
| `Object_16` | `Cylinder.004_10` | `Object_6` | `Material.006` | 256 |
| `Object_18` | `Cylinder.003_11` | `Object_7` | `Material.007` | 256 |
| `Object_20` | `Cylinder.005_12` | `Object_8` | `Material.009` | 158 |
| `Object_22` | `Cylinder.006_13` | `Object_9` | `Material.010` | 124 |
| `Object_24` | `Cylinder.007_14` | `Object_10` | `Material.008` | 124 |
| `Object_26` | `Cylinder.008_15` | `Object_11` | `Material.011` | 158 |
| `Object_28` | `Cylinder.009_16` | `Object_12` | `Material.012` | 158 |
| `Object_30` | `Cylinder.010_17` | `Object_13` | `Material.013` | 124 |
| `Object_32` | `Cylinder.011_18` | `Object_14` | `Material.014` | 124 |
| `Object_34` | `Cylinder.012_19` | `Object_15` | `Material.015` | 158 |
| `Object_36` | `Cylinder.013_20` | `Object_16` | `Material.016` | 124 |
| `Object_38` | `Cylinder.014_21` | `Object_17` | `Material.017` | 124 |
| `Object_40` | `Cylinder.015_22` | `Object_18` | `Material.018` | 124 |
| `Object_42` | `Cylinder.016_23` | `Object_19` | `Material.019` | 158 |
| `Object_44` | `Plane.002_25` | `Object_20` | `Material.023` | 736 |
| `Object_46` | `Plane.005_26` | `Object_21` | `Material.025` | 124 |
| `Object_48` | `Plane.006_27` | `Object_22` | `Material.026` | 2,348 |
| `Object_49` | `Plane.006_27` | `Object_23` | `Material.024` | 1,975 |
| `Object_51` | `Plane.007_28` | `Object_24` | `Material.027` | 40 |
| `Object_53` | `Cylinder.017_29` | `Object_25` | `Material.028` | 124 |
| `Object_55` | `Cylinder.018_30` | `Object_26` | `Material.029` | 124 |
| `Object_57` | `Plane.004_31` | `Object_27` | `Material.030` | 40 |
| `Object_59` | `Plane.008_32` | `Object_28` | `Material.031` | 40 |
| `Object_61` | `Cylinder.019_33` | `Object_29` | `Material.032` | 124 |
| `Object_63` | `Cylinder.020_34` | `Object_30` | `Material.033` | 158 |
| `Object_65` | `Cylinder.021_35` | `Object_31` | `Material.034` | 158 |
| `Object_67` | `Cylinder.022_36` | `Object_32` | `Material.035` | 124 |
| `Object_69` | `Text.001_37` | `Object_33` | `Material.022` | 448 |

**Stop gate:** Review the live `/new` renderer before authorizing the complete opening or any subsequent website section.
