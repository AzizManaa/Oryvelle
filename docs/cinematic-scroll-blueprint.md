# Cinematic product website — implementation blueprint

Research date: **3 October 2026**. Status: **architecture and reference; no website implementation**.

Architecture clarification: **clean slate**. The existing landing implementation is disposable. Design the ideal empty-repository architecture first, then reuse only code that earns a place in it. The [repository disposition audit](./cinematic-repository-audit.md) records current KEEP / REFACTOR / REPLACE / REMOVE decisions. This clarification supersedes earlier suggestions to retain styling utilities merely because they are installed.

Creative clarification: **reference fidelity first, controlled Oryvelle adaptation second**. Phase 1 follows Flowty’s observed structural, compositional, and motion journey closely. Do not invent an alternative Oryvelle story, simplify a missing-asset scene into a conventional section, or introduce orb/constellation/portal/night-to-dawn concepts. The [reference fidelity plan](./cinematic-reference-fidelity.md) locks the beat order, composition targets, placeholder policy, and qualitative comparison process. It supersedes any earlier suggestion in this document that the reference journey could be freely adapted before a baseline is established.

This document defines how to achieve the craft of [Flowty](https://flowty.co/) with our own identity, product, claims, and assets. It is the implementation agent’s source of truth for architectural decisions. It does not authorize copying Flowty’s branding, photographs, copy, or device renders.

Original assets/content do not imply original scene structure in Phase 1. Insert real Oryvelle identity and information where available, while preserving the reference’s compositional roles, scene order, relative scale, movement, depth, and pacing. Rendering techniques remain independent of Flowty’s implementation. The [public phone-renderer investigation](./flowty-phone-renderer-investigation.md) now confirms a Spline/WebGL opening with GSAP/ScrollTrigger, independently selected screens and layered stand images; its evidence updates the opening renderer decision below.

## 1. Decisions at a glance

Build a semantic, server-rendered page with cinematic **chapters**, rather than a canvas application or a collection of unrelated reveal effects.

- Choose Next.js, React, and TypeScript because they serve the product website. The installed framework infrastructure may remain when appropriate. Use **CSS Modules for components and scenes, plus a small global reset/token stylesheet**. Tailwind is not part of the proposed final stack; migrate its active consumers before removing it.
- Use **GSAP + ScrollTrigger + @gsap/react** for coordinated timelines. Start with **native scrolling**.
- Use normal document flow for most content. Use CSS sticky stages for a small number of cinematic chapters. One chapter can contain several logical scenes.
- Keep the opening product in one shared stage through reveal, rotation, and environmental settling. Do not remount a new phone at every heading.
- Use layered DOM devices for modest perspective, screen demonstrations, and static compositions. Use **one Three.js/R3F canvas for the opening full-turn chapter**, with independent screen textures and a matching static poster. A flat image with CSS rotation cannot supply missing geometry.
- The public implementation investigation confirms that full-turn geometry, independent screens and hybrid environmental settling are relevant requirements. The combined requirements justify this bounded 3D engine; the render proof must still pass the asset/performance gate before authoring the full opening timeline.
- Use a persistent CSS atmosphere: dark base, a small number of glow planes, vignette, and subtle grain. Animate transforms and opacity; avoid recalculating huge blurred gradients every frame.
- Do not install Motion, Lenis, Lottie, Spline, Drei or postprocessing by default. The opening WebGL stack has one specific job; other tools still need evidence and ownership.
- Reduced motion, narrow screens, asset failures, and JavaScript failure must retain the story in an attractive static/normal-flow presentation.

**What makes the quality:** consistent art direction, matching camera and light between shots, strong composition, carefully authored handoffs, readable pauses, and high-quality assets. More libraries do not provide these.

### Evidence conventions

**Observed** means directly seen during the earlier desktop browser inspection, including stationary viewing, small backward/forward scrolls, and interaction tests. **Inferred** describes a possible implementation; Flowty’s source, animation libraries, and media pipeline were not inspected. **Proposed** describes our implementation, not a measured property of the reference.

Scroll distances below are starting art-direction values expressed in viewport heights of **scroll travel**, not animation seconds. Reference durations are qualitative estimates; exact pixel offsets, mobile behavior, frame counts, and easing were not measured.

### Repository context

The inspected project currently has Next.js 16.3.3, React 19.2.4, TypeScript, Tailwind 4, and Vitest. These are installed versions, not requirements or a claim about the newest public releases. Choose the target architecture independently of these packages. Keep appropriate framework infrastructure without unnecessary version churn, remove redundant systems, and confirm the lockfile before implementation. No existing landing component, animation controller, theme, font choice, background, responsive helper, or asset is entitled to reuse.

### Clean-slate implementation contract

1. Start with the scene, rendering, atmosphere, accessibility, and performance architecture in this document. Do not adapt the new story to the old component hierarchy.
2. Compare the repository to that target using the linked audit; refresh consumer evidence immediately before implementation because files may change.
3. Preserve useful production functionality, such as legal URLs/content and metadata, without preserving its old presentation abstractions.
4. Replace conflicting abstractions instead of accumulating adapters, overrides, compatibility wrappers, or a second scroll owner. Migrate real non-landing consumers where necessary.
5. Delete superseded landing modules, styles, helpers, tests of removed behavior, dependencies, and unused assets as part of the replacement milestone. Do not leave an unused old landing system beside the new one.
6. Every retained dependency has one concrete responsibility. Browser primitives come first; optional renderers/libraries remain conditional on actual requirements.
7. Reusable primitives are extracted only when real consumers share behavior. Do not build a speculative design system, global progress store, or renderer framework.

The audit is preparatory, not a deletion operation. Implementation is still a separate future task. Its end state must feel purpose-built for the cinematic experience, with the old architecture removed rather than concealed.

## 2. Reference experience: complete page journey

### Visual language

The page is mostly near-black with pale lavender/white text and luminous indigo-purple photography. Large, relatively light-weight geometric sans typography creates the primary structure. Headlines often occupy much of the viewport; small labels, thin rules, and supporting paragraphs provide contrast in scale. The design alternates expansive empty space with dense product or information compositions.

Depth comes from the device crossing typography, foreground props occluding the product, dark photographs carrying their own light, and blurred atmospheric illumination behind otherwise sharp elements. Glass navigation and occasional pale panels interrupt the darkness. Rounded media panels and restrained borders provide recurring shapes. The atmosphere does not change at every rectangular section boundary.

### Observed sequence and behavior

| Reference segment | Observed experience | Motion classification and limits |
|---|---|---|
| Opening hero | Huge two-line “Silence Your Digital Noise”; tilted metallic phone overlaps type; diagonal purple light; CTA/QR on the left; companion copy and preview on the right. Wordmark at top right. | Asterisk rotates while stationary. Phone screen copy also changes with time. Header wordmark leaves with document scroll. |
| Distraction / rotation | Phone moves through front, edge, back, edge, and front views while the message changes. Product moves differently from typography and atmosphere. | Long cinematic hold, with movement reversing on small backward scrolls: continuous scroll-linked behavior. Public inspection confirms Spline/WebGL object rotation with GSAP/ScrollTrigger. |
| Deep work / desk | Phone turns toward landscape and settles into a ribbed stand; stand crosses in front of large type. Purple light recedes toward black. | Another phase of the opening journey; extended hold followed by release and a dark breathing interval. Public opening integration confirms ScrollTrigger pinning to a later flow section; exact total travel remains unmeasured. |
| Wrist photograph | Large centered heading contains a small watch photograph; the photograph expands toward the viewport. Typography behind it dims/blurs. | Reversible pinned expansion, estimated at more than two viewport heights of travel. Photograph itself appears static. |
| Evidence | Giant “Up To 37%” number with supporting research text; light returns from the left. | Odometer-like count settles after entrance. Likely a triggered animation; continuous scrub was not established. Claim belongs to reference only. |
| Audience | Oversized two-tone statement above six profession photo cards with avatar overlaps and dark label pills. | Horizontal dragging successfully moved this row. It was not a vertically pinned horizontal-scroll chapter. |
| Feature demonstration | Large “Stay In Flow / Reach Goals”; tabs and a progress divider on the left, rounded purple-lit phone media on the right. | Tabs advance while stationary; manual selection works. Normal vertical flow. A feature arrow navigates to a feature page. |
| Premium editorial | Large headline beside narrow supporting copy and a long rule. Statistics text/media row followed by reversed themes/media row. | Normal document flow with substantial spacing. One media entrance blurred then sharpened; small reverse scroll did not replay it, suggesting a triggered entrance. |
| Reviews | Oversized four-line two-tone introduction, then horizontally arranged outlined review cards with varied heights, stars, dates, and colored dots. | A custom drag cursor appeared, but attempted dragging did not move this row. Do not assume every reference carousel was functional. |
| Questions media | Huge edge-cropped moving question text and rotating asterisk, then rounded hands/landscape-phone media. | Marquee and timer demonstration continued without scrolling. Blur was seen around the boundary, but its exact trigger/progress relation was not verified. Media format unknown. |
| FAQ | Left supporting copy and CTA/QR; three already-visible answers on the right with dividers. | Both columns moved normally; no sticky FAQ behavior was observed. |
| Final CTA / footer | Giant centered trial CTA, store buttons, returning broad purple glow, QR, link columns, copyright/design credit, and a huge cropped wordmark at the absolute bottom. | Floating navigation disappears near footer. Return-to-top smoothly travels back through the document. Additional scroll to the lower wordmark confirmed the absolute end. |

### Navigation and overlays

The pale bottom navigation contracts to a small brand mark while scrolling down and expands when scrolling up. Opening the menu produces a larger pale rounded panel with large navigation links, smaller legal/social links, a dark download button, a dim backdrop, and a separate close control. The QR label opens a pale right-side drawer with large title and QR card; the QR image itself did not activate it. These are discrete interaction animations, not part of the cinematic scrub timeline.

### Six distinct animation classes

1. **Entrance:** premium image sharpens; evidence count resolves. These can complete once and remain visible.
2. **Scroll-linked:** phone poses, wrist expansion, and background/type attenuation should track progress and reverse deterministically.
3. **Sticky/pinned:** the viewport remains occupied while a longer chapter supplies travel; opening and wrist sequences use this visual pattern.
4. **Parallax:** device, type, glow, and environment move at different rates. Different rates alone do not prove a particular implementation.
5. **Ambient:** asterisks, marquee, phone content, and media timer continue while the page is stationary.
6. **Interactive:** tabs, draggable audience cards, menu, QR drawer, navigation contraction, and return-to-top respond to input.

Keep these classes separate in implementation and debug tools. A timer changing while stationary is not a scrub effect; a reversed phone pose is not a one-shot entrance.

## 3. Technique selection: simplest capable renderer

| Requirement | First choice | Escalate only when | Avoid |
|---|---|---|---|
| Layout, copy, FAQ, links | Semantic HTML + CSS grid/flex | Never needs a graphics engine | Text baked into images or canvas |
| Entrance, small hover | CSS transition or GSAP for coordinated groups | Complex gestures/layout transitions justify Motion | Two libraries writing the same transform |
| Multi-phase scroll chapter | GSAP timeline + ScrollTrigger | Browser-native scroll timelines fit a small enhancement | Hundreds of unlabelled scroll callbacks |
| Viewport hold | CSS sticky shell | ScrollTrigger pin is necessary for a specific composition | Sticky and JS pin on the same shell |
| Cropping/expanding photograph | Overflow shell, border radius, transform; clip-path if needed | Complex authored silhouette needs SVG mask | Animated layout width/height every frame |
| Atmosphere/light | CSS gradients or pre-blurred raster planes | Truly reactive light/distortion needs a shader | Full-screen filter/gradient recomputation |
| Mild device tilt | Layered DOM + CSS perspective | Silhouette, rear chassis, reflection, or camera must change | Calling a flat card a realistic 360° phone |
| Fixed-camera realistic turn | Pre-rendered frame sequence on Canvas 2D | Memory/network budget fails or geometry must be interactive | Scroll-seeking a long-GOP video as the default |
| Dynamic realistic device | One Three.js/R3F scene | True dynamic material/geometry/camera requirement | Several full-page WebGL canvases |
| Ambient product demonstration | Short muted video with poster, or real DOM UI | Vector illustration export needs Lottie | Video for readable body copy |
| Marquee, decorative rotation | CSS keyframes | A timeline must coordinate them | Per-frame React state |
| Icons and decorative geometry | SVG | Raster texture is part of the art direction | Large canvas for a few simple shapes |
| Local programmatic time-based effect | Web Animations API or existing GSAP | Scroll choreography is involved | Another global animation scheduler |

CSS masks/clip-path are useful, but support, paint cost, and edge quality must be tested for the exact shape. Filters can be expensive even when the rest of the scene uses transforms. A transform does not automatically guarantee smooth GPU rendering. [web.dev animation guidance](https://web.dev/articles/animations-guide)

Native CSS scroll timelines are an enhancement option for a simple progress indicator or isolated transform. At the research date, MDN labels `animation-timeline` as limited availability; it is not the baseline for our full cross-browser journey. [MDN animation-timeline](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/animation-timeline)

Motion offers scroll motion values and supports useful combinations of scroll transforms; it is a viable alternative for a simpler site. Our chosen chapters need labelled orchestration and coordinated handoffs, so GSAP already fills that role. Add Motion only for a separately justified UI need, never as a second chapter engine. [Motion useScroll](https://motion.dev/docs/react-use-scroll)

## 4. Story architecture and pacing

The Phase 1 storyboard is the observed reference journey: **hero/product → long product transformation → physical settling → dark release → embedded-media typography → media expansion → evidence → audience cards → feature demonstration → premium editorial → reviews → moving typography → ambient product demonstration → FAQ → final CTA/atmospheric footer**. Preserve these ordered beats, including distinct evidence/audience and marquee/demo compositions even where the architecture groups them under one scene number. Oryvelle supplies content; it is not permission to reorder or eliminate the structure.

Use approximately two major cinematic chapters, separated by normal-flow information. Keep the long reference holds and readable pauses; do not compress them merely to make a shorter landing page. The proposed opening starts around six desktop viewport heights of travel; the photography chapter starts around two. These are provisional engineering values, not measurements of Flowty. Tune them against the observed sequence and live reference review; preserve the dark breathing/release interval as a deliberate beat.

| Scene | Role | Container / travel on desktop | Primary motion |
|---|---|---|---|
| 01 Intro | Establish promise and identity | Shared opening sticky stage; 0–12% of chapter | Restrained entrance, readable hold |
| 02 Product reveal | Connect promise to interface | Same stage; 12–32% | Device translation/scale, text handoff |
| 03 Device rotation | Demonstrate object and purposeful change | Same stage; 32–65% | Scrubbed front → edge → back → edge → front journey |
| 04 Desk/environment | Bring product into a physical ritual | Same stage; 65–100% | Settling pose, occlusion, light transition |
| 05 Human/photo expansion | Shift from product to lived outcome | Independent sticky stage; 1.8–2.4 VH travel | Reversible image expansion |
| 06 Evidence/audience | Explain benefit and relevance | Normal flow, about 1–2 screenfuls | Triggered count, quiet card interaction |
| 07 Feature demonstration | Show how it works | Normal two-column section | Time-based/manual tabs |
| 08 Editorial capabilities | Add information without another long pin | Alternating normal-flow media/text | Small entrances, optional local parallax |
| 09 Trust/reviews | Supply evidence and voices | Normal flow | Horizontal native card browsing |
| 10 Ambient interaction | Renew visual energy | Normal-flow large media | Marquee and pausable demo |
| 11 FAQ | Resolve objections | Normal flow | Already-visible answers in baseline |
| 12 Invitation/footer | Close the story and provide routes onward | Normal flow to absolute bottom | Atmospheric return, interaction overlays |

### Scene 01 — Intro

**Purpose:** communicate one compelling promise immediately, with a visible product and action.

**Viewport structure:** opening chapter contains a sticky, one-viewport stage. Device and visual type are positioned within it; CTA belongs to a stable readable region. Semantic heading and explanatory copy exist in HTML. The opening composition is visible before animation initialization.

**Timeline, local 0–100%:** 0–20% is the initial readable composition; 20–65% optional headline line reveal and device light/scale settling; 65–100% prepares the next heading and product movement. Intro entrance is a short time-based enhancement; the subsequent transition is scrubbed. Do not require scrolling to reveal the initial CTA.

**Layers, back to front:** base atmosphere → diagonal glow → oversized type → device → companion text/CTA. Asterisk can rotate slowly, subject to pause/reduced motion. No blur on body text. Device may begin with mild yaw and roll, with perspective around 1,000–1,600 CSS pixels as an initial tuning range.

**Handoff:** retain the same device pose, camera, and light at Scene 02’s first frame. Type moves/dims behind it rather than cutting the entire section to a different background.

**Technology:** HTML/CSS, layered device poster, GSAP chapter timeline; CSS for ambient rotation. No WebGL required for the initial view.

### Scene 02 — Product reveal

**Purpose:** connect the promise to a concrete product action.

**Structure/travel:** same sticky stage, roughly 1.2 VH of opening travel. Nothing is independently pinned inside it.

**Local phases:** 0–15% outgoing title fades/translates; 15–40% product moves toward the next focal anchor; 40–75% new title and UI are readable; 75–100% product moves toward the rotation composition.

**Transforms:** translation relative to stage anchors, moderate scale change, modest roll/yaw. Screen change uses a masked crossfade within the chassis. Reflection and contact shadow move independently but derive from the device pose.

**Layers:** atmosphere → outgoing/incoming type → device → screen/reflection → concise annotation. At most two text compositions overlap briefly; their semantic reading order remains linear.

**Background:** glow shifts slowly and changes intensity; base black continues. Type contrast must remain sufficient throughout its reading hold.

**Technology:** the opening shares one R3F device instance; layered DOM remains suitable for other modest appearances. Match its loading poster to the initial visible model pose and switch only once ready without a jump.

### Scene 03 — Device rotation

**Purpose:** create the strongest object-focused moment while advancing the message.

**Structure/travel:** same stage, about 2 VH travel. Scrubbed, reversible; no forced snap.

**Local phases:** 0–15% establish front pose; 15–40% front to edge; 40–60% rear three-quarter/back; 60–85% return through edge to the next useful front pose; 85–100% hold and begin landscape settling. Use our device geometry and screen assets, while preserving this observed motion role and the device’s dominance. Do not replace the desktop full-turn beat with mild tilt merely because it is easier.

**Layers:** atmosphere → typography → product → dynamic/baked reflection → cast shadow. Keep the object sharp; allow large background type to dim or receive a limited blur during occlusion. Chassis perspective, foreshortening, silhouette, and reflection must agree.

**Implementation distinction:** CSS `rotateY` on a single PNG only rotates its plane. Separate front/back/edge planes can make a stylized device, but realistic bevels and highlights still need assets or geometry. For this opening, use actual 3D geometry with an independent screen material, controlled lighting and a simple camera. The required full-turn/second-turn/landscape choreography and screen changes justify it. Transparent rendered frames remain a fixed-shot alternative under the gate in Section 8. Never hide a visibly incorrect edge behind excessive blur.

**Handoff:** the outgoing pose is also the first environmental phase pose. Preserve the observed later back-facing turn before the landscape front settles; do not reduce the environmental handoff to translation alone. Screen and light continuity matter more than the nominal rotation angle.

### Scene 04 — Desk / environment

**Purpose:** translate software into a physical habit or setting.

**Structure/travel:** final opening-stage segment, about 2 VH; the stage then releases into document flow.

**Local phases:** 0–20% environment emerges behind the object; 20–55% phone rolls/translates toward its landscape stand pose; 55–75% foreground stand occludes the lower chassis and contact shadow strengthens; 75–90% headline/environment hold; 90–100% lighting recedes and chapter releases.

**Layers:** atmosphere → rear desk/background plate → large type → rear stand elements → phone → front stand cutout → restrained content. Split the stand into rear/front assets if it crosses the phone. Match ground plane, horizon, camera focal length, and shadow direction in all exports.

**Transforms/masks:** foreground and rear environment move less than the phone; its screen stays masked. Avoid scaling the desk independently enough to expose mismatched perspective. A baked shadow plate can change opacity/scale subtly; true rotating shadows belong in renders or 3D.

**Background:** reduce the purple glow before release; let the next section arrive through darkness. Preserve the reference’s noticeable dark breathing interval. Its exact travel was not measured; calibrate the release and following arrival together rather than silently shrinking the interval or adding an unrelated transition.

**Technology:** the same R3F phone with DOM rear/front stand image layers; do not build a full 3D desk merely to support occlusion. End with a stable poster if that permits releasing heavy renderer resources. Preserve continuity on reverse scroll; reload/fallback policies cannot make the phone disappear.

### Scene 05 — Photography expansion

**Purpose:** move from the object to the human outcome.

**Structure:** independent sticky stage; 1.8–2.4 VH travel. Oversized headline behind a centered expanding image shell. Use a different mobile crop.

**Local phases:** 0–15% title and inset photo readable; 15–65% image expands; 65–85% photo dominates while background type dims/softens; 85–100% stable photo releases upward. All scrub phases reverse.

**Layers:** atmosphere → oversized type → image clipping shell → photo → optional small caption. Animate an outer shell transform and inner photo counter-scale when needed to keep the focal subject stable. Change border radius gently; use clip-path only when it adds a meaningful shape. Do not distort the photograph with unequal x/y scaling.

**Background:** keep dark base visible around the growing photo; blend into the photo’s own lighting. Type blur can be 0–6 px on a limited area, with a no-blur performance fallback.

**Technology:** HTML image/next/image with reserved aspect ratio, CSS overflow and transform, GSAP scrub. WebGL is unnecessary.

### Scene 06 — Evidence and audience

**Purpose:** substantiate the story and help visitors identify with it.

**Structure:** normal flow; oversized metric followed by supporting source and audience cards. Use only verified product-specific claims.

**Entrance phases:** 0–25% metric enters; 25–75% optional count resolves over about 0.7–1.1 seconds; 75–100% final number remains. This progress is time-based, not a forced scroll chapter. Audience cards need no continuous motion.

**Layers/background:** soft returning glow → type/evidence → photographs → avatar/label details. No foreground parallax necessary. Supporting citation must remain readable and clickable.

**Interaction:** native horizontal overflow with optional scroll-snap and visible previous/next buttons. Pointer dragging is optional enhancement. Do not capture vertical wheel input to move cards.

**Technology:** HTML/CSS, a small GSAP entrance if useful, React for card controls. Do not repeatedly announce animated numbers to screen readers.

### Scene 07 — Automated feature demonstration

**Purpose:** explain real behavior in a compact, repeatable demonstration.

**Structure:** normal two-column layout; copy/tabs around one-third, media around two-thirds. Stack on small screens.

**Time-based phases per panel:** 0–10% settle selected panel; 10–85% demonstrate one operation while a progress line advances; 85–100% transition to next panel. Start with a 6–9 second panel cycle, then tune to actual reading time. Manual selection resets progress and pauses automation until the user explicitly resumes.

**Layers:** panel background → media/photo → masked screen or real UI → optional annotations. Crossfade media over 250–450 ms; reserve dimensions to prevent layout shifts. No long vertical pin.

**Behavior:** pause outside viewport, in a hidden tab, on keyboard focus, and through a visible persistent pause control. Reduced motion defaults to manual panels with still media. Use ARIA tabs if these are tabs, not a generic collection of clickable divs.

**Technology:** React state for selected panel, CSS/GSAP for panel transition, video or DOM UI for the demonstration. Use one clock. Background timer loops cannot keep announcing changes.

### Scene 08 — Editorial capabilities

**Purpose:** provide detail and a calmer interval after the cinematic opening.

**Structure:** normal alternating text/media rows with a large editorial heading and thin rules; text 35–45%, media 55–65% initially. Typography and images align to the same page grid.

**Entrance phases:** 0–30% image translates 16–32 px and fades; 30–80% sharpens if budget allows; 80–100% final state. A roughly 0.5–0.8 second triggered entrance can complete once. Optional local parallax is small, bounded, and absent on mobile.

**Layers:** global dark atmosphere → image panel with its own purple light → body text and rule. Background continuity comes from the global base; panels can have distinct lighting without full-width background cuts.

**Technology:** server-rendered content, next/image, CSS grid, optional GSAP entrance. Keep body text static. Release any previous cinematic renderer before this section when safe.

### Scene 09 — Trust and reviews

**Purpose:** provide credible independent evidence.

**Structure:** normal flow with large intro and horizontally browsable cards. Cards use authored widths, a shared baseline/grid, subtle outline, and sufficient body-text contrast; varied content height is acceptable.

**Phases:** entrance 0–30% introduces row; 30–100% static readable state. Interaction scrolls cards; there is no continuous vertical timeline. Hover may lift a card 2–4 px or strengthen its border, without moving surrounding layout.

**Layers/background:** quiet atmosphere → intro → cards → tiny accent markers. Do not animate reviews automatically while someone reads them.

**Technology:** HTML, CSS overflow, React controls if necessary. A successful audience drag in the reference does not establish successful review dragging.

### Scene 10 — Ambient question / interaction moment

**Purpose:** reintroduce energy and demonstrate the product in use before objections.

**Structure:** normal-flow oversized marquee followed by large rounded environmental media. No new pin unless the storyboard proves a specific need.

**Phases:** section entrance reveals media over 0.6–0.9 seconds; then marquee and demo loop independently of scroll. Optional image parallax spans the section with less than 8% of media height displacement.

**Layers:** quiet atmosphere → oversized cropped marquee → media shell → hands/phone image or video → caption. Text duplicates used for the seamless loop are decorative and hidden from assistive technology.

**Background:** use the media’s lighting as the visual event, not an expensive global shader. No mandatory scroll-velocity blur; it adds cost and can reduce legibility.

**Technology:** CSS marquee with persistent pause, video/DOM demo, GSAP only for entrance or measured local parallax.

### Scene 11 — FAQ

**Purpose:** answer practical concerns directly.

**Structure:** normal-flow two-column desktop, stacked mobile. Do not pin the support column. Keep the baseline answers already visible, as observed. A disclosure redesign is a later controlled adaptation, not the initial reference target.

**Phases:** no scrub timeline. Optional quiet heading entrance; answers should be readable without animation. Disclosure height follows content rather than a fixed measured pixel assumption.

**Layers/background:** atmosphere → support copy and CTA → answer blocks/dividers. No decorative occlusion of answers.

**Technology:** semantic HTML; React only for behavior beyond native disclosure. Maintain deep-linkable FAQ anchors.

### Scene 12 — Final invitation and footer

**Purpose:** complete the emotional arc and provide clear next actions.

**Structure:** normal-flow final CTA, store/action buttons, link grid, legal information, and decorative oversized brand treatment. Include the actual final content in document height; do not clip away required footer links.

**Scroll phases:** 0–30% glow returns; 30–70% CTA reaches primary view; 70–100% footer arrives and floating nav withdraws. This is bounded background interpolation over normal scrolling, not another long pin.

**Layers:** returning glow → CTA → actionable links → decorative wordmark; navigation and dialogs live in the page overlay layer. Footer text remains sharp and high contrast.

**Interactions:** menu, optional QR drawer, and return-to-top use time-based motion. QR must have a direct usable URL alternative. Respect reduced motion for return-to-top.

**Technology:** HTML/CSS + GSAP background owner, React/native dialog for overlays. Preserve the reference footer’s compositional rhythm, scale and extended ending, using Oryvelle’s own wording, links and brand assets.

## 5. Global scroll architecture

### Component tree

```text
ProductPage [Server Component: content, metadata, asset descriptors]
├── MotionBoundary [Client: lifecycle and preference coordination]
│   ├── GlobalBackground [decorative fixed layers]
│   ├── Navigation [fixed overlay; discrete state]
│   ├── OpeningChapter [one sticky stage / one scrub timeline]
│   │   ├── IntroComposition
│   │   ├── ProductComposition
│   │   ├── DeviceRenderer [same instance across opening scenes]
│   │   └── EnvironmentLayers
│   ├── PhotoChapter [independent sticky stage / timeline]
│   ├── EvidenceAndAudience [normal-flow server content + small islands]
│   ├── FeatureDemo [interactive island]
│   ├── EditorialSections [normal-flow server content]
│   ├── Reviews [normal-flow content + controls]
│   ├── AmbientDemo [pausable island]
│   ├── FAQ [semantic content]
│   └── Footer [semantic content]
└── DialogLayer [portal; menu/QR if required]
```

A client boundary may receive server-rendered children; it need not turn every paragraph into client-side code. Initial Client Component HTML can also be server-rendered. Keep data/content and interactive ownership explicit. [Next.js Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components)

### Timeline boundaries

Use **one timeline per cinematic chapter**, with labels for its logical scenes. Do not create one master timeline spanning the entire page: content edits would couple unrelated distances, refreshes, and responsive variants. Do not put separate ScrollTriggers on child tweens already controlled by a parent scrub timeline.

For the default CSS-sticky architecture, a chapter’s height is:

```text
chapter height = stage height + desired scroll travel
example: 1 viewport stage + 6 viewport travel = 7 viewport section
progress = clamp((scroll position - chapter start) / travel, 0, 1)
```

ScrollTrigger starts at `top top` and ends after the measured chapter height minus sticky-stage height; the stage is sticky at `top: 0`. `bottom bottom` is equivalent only when stage height equals the current viewport height. A stable `100svh` stage can differ from the visible viewport as mobile browser chrome changes, so use the measured travel rather than assuming equality. **There is no `pin: true` on that stage.** If a later scene genuinely needs ScrollTrigger pinning instead, let its pin spacer supply distance and remove the CSS-sticky/extra-height strategy for that scene.

Use a stable stage height, initially `100svh`, with safe-area insets. Re-measure on meaningful viewport/orientation changes; avoid rebuilding every time mobile browser chrome changes. Overflow clipping belongs inside the stage, not on an ancestor that unintentionally changes the sticky scroll container. Avoid nested pins and transformed ancestors around fixed navigation.

### Illustrative chapter skeleton — not implementation code

```tsx
// Client chapter, inside useGSAP({ scope: chapterRef }).
// Desktop example; build the mobile/static composition separately.
// Setup only after the chosen enhancement mode and layout are ready.
const mm = gsap.matchMedia();
mm.add({ wide: '(min-width: 1024px)', reduce: '(prefers-reduced-motion: reduce)' }, ctx => {
  if (ctx.conditions.reduce || !ctx.conditions.wide) return;
  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: chapterRef.current,
      start: 'top top',
      end: () => '+=' + (chapterRef.current.offsetHeight - stageRef.current.offsetHeight),
      scrub: 0.25,
      invalidateOnRefresh: true,
      // CSS sticky owns the hold; no pin here.
    },
  });
  tl.addLabel('intro', 0)
    .addLabel('reveal', 0.12)
    .addLabel('turn', 0.32)
    .addLabel('environment', 0.65)
    .addLabel('release', 1);
  // Durations/positions below are authored in normalized chapter units.
  // Actual pose values come from measured anchors and storyboard data.
  tl.to(devicePose, { progress: 1, duration: 1,
    onUpdate: () => deviceRenderer.setProgress(devicePose.progress) }, 0);
});
// Cleanup: revert matchMedia/context and remove owned external listeners.
```

This illustrates ownership, not a complete working component. An implementation must include actual keyframes, measurement, fallbacks, and cleanup. Use current `gsap.matchMedia()` rather than deprecated `ScrollTrigger.matchMedia()`. Use `useGSAP` scoped contexts, and `contextSafe` for delayed event callbacks that create animations; manually remove owned listeners. [GSAP matchMedia](https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/), [GSAP React integration](https://gsap.com/resources/React/)

### Progress and property ownership

- ScrollTrigger/timeline owns continuous progress. Device and atmosphere consume it through refs/imperative adapters, not React `setState` on every frame.
- React owns discrete state: selected feature, dialog open, user pause, active navigation destination, and coarse active chapter.
- A chapter config stores labels, travel, asset keys, poses, and atmosphere keyframes. Store meaningful anchors such as `deviceCenter` and `standContact`, not unexplained page pixel offsets.
- A single atmosphere controller resolves progress into its current palette. It must evaluate the correct state after a fast scroll, restored scroll position, or back/forward navigation; do not rely only on `onEnter` events having fired in order.
- Separate wrappers for separate transform owners: chapter translation on an outer wrapper, local device tilt on an inner wrapper, hover on another wrapper. Do not have CSS and GSAP race over one `transform`.
- Continuous values live in refs. Add a global store only if several non-animation features genuinely need shared state. No route-level progress store is needed for one landing page.

Measure during setup/refresh, not in animation updates. Refresh after critical fonts and asset dimensions settle, and after real layout changes. Avoid `refresh()` per frame or repeatedly during scrolling. Build triggers in document order. Function-valued measurements and `invalidateOnRefresh` keep responsive values current. [ScrollTrigger documentation](https://gsap.com/docs/v3/Plugins/ScrollTrigger/), [common ScrollTrigger mistakes](https://gsap.com/resources/st-mistakes/)

### Progressive enhancement and continuity

The initial HTML must show the promise, poster, copy, and actions. Default styles provide readable normal-flow scene summaries. Enhanced sticky/absolute compositions activate only when prerequisites are ready. Do not ship server HTML with all copy at `opacity: 0` waiting for JavaScript.

Reserve hero media geometry from the first render. If late activation would change document geometry after a visitor has already scrolled, keep that session in the static mode rather than jumping their position. Test slow JavaScript and failed media explicitly. Reduced-motion and static modes remove excessive chapter travel instead of leaving empty multi-viewport containers.

Handoffs require matching endpoint/startpoint poses, screen content, crop, shadow, and illumination. Overlap adjacent visual phases by about 8–15% where useful. Keep one product instance wherever possible. If changing renderers, switch at matching frames or a purposeful occlusion, not a long half-transparent double-device crossfade. A dark hold is a legitimate transition; an unexplained blank gap is not.

## 6. Reusable motion grammar

Values below are proposed defaults, tuned after visual review. Scrub smoothing is catch-up time in seconds, not the amount of scroll travel. Begin with `scrub: true` for exact tracking; use about 0.15–0.35 seconds when a small amount of settling improves the object motion. Avoid compounded smoothing from scroll middleware plus springs plus scrub.

| Primitive | Contract / default | Constraints |
|---|---|---|
| `TextReveal` | Line wrapper with overflow clip; inner line y from 105% to 0; 0.65–0.9 s; 0.06–0.10 s line stagger | Split after fonts settle; resplit on real wrapping changes; preserve one accessible text equivalent |
| `ClipReveal` | Reveal bounded media through overflow or simple inset clip; 0.6–0.9 s | Prefer rectangular masks; test paint cost; do not clip focus outlines |
| `FadeUp` | Opacity 0→1, y 16–32 px; 0.45–0.7 s | Entrance only; never default every paragraph to hidden |
| `ScaleReveal` | Scale 0.96→1 with opacity; 0.6–0.8 s | Avoid repeated zooming; use meaningful transform origin |
| `BlurReveal` | Limited media/type blur 4–8 px→0; 0.5–0.8 s | Optional; no body copy blur, no full-screen live filter |
| `PinnedScene` | Chapter owns travel and one stage; exposes normalized progress | Sticky default; no nested hold; reduced-motion normal flow |
| `ScrubTransform` | Piecewise pose interpolation using `ease: none` by default | Easing inside a phase must not create long dead zones |
| `ParallaxLayer` | Bounded displacement relative to stage/section progress | Start background at 0.1–0.25× principal travel, foreground 0.8–1.1×; tune composition, not physics |
| `DeviceTransform` | Named poses: x/y/scale/yaw/pitch/roll, shadow, reflection | Anchor-based; preserve aspect; renderer decides true geometry |
| `ImageExpansion` | Clipped shell expands; image crop preserves focal point | Scrubbed and reversible; no stretch; mobile crop independent |
| `BackgroundTransition` | Interpolate palette/glow-plane state over chapter progress | One writer; fixed base; no hard section color cuts by default |
| `GlowTransition` | Translate/scale/opacity of pre-blurred plane | Keep texture/gradient itself mostly static |
| `Marquee` | Linear ambient translation of repeated track; about 35–65 px/s | Pause control; offscreen pause; static reduced-motion state |
| `AutoProgressTabs` | One selected panel and visible progress; 6–9 s initial cycle | Manual override, persistent pause, focus/visibility handling |
| `FloatingNavigation` | Direction-based expanded/compact state; 0.2–0.35 s | Hysteresis around 24–48 px cumulative travel; expand on focus; do not fight footer |
| `HorizontalDragCards` | Native overflow first; optional pointer drag enhancement | Buttons and keyboard access; no vertical scroll hijack |

**Easing:** scrubbed position/rotation usually linear. Entrances use a restrained `power2.out`/`power3.out` style curve. UI dismissal can use a short ease-in. Avoid elastic/bounce on premium device presentation. Use linear ambient rotation and marquee.

**Origins:** device around its visual center unless the shot calls for a stand contact pivot; expanding image around its focal anchor; text from its baseline/line clip. Origins belong in scene data, not ad hoc tween strings.

**Restraint:** at most one dominant movement and one supporting atmosphere change per beat. Let readable text remain still for a meaningful interval. Hover gestures do not rotate the same product that a scrub timeline controls. Intro entrances, loops, and scroll progress are independently pausable/debuggable.

## 7. Native scroll, Lenis, and scheduling

Native scrolling is the production baseline: it preserves browser input behavior, links, find-in-page, and straightforward sticky positioning. GSAP scrub can soften an object’s response without interpolating the entire document.

Consider Lenis only after native-scroll visual review establishes a specific need for consistent wheel interpolation. It brings another lifecycle and nested-scroll responsibility. Current documentation describes GSAP integration through Lenis scroll events and a single animation ticker. Do not enable `autoRaf` while also feeding Lenis from GSAP’s ticker. If modifying global ticker lag smoothing, own that app-wide decision and restore it appropriately. Destroy instances and unregister callbacks on route cleanup. [Lenis official README](https://github.com/darkroomengineering/lenis)

Test anchors, dialogs, nested carousels, touch, Safari, low-power mode, restored positions, and keyboard scrolling before adopting it. Its documented limitations include iframe input and platform-specific frame-rate behavior; it does not repair expensive scenes. Reduced motion should bypass optional smooth-scroll interpolation.

Do not add a second global `requestAnimationFrame` loop for DOM transforms. Canvas/WebGL render scheduling is allowed where necessary, but it consumes chapter progress rather than independently calculating scroll.

## 8. Device rendering strategy and decision gate

### Comparison

| Strategy | Quality / suitable movement | Performance and mobile | Complexity / responsiveness |
|---|---|---|---|
| Single transparent frame + screen | Excellent frontal art direction; limited tilt | Small payload, simple composition | Easiest; crop and screen mask must match |
| Layered DOM chassis/screen/reflection/shadow | Convincing mild perspective and screen demos; limited true rear view | Generally inexpensive if layers are bounded | Moderate asset work; responsive anchors and correct perspective needed |
| Authored CSS front/back/edge geometry | Useful stylized object with controlled angles | Can be light, but many layers add compositing cost | Silhouette/material realism difficult; not default for a hero-grade phone |
| Rendered transparent frame sequence | Highest predictable baked lighting for fixed shot; deterministic frame selection | Network and decoded-memory cost can be high; use lower-resolution/mobile alternative | Needs offline rendering and asset pipeline; responsive camera changes require variants |
| GLB + Three.js/R3F | True geometry, dynamic light/material/camera and screen texture | Runtime GPU/JS cost; device/DPR sensitive; small model may beat a large sequence | Highest engineering and art/lighting complexity; flexible framing |
| Baked video | Excellent environmental/ambient shot with compact delivery | Hardware decode often useful, but many active videos consume resources | Easy timed playback; precise bidirectional seeking depends on encoding/browser |

### Recommendation

Use **layered DOM for modest/static product appearances** and **one Three.js/R3F canvas for the opening chapter**. The [public investigation](./flowty-phone-renderer-investigation.md) established live 3D rotation, independently selected/video-backed screen objects and a hybrid image stand. Our combined full-turn, changing-screen, responsive-pose and lighting requirements favor a compact original/licensed model over baking each combination into sequences. This is an independent architectural judgment, not an instruction to reproduce Spline’s implementation.

Before the full choreography, compare one representative rotation/settling proof against Section 14. Retain matching static/mobile fallbacks. Pre-rendered frames remain a credible alternative for a fixed baked shot if the model cannot achieve acceptable quality/performance, but are no longer the opening default. Phase 1 includes the full turn and environmental settling; the gate cannot silently remove either beat. Record temporary limitations in the fidelity ledger. Keep only the selected production engine, not both stacks merely to preserve options.

**Gate acceptance:** front/edge/back silhouette convincing; stand contact and shadows match; screen stays legible where intended; frame selection reverses; fast scroll never leaves a blank canvas; weakest supported mobile has an attractive fallback; transfer/decoded memory passes; assets are licensed and reproducible. The render proof is a later implementation phase, not work authorized by this document.

### DOM layer contract

Use an outer scene-position wrapper, an inner perspective wrapper, and chassis/screen/reflection/shadow children. Mask screen content using the actual screen shape, including corners/cutouts. Reflection can be a separate transparent image or subtle gradient; it cannot recreate view-dependent physically accurate reflection over arbitrary angles. Keep the shadow outside the screen mask.

`transform-style: preserve-3d` needs an unbroken suitable hierarchy. Grouping effects such as opacity, filters, masks, and clipping can flatten descendants; apply these on outer compositing wrappers, outside the critical preserve-3D chain. Do not casually apply `isolation`, paint containment, or filters to that chain. [MDN transform-style](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/transform-style)

### Sequence contract

Use Canvas 2D only for the product frames, leaving copy and controls in HTML. Progress maps to a frame index. Decode nearby frames and paint only when the index changes; retain the last good frame. Asset loading must not be driven by React renders.

A sequence’s compressed size is not its decoded size: 120 frames at 1280×720×4 bytes is approximately **422 MiB** before overhead. A 24-frame window at that size is approximately **84 MiB**. Use bounded working sets, desktop/mobile resolutions, preload around the next relevant pose, and dispose unneeded decoded frames. A small window cannot guarantee instantaneous arbitrary reverse seeks: define nearest-loaded-frame/poster behavior and test rapid direction changes. Avoid a full high-resolution preload.

Alpha WebP/PNG frame exports simplify atmosphere integration; compare decode speed and file size before choosing AVIF for a sequence. AVIF is excellent for many stills but not automatically the fastest multi-frame decode choice. Match alpha edges to avoid dark halos. Use an asset manifest with dimensions, camera/crop, frame count, and checksums.

### WebGL contract — selected for the opening

One canvas, one owned render scheduler, limited camera/material system, DOM typography. Use GLB; compress geometry/textures where justified and measure decoding overhead. Prefer baked environmental lighting and simple materials before custom shaders. Render while scrub/ambient geometry changes; stop when idle/offscreen.

R3F `frameloop="demand"` with `invalidate()` supports on-demand rendering; imperative pose changes must invalidate, and damped motion must continue invalidating until settled. Visible video textures and time-based idle geometry also need continued frames even when scrolling stops; pause both when hidden/offscreen. GSAP owns pose choreography while R3F owns rendering scheduling; do not add a competing manual render loop. Do not assume demand mode renders changed refs by itself. Shared cached assets require intentional ownership/disposal. [R3F performance guidance](https://r3f.docs.pmnd.rs/advanced/scaling-performance)

Use GLTFLoader/KTX2 support where needed, and dispose owned GPU resources when the chapter/route is released. Do not dispose shared resources still in use. [Three.js GLTFLoader](https://threejs.org/docs/pages/GLTFLoader.html), [Three.js cleanup](https://threejs.org/manual/pages/cleanup.html)

Custom shaders are conditional tools for a specific effect, not the atmosphere baseline. They require precision, color-space, alpha, DPR, and GPU profiling work. [WebGL best practices](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices)

## 9. Asset inventory and production pipeline

Dimensions below are authoring starting points; export to actual rendered size and DPR budget. Maintain editable masters separately from optimized web assets.

| Asset | Format / approximate resolution | Alpha / variants | Production and optimization |
|---|---|---|---|
| Product UI screens | PNG master; WebP/AVIF web, around 1170×2532 for a tall device | No alpha normally; desktop/mobile UI states if different | Capture real product; remove private data; inspect small rendered readability |
| Hero device poster | Transparent WebP or AVIF after testing; 1600–2200 px long edge desktop, 800–1200 mobile | Alpha essential; alternate mobile pose | Render/model or licensed mockup; tight crop plus measured padding |
| Chassis front/back/edge | Transparent WebP; same camera and pixel geometry | Alpha; consistent variant set | Render together; never combine mismatched mockups |
| Screen mask | SVG path or CSS rounded shape for simple screen | Alpha/mask; coordinates tied to frame | Derive from chassis geometry; test antialiasing and cutouts |
| Reflection and shadow | Transparent WebP/PNG; device-sized, often lower resolution | Alpha essential | Render matching light; shadows may be CSS only for simpler scenes |
| Optional turn/settling sequence (alternative only) | Alpha WebP/PNG candidates; start near 960–1280 wide desktop, 540–720 mobile; 60–100 authored frames as initial experiment | Alpha; independently cropped mobile sequence or still | Offline 3D render; bounded decode; budgets override frame count |
| Desk rear plate / stand rear / stand front | WebP/AVIF rear photo; transparent foreground WebP; 1600–2400 long edge | Foreground alpha; portrait variant | Photograph/render one matched scene; export occlusion plates |
| Expanding human photograph | AVIF/WebP, 2000–2600 wide desktop, 1000–1400 portrait | Usually opaque; focal-point metadata | Own photography or licensed source; prepare actual portrait crop |
| Editorial media | AVIF/WebP, 1200–1800 wide | Usually opaque; mobile crops | Consistent lighting treatment and realistic device perspective |
| Ambient demonstrations | WebM/MP4 codec alternatives plus WebP poster; 720p–1080p desktop, 540p–720p mobile | Opaque unless special tested need | Short seamless clips, no unnecessary audio; lazy source assignment |
| Audience portraits / avatars | WebP/AVIF; 500–800 px cards, 96–160 px avatars | Optional cutout alpha | Own/licensed imagery; meaningful alt only when informative |
| Noise / grain | Tiny repeatable PNG/WebP, roughly 128–256 px | Alpha or neutral texture | Generate once; extremely low opacity; no continuously regenerated noise |
| Glow / vignette | CSS gradients first; optional low-resolution raster glow | Transparent layer | Art-direct in CSS; keep blur mostly baked/static |
| Icons / decorative graphics | SVG | Transparent | Original vectors, shared stroke/optical sizing; optimize paths |
| Logo / footer wordmark | SVG | Transparent | Own identity; decorative duplicate hidden from AT |
| Fonts | WOFF2 variable font where appropriate | Required weights/languages only | Licensed source; subset responsibly; reserve typographic metrics |
| QR | SVG generated from final URL | Opaque high-contrast quiet zone | Verify with real phone; URL alternative; no fake destination |
| Opening GLB (selected approach) | GLB + optional compressed texture assets; maps generally ≤2K, screen around 1K initially | Model materials define transparency | Author clean UVs/normals; cap geometry/material count; mobile fallback poster |

Photography and generated environmental imagery need reproducible camera/light/crop notes. AI-generated imagery can help concept exploration, but precise device geometry, readable UI, and consistent sequential views should come from controlled renders or photography. Do not generate each sequence frame independently.

Asset manifest fields: identifier, role, desktop/mobile source, dimensions, aspect ratio, focal anchor, alpha mode, poster/fallback, byte size, decoded estimate, loading priority, ownership/license, and source master. An implementation agent must not invent missing assets and compensate with unrelated stock imagery without an art-direction decision.

**Phase 1 placeholders are allowed and expected where necessary.** Preserve the composition, timeline slot, occlusion role, and renderer contract. Record temporary representation, exact final asset specification, and the quality currently missing in the fidelity ledger. Asset absence never authorizes deleting the stand, replacing the expansion with a static card, or inventing a different scene. Placeholder presence does not count as finished fidelity; final realistic asset validation remains required.

## 10. Typography and layout system

Use a licensed typeface matching the reference’s visual characteristics and scale contrast during Phase 1: light/regular geometric sans display, oversized editorial statements, compact labels, and readable body copy. Public DOM/styles inspection identifies **Outfit**, including a weight-300 face. Acquire any chosen font from a separately licensed source; this finding is not permission to reuse reference-delivered font assets. Do not substitute a new serif/editorial identity that changes its composition before the baseline is established.

Proposed token ranges:

```css
/* Illustrative tokens; verify with final font and content. */
--type-display: clamp(3rem, 1.1rem + 7vw, 9.5rem);
--type-editorial: clamp(2.4rem, 1rem + 5.5vw, 7rem);
--type-section: clamp(2rem, 1rem + 3vw, 4.5rem);
--type-body: clamp(1rem, 0.95rem + 0.2vw, 1.2rem);
--page-gutter: clamp(1.25rem, 3.5vw, 4.5rem);
--content-max: 96rem;
```

Display line-height starts around 0.95–1.05 and letter-spacing around −0.02em to −0.04em, adjusted for the font. Body line-height starts around 1.5–1.65, max width 55–70 characters. Avoid excessively light body weights. Use a consistent grid and explicit composition anchors rather than absolute-positioning every paragraph.

Use rem-based bounds with viewport interpolation; test zoom rather than assuming fluid type guarantees accessibility. `clamp()` supplies bounded responsive values. [MDN clamp](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/clamp)

Art-direct hero line breaks for each layout without making words inaccessible. Use `text-wrap: balance` progressively for headings, but not as a substitute for testing actual copy/localization. Reserve room for accents/descenders in reveal clips. Resplit lines after font loading and meaningful width changes, not on every scroll event.

Oversized type can extend outside a decorative scene boundary, but meaningful copy must remain readable at 320 px, landscape phone, and zoom. Dimmed words are a visual hierarchy device only if contrast remains acceptable for actual content; decorative duplicate text can be lower contrast. Do not reproduce the reference’s low-contrast text indiscriminately.

Fonts must load through `next/font` with a restrained weight set. Font metrics affect anchors and wrapping, so coordinate the first scene measurement with font readiness without blocking initial readable HTML. [Next.js font documentation](https://nextjs.org/docs/app/api-reference/components/font)

## 11. Background and lighting system

### Persistent atmosphere

`GlobalBackground` is decorative and fixed behind the page. It contains:

1. opaque near-black base;
2. two or at most three soft glow planes;
3. optional vignette;
4. tiny static grain texture.

Use a restrained scene palette, for example cool-dark opening → lower-intensity neutral desk → dark photographic interval → left-side evidence glow → quiet editorial darkness → broad final illumination. These describe our lighting journey, not required brand colors.

```ts
type AtmospherePose = {
  base: string;
  glowA: { x: number; y: number; scale: number; opacity: number };
  glowB: { x: number; y: number; scale: number; opacity: number };
  paletteMix: number;
  vignette: number;
  grainOpacity: number;
};
// Keyframes are attached to scene labels, not arbitrary page offsets.
```

Move and scale glow planes using transforms; fade them using opacity. Prefer crossfading two prepared palettes over continuously interpolating many gradient stops. Keep broad blur fixed or baked. Large blurs and animated backdrop-filter should be exceptions verified by profiling. A small navigation glass surface is a different cost from a full-screen blurred layer.

The atmosphere controller is the sole writer. Chapter-local progress maps to atmosphere keyframes; ordinary sections contribute their own measured transition intervals. At every scroll position there is a deterministic resolved pose. Reverse scrolling, fast skips, and initial restoration must yield the same atmosphere.

Use overlap to evolve the light before a new scene arrives. An environment photograph may own local lighting while the global base remains continuous. Do not apply the same purple glow to every media asset; variation in darkness and direction supplies pacing.

**WebGL is not required.** Use a shader only if a demonstrated dynamic effect cannot be achieved convincingly with these layers and it passes GPU budgets. Grain does not need a noise shader. Lighting transitions should support composition, not compete with text.

## 12. Layering and depth contract

Use named layers, with local stacking contexts per chapter and a top-level overlay system.

| Token | Suggested order | Scope |
|---|---:|---|
| atmosphere | 0 | Page |
| scene type | 10 | Local chapter |
| environment rear | 20 | Local chapter |
| product | 30 | Local chapter |
| content | 40 | Local chapter |
| foreground occluder | 50 | Local chapter |
| navigation | 80 | Page overlay |
| dialog scrim | 90 | Page overlay |
| dialog | 100 | Page overlay / native top layer |

The numeric values are tokens, not permission to continually raise them. Put the page content root above the atmosphere, and resolve scene tokens inside that root; local indices do not compete with page overlays. Native modal dialog top-layer behavior must be considered separately from ordinary z-index. Keep fixed navigation outside transformed/filter ancestors that can change containing blocks. Apply chapter isolation outside the device preserve-3D hierarchy.

Depth cues should agree: closer elements move more, occlude behind elements, and carry stronger detail; background type can dim/soften. Shadows must follow the product’s contact plane, not merely its screen-space y position. Large negative `translateZ` values are not a replacement for authored composition.

Parallax ratios are art-direction tools, not physical simulation. Start subtle and bound them so edges never reveal missing image area. Foreground blur is optional and static where possible. Do not make every layer drift at a different speed.

## 13. Responsive choreography

Breakpoints are composition decisions, not simply device labels. Start at `<768 px`, `768–1023 px`, `1024–1439 px`, and `≥1440 px`, then adjust around actual content collisions. Also use viewport height, orientation, pointer type, and reduced-motion preference. A short desktop window may need the simpler composition even when wide.

| Layout | Opening | Photo expansion | Editorial / interactions | Assets |
|---|---|---|---|---|
| Large desktop | Full shared chapter, about 6 VH travel, generous type/product overlap | 1.8–2.4 VH travel | Wide grid and visible card overflow | Full art-directed camera and landscape photography |
| Laptop | Same story with closer anchors; about 4.5–6 VH | About 1.5–2 VH | Reduce gaps and heading width | Medium resolution; avoid overlarge decoded surfaces |
| Tablet | Fewer rotation phases, around 3–4 VH if useful | About 1–1.5 VH or normal flow | Stacked demo or balanced columns; touch browsing | Tablet crop or mobile device pose |
| Mobile | Intro poster + 1–2 short product beats; about 1.5–2.5 VH total travel only if proven smooth; otherwise normal flow | Normal-flow photo or short expansion ≤1 VH | One-column text/media, manual demos by default, native card overflow | Portrait photo, mild device tilt, static stand composition; no full sequence by default |

Do not scale the desktop stand shot until the phone becomes too small to understand. Recompose: product larger, type fewer lines, foreground simplified, contact point recentered. Full front/back rotation can become a mild angle change plus a purposeful alternate still on mobile.

At 320 px and high zoom, use normal-flow layouts, readable headings, and wrapping controls. Respect safe areas and reserve navigation clearance. Do not rely on hover for essential functionality. Native pinch zoom and vertical touch scrolling must remain available. Test actual iOS Safari and Android Chrome; desktop emulation does not establish GPU or browser-chrome behavior.

Use GSAP matchMedia to build/revert variant timelines, not a pile of per-frame breakpoint branches. On variant changes, preserve content and avoid a sudden large scroll-position jump. Rebuild only for meaningful layout changes.

## 14. Performance budget and loading strategy

These are **initial project budgets**, not universal thresholds or promises about the reference. Final acceptance uses real target devices and the finished assets.

| Area | Initial budget / acceptance |
|---|---|
| Core Web Vitals | Field p75: LCP ≤2.5 s, INP ≤200 ms, CLS ≤0.1 |
| Critical route JS | Aim ≤250 KiB gzip including framework/application; incremental cinematic orchestration aim ≤70–100 KiB gzip; measure actual bundles |
| Initial critical media | Aim ≤1.5 MB desktop, ≤0.9 MB mobile; hero poster preferably ≤350 KB / ≤200 KB |
| Deferred opening 3D payload | Aim ≤4–6 MB combined compressed renderer/model/textures beyond critical HTML/poster; measure actual chunks and GPU memory. A baked alternative would aim ≤8–12 MB desktop; mobile omitted by default |
| Sequence working set | Aim ≤64–96 MiB desktop, ≤32–48 MiB mobile decoded frames; account separately for browser/GPU overhead |
| Frame work | Target sustained ~60 fps on supported 60 Hz hardware; 16.7 ms frame interval; scroll orchestration JS typically ≤3 ms; investigate sustained missed frames |
| Opening WebGL | Start ≤40–60 draw calls, ≤100k visible triangles, DPR cap around 1–1.5 on mobile; validate rather than treating counts as guarantees |
| Media concurrency | One cinematic canvas; generally one playing video; pause offscreen loops |
| Lifecycle | No retained render loop, listener, decoded-frame cache, or GPU resources after owned route teardown |

Core Web Vitals thresholds are externally defined; the other numbers are our proposed engineering gates. High-refresh displays have smaller frame intervals. Low-power devices may need a lower-cost composition rather than an unrealistic claim of universal 60 fps. [Core Web Vitals thresholds](https://web.dev/articles/defining-core-web-vitals-thresholds)

### Practical rules

- Animate transforms and opacity first. Measure paint/compositing for clipping, border-radius, blur, and shadows on representative assets.
- Batch reads during setup/refresh; writes during animation. No `getBoundingClientRect` loop mixed with style writes per frame.
- Use `will-change` narrowly, near active animation, and release it. Many large compositor layers increase memory; more layers are not always faster. [Layer management guidance](https://web.dev/articles/stick-to-compositor-only-properties-and-manage-layer-count)
- Critical hero media is discoverable in HTML and not delayed by renderer loading. Avoid a cinematic loading curtain hiding the LCP content. [LCP optimization](https://web.dev/articles/optimize-lcp)
- Use correctly sized responsive still images; reserve dimensions and provide accurate `sizes` for fill layouts. Next.js 16 deprecates `priority` in favor of `preload`; select one LCP loading strategy, and do not combine `preload` with `loading` or `fetchPriority`. Do not preload every scene. [Next.js Image](https://nextjs.org/docs/app/api-reference/components/image)
- Decode next-scene images ahead of entry with bounded concurrency. IntersectionObserver is suitable for coarse proximity/loading, not fine scrub progress.
- Defer heavy renderer modules and mount them only near their chapter. A dynamic import rendered immediately is not truly deferred. `ssr: false` must be inside a Client Component; it is inappropriate for the whole content page. [Next.js lazy loading](https://nextjs.org/docs/app/guides/lazy-loading)
- Do not assume video preloading is guaranteed. Use posters, `preload="none"` or `metadata` appropriately, and assign distant sources near use. `link rel="preload" as="video"` is not a reliable Chrome/Safari strategy. [Video preload guidance](https://web.dev/articles/fast-playback-with-preload)
- Use muted/playsInline for any permitted ambient autoplay, with visible pause and a still fallback. Supply tested codec alternatives; avoid simultaneous full-resolution video decoders. [Video/source guidance](https://web.dev/articles/video-and-source-tags)
- Sequence compressed bytes, decoded memory, and GPU texture memory are separate costs. Cap caches; pause work offscreen and when the document is hidden.
- WebGL texture/DPR/backbuffer costs must be measured on mobile. Start with simple lighting and shader passes; avoid full-resolution postprocessing by default.

### Verification plan

Record traces during slow forward scroll, fast flick, reverse scroll, resize, menu opening mid-chapter, and return-to-top. Inspect frame time, main-thread long tasks, paints, layer count, decoded memory, network transfer, and renderer calls. Test cold cache and slow loading. Lighthouse helps initial-load checks but does not establish cinematic scroll smoothness. Field CWV requires deployed measurement; local traces are a different evidence tier.

## 15. Accessibility and reduced motion

Treat WCAG 2.2 AA as the baseline, with an additional policy to disable nonessential interaction motion when requested. Motion-specific interaction disabling is described at AAA, but we adopt it as a product requirement. [W3C animation from interactions](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html)

### Reduced-motion composition

Detect `prefers-reduced-motion` before enabling cinematic timelines, and respond to preference changes. Replace long holds with normal-flow key compositions. Remove scrubbed rotation, parallax, blur, marquee travel, and ambient spinning. Preserve a strong hero poster, desk still, photograph, and readable story. Optional local fades should be minimal, not a loophole for widespread movement.

Default auto demos to manual, use still posters, and make return-to-top immediate. This must also be a useful explicit “reduce motion” option if we provide a site-level preference; system preference takes priority unless the user deliberately chooses otherwise.

### Content and interaction requirements

- Real headings and paragraphs remain in the DOM. Use one H1 and sensible subsequent hierarchy. Decorative canvas, glows, and duplicated text are hidden from assistive technology.
- If split visual text is decorative, provide one equivalent semantic heading; do not announce each letter. Do not duplicate entire hidden stories unnecessarily.
- Animated-out interactive content must not remain accidentally focusable. Use an explicit focus/visibility policy and `inert` where appropriate; never set `aria-hidden` on a subtree containing focus.
- Keep key actions in stable normal-flow or overlay positions. Keyboard navigation must not require guessing a scroll phase.
- Provide skip links to main content and past the cinematic journey. Anchors should land on a useful semantic heading, not an invisible mid-timeline element.
- Normal scrolling, Page Up/Down, Home/End, and browser find must work. A pin is a visual hold, not an input trap.
- Focus indicators remain visible outside clipping shells. Text contrast is tested against the brightest/darkest animated background states.
- Modal menu/QR drawer: labelled dialog, sensible initial focus, Escape close, background inert, focus restoration. Direct links remain available without QR scanning.
- Native overflow and buttons make card browsing usable. Custom dragging also needs a non-dragging pointer alternative; keyboard support alone is insufficient. [W3C dragging movements](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html)
- Tabs follow the APG pattern; arrow keys and selected/panel relationships are implemented. Prefer manual activation when media loading is nontrivial. [ARIA tabs](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/)
- Auto-advancing content pauses on focus and requires explicit user action to restart after intervention. [ARIA carousel guidance](https://www.w3.org/WAI/ARIA/apg/patterns/carousel/)
- Persistent pause controls cover moving ambient content and automated updating demonstrations. Pausing only while hovered/focused is insufficient. [W3C pause, stop, hide](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide)
- Timers, counters, and demonstrations are not continuously updated live regions. Provide a stable descriptive equivalent.

Test keyboard-only use, VoiceOver/NVDA, reduced motion, 200%/400% zoom, and forced colors where relevant. Compare the same information and available actions across static and animated modes.

## 16. SEO and Next.js production concerns

Keep product narrative, evidence, FAQ, reviews, and links server-rendered and crawlable. A canvas can decorate a device but cannot be the only source of the product message. Do not reveal essential text only after a ScrollTrigger callback creates it.

Use App Router metadata for title, description, canonical URL, social previews, and robots decisions. Metadata stays in the server layer, separate from motion components. [Next.js metadata](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)

Use accurate structured data only where applicable: for an app, consider SoftwareApplication with real available facts; use Organization or other types only when supported by actual content. Do not invent ratings, offers, or eligibility. Safely serialize JSON-LD, including escaping dangerous HTML delimiters, and validate the result. [Next.js JSON-LD](https://nextjs.org/docs/app/guides/json-ld)

Use descriptive links, alt text for informative images, decorative empty alt where appropriate, sitemap/robots as the project requires, and real URLs for navigation. Avoid client-only routing for simple links. Keep image dimensions stable and fonts restrained to protect CLS. Initial poster/HTML should satisfy the page even when WebGL or video fails.

Core Web Vitals, accessibility, SEO, and frame-rate measurements are separate acceptance checks. A successful production build proves none of the browser-specific motion behavior by itself.

## 17. Final dependency ownership

| Dependency / platform | Decision | Controls | Must not control |
|---|---|---|---|
| Next.js | Keep | SSR, routing, metadata, image/font pipeline, module splitting | Per-frame animation state |
| React | Keep | Component lifecycle, semantic composition, discrete interaction state | Per-frame scrub values via rerenders |
| TypeScript | Keep | Scene/pose/asset contracts | Art-direction decisions disguised as types |
| CSS Modules | Use for scenes | Layering, masks, transforms, responsive compositions, tokens | Competing transforms on GSAP-owned elements |
| Tailwind / @tailwindcss/postcss | Remove after active consumer migration | No responsibility in the proposed final architecture | Constraining scene CSS or surviving only for old utility classes |
| GSAP | Add when implementation starts | Timelines, coordinated entrances, interpolation, UI transitions where needed | Content fetching or React state management |
| ScrollTrigger | Register with GSAP | Chapter progress, lifecycle-aware refresh, measured triggers | Native scroll replacement |
| @gsap/react | Add with GSAP | Scoped setup/cleanup through useGSAP | Automatic cleanup of arbitrary listeners we own |
| next/image / next/font | Use selectively | Still-image sizing/loading and font delivery | Canvas frame decoder or video streaming |
| Canvas 2D | Alternative, not opening baseline | A separately justified baked-device sequence | Page text, controls, whole-site composition |
| Three.js + R3F | Recommended opening stack; validate representative render first | One actual 3D product chapter, geometry/materials/screen textures and rendering lifecycle | GSAP choreography, editorial layouts or a basic background glow |
| Motion | Omit baseline | Only separately approved complex layout/gesture UI | Same transforms/timelines as GSAP |
| Lenis | Omit baseline | Optional measured wheel interpolation | Performance repair or mandatory touch scroll interception |
| Lottie | Omit baseline | Conditional authored vector illustration | Realistic device rendering or page orchestration |
| Web Animations API | Available, no package | Small isolated imperative time-based effect | A second competing page timeline |
| SVG | Use | Logos, icons, simple masks/decor | Raster photography |

Lottie supports multiple renderer options; its useful role here would be a specific vector illustration supplied by an animator, not a reason to export the site as an animation file. [Lottie load options](https://github.com/airbnb/lottie-web/wiki/loadAnimation-options), [renderer settings](https://github.com/airbnb/lottie-web/wiki/Renderer-Settings)

The Web Animations API can handle a local programmatic animation without another dependency. Cancel owned animations on cleanup and coordinate reduced-motion behavior. Existing CSS/GSAP is usually sufficient here; using WAAPI is an option, not another required subsystem. [MDN Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API)

## 18. Proposed project structure

Organize by cinematic responsibility, not a directory of every effect imaginable. Build this hierarchy independently of the old landing structure. Existing naming conventions may be reused if they fit; they must not force adapters or retain obsolete abstractions. Include necessary migration of shared active consumers, while avoiding unrelated changes to production functionality.

```text
app/
  page.tsx                         # server composition and metadata
components/landing/
  content/                         # semantic editorial/evidence/FAQ/footer
  chapters/
    opening/OpeningChapter.tsx
    opening/opening.timeline.ts    # labels/poses; no global side effects
    opening/opening.module.css
    photography/PhotoChapter.tsx
  device/
    DeviceView.tsx                  # renderer-neutral facade
    LayeredDevice.tsx
    SequenceDevice.tsx              # only if selected
    WebGLDevice.tsx                 # only if selected; lazy client module
    device.types.ts
  atmosphere/
    GlobalBackground.tsx
    atmosphere-controller.ts
    atmosphere.module.css
  motion/
    MotionBoundary.tsx
    useChapterTimeline.ts
    useMotionPreference.ts
    primitives/                    # only primitives with real consumers
  interactions/
    FeatureDemo.tsx
    CardRail.tsx
    FloatingNavigation.tsx
    MenuDialog.tsx
    QrDialog.tsx
  config/
    story.ts                       # scene IDs, labels, travel variants
    motion.ts                      # shared timing and restraint tokens
    assets.ts                      # manifest, crops, fallbacks, loading
  styles/tokens.css
lib/animation/
  gsap-client.ts                   # client registration boundary
  interpolate-pose.ts
public/product-story/              # optimized web assets, not huge masters
docs/
  cinematic-scroll-blueprint.md
  storyboards/                     # later composition and acceptance notes
```

`DeviceView` exposes a small imperative contract: ready state, `setProgress`/`setPose`, pause/resume where meaningful, and disposal. Do not build a universal rendering framework. Keep the final selected renderer plus its static fallback, not three unused production engines.

Configuration should describe content/story semantics. Measurements such as viewport-relative anchors are resolved by the owning chapter. Runtime code should not scatter `window.innerHeight * 13.72` constants across components. Hooks are useful for lifecycle consistency, but a generic hook should not hide every chapter’s timeline behind an unreadable schema.

## 19. Implementation phases and gates

| Phase | Work | Exit criteria |
|---|---|---|
| Preflight — Architecture disposition | Recheck the repository audit and consumer graph against the ideal architecture; plan route/style migration and removal boundaries | Every relevant module/package classified; real consumers protected; no compatibility layer planned merely for obsolete landing code |
| 0 — Reference storyboard and rendering proof | Lock observed beat order and composition; map Oryvelle content into it; document placeholders; produce representative device/environment asset test | Renderer selected or its unresolved gap documented; full-turn/stand roles preserved; final asset requirements and performance gate explicit |
| 1 — Static visual system and replacement | Build the new server composition, type, spacing, posters, normal-flow story and navigation; migrate legal/support styling; remove superseded landing and Tailwind consumers | Attractive without motion; production URLs/content preserved; no old landing controller, stale imports, duplicated theme, or unused styling dependency |
| 2 — Atmosphere and depth | Fixed background, named layers, glow palette, composition anchors | No hard unintended seams; type contrast passes; no expensive global filter |
| 3 — Opening chapter foundation | One sticky stage, labelled timeline, scene measurement, cleanup/debug progress | Slow/reverse/fast scroll stable; no renderer duplication or nested pins |
| 4 — Device/environment choreography | Selected renderer, screen/reflection/shadow, stand occlusion and matching handoff | Convincing edge/back/settling; no blank loading frames; resource lifecycle verified |
| 5 — Photo chapter and releases | Expansion, crop/blur fallback, opening release, editorial entry | Continuous pacing; every hold justified; mobile composition independent |
| 6 — Editorial and evidence | Quiet entrances, audience rail, verified claims/reviews | Readable with motion disabled; no excessive reveal grammar |
| 7 — Interactive demonstrations | Tabs, pause, cards, menu/QR, nav contraction | Keyboard/pointer alternatives; automation pauses correctly; dialogs restore focus |
| 8 — Responsive / reduced motion | Mobile assets/timelines, short-height variants, static modes | 320 px and zoom checks; actual iOS/Android behavior; no empty pin spacers |
| 9 — Performance | Profile real assets, decoding, layers, video/WebGL; tune preload and cache | Agreed budgets pass on target devices; cold-load and reversal traces retained |
| 10 — Final craft and release review | Lighting continuity, reading holds, typography, transition overlap, final footer | Entire journey inspected to absolute bottom; a11y/SEO/CWV plans and deployed verification documented |

These numbered rows are engineering work packages **within Creative Phase 1 — reference baseline**, not permission for early creative divergence. Placeholders may be used throughout to preserve the complete storyboard, but validate the representative renderer early and track its remaining limitations. Accessibility and performance are designed from Phase 0, not postponed until Phases 8–9.

**Creative Phase 1 exit:** the complete reference-inspired journey works and has been reviewed across composition, scroll behavior, transition, typography, depth/layering, background/lighting, pacing, and interaction. List concrete differences without scores; unresolved placeholders are disclosed. Do not declare baseline success merely because every section exists.

**Creative Phase 2 — controlled Oryvelle adaptation:** only after baseline success, make incremental, deliberate changes to identity, copy, screens, color/lighting, imagery, environment, motifs, and individual transitions. Orb/constellation language or other major new concepts require explicit approval. For each significant change record what improved, which reference quality was lost, and how to retain that quality. Preserve the baseline comparison evidence.

At each replacement milestone, remove dead code immediately after its consumers are migrated. Final acceptance includes a dependency/asset/import audit: no legacy landing modules, unexplained runtime dependencies, duplicate animation ownership, or retained compatibility shims without an active application requirement.

## 20. Pitfalls and acceptance checklist

### Avoid

- Claiming the reference uses a library or media type without source evidence.
- A full-page master timeline coupled to every paragraph and footer offset.
- Independent child ScrollTriggers fighting a scrubbed parent timeline.
- Sticky plus pin plus extra manual spacer on the same stage.
- Flat image rotation pretending to reveal unprovided geometry.
- Mismatched perspective/light between device and stand assets.
- Two copies of the product overlapping in a visible crossfade.
- Per-frame React state, repeated layout reads, or refresh loops.
- Full-screen animated blur, unlimited `will-change`, unbounded sequence decoding.
- Assuming muted video can reliably scrub backward frame-by-frame.
- Smooth scrolling used to conceal frame drops.
- Decorative low-contrast type reused for actual body content.
- Desktop rotations scaled down until mobile content becomes illegible.
- Hidden SSR copy, focusable invisible panels, or pinning that traps input.
- Timers/marquees with no persistent pause.
- Replaying entrances on every small backward scroll without a storytelling reason.
- Calling Lighthouse/build success proof of the complete interactive experience.

### Required full-journey checks

Inspect from initial hero to the actual final footer wordmark/end. Pause in every cinematic phase; scroll a little backward and forward; flick across multiple scenes; restore the page mid-chapter; rotate the viewport; open/close navigation while a scene is active. Confirm stage release, atmosphere continuity, readable hold time, keyboard focus, direct links, pause state, and renderer fallback. Inspect reduced-motion and no-JS presentations separately.

A development-only overlay should expose chapter ID, local 0–1 progress, active labels, renderer readiness, and mode. Remove it from production. Save screenshots of key poses and profiling traces as acceptance evidence rather than relying on memory.

## 21. Unresolved decisions — implementation agent must resolve deliberately

1. **Content and assets:** map real Oryvelle features, copy, screens, and Google Play action into the fixed reference storyboard. Verify claims; do not invent statistics/reviews. Missing assets use documented placeholders without removing scene roles.
2. **Full-turn renderer proof:** the selected opening stack is one Three.js/R3F canvas. Validate model/material quality, independent screens, second turn/landscape, stand contact and budgets before the full timeline. Only measured failure justifies reconsidering a baked sequence; temporary limitations belong in the fidelity ledger.
3. **Camera and environment:** preserve landscape device settling, stand/foreground occlusion, depth, and dark release. Determine own/placeholder assets and matching camera/light. A substantially different environmental concept belongs to controlled adaptation later.
4. **Target hardware/browser floor:** agree the weakest supported devices and the fallback policy before accepting GPU/sequence budgets.
5. **Font and identity:** choose licensed typography, palette, and visual accents. Outfit is identified in the reference DOM/styles; our font sourcing, weights and metric match still need validation.
6. **Motion preference UI:** decide whether to expose an explicit persistent site-level control in addition to system reduced motion; ambient content still needs pause controls.
7. **Navigation/QR:** choose actual actions and destinations. A QR drawer is optional; mobile visitors need direct actions.
8. **Smooth scroll:** native is approved baseline; any Lenis adoption requires a specific demonstrated benefit and regression checks.
9. **Video/sequence encoding:** test actual files and decoding. Format choice cannot be finalized from generic compression claims.
10. **Analytics and deployment:** define consent, field CWV collection, hosting/CDN caching, and release evidence separately from the animation implementation.

Do not let unresolved content decisions turn into speculative dependencies. Preserve the approved architecture and record any later deviations with their concrete quality/performance reason.

## 22. Research register

Context7 was used to resolve and query `/vercel/next.js`, `/websites/gsap_v3`, and `/pmndrs/react-three-fiber` for server/client boundaries, media/font concerns, timeline/pin/scrub behavior, responsive cleanup, and renderer scheduling. Current official documentation was also checked, including the correction from older `ScrollTrigger.matchMedia` examples to `gsap.matchMedia`.

Sources linked next to relevant claims are primary documentation. The main references are:

- [Flowty — visual reference](https://flowty.co/): live desktop observations; underlying technology unverified.
- [GSAP ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/), [React lifecycle](https://gsap.com/resources/React/), [matchMedia](https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/), [timeline mistakes](https://gsap.com/resources/st-mistakes/).
- [Next.js server/client model](https://nextjs.org/docs/app/getting-started/server-and-client-components), [Image](https://nextjs.org/docs/app/api-reference/components/image), [font](https://nextjs.org/docs/app/api-reference/components/font), [lazy loading](https://nextjs.org/docs/app/guides/lazy-loading), [metadata](https://nextjs.org/docs/app/api-reference/functions/generate-metadata), [JSON-LD](https://nextjs.org/docs/app/guides/json-ld).
- [R3F performance](https://r3f.docs.pmnd.rs/advanced/scaling-performance), [Three GLTFLoader](https://threejs.org/docs/pages/GLTFLoader.html), [Three cleanup](https://threejs.org/manual/pages/cleanup.html), [WebGL practices](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices).
- [Motion scroll](https://motion.dev/docs/react-use-scroll), [Lenis](https://github.com/darkroomengineering/lenis), [Lottie renderer settings](https://github.com/airbnb/lottie-web/wiki/Renderer-Settings).
- [MDN transform-style](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/transform-style), [scroll timeline availability](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/animation-timeline), [fluid values](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/clamp).
- [web.dev animation guidance](https://web.dev/articles/animations-guide), [layer costs](https://web.dev/articles/stick-to-compositor-only-properties-and-manage-layer-count), [LCP](https://web.dev/articles/optimize-lcp), [CWV thresholds](https://web.dev/articles/defining-core-web-vitals-thresholds), [video preload](https://web.dev/articles/fast-playback-with-preload).
- [W3C pause controls](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide), [interaction motion](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html), [drag alternatives](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html), [ARIA tabs](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/), [ARIA carousel](https://www.w3.org/WAI/ARIA/apg/patterns/carousel/).

Recheck compatibility and documentation when implementation begins. Observations establish behavior; the architecture is our production recommendation; proposed timings and budgets require validation with our own content and hardware.
