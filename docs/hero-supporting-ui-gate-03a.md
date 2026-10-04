# Gate 03A — Hero supporting UI research and composition proposal

Date: 3 October 2026  
Status: research complete; proposal awaiting visual/product approval. **No Gate 03B implementation authorized or performed.**

## Recommendation

Choose **Direction 2 — Balanced**: add **two supporting units**, while retaining the approved opening:

1. A compact **Android / Google Play availability and desktop QR group** associated with the existing primary CTA.
2. **One lower-right sound-mixing capability card**, communicating multi-audio mixing and the sleep timer.

Keep the existing Oryvelle wordmark, paragraph, primary CTA and bottom download anchor. Do not add a watch, another phone, a separate store card, a feature grid, an audio player or a menu with speculative destinations. Leave the upper-right atmosphere and the space around the phone intentionally quiet.

These are proposed additions, not approved production components. A QR trigger is an alternate way to reach the same app listing, not a competing conversion goal. The capability card supplies concrete product information rather than another download action.

## Scope and evidence

Personally inspected [Flowty](https://flowty.co/) in Brave during this gate, then inspected [the current Oryvelle opening](http://localhost:3000/new). Used native wheel scrolling, reloads, Brave DevTools responsive viewport controls, screenshots and the browser accessibility tree. Opened Flowty's QR sheet, menu and watch-card action. No proprietary assets, source, internal animation values or coordinates were copied.

Evidence labels throughout:

- **Observed:** visible behavior in this live inspection.
- **Implementation evidence:** browser-exposed labels, destinations or our own current source.
- **Interpretation/proposal:** compositional purpose, likely ownership, or recommended Oryvelle behavior.

Viewport sizes below are CSS viewport settings, not screenshot pixel dimensions. Responsive emulation is browser evidence, not physical-device testing.

| Viewport | Flowty inspection | Oryvelle inspection |
|---|---|---|
| Wide desktop, 1920 × 1080 | Hero, card pair, conversion group, bottom bar; watch action | Hero negative space and current anchors |
| Normal desktop, 1440 × 900 | Reload/entry to hero; all support groups | Hero, departure, first rear, later landscape approach |
| Short desktop, 1440 × 640 | Hero groups remain present; tighter vertical composition | Hero and available right-side space |
| Tablet/narrow, 820 × 1180 | Reload; centered phone, reduced support inventory | Hero; large phone consumes most right-side space |
| Mobile, 390 × 844 | Reload; hero and scroll into later opening/stand presentation | Hero, copy/CTA above phone, corner download anchor |
| Native wide Brave window | Hero, QR sheet, menu; slow forward samples through turn, rear and stand | Comparison supplemented by exact emulated sizes above |

Captured evidence:

- [Flowty native wide hero](captures/gate-03a/flowty-wide-hero.png)
- [Flowty 1440 × 900](captures/gate-03a/flowty-1440-900.png)
- [Flowty tablet](captures/gate-03a/flowty-tablet.png)
- [Flowty mobile](captures/gate-03a/flowty-mobile.png)
- [Oryvelle 1440 × 900](captures/gate-03a/oryvelle-1440-900.png)
- [Oryvelle wide](captures/gate-03a/oryvelle-wide.png)
- [Oryvelle mobile](captures/gate-03a/oryvelle-mobile.png)

Screenshots include browser/DevTools chrome. They document observed compositions; they are not redesigned mockups. No browser overlays or production edits were necessary.

### Evidence limits

This was a supporting-UI inspection, not another renderer investigation or complete site audit. Exact animation durations, CSS positioning mechanisms and breakpoints were not extracted from Flowty's bundles. Describe the observable viewport behavior without claiming proprietary implementation knowledge. Store labels establish presented availability, not independent verification of each store listing. No conversion effectiveness or user-testing evidence was collected.

Flowty logged hydration mismatches on reload and a DOM insertion error when switching responsive modes mid-session. Reloaded at the chosen viewport before evaluating responsive compositions, rather than treating that transient state as the intended design. Browser warnings on our development route were also visible; this gate did not change their handling.

## Live Flowty supporting-element inventory

Excludes the large headline and primary 3D phone. Functional/compositional purposes are interpretations grounded in the observed controls.

| Element actually present | Functional purpose | Compositional purpose and hierarchy | Observed motion / persistence |
|---|---|---|---|
| Top-right wordmark on desktop | Site identity; home link | Small pale counterpoint to huge left headline; establishes the far-right edge without a full header | Visible with hero after entry; leaves as initial hero moves away. Not a persistent top navigation header |
| Lower-left supporting paragraph | Explains focus/recovery and app value | Modest text block balances the phone; gives the primary CTA a reason to exist | Moves upward with hero copy, independently of the physical phone turn |
| Pale `Start For Free` button | Primary acquisition action | Strongest local action; wider than adjacent square controls, clear contrast | Present on desktop/mobile hero; leaves with initial copy |
| Adjacent QR icon button | Transfers a desktop visitor to the mobile download destination | Small square secondary utility; same action-row height, dark surface | Present on desktop/tablet, absent in inspected mobile hero; departs with hero group |
| Adjacent downward arrow | Advance through storytelling | A small orientation cue separates exploration from acquisition | Leaves with hero; QR/down controls also appear with later opening copy on desktop |
| Tiny credit-card reassurance | Reduces perceived signup/payment friction | A quiet subordinate line below CTA, not an extra card | Present on desktop; not visible in inspected tablet/mobile hero |
| Lower-right information card | Short product positioning plus platform download choices | Dark rounded enclosure, faint border; a moderate horizontal mass opposite the left conversion group | Moves upward with initial hero rather than remaining beside every phone pose; absent in tablet/mobile hero |
| Apple and Google icon buttons within that card | Platform selection / download affordances | Two small square outlined buttons grouped inside one container, not independent floating badges | Leave with parent card; desktop inventory only |
| Adjacent portrait watch card | Communicates companion-device capability; links to feature detail | Narrow secondary product image, same approximate height as information card; fills the outer-right edge | Visible desktop/tablet; absent mobile; leaves with initial hero |
| Watch-card circular diagonal-arrow control | Opens smartwatch feature destination | Pale compact action cue over a subdued product card | Remains part of card, not standalone chrome |
| Bottom-center pale capsule: hamburger, mark, dark Download inset | Navigation plus persistent acquisition | Bright horizontal foreground anchor; spans roughly a quarter to a third of desktop viewport width; overlaps the phone visually | Expanded at hero; contracts to a small mark-only capsule during deeper opening, remains at bottom through observed rear/stand stages |
| Hamburger menu overlay | Access existing pages and utility links | Turns small navigation affordance into a focused pale panel; background dims | Click opens centered rounded panel; close control appears below; separate interaction state |
| QR download sheet | Cross-device download instructions | Large pale right-side sheet with headline, QR and instructions; deliberately dominant only on demand | Opens over dimmed hero; close restores hero; not an always-visible QR slab |
| Custom pointer treatment on desktop | Interaction feedback / branded pointer | Small arrow-like pointer with soft glow; very low hierarchy | Follows pointer; not a content card or corner button |

There were no visible hero rating stars, user counts, testimonial avatars, award badges, social-icon row, pricing grid or persistent top menu in the inspected hero. The decorative star within the headline belongs to the main typography, not an extra support component. Browser controls and emulation resize handles are not website UI.

### Interaction findings that change the interpretation

- **QR:** clicking the QR button opened a pale, full-height right sheet headed “Scan the QR Code”, with close button, large bordered QR area and platform-routing instructions. The delivered image's accessible value was `https://flowty.co/download`. The sheet says the destination selects App Store or Google Play according to device. This is useful desktop-to-phone transfer, not trust/social proof.
- **Watch card:** accessible label was **“Watch preview video”**, but clicking it actually navigated to [Smartwatch Integration](https://flowty.co/features?section=smartwatch-integration). It should be classified as feature discovery; the label alone does not prove video playback.
- **Menu:** observed panel showed Home, Features, Referral and Pricing, plus Support, Terms of Use, Privacy Policy, LinkedIn, Instagram and Download. Its usefulness comes from real destinations. Oryvelle should not inherit that sitemap or referral/pricing content.
- **Bottom bar:** the visible control changes shape. A continuously expanded bar is not the reference's behavior during the physical transformation. The mark-only state preserves orientation with much less foreground obstruction. Exact hover activation/re-expansion rules were not established; do not assume the expanded controls are always exposed.

## Hierarchy and spacing principles

Observed desktop composition has three distinct supporting zones: lower-left explanation/conversion, lower-right product/platform pair, bottom-center navigation. They are not equally bright.

- Main headline and phone dominate. The right cards are dark, with low-strength borders and smaller type. Their combined group is approximately a fifth to a quarter of viewport width in the inspected desktop compositions; each card is far smaller than the phone.
- Cards share baseline/height and close spacing. The information card is roughly twice the watch-card width. This reads as one support group, not two unrelated offers.
- The action row shares button height. Primary action is wide and pale; utilities are near-square and dark. Small icons sit comfortably inside large enough targets.
- Wordmark and corner groups align with modest outer gutters, approximately a few percent of viewport width. The central phone keeps a generous clear region; cards stay toward the outside edge.
- Rounded corners are substantial but subordinate to the shape of the phone. Thin borders define dark objects without high-contrast glass styling. Transparency is visually restrained; the card does not become a bright frosted panel.
- Body copy is more prominent than reassurance, less prominent than display type. Platform icons are recognizable utility marks, not another headline.
- Brightness, not number of cards, creates the final anchor: the bottom capsule contributes disproportionately to perceived completeness.

**Interpretation:** Flowty feels complete because its support groups have jobs and clear grouping. Filling every empty area would lose the cinematic hierarchy.

## Supporting UI through the opening

| Stage | Directly observed behavior | Oryvelle implication |
|---|---|---|
| Entry completes / hero | Identity, support copy, actions and cards are visible in the finished hero; bottom bar expanded | New elements must exist under the approved entry and reveal with it, without a second entrance sequence |
| Early phone turn | Headline departs first; paragraph/actions and right pair remain briefly, then travel upward | Keep support in the hero's departure, not pinned to the phone |
| Rear reveal / next copy | Original right pair exits; next editorial copy arrives; compact bottom mark remains | Clear the right-side phone path before this pose; no capability card at rear hold |
| Later turn / landscape approach | Original hero cards absent; later copy has its own support utilities; bottom mark remains small | Do not reintroduce the proposed card or QR beside the stand |
| Stand composition | Physical product and large type dominate; compact mark remains an unobtrusive foreground anchor | Maintain approved contact/occlusion and calm environment |
| Reverse travel | Support is part of scroll staging rather than a one-time replacement | Future additions should restore naturally with the hero on reverse scroll; no irreversible entrance-only state |

The reverse behavior recommendation is ours; this gate did not measure Flowty's exact reverse thresholds. No normalized Flowty timing values are implied by these stage descriptions.

## Responsive observations

**Desktop wide/normal/short:** all three supporting zones remain. A short viewport compresses vertical space, with phone extending beyond bottom; utility groups still sit near the lower edge. Do not solve our short-screen density by changing the frozen phone framing.

**820 × 1180:** Flowty centers an almost full-height portrait phone below the headline. The wide right information card and its platform pair disappear. The small watch card remains in the lower-right region. Lower-left paragraph wraps more tightly; primary `Start For Free` and reassurance are not shown there, while QR/down utilities remain. Bottom bar is compact in width with hamburger, mark and Google icon acquisition control.

**390 × 844:** wordmark moves to the upper-left; headline, paragraph and primary CTA/down arrow form a vertical introduction above the phone. No hero QR, watch card, information card or credit-card reassurance was visible. Bottom bar remains a strong foreground anchor, with hamburger, mark and Google acquisition icon. Scrolling deeper reveals a smaller mark-only state and vertically arranged later opening content.

**Interpretation:** removal and recomposition, rather than shrinking all desktop cards, is part of the quality. Oryvelle's tablet phone occupies more of the right side than Flowty's tablet watch-card composition permits; copying that exception would create a collision.

## Current Oryvelle negative-space analysis

Approved main elements are treated as constraints, not redesign candidates.

| Region | Current observation | Judgment / proposed treatment |
|---|---|---|
| Upper-left | Oversized headline already supplies strong hierarchy | Full; no labels or feature pills above it |
| Between headline and lower-left support | Broad dark area gives text and device breathing room | Intentionally quiet; do not insert a feature strip |
| Upper-right beneath wordmark | Atmosphere and negative space frame phone | Intentionally quiet; no second header row or floating badge |
| Central/right product region | Large physical phone, screen information and illumination | Protected moving region; no overlapping card or small device |
| Lower-left | Existing paragraph and single CTA are clear; platform is not explicitly communicated in visible text | One availability/QR group gives useful clarity without replacing primary CTA |
| Far lower-right on desktop | No small support content; lighter overall weight than lower-left | Suitable for one restrained capability card, only where a clear gap survives phone float and early trajectory |
| Bottom-center desktop | Existing pale `O ↗` already creates an anchor | It is a Google Play link, not navigation. Keep it for this proposal; do not add another bar |
| Tablet | Phone covers most central/right area, support constrained to left | Do not place desktop card beside it |
| Mobile | Copy/action above phone; little spare horizontal room; existing download anchor shifts to lower-right | Platform line only; no QR or floating feature card |

The lower-right absence reads as less finished **on desktop**, but it is not a universal hole. Mid-right negative space is also the phone's future travel space. A fixed support card would become a visual obstruction during the first back pose or later landscape transition.

### CTA and bottom-center conclusions

The current primary button is sufficient as the principal action. A second store badge would repeat its destination while competing visually. Add a small visible “Android · Google Play” line and desktop scan utility instead. This is platform clarity plus cross-device usefulness; it does not imply free access to all features.

The current bottom anchor already makes the composition feel grounded. Its visible `O ↗` is compact and somewhat abstract, but its actual accessible name is “Get Oryvelle for Android” and its destination matches the primary CTA. This is **conversion chrome, not navigation**. There is no urgent need for a hamburger merely to resemble Flowty.

A future site-wide menu becomes useful when there are approved, working destinations. Its footprint should remain small and avoid obscuring the product; that decision belongs to a later navigation scope. Do not create empty Features/Explore links or assume future sections now.

## Flowty → Oryvelle mapping

A = directly useful general purpose; B = useful composition with different content; C = Flowty ecosystem/content, exclude; D = unnecessary for Oryvelle now.

| Flowty element / concept | Class | Oryvelle translation and reason |
|---|---|---|
| Wordmark/home identity | A | Already present; retain existing brand placement/behavior |
| Supporting paragraph | A | Already present; retain wording and hierarchy |
| Primary acquisition button | A | Existing download CTA already serves it; no replacement |
| Desktop QR access | A | Scan to the actual Google Play listing; helps a desktop visitor install on their phone |
| Platform availability indication | A | Explicit Android / Google Play metadata, not two equal platform buttons |
| Two-platform icon pair / Apple button | C | Oryvelle has no authorized iOS distribution; never imply it |
| Right informational enclosure | B | Single specific mixing/timer capability card, not vague “companion” language or duplicate store actions |
| Watch render / companion-device content | C | No Oryvelle watch support; no second hardware promotion |
| Secondary feature discovery purpose | B | Communicate mixing/timer; feature link only if a real approved destination exists |
| Credit-card disclaimer | C | Flowty's payment/signup reassurance does not establish Oryvelle's terms; replace its role with factual platform metadata only |
| Downward next-stage shortcut | D | Native scrolling and cinematic motion already orient visitors; another action adds clutter and skip/jump risk |
| Bottom persistent conversion anchor | A | Already exists; preserve it, avoid redundant new bar |
| Hamburger site navigation | D (for this gate) | Flowty has actual pages. Oryvelle needs an agreed destination set before a menu earns a place |
| Referral/pricing/social menu inventory | C | Do not reproduce product-specific destinations or invent Oryvelle programs |
| Large QR sheet composition | D | Utility is useful; giant headline/full-height sheet is unnecessary for our quieter hero |
| Rounded dark surfaces and faint borders | B | Apply restraint to the single proposed card, with Oryvelle hierarchy and existing atmosphere |
| Custom glowing pointer | D | Adds no product understanding; normal cursor/focus affordances are enough |

Explicitly exclude: Apple/watch imagery, second phone mockup, productivity/focus-blocking claims, credit-card wording, copied referral/pricing menu, rating/count/trust badges, autoplay audio, fake sliders, decorative particles, constellation background and orb. The app's constellation capability may be discussed later as product content; it is not a reason to reintroduce the old landing concept.

## Exactly three composition directions

### Direction 1 — Minimal

**Added components:** one availability unit: a small “Android · Google Play” line associated with the existing CTA. No QR, no right card, no new navigation.

**Purpose:** clearly identifies the platform; completes the acquisition grouping with factual information. Does not attempt to balance the right side with content.

**Placement:** close to the existing button, preferably beneath it using available support-group space; do not move paragraph/button anchors. Small secondary type, no badge container.

**Scroll:** travels and disappears with existing hero support; restored on reverse. No persistence into rear/stand.

**Desktop/mobile:** same content; compact single line. Keep current bottom anchor and wordmark.

**Intentionally empty:** entire far-right region, upper-right atmosphere, middle-left negative space.

**Risk:** strongest quietness, weakest improvement to desktop balance; desktop visitors still have to send/open the link on their phone themselves. Good if brand restraint outweighs product discovery.

### Direction 2 — Balanced — recommended

**Added components:** two units:

1. Availability group with “Android · Google Play” and one desktop **scan** trigger.
2. One right-side **sound-mixing capability card**.

The scan overlay is an interaction state of unit 1, not a third always-visible component. No additional download button inside either unit.

**Purpose:** availability/QR improves acquisition clarity and desktop-to-phone transfer. Capability card tells visitors something beyond the existing paragraph: several sounds can be combined and stopped with a sleep timer. It balances the left support with a modest right-side mass.

**Representative card content, not final copy:**

> Your evening mix  
> Combine ambient sounds.  
> Set a sleep timer.

A tiny noninteractive diagram of two sound layers may reinforce “combine”. Use generic layer labels until actual catalog entries are approved. No fake playing state, animated equalizer, slider, duration selection or unsupported efficacy claim.

**Placement:** far lower-right, aligned approximately with the left support group. Start visual evaluation around 240–280 CSS px wide and 140–180 px tall on normal desktop; treat these as our proposal, not measured Flowty coordinates. Dark surface, fine restrained border, roughly 16–24 px radius, 16–20 px internal padding, short title, two small lines. It must stay considerably below headline/phone weight. One small illustrative symbol at most. Keep a clear gap from the phone silhouette across ambient movement.

**Scroll:** reveal together with hero under existing entry; remain stationary relative to hero while phone begins moving, then depart with the initial hero composition. Must be gone before the first rear composition consumes that region. Prefer the existing hero departure envelope; do not change any phone/copy thresholds. Card never returns at stand and never follows the phone. Reverse restores it deterministically.

**Desktop:** availability line plus compact scan utility close to CTA; QR disclosed only on request. Small anchored panel or modest dialog with QR, destination label and close control—not a Flowty-sized sheet. Primary link remains available. Right card only when there is genuinely adequate separation.

**Tablet/mobile:** retain availability text; omit desktop QR trigger and right card where they would conflict. The capability card is supplementary because paragraph/device already communicate the category. Do not add normal-flow blocks that change approved hero height or force the phone down. Keep current corner/bottom anchor behavior.

**Intentionally empty:** upper-right light field, headline-to-support gap, area immediately around phone, later physical-turn and stand compositions.

**Risks:** card may become too dark to read over glow, or too bright and compete with phone; motion path can collide despite a good top screenshot; QR overlay needs proper focus/close behavior and unchanged scrollbar geometry. Static fallback must remain coherent. No proof yet that this improves conversion.

### Direction 3 — Product-rich

**Added components:** three units: availability/desktop QR group, one larger actual-app preview card on lower-right, one concise toolkit strip attached to the left support group. Retain existing bottom anchor; no menu by default.

**Representative content:** approved static sound-mixer crop with short caption; toolkit strip “Sounds · Breathing · Meditation”. Only actual current app assets may be used. No fabricated app UI.

**Purpose:** concrete product inspection plus breadth of available tools; stronger information density and a more tangible right counterweight.

**Placement:** preview roughly 280–340 px wide, taller than Balanced card; strip close to support copy with subordinate type. Must stay outside device silhouette. Neither should imply desktop playback.

**Scroll:** all additions leave with initial hero; no rotating screenshots, autoplay tabs or independent ambient animation. Later opening remains untouched.

**Desktop:** richest information; still one preview rather than several cards. Short desktop may need to omit the strip/card rather than move approved anchors.

**Mobile:** omit preview and QR; platform line retained; toolkit strip only if it fits without changing the frozen layout, otherwise omitted.

**Intentionally empty:** upper-right, central phone path and all later turn/stand scenes.

**Risks:** repeated UI competes with the main screen, adds image/readiness weight, crowds short viewports, repeats capabilities already in paragraph, and can turn the hero into a conventional feature layout. Depends on approved screenshot selection. Not recommended for this opening.

## Why Balanced wins

Minimal resolves platform ambiguity but leaves useful mixing/timer information absent. Product-rich asks visitors to inspect multiple product surfaces while the physical phone is already carrying the story. Balanced adds the smallest specific counterweight that solves both desktop balance and product understanding.

The selected right card has **no acquisition CTA**. It explains a capability rather than becoming a competing promotional offer. The existing phone remains the only device and the visual center. Tablet/mobile intentionally approximate Minimal.

Recommended count: **two added supporting units on roomy desktop; one text availability unit on constrained layouts**. Zero new permanent navigation units. One on-demand QR overlay associated with the availability group.

## Annotated structural wireframe

This diagram proposes regions only; the approved main elements retain their exact size, framing and motion.

```text
┌───────────────────────────────────────────────────────────────┐
│ APPROVED LARGE HEADLINE                        ORYVELLE        │
│                                                               │
│                                APPROVED PHONE                 │
│          quiet space              /                           │
│                                  /          quiet atmosphere  │
│                                 /                             │
│                                                               │
│ APPROVED SUPPORT COPY          /                              │
│                               /           ┌────────────────┐  │
│ [APPROVED DOWNLOAD CTA]       /            │ Your evening   │  │
│ Android · Google Play [QR]                 │ mix            │  │
│                                           │ Combine sounds │  │
│                      [existing O ↗]       │ Sleep timer    │  │
│                                           └────────────────┘  │
└───────────────────────────────────────────────────────────────┘
  left: conversion/platform clarity       right: capability
                  existing foreground anchor retained
```

QR stays hidden until requested. The card is not fixed global chrome. At the rear/return/stand checkpoints the added hero units have exited, leaving the currently approved compositions.

```text
Constrained mobile:                Rear / stand stages:
Oryvelle                           existing copy + product
approved headline                  existing atmosphere
approved paragraph                 existing bottom anchor
approved CTA                       no new supporting card
Android · Google Play              no new QR utility
approved phone
existing corner download anchor
```

## Implementation risks and boundaries for later approval

- Judge the full moving silhouette, not only the top frame. At 820 px tablet the available right space is already consumed. Provisional desktop eligibility could start around 1200 px, but final choice must be based on width **and height**, not copied breakpoint values.
- New UI must not resize the hero or move any approved anchors. If it cannot fit, omit it rather than shrink/move the phone or type.
- Integrate supporting departure into the existing hero lifecycle; no second ScrollTrigger, new scrolling system or independent progress owner is justified.
- A disappearing interactive QR trigger must leave keyboard focus usable; do not retain invisible focusable controls. Dialog needs name, focus management, Escape, close button and a direct Google Play link. Scrolling/entry state must not change width.
- QR must encode the existing authoritative `PLAY_STORE_URL`, currently `https://play.google.com/store/apps/details?id=com.nekodesk.oryvelle`. Do not add an invented platform router. Confirm scan destination before implementation sign-off.
- Static fallback/reduced-motion/no-JS should retain platform clarity and primary download access; supplementary cards do not justify blocking readiness or loading more heavy assets.
- A capability card is informational unless a real interaction is separately approved. Avoid controls that promise audio playback without implementing it.
- No new phone screens/videos, app screenshot fabrication or final-art production required for Balanced.
- Existing bottom anchor is not a navigation system. Future useful navigation can be evaluated separately with actual destinations, without committing to a site-wide component hierarchy here.

## Questions requiring visual/product judgment

1. Does the lower-right **mixing + timer** emphasis feel right, or should the single card instead emphasize breathing/meditation? Mixing is recommended because it adds functionality not explicit in the frozen paragraph.
2. Should the card remain entirely typographic or include a tiny two-layer diagram? Prefer typographic first; add the diagram only if it clarifies mixing.
3. Is desktop QR useful enough to include in Gate 03B, or should the availability line alone be implemented initially?
4. Should the card be visible at 1440 × 640 if separation permits, or intentionally omitted on short screens? Decide by visual review without moving approved content.
5. Is the current bottom `O ↗` sufficiently understandable? This proposal retains it; relabeling/replacing it would need explicit future scope rather than a quiet redesign.

These are review choices, not blockers requiring code exploration now. Copy is representative and should not be treated as final marketing wording.

## Preservation and validation

Research-only changes: this report, screenshot evidence and a hash manifest. No packages installed. No app, component, CSS, phone material, screen, loader, stand, timeline or production asset modified. Implementation baseline captured in [the manifest](captures/gate-03a/implementation-baseline.sha) before browser inspection; verified again after writing this report.

Source inspection confirmed the existing bottom anchor's Google Play destination and the current hero departure behavior. It did not trigger a code cleanup or performance gate. Lint/build/tests were not rerun because this gate changes documentation only; hash verification and `git diff --check` are the relevant preservation checks.

## Proposed future Gate 03B — Hero Supporting UI Implementation

Subject to approval: implement **only** the Balanced direction's availability/desktop-QR group and one informational mixing/timer card. Preserve existing primary CTA, brand, bottom anchor and every approved cinematic value. Make additions leave with the initial hero, restore on reverse and simplify to platform text on constrained layouts. Validate QR, keyboard/focus, entry handoff, fallback, responsive collisions and all opening checkpoints. No new navigation destinations, Section 02, audio demonstration, screen/video production or main-composition redesign. Stop for visual review.
