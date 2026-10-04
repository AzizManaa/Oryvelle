# Orb accretion spin — visual prototype

Review: http://localhost:3000/new

Implemented the researched motion principle: circulating accretion light around a stable dark shadow, with a traveling lensed echo in the existing upper arc. This is an artistic approximation, not relativistic ray tracing.

Only `components/landing/chapters/mix/orb-renderer.ts` changed.

- Existing flattened material bands now have continuous directional phase instead of only small back-and-forth phase variation.
- Outer pass: 56-second circulation; principal pass: 28 seconds; inner pass: approximately 18.7 seconds. Existing elapsed-time settlement slows all of these near the timer.
- Existing lavender/cool-teal material separation and asymmetric localized blooms remain. No overall orb/camera rotation, position change, scale change or new geometry.
- The upper lensed crown receives a restrained traveling light layer on its existing path, synchronized to the main disk phase. No extra sphere outline.
- Boundary calls have no ambient life and therefore receive no circulation. Section 01 → orb recognition remains unchanged.
- Reduced motion gives life zero: no circulation or traveling crown light. Existing fallback/offscreen/hidden lifecycle owns drawing as before.
- Reuses the existing Canvas draw and ticker. No new scheduler, asset, renderer, dependency, typography or layout change.

Sources researched before implementation:

- [NASA: warped accretion disk, faster inner gas and sheared bright knots](https://www.nasa.gov/universe/nasa-visualization-shows-a-black-holes-warped-world/)
- [NASA: shadow, photon images and Doppler brightness asymmetry](https://science.nasa.gov/universe/black-holes/anatomy/)

## Review status

Per your instruction, no browser validation, automated tests, lint, TypeScript or build was run for this adjustment. Motion visibility, direction, speed and visual balance remain for your review. No performance measurements claimed. Expected drawing addition is one conic gradient and one stroke while ambient life is active; actual cost is unmeasured.
