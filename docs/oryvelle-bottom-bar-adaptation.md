# Oryvelle bottom bar adaptation

Replaces the small O ↗ download anchor in the opening with an Oryvelle-specific bottom-center dock. Based on the live Flowty supporting-control inspection; this adapts the interaction principles, not its product ecosystem or navigation destinations.

## Design and motion

- Pale lavender surface, inset dark Download action, two-line menu icon and Oryvelle O mark.
- Desktop expanded width 440px, height 58px; mobile width 320px capped at 90vw, height 54px.
- Scroll direction contracts the dock to 134px while moving down and expands it while moving up, at any chapter position. An 8px directional intent threshold filters tiny scroll jitter; top-of-page restores the expanded state.
- Direction changes run one .45s `power3.out` tween, replacing any in-flight tween. Stopping retains the current state. Download leaves the keyboard order during contraction; menu and home mark remain reachable.
- The bar first contracts over .22s into the centered 52px close-control footprint, withholding its contents. Its underlying surface is then hidden, so a duplicate bar never remains behind the modal. The panel expands upward from that same narrow footprint over .62s with `power3.inOut`; grouped contents reveal from .51s with .34s opacity/12px translation and .055s stagger.
- Closing reverses the sequence: contents leave, panel collapses downward to the narrow footprint, X disappears, and the bar expands back into its prior scroll-direction state with its controls restored. Reduced motion performs the same state handoff immediately.
- Dismissal reverses the opening timeline. No timeout or additional ScrollTrigger.
- Menu-icon hover shortens the second line; Download uses a clipped vertical word roll and restrained background feedback.

## Real actions only

The opening returns to chapter progress 0. Explore sounds moves to .57, where the existing interactive Explore preview is available. The latter is omitted in reduced-motion/poster/WebGL fallback. It does not automatically start audio or activate the preview. Both download actions retain `PLAY_STORE_URL` links; desktop clicks now open the shared QR side panel, with menu dismissal completed before that handoff. See `desktop-download-qr-panel.md`.

No fabricated future pages, Apple availability or Section 02 navigation.

## Ownership and accessibility

The dock owns its compactness CSS variable through a passive native scroll-direction listener. It does not use chapter progress or create a ScrollTrigger. Menu animation owns its separate dialog surface and contents. The phone timeline and pose definitions are untouched. The listener is removed on cleanup; GSAP context reverts its tweens. Modal-open scroll events do not change dock state.

Native modal dialog provides focus containment. Named trigger/panel, expanded state, autofocus on the first menu action, close button, Escape, backdrop dismissal and focus return are included. Wheel/touch/background navigation-key scrolling is suppressed while open without changing body width, scrollbar geometry or chapter height. On dismissal the pending chapter action runs after the closing animation.

GSAP event animations use `useGSAP` / `contextSafe` as documented in Context7's `/greensock/react` guidance. Context owns animation cleanup; wheel listener is symmetrically removed. No new RAF, renderer, progress store or dependency.

Reduced motion opens/closes immediately with complete contents and disables CSS hover travel. Static fallback retains the dock and download access.

## Responsive integration

The dock is centered on mobile rather than the previous right-corner anchor. At widths up to 1100px, the existing Explore controls are positioned 66px above their former bottom offset to avoid competing with the dock. No copy, phone composition, screen, atmosphere or choreography values were changed.

## Files

- `components/landing/chapters/opening/OpeningDock.tsx`
- `components/landing/chapters/opening/opening-dock.module.css`
- `components/landing/chapters/opening/OpeningChapter.tsx`
- `components/landing/chapters/opening/HeroAvailability.tsx` (fallback focus target)
- `components/landing/chapters/opening/opening.module.css` (obsolete anchor styles removed)
- `components/landing/device/explore/explore.module.css` (control separation)

## Review status

Dismissal correction: the full-stage dock wrapper intentionally uses `pointer-events:none` so it does not block the phone. The modal now explicitly restores `pointer-events:auto`; previously it inherited the wrapper's disabled hit testing, preventing both X and outside clicks. Closing immediately at animation time zero also closes directly rather than waiting for a reverse-completion callback that has no travel to complete.

Implementation only. Per the user's standing instruction, no browser testing, lint, TypeScript checks, tests, build or diff checks were run. Menu motion, mobile spacing and forward/reverse dock behavior remain for user review; this document does not claim visual validation.
