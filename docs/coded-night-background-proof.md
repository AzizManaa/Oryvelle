# Coded night background proof

## Scope

The `/new` opening now uses a native coded night field instead of the supplied nebula image. The PNG/WebP remain in `public/backgrounds/` for comparison; neither is requested by this background. Phone rendering, mobile framing, screens, stand, typography and scroll choreography were not changed.

## Composition

- Broad static CSS indigo/lavender/teal washes create depth, with separate desktop/mobile recipes and the existing diagonal beam retained.
- One decorative Canvas 2D layer draws 170 background points on desktop and 90 on mobile.
- Three small constellation clusters on desktop, two on mobile, use thin dim connections and softly luminous nodes. These are decorative sky geometry, not product navigation or Android Explore claims.
- Seeded coordinates are stable across reloads and resizes. Each star has independent brightness, radius, shimmer phase, period (4–13 seconds) and relative amplitude (8–24%). Bright points use small radial sprites, without cross-shaped spikes.
- A smooth intensity falloff keeps the upper-left editorial area quieter. No moving particles, shooting stars, scroll parallax or nebula animation were introduced.

## Lifecycle / rendering

The field uses the existing GSAP ticker, with its own drawing capped at approximately 20Hz. It does not change global ticker frequency, add RAF or alter ScrollTrigger. React does not update state per frame.

Ticker subscription starts only after entry release, while the canvas is intersecting the viewport and the document is visible. Reduced motion and opening fallback retain static stars/haze with no subscription. ResizeObserver redraws the responsive backing store; DPR is capped at 1.5. Two tiny generated glow sprites are reused, avoiding per-star blur filters and gradient allocations each frame.

Cleanup removes ticker/listeners/observers and releases owned canvas backing stores. If Canvas 2D is unavailable, CSS night/haze still renders. The entry and phone fallback owner remain unchanged.

For scale context, a 1440×900 backing store at DPR 1.5 is approximately 11.1 MiB of RGBA pixels, excluding browser overhead. This replaces raster background delivery with visible Canvas drawing work; it is not a claim of measured performance improvement.

## Documentation

Context7 React effect-cleanup guidance and GSAP ticker add/remove/callback documentation were consulted. Global `gsap.ticker.fps()` was deliberately not changed because it would also affect existing animations.

## Review

No browser tests, automated checks or build were run, as requested. Review `/new` for star visibility, constellation restraint, headline contrast and mobile density. The code-generated haze intentionally has less detailed cloud texture than the supplied nebula artwork. No Section 02 work was added.
