# Creative Phase 1 — Flowty fidelity baseline

Date: **3 October 2026**. Status: **planning only; baseline not implemented or evaluated**.

This is the creative companion to the [technical blueprint](./cinematic-scroll-blueprint.md) and [clean-slate audit](./cinematic-repository-audit.md). Latest user clarification governs: reproduce Flowty’s **design grammar, structural rhythm, composition, and visual behavior** closely before deliberately adapting the experience. Reproduce the result using our clean architecture, not Flowty’s code. The [public renderer investigation](./flowty-phone-renderer-investigation.md) confirms the opening’s WebGL/Spline, GSAP pin/pose timeline, independent screens and image-layered stand; it informs technique selection without changing the visual target.

## 1. Priority and boundaries

During Phase 1, choose the solution closer to the observed reference experience over a more original Oryvelle concept. Use our logo, screenshots, verified copy/features, and Google Play destination where practical, fitting them into the reference roles first. Color substitutions may be minimal; keep the lighting contrast and atmosphere relationships. Larger identity/imagery changes follow baseline review.

Do not introduce constellation navigation, portals, night-to-dawn storytelling, extensive orb transitions, new section sequencing, or a conventional landing layout to accommodate missing assets. Do not remove a difficult full turn, stand, foreground layer, expansion, or long hold without explicitly reporting the deviation and resolving it with the user.

Use original/licensed/temporary assets; do not copy Flowty’s proprietary images, renders, logo, text, or product UI. Evidence/statistic/review slots are structural roles, not authorization to reproduce claims or fabricate Oryvelle evidence.

Desktop observation is the fidelity evidence available. Exact element sizes, scroll distances, easing and source implementation were not measured; proportions below are qualitative and relative. Mobile/reference responsive behavior has not been established. Engineering starting values in the blueprint are provisional, not reference measurements.

## 2. Locked beat order

```text
01 Hero and product composition
02 Long continuous product transformation
03 Landscape product settling into stand / environment
04 Dark release and breathing interval
05 Oversized typography with inset/embedded human media
06 Dramatic expanding photograph
07 Evidence / statistic
08 Audience / use-case cards
09 Large automated/manual feature demonstration
10 Premium editorial introduction and alternating media/text rows
11 Trust / reviews
12 Oversized moving question typography
13 Ambient hands/device product demonstration
14 Open FAQ and support CTA
15 Large final CTA
16 Atmospheric footer through absolute end
```

The technical blueprint groups some beats into one scene/chapter. That grouping must not collapse their visible distinctions. Navigation/menu/QR interactions span the journey and are separate from the scene order.

## 3. Composition and behavior reference sheets

These sheets specify what makes each beat successful and what must be compared. They are not invented pixel-accurate reproductions. Capture actual reference and implementation key poses at matched viewport sizes during the later baseline review; re-observe uncertain details before claiming a match.

### 01 — Hero/product

- **Composition/focus:** enormous two-line heading across the upper composition; tilted metallic phone centered toward the right, overlapping type. Device and headline are co-dominant. Preserve generous negative space and lower supporting regions; do not reduce this to left-copy/right-card.
- **Proportions/type:** headline spans much of the viewport width; phone is a large scene object. Lower-left CTA/QR and lower-right companion copy/preview are much smaller. Geometric regular/light sans, pale lavender/white, tight display leading.
- **Depth/light:** diagonal diffuse indigo-purple illumination on near-black; phone sits in front of text. A small rotating decorative mark supplies ambient movement. Header wordmark scrolls away; bottom nav stays available.
- **Scroll/entry/release:** initial composition readable immediately; next product movement flows out of this pose into the same shared stage. Initial visual dominance must survive early scrolling.
- **Content/asset mapping:** Oryvelle headline, device screen, logo, Google Play action. Own transparent device and preview assets; placeholder preserves the same scale/anchor/overlap.

### 02 — Long product transformation

