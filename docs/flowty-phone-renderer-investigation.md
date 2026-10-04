# Flowty opening phone — public implementation investigation

Inspected **3 October 2026** in Brave, using Elements/Computed, Network, Console messages, and search within publicly delivered JavaScript in Sources. Reference: [Flowty](https://flowty.co/). This report supplements and updates the [implementation blueprint](./cinematic-scroll-blueprint.md) and [reference fidelity plan](./cinematic-reference-fidelity.md). No website implementation, dependency installation, or proprietary asset/code reuse was performed.

## Renderer conclusion

**Reference:** the opening phone is a live WebGL/Spline scene, with actual 3D object transforms driven by GSAP/ScrollTrigger. CSS moves/scales its canvas; separate HTML image layers provide the stand/environment composition. It is not simply a flat phone image rotated with CSS, and the investigation did not identify a numbered frame sequence responsible for the turn.

**Our recommendation:** one small **Three.js + React Three Fiber canvas for the opening chapter**, one original/licensed device model, independently controlled screen material, and a GSAP chapter timeline. Keep typography, lighting atmosphere, navigation, stand cutouts and other content in HTML/CSS. Use a matching static poster for loading, reduced motion, unsupported WebGL and intentional mobile fallback. Do not install Spline, Lenis, Drei, postprocessing or shader packages merely because the reference uses 3D.

This supersedes the earlier **pre-rendered sequence as opening default** recommendation. The reason is our combined fidelity requirement: full front/edge/back geometry, another turn toward landscape, independently changing/playing screens, responsive anchors and evolving lighting while retaining one product. A sequence remains viable for a genuinely fixed baked shot, but baking these independent dimensions creates more asset variants and synchronization work. A compact model addresses them directly. The later representative render proof must still establish quality and performance; this investigation is not that proof.

## Evidence ledger

| Question | Directly observed evidence | Conclusion / limit |
|---|---|---|
| Phone DOM | `phone-spline-scene` contains `canvas.phone-spline-scene__canvas`, inside a `pin-spacer-PhonePin` wrapper | Canvas renderer is the opening product; no HTML screen element was visible inside this hierarchy |
| Public scene resource | Network recorded `/spline/phone.splinecode`, fetch, 200, initiated by `1jm00iTN.js:8175` | Spline scene file delivered; no scene data was extracted or reused |
| Rendering runtime | Console names `@splinetool/runtime`; runtime bundle contains `THREE.WebGLRenderer` identifiers; actual WebGL warnings include texture-storage/attachment operations | WebGL/3D delivery confirmed. Exact context version was not probed. Presence of Three internals does not establish a separate direct app dependency |
| Initialization | Opening component loads the scene, appends a canvas, guards against reinitializing an existing app, and looks up named scene objects | Strong evidence for one persistent opening scene; DOM identity was not tested with JavaScript reference equality |
| Geometry animation | Opening bundle targets 3D group `rotation` and `position` and a named spotlight intensity | Actual object transform/light choreography, beyond CSS plane rotation |
| Scroll ownership | GSAP timeline `PhonePin` has a ScrollTrigger, scrub enabled, pin enabled, no pin spacing, hero start and a later `flow` section end trigger | Long chapter pin is directly confirmed; exact total scroll distance remains viewport/layout dependent |
| Screen changes | Progress thresholds select different named screen objects by scale; code obtains a screen material's video image, resets it and calls play | Screen content is independently managed within the 3D scene; a video texture is explicitly present |
| Stand | Timeline targets background/handle image selectors; Network later loads `stand.png` and `stand-handles.png` | Hybrid 3D phone + image environment, not necessarily a complete 3D desk |
| Smooth scroll | DOM contains Lenis classes; delivered page-wrapper code owns Lenis lifecycle and GSAP ticker integration | Lenis is confirmed in the reference, but remains optional/omitted in our baseline |
| Typography | DOM/styles identify `Outfit`, including a font-face entry with weight 300 | Typeface identified; choose a separately licensed font source, never reuse downloaded reference font assets |

## What the delivered integration reveals

Public bundle names/URLs below identify the inspected evidence, not stable API contracts. Deployment hashes can change.

- [Opening integration bundle](https://flowty.co/_nuxt/BXEizuzJ.js): `PhoneSplineScene`, `PhonePin`, named-object lookup, screen selection, pose/light timelines and video-image playback.
- [Runtime bundle](https://flowty.co/_nuxt/1jm00iTN.js): Three/WebGL renderer identifiers inside the delivered Spline rendering runtime.
- [Page-wrapper bundle](https://flowty.co/_nuxt/BbtqGNag.js): scene preload, Lenis configuration and destruction/ticker lifecycle.
- [Animation bundle](https://flowty.co/_nuxt/CCHyEgAG.js): GSAP/ScrollTrigger implementation identifiers; actual use is independently established by the opening integration.

The opening integration looks up `Idle`, `iPhoneWrapper`, `iPhoneGroup`, `iPhoneContainer`, `Spot Light` and `Screen` through `Screen6`. This establishes separate transform and screen controls. It does **not** establish the full model hierarchy, which meshes share materials, or the private authoring project.

The scroll timeline changes object yaw through substantial multi-turn values and later adds a landscape roll. It also translates the group while translating/scaling the canvas itself. CSS and 3D transforms therefore operate at different levels: the former positions the rendered shot in the page, the latter changes the actual device view. Ambient idle position/rotation uses repeating/yoyo time-based tweens, separate from the scrubbed chapter.

The integration chooses screen 1, 2 or 3 using progress boundaries around 0.26 and 0.7, scaling inactive screen objects to zero. One screen's material image is checked as an HTML video and playback begins. These are reference implementation facts, not parameter values to copy. Our version should expose a named screen-state contract and keep arbitrary authored scene internals outside the scroll controller.

## Recorded scroll samples

During slow advancement, the selected phone canvas remained in the same opening DOM hierarchy. Samples of its computed transform were:

| Visible pose | Computed CSS transform |
|---|---|
| Full back | `matrix(0.977, 0, 0, 0.977, 0, -100.023)` |
| Returning edge/front | `matrix(0.9603, 0, 0, 0.9603, 0, -172.665)` |
| Returning readable front | `matrix(0.9509, 0, 0, 0.9509, 0, -213.575)` |
| Later turn toward environment | `matrix(0.9258, 0, 0, 0.9258, 0, -217.28)` |
| Landscape phone over stand | `matrix(0.9028, 0, 0, 0.9028, 0, -217.28)` |

These numbers belong to the docked DevTools viewport and are not normalized animation keyframes. Their value is diagnostic: the phone visibly turns while the canvas CSS matrix contains only uniform scale and vertical translation. Delivered object-rotation code explains the yaw/roll inside the renderer. The environment handoff includes another back-facing phase before the landscape front settles; do not reduce it to a straight translation of a front-facing image.

The returning front shows the blocker/settings screen rather than simply restoring the hero's initial content. Later landscape composition shows the timer screen. Screen-state selection and video playback explain how the same scene can present different UI without remounting another phone. Exact mapping of each network video to each named screen is not proven.

## Network findings and limits

Recording was active during reload and progression through the opening into the stand. Cache stayed enabled. This is a mixed/warm-cache functional inspection, **not** a cold-load performance benchmark.

| Resource | Recorded evidence | Interpretation |
|---|---|---|
| `/spline/phone.splinecode` | One matching scene fetch; 1,232,354 bytes transferred; resource body 1,600,821 bytes | Approximately 1.23 MB transfer / 1.60 MB body in this recording, not GPU memory or complete renderer cost |
| `/video/timer.mp4` | Multiple HTTP 206 range requests | Public video media loaded; likely timer screen content, but exact screen association remains inference |
| `/video/watch.mp4` | Multiple HTTP 206 range requests | Another video loaded; cannot attribute every range to opening from URL alone |
| `/img/stand.png` | AVIF delivery via Cloudflare transform, 840×740 URL parameters; ~35.8 kB transfer | Rear stand image resource arrived as opening progressed |
| `/img/stand-handles.png` | AVIF delivery, 840×740 URL parameters; ~7.4 kB transfer | Separate image consistent with foreground occlusion handles |
| `/img/hand-watch.png` | AVIF delivery, 1823×1084 URL parameters; ~257 kB transfer | Later media asset also loaded; adjacent loading is not proof it draws the opening phone |
| `needs-mobile`, `needs-tablet`, `flow-mobile`, `flow-tablet` PNGs | Initial-load image requests, some disk cache | Alternate assets exist; actual mobile rendering mode was not verified in this investigation |

No `.glb` or `.gltf` filename requests appeared in the recorded session under explicit filters. No numbered phone frame series was identified. These are bounded negative findings: geometry/textures can be packaged inside `.splinecode`, embedded, cached or named differently. Do not conclude there is no geometry because there is no standalone GLB request. Likewise do not invent a frame count, environment-map format or texture inventory.

Console contained hydration, runtime-version and WebGL warnings. They are diagnostic observations, not proof that the visible phone failed. We did not bypass the DevTools paste guard to run a context probe; the UI, loaded integration and runtime evidence already establish the relevant renderer class.

## Renderer options for our implementation

| Option | Fit for the required opening | Decision |
|---|---|---|
| Single DOM image + CSS perspective | Good poster/mild tilt; lacks true back, thickness, lens geometry and view-dependent lighting | Use for fallback and modest appearances, not full-turn baseline |
| Layered front/back/edges in DOM | Can approximate thickness and switch live screen; realistic bevels/camera details/reflections become increasingly handcrafted | Keep as a stylized alternative only; insufficient default for strict premium full-turn fidelity |
| Canvas 2D frame sequence | Excellent fixed baked geometry/light, deterministic frame index; independent live screen needs matched projection, variants affect memory and authoring | Retain documented alternative; no longer opening default |
| Scroll-seeked video of whole phone | Compressed baked shot; reverse/random seeking depends on encoding, decoding and browser scheduling | Reject as baseline reversible phone mechanism; video remains appropriate inside screen/ambient media |
| Spline runtime | Demonstrably delivers reference; useful authoring workflow if team chooses it, but adds an editor/runtime contract and scene-internal coupling | Do not add by default; discovering reference's tool does not justify ours |
| Direct Three.js | One imperative renderer can be lean; requires explicit resize, loader, scene and resource lifecycle ownership | Valid substitute if implementation team prefers it; never install a second canvas engine alongside R3F |
| Three.js + R3F | Real geometry, independently mapped screen, flexible pose/light, React-owned canvas lifecycle | Recommended opening engine; avoid Drei/postprocessing unless an identified task needs them |

R3F adds a React scene/lifecycle adapter, not another animation choreographer. GSAP owns progress/poses; R3F renders them. This responsibility split avoids two competing timelines.

## Opening contract for the build agent

1. Keep one canvas/product through hero, distraction rotations and landscape settling. Copy and controls remain semantic HTML.
2. Use a commissioned/licensed GLB with actual chassis thickness, rear camera details, front glass, screen mesh and documented UVs. Confirm screen aspect and portrait-to-landscape asset composition.
3. Author named poses against normalized chapter progress. GSAP updates an imperative pose object and object refs; do not call React setState on every scroll tick.
4. Separate pose, ambient motion and screen playback state. Scroll is reversible; a looping timer video is time-based and must not be represented as scrubbed playback unless intentionally designed.
5. Prefer simple physically based materials, a controlled environment/light setup and baked contact-shadow assets. No full desk simulation or expensive postprocessing baseline.
6. Align rear/front stand plates to the same camera and final phone pose. Foreground handles cross in front of the phone; verify occlusion during forward and reverse motion.
7. Let the existing GSAP chapter timeline control DOM image reveal and CSS atmosphere transitions alongside product pose. Do not import reference's coordinate offsets, smoothing values, scene-uniform paths or internals.
8. Start with R3F demand rendering and explicit invalidation for mutated refs. Continued damping, idle motion or video texture needs continued frames while visible; stop/pause on hidden/offscreen/reduced-motion state. Video updates must schedule frames even when the user stops scrolling.
9. R3F owns rendering scheduling; GSAP owns timeline scheduling. Avoid a second manual rendering RAF. Scope disposal of shared/cached models/textures deliberately; primitive objects are not automatically disposed in every case.
10. Preserve the last good poster/frame during asset failure/context loss, then recover at current chapter progress. Mobile simplification is an intentional documented mode, not evidence of how Flowty itself behaves on mobile.

Current Context7 documentation confirms the ref-mutation/demand-rendering contract: [R3F scaling performance](https://r3f.docs.pmnd.rs/advanced/scaling-performance), [performance pitfalls](https://r3f.docs.pmnd.rs/advanced/pitfalls). The later proof must test initial front, edge, full back, changed returning front, second turn/landscape, stand contact, backward scrub and loading fallback before the full choreography is authored.

## Still unknown / not yet validated

- Exact scene geometry, mesh/material counts, embedded assets, lighting/environment-map source and GPU allocation.
- Exact initial-screen vs named-object mapping; which MP4 corresponds to every named screen.
- Whether later product appearances reuse the same app instance or separate scenes. The confirmed persistence conclusion applies to the opening.
- Exact WebGL context version, browser fallback logic and all mobile implementation choices.
- Cold transfer size, actual frame time, decoded/GPU memory and weakest-device performance for either reference or our future renderer.
- Our model quality, asset licensing, final light setup and target-device acceptance. A stack decision does not eliminate these production gates.
