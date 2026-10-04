# Gate 04R — Section 01 → 02 transition and art direction reset

**Status: creative proposal only; awaiting review.** Observed 4 October 2026 in Brave. No website or Android implementation was changed. Gate 04B remains unimplemented. The current constellation composition is rejected; its code remains intact pending approval of its replacement.

**Recommendation: Direction 1 — The light stays.** Let the supported phone and stand leave together after the approved settlement. A residual lavender light trace stays behind, curves into an accretion ring, and reveals the dark Oryvelle orb. Only then introduce “Your night. Your mix.” and the two real sound layers. End by calming the scene around a small timer annotation.

This is an editorial transition from hardware into the app’s sound environment. It does not depict a literal Android interaction, physical sound emission, or an app feature that morphs the phone into an orb.

## Scope and evidence

Frozen: everything before and including the approved stand settlement/hold, phone poses and materials, camera, scales, screens, float, loader, hero/return/desk typography, supporting UI and stand geometry. The post-settlement release boundary is the sole proposed integration seam.

Evidence tiers used here:

- **Observed:** live visual changes while scrolling in Brave; saved captures below.
- **Implementation evidence:** our repository’s layout/timeline/pose definitions, read without edits.
- **Interpretation:** why a reference transition works compositionally.
- **Proposal:** all new phases, copy placement, scroll lengths and visual bridges. These have not been implemented or browser-validated.

Live Oryvelle inspection used the actual wide viewport measured at **2560×1273**. Flowty inspection measured **1440×900**. A viewport override was requested but did not consistently apply to already claimed tabs; measured dimensions take precedence over requested ones. This gate does not claim a newly validated mobile transition. Mobile behavior below is a design proposal.

A code/asset hash inventory was taken before the research deliverables were written, covering 32 files in `app/new`, `components` and `public/mix`. Those files remain byte-identical. Existing dirty work on `feat/flowty-fidelity-redesign` was preserved.

## Reference research — principles, not visual templates

### Caeli Energie — persistent product, changing context

