# Desktop download QR panel

All opening download entry points now share one download panel: the hero Download Oryvelle link, availability Scan button, bottom dock Download and expanded-menu Download Oryvelle.

## Routing

Unmodified primary clicks on a desktop-style viewport (at least 761px, hover-capable fine pointer) open the QR panel. Android/iPhone/iPad/iPod devices, including touch-capable iPad desktop user agents, retain direct store navigation. Narrow/touch-first viewports retain ordinary download links. Modifier clicks and the no-JavaScript experience preserve the authoritative `PLAY_STORE_URL` href.

The panel's explicit Open Google Play directly link always navigates to the store. No separate platform-card component was added in this change.

## Asset

User-supplied `public/assests/qrcode_play.google.com.png` moved without image modification to `public/opening/oryvelle-google-play-qr.png`. The branded QR replaces the generated SVG in the visible experience. Its encoded destination was not decoded in this pass; the user should confirm scanning during their review. Direct links still use the central site configuration URL.

## Design and ownership

Pale lavender full-height right sheet, 440–680px wide / approximately 38vw, editorial heading, compact explanatory copy and bordered QR/instructions region. Short-height desktop reduces internal spacing rather than changing chapter geometry.

Existing GSAP animates the sheet horizontally over .65s with `power3.inOut`; content reveal begins at .27s, with .35s / 14px travel and .06s group staggering. Background dimming shares the same timeline. Closing reverses this timeline.

One React context handles download interception and one native modal dialog owns the panel. Menu download waits for its existing collapse to finish before opening the sheet. No nested simultaneously-open dialogs, added ScrollTrigger, RAF, canvas or dependency.

Named dialog, autofocus on close, native focus containment, Escape, X, backdrop dismissal and focus return included. Wheel/touch/navigation-key scrolling behind the modal is blocked without body scroll locks or viewport-width changes. Changing to a non-desktop viewport dismisses the sheet. Reduced motion presents the complete sheet immediately.

The prior small QR dialog and its runtime CSS were replaced. Phone transforms, materials, screens, atmosphere and scroll choreography were not changed.

## Review

No browser testing, QR decoding, lint, TypeScript, automated tests, build or diff check run, per user instruction. Desktop/mobile routing, scanning, menu handoff and dismissal remain for user review.