- **Composition/focus:** phone stays the primary object while heading/copy changes around or behind it. Maintain its presence throughout front → edge → back → edge → front views.
- **Depth/proportions:** real chassis silhouette and coherent reflections matter. Type, device and atmosphere do not move at identical speeds. Body copy is subordinate and legible at holds.
- **Scroll/pacing:** long pinned/sticky-looking multi-viewport sequence; small reverse scroll reverses poses. Keep reading holds between transformations, not an automatic timed spin.
- **Direction/transitions:** translations, rotation, scale and perspective are coordinated. No remount/cut to an unrelated phone when the next heading appears. Numeric phases are authored later against observed key poses.
- **Assets:** original/licensed true geometry is the selected opening approach, plus independent screen states, light/reflection/shadow. A baked sequence remains a measured alternative. A plane-based temporary turn is explicitly a geometry fidelity gap, not a completed match.

### 03 — Physical settling / desk stand

- **Composition/focus:** the same phone tilts into a landscape composition and rests in a ribbed stand. Large typography belongs to the scene, not a separated content block.
- **Depth/occlusion:** stand foreground crosses the composition, including in front of product/type where appropriate. Preserve contact plane, shadow, rear/front split and camera alignment.
- **Light/background:** purple illumination recedes toward black as the sequence ends. The environment feels like the product’s destination rather than a separate stock-photo section.
- **Scroll/pacing:** extended settling and readable hold within the opening chapter; release upward into the following dark interval. Reverse scroll should reconstruct the approach.
- **Assets:** matching phone poses plus environment/rear stand/front stand and contact shadow. Placeholder geometry is allowed, but missing occlusion/contact realism must remain on the ledger.

### 04 — Dark release

- **Composition:** a noticeably sparse black interval after the dense physical scene. Its negative space is the beat.
- **Behavior:** opening stage releases; glow has already receded. Next oversized headline arrives after the breathing space, not immediately as a rectangular background cut.
- **Pacing:** calibrate against the reference; the exact travel is unmeasured. Do not shorten solely because empty space seems inefficient, or lengthen without observing the consequence.
- **Technology/asset:** document spacing and atmosphere interpolation; no new artwork or portal transition needed.

### 05–06 — Embedded media → expanding photograph

- **Initial composition:** centered giant two-line heading with a small watch/human photograph integrated within the text composition. Text dominates first; image starts as a small focal interruption.
- **Expansion:** media grows toward almost viewport scale while composition holds; background type becomes dimmer/blurred behind it. Preserve the change in dominance from text to image.
- **Depth/masking:** clear photo crop and focal subject; text is behind the expanding shell. Rounded/cropped edges evolve without stretching the image. Photo itself appeared static.
- **Scroll/release:** reversible continuous expansion, estimated above two viewport heights in inspection; finish with a dominant stable photo before release.
- **Assets/content:** own lifestyle/device-in-use photograph, retaining the human-media role and crop. A temporary image must not become a static conventional media card. Preserve initial inset and final full composition.

### 07 — Evidence/statistic

- **Composition/focus:** giant centered metric/number with compact supporting source and explanation. Lighting returns from the left after the photo/dark sequence.
- **Motion:** observed odometer-like settling; triggered classification is probable, not proven scrub. Keep final number stable and readable.
- **Depth/pacing:** low object complexity; typography becomes the focal point. Normal flow supplies an informational pause.
- **Content:** use a verified Oryvelle number/evidence statement. If none is ready, visibly label an internal placeholder; do not publish reference statistic or invented efficacy claims. Preserve scale/hierarchy while content is unresolved.

### 08 — Audience/use-case cards

- **Composition:** enormous multi-line two-tone introduction, then six photo-based profession/use-case cards in a horizontal row; dark pill labels, colored dots and overlapping avatars.
- **Focus/space:** headline first, then a denser photo strip. Preserve relative card scale and partial overflow hint rather than making a tiny grid.
- **Interaction:** audience dragging was observed working. No vertically pinned horizontal timeline. Keep ordinary vertical flow and native touch/card browsing; do not redirect vertical wheel input.
- **Assets/content:** own audience/use-case images and text. Placeholder card photos still occupy the same visual roles; approved final photography is recorded.

### 09 — Large feature demonstration