Live: [Caeli Energie](https://www.caeli-energie.com/). Recognition: [Awwwards SOTD, 21 September 2025](https://www.awwwards.com/sites/caeli-energie). The award page also identifies on-scroll product presentation/features and title animation as highlights.

**Directly observed:** a large pale physical product starts against oversized green type. Scrolling reduces its dominance while it remains the recognizable center of the composition. A room assembles around it: console, plants, shelf, shadows, restrained pale curved airflow lines. Subsequently a pale panel expands over the room, preserving the same product as the visual anchor while oversized product typography establishes the next information state. The environment changes before attention is handed to a different topic.

**Interpretation:** continuity comes from an identifiable subject retaining its relationship to the viewer while the meaning of its surroundings changes. Shadow and set dressing establish physical depth without requiring every element to perform a spectacular animation. Copy does not need to lead every state.

**Extract for Oryvelle:** preserve one visual property before replacing the object. Establish an environment through sparse light/depth cues. Reveal the function after the object has earned attention. Do not adopt the cream room, plants, airflow visualization, product panel or bright palette.

An undismissed consent notice occupied the lower-left of the reference during this inspection; it did not prevent observing the central sequence. No inference about hidden areas is made.

### Aramco — The Birth of Oil — a thread through a world

Live: [The Birth of Oil](https://www.aramco.com/en/about-us/our-history/the-birth-of-oil). Recognition: [Awwwards SOTD, 27 May 2025](https://www.awwwards.com/sites/aramco-the-birth-of-oil).

**Directly observed:** the opening title sits over a pale textured material field intersected by a thin luminous line. After Start, that material resolves into large globe geometry. The line becomes several curved paths converging toward a small bright focal point. The globe moves through the viewport while the paths keep a readable direction. Editorial text is staged alongside the world rather than in a separate rectangle below it. The first globe/world transition and its outgoing text were inspected; this was not an exhaustive walkthrough of the full narrative.

**Interpretation:** a small visual thread can carry spatial orientation while a much larger background changes. The viewer can track a relationship before understanding the complete next object. A restrained line gives a transformation a reason.

**Extract for Oryvelle:** use one continuous trace, one bend, and one resulting ring. Delay explanatory text until the dark object can be recognized. Do not borrow the globe, planetary surface, story content, many paths, pale texture or heavy immersive architecture.

### Additional reference checked, not treated as motion evidence

[Noomo Labs](https://labs.noomoagency.com/) and its [Awwwards SOTD page, 19 June 2024](https://www.awwwards.com/sites/noomo-labs) were opened live. The live experience reached its 100% loading/press-and-hold entry. The attempted short hold did not enter the main sequence, so **no interior scroll behavior from Noomo is claimed here**. Its entry-only observation is excluded from the recommendation’s transition evidence. It is older than the two 2025 references above, and is not presented as a new award.

Search results sometimes returned outdated or ambiguous recognition dates: the opened Vooban award page was the 2020 version. It was discarded as a recent-reference candidate. Award listing dates are verified against the actual award pages, not search-card snippets.

### Shared design principles

1. Preserve a readable anchor while context changes.
2. Let the next world begin before the previous world has disappeared completely.
3. Make negative space a route for attention, not an unmotivated gap.
4. Introduce the object, then the name, then the practical information.
5. Use one dominant change per interval; avoid a pile-up of exits, light changes, text and satellites.
6. Let the endpoint reduce energy; it should offer the next chapter a resting composition.

These are design deductions from the inspected sequences, not claims that the references use our proposed renderer or choreography.

## Flowty — opening release re-observed

Live reference: [Flowty](https://flowty.co/). Opening rotations, landscape approach, supported hold and progression into the wrist chapter were re-observed. Small forward/backward increments were used around the wrist expansion.

**Direct observations:**

- The landscape phone settles into the ribbed stand, with a dark field and a purple diagonal atmosphere behind it.
- Scrolling carries the supported composition upward. It does not visibly turn into the wrist photograph.
- The last stand/copy details remain near the upper edge as the next large typography comes up from below.
- A small rounded wrist photograph appears **inside** “Flowty On Your Wrist,” giving the next chapter an object immediately instead of a heading followed by a distant illustration.
- The photograph then expands toward the viewer and overlaps/occludes the type. The text becomes blurred as the photograph takes precedence.
- The dark background persists; visual continuity is not a new rectangular color block. The small bottom-center brand/download control remains an orientation cue in the sampled transition.
- There is breathing space during the outgoing stand, but no attribution interlude that announces a finished demonstration.
- Reverse scroll reconstructs the smaller photograph/type relationship.

**Implementation evidence available in this inspection:** the DOM exposes a stand image, “Flowty On Your Wrist” heading and wrist image as separate elements. Public visual inspection supports separate layers. It does not establish whether every crop/blur/position is owned by one timeline or which exact authored values are used. No proprietary code, model, asset or coordinate was copied.

**Interpretation:** Flowty uses continuity of darkness, scroll direction, type scale and a product/ecosystem narrative. It does **not** prove that its purple beam morphs into the next image or that the same physical object persists across that boundary. Oryvelle can use the pacing principle while building a more explicit light bridge to its own signature orb.

## Our current discontinuity — exact diagnosis

### What the live sequence already gives us

The full opening was reviewed through hero/first turn/rear/returning screen/second transformation/stand approach/settlement/release. The large physical device remains dominant; the return composition places pale copy left and the phone right. During the second turn the phone becomes diagonal, the stand rises, and the final supported screen is nearly level/front-facing in landscape.

The settled composition contains:

| Property | Observed inheritance opportunity |
| --- | --- |
| Dominant shape | Wide dark rounded phone rectangle over a narrower ribbed stand |
| Screen | Muted violet/near-black plane; pale `30:00` is the strongest internal text |
| Stand | Ribbed rounded backing; two small front supports; tapered stem; shallow curved base |
| Light | Soft lavender diagonal beam from lower-left toward upper-right; subdued violet desk glow |
| Palette | Near-black body/space, pale lavender typography, low-saturation purple illumination |
| Depth | Phone in front of backing, support tabs in front of phone; shadows/gradient around base |
| Type | Oversized “Rest comes / into focus.” at upper-left; quiet support paragraph lower-left |
| Space | Right/lower-right atmosphere and dark area beneath the device; left space becomes free after copy exits |
| Motion | Previous diagonal physical turn resolves into horizontal stability; subsequent document motion goes upward as visitor scrolls down |

The supported phone is physically stable. A future bridge must move **phone + backing + supports + stem/base together**; the phone must not lift or float away from its support to create a transition.

### Where continuity is lost

Source evidence in `opening.module.css`, `opening.timeline.ts` and `opening-poses.ts`:

- Opening chapter: `660svh`; stage: `100svh` sticky. Authored progress uses chapter height minus stage height, equivalent to approximately **560svh** travel.
- Supported pose is reached at `.91`; pose remains unchanged through `1`. Ambient float already attenuates at contact.
- Once the sticky stage releases, its phone, environment, copy, glow and bottom anchor all travel upward with the document.
- A separate `.boundary` occupies **75svh**, background `#09090b`, with attribution at its bottom.
- Section 02 then starts with its own `#08050e` field, **110px** top padding, a centered eyebrow/heading/supporting sentence, and a separate spatial field below. Its orb is much farther down the stage, after the constellation.

**The first loss is immediately after progress 1:** the atmosphere belongs to the outgoing stage and disappears with it. **The interruption becomes unmistakable when the empty attribution boundary dominates the viewport.** The next heading then explains a new topic before the new signature object is visible.

At the sampled wide viewport, one release frame measured opening bottom at about **700px** while the next section top was about **1,655px**: the difference is the **955px / 75svh boundary** at the actual 1273px viewport height. This is source-and-DOM corroboration, not a guessed animation timing.

Matching two dark background colors alone cannot fix this. The viewer needs a surviving focal trace and a coordinated object/text handoff.

### Evidence captures

[Approved settled composition](captures/gate-04r/oryvelle-settled.jpg) · [outgoing stage](captures/gate-04r/oryvelle-release.jpg) · [gap and new heading](captures/gate-04r/oryvelle-gap.jpg).

![Current outgoing stage and lost atmosphere](/Users/yami/Documents/Next/noxelle/docs/captures/gate-04r/oryvelle-release.jpg)

The attribution is required provenance, not disposable clutter. A future replacement should preserve its content/license link in a compact accessible credit treatment without reserving 75svh of story interruption. Its final placement requires approval; no credit was moved or deleted in this gate.

## Exactly three concepts

Scroll estimates below mean **travel after the existing opening reaches progress 1**, through the Section 02 timer endpoint. They are design budgets, not implementation offsets or locked timings. No preceding opening distance is included or retuned.

### Direction 1 — The light stays — recommended

**Idea:** the hardware leaves, but the atmosphere it established stays and becomes the material that defines the orb.

- **Last Section 01 frame:** exact approved supported phone/stand/desk copy. No new light is visible before the release boundary.
- **Mechanism:** after the hold, the hardware and copy continue upward as a supported unit. A faint trace gathers in the existing lavender light corridor underneath the leaving composition. The trace stays at a stable lower/right screen position, softens its diagonal, bends into a shallow elliptical arc, and becomes the orb’s front/rear accretion light.
- **Surviving property:** lavender color, light direction and the viewer’s focal trajectory. The current diffuse beam contains no literal ring; bending it into a trace is new editorial art, not a claim about existing geometry.
- **First recognizable Section 02 frame:** a thin flattened ring defining almost-black depth. No header row, section-number label, map or feature panel.
- **Orb entrance:** center becomes perceptible through ring occlusion and a soft horizon edge. The same trace must remain trackable throughout the change. Do not crossfade a finished orb on top of a disappearing finished phone.
- **Typography:** after the ring is readable, “Your night.” appears in left negative space; “Your mix.” follows as the first satellite gathers. No letter effects or copying the old centered layout.
- **Sounds:** Calming Rain and Brown Noise enter as actual circular covers from different oblique paths. Both become readable near the orb. Their names precede level annotations. Neither appears as a star, map point or a selection control.
- **Mix:** two quiet `50%` annotations and one sentence, “Balance each layer.” Numeric levels represent an example, not default product settings. Orbit radius remains a composition choice, not a functional encoding of volume.
- **Timer:** `30 min · Fade out` arrives as ring brightness and ambient satellite drift settle. The visual sequence illustrates a configured timer, not thirty minutes elapsing. No countdown, sleep-detection claim or autoplay audio.
- **Length:** **240–300svh** total travel; roughly 70–100svh for boundary-to-orb, remaining travel for two layers and one settling transformation. One continuous sticky interval if needed, no repeated pin/unpin. These eight storyboard checkpoints are continuous states, not eight separate sections.
- **Desktop:** orb resolves center-right, leaving type left; one large ring system, generous upper darkness. Short desktop places type higher and annotations closer to satellites, without moving the approved opening.
- **Mobile:** supported scene exits upward; a shallow arc occupies lower center and leads directly into a large normal-flow orb. Copy follows orb recognition, then sound layers and timer in one column. Short localized reveal or normal-flow overlap; no long desktop pin shrunk onto mobile.
- **Reduced motion:** contiguous static stand endpoint → matched quiet ring/orb composition with complete copy, avatars and timer. No large displacement or accretion travel required to understand the content.
- **Feasibility:** separate opening R3F and existing Canvas 2D orb; a boundary-only staging layer; draw the surviving trace through the orb renderer’s first pass or a precisely coordinated light layer. No second WebGL scene needed.
- **Performance:** temporary overlap of the existing phone canvas and the orb canvas. Phone already settled can remain demand rendered; orb draws only while visible. Avoid large changing blur radii/fullscreen filters. Existing measurements do not establish performance of this future overlap.
- **Primary risk:** if the diagonal beam merely disappears and an ellipse appears elsewhere, it reads as a dissolve. The trace must retain a visible position/direction relationship. Keep it quiet enough not to become a portal.

### Direction 2 — The screen becomes the room

**Idea:** transition from the luminous plane of the supported display into the sound environment it represents.

- **Last Section 01 frame:** exact supported phone with its existing landscape timer screen.
- **Mechanism:** hardware exits upward as one unit. Its violet screen light is echoed by a soft, initially rectangular light field **behind** the display. That residual plane expands downward/forward after the hardware clears; it loses rectangular edges, revealing an almost-black circular region and a lateral ring highlight.
- **Surviving property:** screen luminance/color and horizontal aspect. No new content or altered approved screen texture.
- **First Section 02 frame:** close dark-violet light field with a lateral highlight, not a screenshot enlarging or another phone.
- **Orb entrance:** the dark region gains horizon/ring occlusion as the screen-light field recedes into atmosphere. A planar-to-circular transformation gives a perceived move from interface into experience.
- **Typography:** “Make room / for your night.” appears only after the light plane releases its rectangular shape; “Your mix.” becomes the later functional phrase. Representative copy, not final approved marketing text.
- **Sounds:** real avatars enter from the lateral edges of the light field, then settle diagonally around the orb; low-saturation teal appears with Rain.
- **Timer:** small `30 min · Fade out` echoes the opening timer as the scene closes, while all major illumination becomes quieter.
- **Length:** **220–280svh** travel; one expanding light transition and one mix/settlement sequence.
- **Desktop:** expansive planar light across middle-right; text gets left space after desk copy departs. Never enlarge the phone or change its camera to fake a push-in.
- **Mobile:** smaller residual light strip at screen departure; one soft widening into the orb composition, then normal-flow text/layers/timer.
- **Reduced motion:** share the violet light palette between adjacent static supported phone and orb frames; no expansion required.
- **Feasibility:** a DOM/CSS/SVG residual field plus Canvas orb, aligned after settlement only. Screen-space alignment to the tilted/glass-bounded display must be verified; this is not a screen overlay attached through the full turn.
- **Performance:** no screen readback, Canvas capture, new video, texture changes or second WebGL. A huge soft plane could cause excessive raster fill, so transform a modest prepainted light layer rather than animating fullscreen blur.
- **Primary risk:** a rectangular field can resemble an enlarged fake screenshot or a second UI showcase; it may also suggest the app actually has an immersive mode. Projection alignment is harder than the light-trace direction, especially across aspect ratios.

### Direction 3 — Into the quiet shadow

**Idea:** descend visually toward the shadow around the stand base; that shadow becomes the orb’s dominant black center.

- **Last Section 01 frame:** approved stand geometry with its curved dark base and surrounding desk glow.
- **Mechanism:** after the hold, the stand/phone rise together. The dark shadow below the base broadens and becomes the new focal area. A fine crescent on its near edge stays readable; the receding hardware is occluded by the growing dark region rather than simply fading. The crescent resolves into the flattened orb ring.
- **Surviving property:** curved base/shadow silhouette, darkness and a small rim highlight. The current base is a shallow arch, not an existing full ellipse; new shadow geometry would be editorial.
- **First Section 02 frame:** a dark mass revealed by one low lateral rim, with no world map or centered header.
- **Orb entrance:** back ring appears behind the dark center, front ring follows the shadow’s near edge. The orb feels discovered within darkness rather than arriving as an image.
- **Typography:** “A little quieter.” first occupies upper-left; “Your night. Your mix.” becomes the practical phrase when avatars arrive. Avoid three successive oversized headlines.
- **Sounds:** actual covers emerge from opposite sides of the dark region, remain small, then names and minimal example levels establish that this is a mix.
- **Timer:** the shadow/ring settles nearly motionless with `30 min · Fade out` at its lower edge; faint lavender remains as the next chapter’s possible starting value.
- **Length:** **200–260svh** travel; strongest boundary action is around 50–80svh.
- **Desktop:** focus travels downward toward base, then the dark object recenters slightly right. Do not move or tilt the approved camera before the boundary.
- **Mobile:** shallow base-shadow shape carries downward into a full-width orb; no dramatic zoom or long pin.
- **Reduced motion:** contiguous static base-shadow and orb states with stable rim; no fullscreen dark wipe.
- **Feasibility:** SVG/CSS mask plus Canvas layers; conditional projection alignment to the supported unit. No real camera descent or shader required.
- **Performance:** simple dark shape and clipped rim are inexpensive candidates, but large animated masks may rerasterize. Need measurement, not an assumption that all clipping is free.
- **Primary risk:** dark-on-dark can become an empty loading-like interval. Excessive shadow expansion can feel like a portal swallowing the hardware, and it trades Oryvelle’s luminous-ring identity for a less immediate black wipe.

## Recommendation and decision criteria

| Criterion | The light stays | Screen becomes room | Quiet shadow |
| --- | --- | --- | --- |
| Continuity with actual endpoint | Strong: existing lavender corridor | Strong color/plane relationship | Strong base/shadow relationship |
| Oryvelle signature | Ring/light creates dark mix object | Interior experience, less immediately signature | Dark center first; ring later |
| Comprehension | Easy to follow a trace into a ring | Plane-to-world needs careful staging | Dark reveal risks ambiguity |
| Restraint | One bend, one ring, two sound layers | Large plane can dominate | Very restrained but easily too empty |
| Responsive viability | Trace can compress without precise screen alignment | Sensitive to screen projection | Sensitive to base projection/contrast |
| Technical risk | Moderate continuity drawing | Highest alignment/fake-screen risk | Moderate masking/legibility risk |

**Choose The light stays.** It is distinctive because the light that established the physical scene becomes the material of Oryvelle’s own visual object. The sound layers then explain what that object means. It does not depend on a proprietary reference transition or a new GPU architecture. It has a readable small-screen version, and the final dimmed ring can provide a calm seam for a later chapter without designing Section 03 now.

This recommendation is not based solely on ease. Screen-light continuity has a potentially compelling sense of entering the product, but the current screen is a timer: overemphasizing that plane would repeat the timer and postpone the mix. Shadow continuity is elegant but less legible in our already near-black environment.

## Recommended eight-frame storyboard

![The light stays — eight proposed viewport states](/Users/yami/Documents/Next/noxelle/docs/captures/gate-04r/recommended-storyboard.png)

This is a deliberately simplified annotated drawing, **not an implemented website capture or a final artwork mockup**. Avatar circles stand for the existing real sound covers. Frames communicate composition/continuity; drawn phone geometry is schematic. Percentages refer to the proposed new travel after opening progress 1.

| Frame / phase | Viewport composition and narrative change |
| --- | --- |
| 1 / 0% | Approved stand/phone/copy intact; diagonal lavender light remains exactly as approved. No new title. |
| 2 / 0–15% | Supported assembly/copy exit upward together. A low, faint light trace persists below that path; hardware still visible while the bridge is established. |
| 3 / 15–28% | Hardware clears. Trace bends toward a shallow ellipse at center-right; diffuse diagonal reduces. No full orb or headline yet. There is always a visible trace. |
| 4 / 28–42% | Near-black center becomes legible inside the ring. Rear/front occlusion and horizon edge identify the orb. No satellites yet. |
| 5 / 42–55% | “Your night.” appears at left in the newly available space. Orb remains dominant. “Your mix.” joins as the next state begins. |
| 6 / 55–70% | Rain enters from upper-right, Brown Noise from lower-left, on distinct shallow arcs. Names appear near their actual covers. No linked map/path network. |
| 7 / 70–85% | Both layers settle. Small `50%` annotations and “Balance each layer.” communicate independently adjustable volume. Orb/light changes are subtle, not audio-reactive claims. |
| 8 / 85–100% | Illumination and satellite drift soften, tiny `30 min · Fade out` settles near the lower ring. Copy quiets; lower edge remains dark and unobstructed for eventual continuation. |

The eight drawings are checkpoints within **one memorable transition and one meaningful mix-to-rest transformation**. They should not become eight hold durations or a long scroll marathon.

### Typography choreography

- Inherit the existing opening font and pale-lavender language; do not introduce a new display family.
- Remove the proposed section-number eyebrow and centered header from the new visual direction.
- Let the last desk copy travel with its outgoing scene; do not animate it before settlement.
- Leave a short object-only interval while the trace forms a recognizable ring.
- Use left-aligned editorial two-line “Your night. / Your mix.” beside the right-shifted orb. Scale should remain subordinate to the opening’s hardware spectacle.
- Reveal by restrained clipping/translation/opacity, one line at a time. No word scramble, individual character motion or glowing text.
- Function arrives later as a short sentence and small annotations, not a long supporting paragraph from frame one.
- For narrow screens, place type above/below the orb in a deliberate vertical sequence after the visual establishes itself; do not force a desktop split layout.

### Orb art direction reset

Retain the renderer for evaluation, not its current full composition. The new object should be defined mostly by **flattened accretion light**, a soft near-black horizon and rear/front ring occlusion. Faint round lensing contours must not become a visible cage enclosing a ball. The dark center stays dominant; no new star field is required.

During the bridge, ring formation must be exposed continuously. The existing `drawMixOrb(context, width, height, elapsed)` draws a finished object and does not yet expose a formation contract. A later prototype may add controlled draw parameters such as ring curvature/extent, core occlusion and illumination. That change must preserve the reusable drawing passes and lifecycle. It is not already implemented.

The orb should generate the environment: restrained lavender where the original beam ends, a small teal contribution when Rain joins, and darkness everywhere else. No full-screen nebula, mountains, giant planet, dense speckles or glowing sphere.

### Satellites and mix truth

Use only the retained real Calming Rain and Brown Noise covers. They appear directly as sound layers. Distinct shallow trajectories and different slow ambient phases prevent mechanical synchronization. Names are sufficient initially; example levels arrive later. Keep annotations separate from ring geometry and readable at short heights.

No dragging, selection, mute, playback, equalizer or slider is proposed. Neither radius nor glow is presented as an actual audio measurement. A subtle light response is editorial narration, not a claim of live analysis. Native text remains available independent of Canvas.

### Timer endpoint

`30 min · Fade out` expresses an inspected supported configuration. No countdown to zero, elapsed-time claim, medical promise or sleep-stage behavior. Do not turn this into a second large timer demo after the landscape screen. Let illumination and movement settle while the small status appears; a configured endpoint supplies closure.

Preserve some low ring light at the final frame so a later chapter has a visual starting point. No Section 03 design is selected by this report.

## Mobile, reduced motion and failure interpretation

**Mobile:** one vertical journey, not a miniaturized desktop viewport. The post-stand residual arc spans the useful width; a large black-centered orb follows immediately, with text staged nearby in normal flow. Two sound covers/labels can gather sequentially at readable sizes. Levels and timer remain integrated into the object’s footprint. Prefer no long mobile pin and no repeated sideways or rotational travel.

**Tablet/short desktop:** reduce peripheral simultaneous annotations; retain the trace, orb, two covers and concise title. The transition must be designed against the actual endpoint at each responsive composition rather than aligning to desktop pixels.

**Reduced motion:** show adjacent static states with matched darkness and a shared arc/ring. Present the complete factual mix/timer content without requiring scroll movement to reveal it. Keep Canvas ambient motion off. No mask rush, zoom, or satellites travelling across the viewport.

**WebGL fallback:** begin the bridge after the static opening/fallback representation’s endpoint, not only after a successful 3D lifecycle. No duplicated phone is needed. If Canvas is unavailable, a restrained static ring/core plus semantic labels/timer can communicate the same story. Existing loading/fallback contracts stay intact.

These are proposed interpretations, not new validation results.

## Technical feasibility after visual selection

The visual concept comes first. Existing capabilities are sufficient candidates: opening R3F, Canvas 2D orb, GSAP/ScrollTrigger, DOM typography and genuine sound covers. Do not merge canvases, add a WebGL orb, add postprocessing or install a smooth-scrolling library.

Ownership proposal:

| Concern | Future owner / boundary |
| --- | --- |
| Existing opening progress 0–1 | Existing opening timeline/pose controller, unchanged |
| Phone physical geometry/materials/pose | Existing R3F model, unchanged |
| Post-settlement assembly departure | New boundary-only outer staging transform; moves supported unit as a whole |
| Surviving trace → ring → mix → timer | One new downstream chapter timeline; one normalized local progress |
| Orb drawing | Canvas renderer reads pose/formation parameters; ambient time remains local |
| Satellite ambient drift | Small additive child offsets, attenuated at timer; no competing writers |
| Readiness/fallback | Existing opening contract plus local orb first-paint/fallback readiness |
| Semantic copy/status | HTML, available without Canvas |

**Important source constraint:** extending `.chapter` height currently changes `chapter.offsetHeight - stage.offsetHeight`, so casually increasing `660svh` would stretch the approved opening. A future boundary prototype must explicitly preserve the authored **560svh** travel and the existing 0–1 mapping. Possible staging is an additive outer shell with separate post-settlement travel, while the original timeline ends at the original coordinate. It may require a narrow layout integration refactor; that is reviewable boundary work, not permission to retune earlier keyframes.

The opening stage uses `overflow:hidden` and `isolation:isolate`. A downstream trace cannot simply be placed inside it and expected to survive its release. Plan a boundary-scoped overlap layer outside that clipping context, or preserve the stage in an additive release shell. Avoid a route-wide global background/store solely for this one handoff.

Do not let both timelines write the original product transform or atmosphere values. Inherit the settled color/visual endpoint, then animate new boundary-owned layers/outer wrapper. The supported unit’s material/camera does not change. The new chapter owns the continued trace once visible; there must not be two nearly aligned ellipses crossfading with a visible seam.

Context7 skill consulted `/websites/gsap_v3` for current lifecycle guidance. [gsap.context](https://gsap.com/docs/v3/GSAP/gsap.context/) tracks animations/triggers for revert; [gsap.matchMedia](https://gsap.com/docs/v3/GSAP/gsap.matchMedia/) reverts responsive branches; [ScrollTrigger.refresh](https://gsap.com/docs/v3/Plugins/ScrollTrigger/refresh/) recalculates downstream measurements after layout changes. Use these capabilities only where needed in the later prototype. No per-frame refresh or React state progress is proposed. Documentation supports lifecycle feasibility; it does not prescribe this creative sequence.

### Performance expectations and unknowns

- Existing phone remains one model/canvas; after settlement, outer DOM movement can carry it without changing its physical pose.
- Existing orb is one 2D canvas with DPR cap, visibility/reduced-motion lifecycle and a drawing-rate cap. Preserve those protections.
- Keep the dual-renderer overlap brief and avoid running orb ambient while it is entirely covered.
- Keep a bounded light region rather than animating a giant blur every frame; preserve dark negative space.
- Repaint Canvas only when its formation/ambient state changes while visible. No second ambient scheduler or scroll progress owner.
- No new large raster/video transfer is required for the concept. Current covers are small and may need higher-resolution masters only if enlarged later.
- No FPS, battery, memory or mobile-GPU improvement is claimed. Formation drawing cost, compositing/mask cost and responsive overlap must be measured in the later prototype.
- The previous Canvas hidden-tab pause was implemented but not conclusively observed under automation. Keep that documented validation debt; do not assume this proposal resolves it.

## Gate 04A.1 disposition — pending approval

| Existing piece | Future disposition | Reason |
| --- | --- | --- |
| `orb-renderer.ts` drawing passes | Retain/adapt | Valuable independent ring/core/lensing drawing; needs formation control and art-direction calibration |
| `MixOrb.tsx` lifecycle | Retain selectively | Canvas readiness, visibility, reduced motion, DPR/disposal protections; satellite layout would change |
| Calming Rain / Brown Noise assets | Retain | Genuine product imagery, directly relevant |
| Factual mix/timer copy and semantics | Retain/recompose | Product truth survives the reset |
| `Constellation.tsx` | Remove from runtime after replacement approval | Constellation story explicitly rejected |
| `constellation-paths.ts` | Remove from runtime after approval | No field/map bridge in new concept |
| Converted constellation masters | Isolate/archive with provenance | No runtime use; preserve history/license evidence |
| Current `MixChapter.tsx` composition | Replace after approval | Centered header → field → orb is the hard reset being corrected |
| Current mix CSS field/layout | Replace selectively | Keep useful accessibility/responsive lessons, not rejected placements |
| Current illustration disclaimers | Reevaluate placement | Preserve truth distinction without making the experience look like a technical proof |
| Captures, product research, attribution/license | Retain | Provenance and verified product facts |
| All Section 01 rendering/content/choreography | Preserve | Approved and frozen |

No runtime files or assets were removed or isolated by editing in this gate. They remain as the rejected prototype so the technical work can be evaluated. A later approved implementation must remove obsolete consumers/styles cleanly, not leave compatibility wrappers around the constellation layout.

## Proposed next gate — boundary composition proof, not full Gate 04B

Suggested scope: **Gate 04R.1 — Light-to-orb transition composition proof**, only if Direction 1 is approved.

1. Freeze representative existing opening frames/hashes and its exact scroll mapping.
2. Establish static checkpoints for supported frame, departing assembly plus retained trace, curved trace, recognized dark orb and timer endpoint.
3. Build the smallest reversible post-settlement bridge to evaluate the trace continuity. Preserve all earlier opening poses/timing and screens.
4. Compose the orb, two real covers and integrated status at desktop/tablet/mobile sizes; do not build an entire later site.
5. Review a short continuous boundary prototype before authoring final Section 02 pacing/typography/layer choreography.
6. Validate reverse scroll, refresh/restored scroll, resize, reduced motion, both renderer fallbacks, and brief dual-canvas rendering activity.
7. After the replacement is approved, remove constellation runtime/layout cleanly while retaining research/license evidence.

Acceptance for that prototype: the eye can follow a trace from the outgoing supported scene into the ring; the orb is recognizable before the title explains it; the physical phone never detaches from its stand; no blank loading-like interval, rectangular section seam, remounted phone, screen change, or preceding choreography retune.

## Questions for creative review

- Approve the light trace as the surviving property, or prefer screen-light/shadow continuity?
- Is the proposed split composition—editorial type left, orb right—the right quieter counterpoint to the hardware opening?
- Should the final timer state merely calm the orb or make it almost still? Proposed: softly reduced motion, not a complete blackout.
- Approve replacing the 75svh credit gap with a compact accessible provenance placement during the next boundary gate? License attribution must remain available.
- The trace-to-ring legibility and current orb’s round lensing contour strength need visual judgment in a boundary proof. The technical renderer is retained, but its current appearance/layout is not treated as approved.

## Deliverables and verification

Report, live-reference/diagnosis captures and the eight-frame concept storyboard are the only new artifacts. Website/Android code and assets remain unchanged. No packages installed; no choreography authored; no Gate 04B or Section 03 started. A build/lint/test rerun is unnecessary for research-only Markdown/PNG/JPEG artifacts; byte comparison and `git diff --check` verify the unchanged implementation boundary and clean patch formatting.

**STOP for creative review.** The recommendation is a proposal, not authorization or a claim that the new transition already exists at `/new`.
