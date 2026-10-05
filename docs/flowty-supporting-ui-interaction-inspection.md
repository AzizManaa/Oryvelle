# Flowty supporting UI — live interaction inspection

Date: 2026-10-05. Reference: https://flowty.co/. Inspected the existing user tab in Brave at 1728 × 947. Research only; no application code changed.

## Evidence boundaries

Direct observations: initial hero, reload/reveal states, menu opening/closing, QR opening/closing including Escape, watch-card destination, scroll-arrow navigation, opening chapter scrolling and reverse restoration.

DOM evidence: rendered button markup, component rectangles, transition declarations, hidden-state transforms, clipping and video properties. Hover mechanisms below are inferred from that markup, not a complete recorded pointer-hover pass. Exact menu/QR choreography durations were not measured. Mobile and reduced-motion interactions were not inspected in this pass.

Some locator clicks automatically brought controls into view and advanced the transformed page despite `window.scrollY` remaining zero. Repeating QR and menu with direct viewport clicks established the correct behavior. The phone shift seen during the first attempt is **not evidence of QR-driven phone choreography**.

## Component inventory and behavior

| Component | Design and purpose | Appearance / interaction / motion |
| --- | --- | --- |
| Bottom-center bar | Pale lavender-gray rounded surface; two-line menu icon left, pixel F mark center, inset black Download button right. Approximately 484 × 59px at this viewport, about 45px above the bottom edge. A bright horizontal anchor across the dark phone composition. | At the hero it exposes navigation and conversion. During subsequent phone chapters it clips down to a roughly 108 × 59px logo pill, hiding the menu/download controls. Reverse scrolling restores the expanded bar. It does not simply remain full-sized throughout the opening. |
| Expanded menu | Pale rounded panel approximately 448 × 510px; large primary links, smaller legal/support/social groups, thin divider, black full-width download action. Dark backdrop reduces the competing hero. | The bar first loses its inner controls and becomes an uninterrupted pale shape, then expands upward into the panel. Contents arrive after the surface opens. A separate dark rounded close button appears below. Close button and Escape restore the original bar and hero. |
| Main CTA | Pale filled rounded rectangle, black medium-weight label; approximately 167 × 52px. Strongest conversion action in the lower-left group. | Rendered lettering has individual spans and duplicated text via a shadow below the baseline. This supports a rolling vertical label reveal rather than a simple color change. Declared transition is 0.6s with 0.01s successive character delays; background inset also transitions over 0.6s. Hover interpretation comes from DOM evidence. |
| QR trigger | Approximately 52px rounded square, dark fill, fine border, pale pixel QR glyph. Sits immediately beside the CTA. Desktop-to-phone transfer utility rather than another full-sized CTA. | Opens a full-height pale sheet from the right, about 573px / one-third viewport width here. Backdrop dims the existing composition. Sheet contains large heading, explanatory copy, framed QR/instructions and top-right close icon. Direct click confirms the underlying phone/headline remain in their existing composition. Close button and Escape dismiss; Escape leaves focus on the initiating QR button, with visible focus outline. |
| Scroll arrow | Same approximate 52px footprint, dark filled rounded square, small pixel-style downward arrow. Adjacent to QR. Separates conversion from progression. | Direct activation moves through the rear-turn passage into the next front-facing chapter. It is a chapter-navigation affordance, not a download shortcut. The later phone chapter repeats QR/arrow below its copy. No continuous bouncing was established. |
| Right informational card | Roughly 250 × 192px, dark tinted surface, subtle border, generous radius and inset padding. Short supporting paragraph above two small platform buttons. | A visual counterweight to lower-left copy/CTA, with real platform conversion actions. It moves away with the hero content during progression, rather than persisting as fixed chrome. Reverse scrolling brings it back. It does not expand into a separate information panel in the inspected interactions. |
| Platform buttons | Dark rounded squares matching QR dimensions and border treatment; pale Apple / G symbols. | Rendered markup shares the QR button's clipped circular pale-fill layer and icon color inversion. Declared transform/color timing: 0.7s. Store destinations were not activated in this inspection. |
| Watch card | Approximately 134 × 192px; narrow dark companion-device card directly beside the informational card. Real watch footage/product imagery and a small pale circular arrow in its lower-right corner. | Watch display changes over time. The page contains a muted looping watch video. The arrow actually navigates to `/features?section=smartwatch-integration`; it did not open a video modal. Its accessible label “Watch preview video” does not accurately describe that observed destination. Rendered hover classes darken the small button and lighten its arrow, with a 0.3s color transition. |
| Wordmark | Quiet pale wordmark at the upper-right; no enclosing badge. | Belongs to the opening identity/composition. No expanding state was observed. |
| Reassurance microcopy | Small muted line below the CTA group. | Adds conversion reassurance without giving it the visual weight of a card. It leaves with the hero supporting content. |
| Custom cursor | Small outlined cursor with localized cool glow. | Visible in desktop screenshots; adds a small interaction cue without becoming a large scene element. Cursor dynamics were not measured. |