- **Composition:** huge two-line heading above a roughly one-third text/tabs and two-thirds rounded purple-lit media arrangement. Preserve the large media presence and asymmetric editorial balance.
- **Interaction/motion:** active tab, explanatory copy, arrow action, and thin progress line; panels advance while stationary and support manual selection. Normal vertical flow, no long pin.
- **Lighting/layers:** photographed/device media carries purple light inside a rounded panel; screen/UI is a focal layer. Avoid replacing this with three generic feature cards.
- **Oryvelle mapping:** one real feature per panel, same progress/manual model, meaningful direct feature action. Pause/focus controls are required accessibility improvements; record visible differences if introduced.

### 10 — Premium editorial

- **Composition:** large heading occupies about the left three-fifths, narrow support copy on the right, then a long fine rule. Follow with text/media around two-fifths/three-fifths, then reversed media/text. Preserve generous vertical gaps.
- **Type/focus:** oversized introductory display; quieter body copy and rounded product photography below. Alternating arrangements supply rhythm without another cinematic pin.
- **Motion:** one observed image entrance softened/blurred then sharpened; small reverse scroll did not replay it. Use restrained triggered entrances rather than continuous animation on all text.
- **Lighting:** near-black global base; colored text panel and purple-lit UI photography provide local contrast. Avoid full-width background changes at every row.
- **Content/assets:** Oryvelle capabilities/premium facts and screens in these roles; temporary photographed phone layouts preserve proportions.

### 11 — Trust/reviews

- **Composition:** giant four-line two-tone intro, then dense thin-outlined black cards with variable heights, stars, dates/names and tiny color accents; approximately three cards plus overflow visible during inspection.
- **Focus/pacing:** readable text density contrasts with earlier large product imagery. No major pin or automated review rotation.
- **Interaction evidence:** reference drag cursor appeared, but attempted review dragging did not move it. Do not claim successful reference drag or intentionally reproduce a failure. Provide usable browsing controls and log the difference.
- **Content:** real permissioned reviews only; clearly labelled internal placeholders otherwise. Do not invent endorsements to fill the role.

### 12–13 — Moving question typography → ambient device demo

- **Composition:** enormous edge-cropped question marquee and rotating decorative mark, followed by a wide rounded hands/landscape-phone media composition.
- **Motion distinction:** marquee and visible product timer kept changing while stationary. They are ambient/time-based, not scroll-scrubbed. Exact media format and boundary blur mechanism were not established.
- **Depth/light:** oversized type gives way to physical hands/device media with purple illumination; cropping and scale preserve environmental intimacy.
- **Entry/release:** retain separate typographic and media beats. Do not merge them into a small FAQ heading. Avoid inventing scroll-velocity blur as an allegedly observed mechanism.
- **Assets:** own hands/phone footage or layered still + UI demonstration, with poster and pause state. Placeholder retains landscape device and human foreground.

### 14 — FAQ

- **Composition:** left support/CTA region around two-fifths, right answer region around three-fifths. Three answers were already visible, separated by thin rules.
- **Scroll/interaction:** normal-flow columns; no observed sticky support block. Do not substitute accordion-only answers or pinning for the baseline.
- **Type/space:** large but quieter question/support hierarchy; readable answer widths and deliberate gaps. No extra parallax or competing backdrop.
- **Mapping:** verified Oryvelle FAQ, Google Play/direct action, optional QR. Additional content can follow without compressing the observed compositional role.

### 15–16 — CTA → atmospheric footer → absolute end

- **Composition:** enormous centered invitation; short support phrase and action buttons below. Broad indigo-lavender glow returns across the closing composition.
- **Footer:** QR/action region, three link columns, return-to-top control, divider/copyright, then huge pale cropped wordmark at the actual bottom. Preserve this extended ending, not just the first footer viewport.
- **Behavior:** floating navigation withdraws near footer; return-to-top traverses back smoothly unless reduced motion. Atmosphere starts evolving before the endpoint rather than popping in after entry.
- **Mapping:** Oryvelle invitation, Google Play only where appropriate, real legal/support/social links, own wordmark. Do not fabricate an iOS destination to reproduce two store buttons; preserve the action grouping’s scale/balance with truthful content.

### Cross-cutting — Floating navigation, menu and QR

Bottom pale/glass navigation is wide while expanded, contracts to a small brand mark on downward scroll, and expands on upward scroll. Menu opens into a larger pale rounded panel, with dim backdrop, large main links, smaller secondary links, dark primary action and distinct close control. QR label opens a pale right-side drawer approximately a third of the desktop view, with dark scrim and a large QR composition.

