# Opening-only restoration

Date: 4 October 2026. Branch: `feat/flowty-fidelity-redesign`.

## Current experience

`/new` is again the Flowty-inspired phone chapter: editorial hero → physical first turn → changed returning screen → second turn → supported landscape phone. It ends with compact model attribution. No Section 02 or replacement section remains.

- Restored the pre-cosmic `#09090b` page field and existing diagonal beam/desk glow.
- Removed shared night-field tokens, gradients, progress writes and ownership.
- Removed light-to-orb staging, its downstream timeline and its 180svh desktop / 90svh mobile extension.
- Opening journey is now 660svh, matching its existing authored chapter reservation. Phone progress, interpolation, thresholds and timeline values are unchanged.
- Reduced motion and renderer fallback use the single opening viewport instead of reserving space for the removed orb chapter.
- Removed boundary-only assembly wrapper/refs, downstream props and `orbFallback` query handling.
- Loader, hidden native scrollbar, typography, Google Play CTA/support/QR, bottom anchor, stand, phone materials/lights/camera/screens/float and resize pose reconstruction remain.

## Removed

- Entire Section 02 `mix`, `boundary` and `orb-world` component directories, their CSS and tests.
- Global atmosphere and image-sequence implementations, observers/tickers/cache code and route integration.
- Derived mix avatars, constellation SVG/path artwork and public runtime assets.
- All generated v1/v2 frame masters, WebP copies, generation scripts, manifests and contact sheets.
- Earlier 124-frame runtime derivatives.
- Section 02/transition/cosmic/black-hole gate reports and their captures, including rejected comparisons and calibration records.
- Two Android capture artifacts explicitly made for the rejected Gate 04A prototype.

License/provenance notices for retired Android-derived artwork were retained compactly under `docs/source-attributions/android-mix`. No GLB, Blender source, phone screenshot/poster or Android project file was deleted.

## User-supplied sources preserved outside the repository

`/Users/yami/Documents/Next/noxelle-section-02-source-archive-20261004/`

Contains the original Hailuo PNG frame/artwork folder and supplied ZIP. Generated subfolders were removed before archiving. These files no longer ship under `public` or occupy the working repository.

## Repository audit boundary

A static import-reachability inventory across `app`, `components` and `scripts`, rooted at route/layout/error/metadata modules, existing tests and development scripts, found no remaining candidate unreachable source files. This is a reference audit, not execution of tests or a proof that every branch/export is needed.

The production `/` landing still imports its older parallax/orb components. Those are active consumers, not Section 02 dead code, so they were preserved along with legal/support routes, SEO, deployment infrastructure and project-wide styling. No package had been added exclusively for the removed frame/Section 02 work; dependency files were left unchanged.

The original phone inspection script and development-only phone diagnostics still have deliberate workflows and remain.

## Preservation evidence

`opening-only-cleanup.json` records the deletion inventory and SHA-256 hashes taken before this cleanup. All recorded device, entry, pose, easing, opening timeline, stand and supporting-UI files remained byte-identical afterward. The resize regression test and its implementation are retained.

Historic opening/Flowty reports and factual Android product-inspection captures are retained as research/master evidence, not imported runtime code. Older blueprint descriptions do not mean Section 02 remains implemented; this restoration record defines the current route scope.

## Validation

Performed source/reference inspection and preservation hashing only. No browser tests, lint, typecheck, test suite or build were run, honoring the user's standing instruction to leave testing to them. Visual restoration awaits review at `http://localhost:3000/new`. No Git reset, stash, clean or commit was used.
