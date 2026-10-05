# Hero left action group

Live Flowty inspection in Brave: the pale Start For Free CTA and outlined QR utility open the same right-hand download sheet. The filled down-arrow smoothly advances to the next phone chapter. The muted line below provides reassurance without competing with the CTA.

Oryvelle adaptation:
- Pale Download Oryvelle CTA with a clipped text rollover.
- Separate outlined QR utility on desktop with a growing pale hover fill; uses the existing shared download panel.
- Filled arrow with the same hover language; native smooth scroll to the existing Explore checkpoint (opening progress 0.57). No new ScrollTrigger or timeline.
- Android · Google Play beneath the row; no unsupported free/no-credit-card claim.
- Mobile retains the download button and arrow, with QR hidden. Availability is positioned outside normal flow so it adds no hero height.
- Poster/preview modes omit the progression arrow. Reduced motion disables hover transitions and uses the existing static opening.

Files changed: OpeningChapter.tsx, HeroActions.tsx (replaces HeroAvailability.tsx), opening.module.css.

The phone, scene, scroll distances, and opening animation values were not changed. Captured the desktop composition for review. No tests, lint, typecheck, or build run; testing remains with the user.

## Click interception correction
The R3F full-viewport event wrapper intercepted the hero controls despite the product parent's `pointer-events:none`. Live hit inspection at the QR and scroll-arrow centers returned the WebGL canvas. Renderer hit testing is now disabled except while the existing Explore availability state is true. The original handlers and scroll/QR ownership remain unchanged. No tests run.