Reproduce roles and transitions with own identity. Keep these discrete/time-based interactions separate from chapter progress. Do not retain the old top-fixed header as a shortcut. Use accessible focus, Escape, direct-link alternatives and persistent pause where needed; compare any resulting visible differences honestly.

## 4. Placeholder contract

For every unavailable final asset record:

| Field | Required entry |
|---|---|
| Beat and layer role | For example, 03 / foreground stand occluder |
| Temporary representation | Own/licensed temporary photo, neutral render, DOM geometry, or mock screen |
| Preserved behavior | Scale/anchor, rotation path, mask, overlap, timing slot, occlusion and light relationship |
| Known limitation | Concrete missing quality: incorrect silhouette, no reflections, missing human foreground, etc. |
| Final requirement | Format, alpha, dimensions/variants, matching camera/light, scene/frame poses, license/source |
| Replacement interface | Stable asset key, crop/focal anchor, renderer/pose contract |
| Review status | Not built / temporary / needs refinement / ready for review, with evidence |

Do not change the scene because a placeholder looks weak. Improve the temporary representation or record the limitation and obtain the final asset. A missing environment is an asset task, not permission to remove physical settling. Placeholders allow the whole journey to be reviewed; they do not establish final photorealistic quality or production performance.

## 5. Fidelity ledger — no scores

For **each major beat**, keep a separate entry for all eight dimensions:

1. composition;
2. scroll behavior;
3. transition;
4. typography;
5. depth/layering;
6. background/lighting;
7. pacing;
8. interaction.

Each entry contains reference observation, implementation observation at the same viewport/key pose, concrete difference, required refinement, asset blocker if any, and evidence. Use qualitative statuses such as `not assessed`, `difference identified`, or `ready for review`. No numerical fidelity rating, invented reference scroll precision, or overall score concealing weak categories.

Illustrative entries below are **examples, not current implementation findings**:

| Beat / dimension | Concrete comparison | Refinement |
|---|---|---|
| Transformation / composition | Reference product remains dominant; implementation product shrinks beneath headline | Adjust pose scale/anchor through the handoff |
| Stand / depth | Reference has foreground occlusion; implementation stand is entirely behind phone | Split foreground plate and align contact plane |
| Handoff / lighting | Reference light evolves before next composition; implementation changes only after entry | Overlap atmosphere keyframes with outgoing phase |
| Photo / pacing | Reference sustains image growth; implementation jumps to final crop | Extend reversible expansion and readable hold |

No baseline exists yet. Populate this ledger from actual browser behavior during implementation, not from code review alone.

## 6. Baseline review and Phase 2 gate

Review the complete implemented journey to its absolute end. Match desktop viewport dimensions to the reference; compare hero, front/edge/back poses, environmental contact/hold, release darkness, inset-photo and expanded-photo states, editorial rows, demonstrations and footer. Scroll slowly, pause, reverse, flick, open overlays and return to top. Record what is scrubbed versus triggered versus ambient.

Reference behavior is the target; exact unknown internals need not match. Reduced-motion, no-JS, keyboard and mobile variants remain required. Record their intentional differences without claiming they reproduce reference modes we did not inspect.

Creative Phase 1 succeeds when the complete baseline conveys the reference’s composition, pacing, depth, continuity and interaction sophistication, with concrete gaps disclosed and resolved to an acceptable review state. A section checklist or working build is insufficient. **Do not begin substantial creative divergence before the baseline is reviewed and accepted.**

Then adapt incrementally: identity → copy/screens → color/lighting → imagery/environment → motifs → optional approved orb/constellation language → selected transitions. Some real identity/content is already present in Phase 1; Phase 2 grants deliberate compositional/creative change, not permission to use incorrect content earlier.

For each change, compare against saved baseline poses and behavior: what did we gain, what reference quality did we lose, and how can it be preserved? Major new concepts require explicit user approval. Keep adaptation changes small enough to attribute their effects.

The process is **understand → reproduce design grammar → establish baseline → adapt deliberately**. A clean-slate codebase serves that process; it does not replace it with a different creative journey.