## Motion construction visible in the DOM

The menu bar is not merely scaled into a big rectangle. Its outer surface has an animated `clip-path: inset(... round ...)` and bottom origin. The navigation panel remains inside that surface, hidden while closed. Its content groups have hidden-state `translateY(12px)` plus opacity/visibility changes. This supports the observed sequence: surface opens first, internal content follows. It avoids visibly stretching the lettering.

The two-line menu glyph has a 0.6s width transition on the second line, targeting 70% width on group hover. The primary/menu download labels use the same 0.6s staggered rolling-letter mechanism.

QR, platform and scroll buttons use a clipped circular pale fill, initially scaled to zero, with a 0.7s transform declaration and corresponding icon color change. Their markup suggests a growing fill rather than an instantaneous background swap. The exact pointer-origin behavior was not verified.

Several declared transitions share `cubic-bezier(0.625, 0.05, 0, 1)`. That consistency matters more than copying its exact curve: small controls feel related because their acceleration/deceleration language is shared.

On reload, controls are initially withheld, then present in the revealed hero. Hero button markup retains opacity-zero base classes overridden by animated transform/opacity values. Exact reveal order and durations require a recording to quantify; this pass does not invent timings.

## Persistence and hierarchy

- Hero CTA, QR, arrow, reassurance and right cards form a chapter-specific support layer. They do not all stay fixed over later compositions.
- Bottom bar is persistent site chrome, but its visible density adapts: expanded at the hero, compact during product choreography.
- Later phone chapters retain small contextual QR/arrow pairs rather than carrying the entire hero conversion cluster forward.
- Large pale surfaces are reserved for principal conversion/navigation and opened overlays. Supporting cards stay dark.
- Pixel icons unify QR, downward arrow, diagonal watch arrow and F mark. They belong to Flowty's identity; Oryvelle should retain its own icon language.

## Lessons for Oryvelle

The strongest transferable idea is **one coherent interaction grammar**: related radii, control footprints, contrast states, easing and close behavior. The feeling of completeness comes from clear jobs and coordinated state changes, not the number of cards.

Useful candidates for a future scoped proposal:

1. Give the existing CTA/QR/preview controls consistent hover, focus and pressed feedback.
2. Consider a compact scroll affordance if the oversized mobile phone does not clearly communicate that scrolling continues the story.
3. Keep supporting controls subordinate, and let them depart before they compete with the moving phone.
4. If navigation becomes necessary, use a surface-first expansion with stable typography and clear dismissal. Do not invent menu destinations just to reproduce the bar.
5. Retain Oryvelle's compact QR utility; Flowty's full-height sheet is a reference for transition quality, not a requirement to enlarge ours.

Do not copy the watch promotion, Apple availability, product claims, exact geometry or full navigation contents. They reflect Flowty's product and website structure.

## Limitations

This is a desktop interaction/design inspection, not a production accessibility or performance audit. No exact GSAP timeline timings, focus trap, outside-click behavior, touch behavior, mobile menu layout or reduced-motion behavior are claimed. No Oryvelle tests, builds or visual edits were performed.
