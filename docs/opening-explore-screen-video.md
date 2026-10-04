# Section 01 — Explore screen recording

## Scope

The returning-front `portraitB` screen now shows a real physical-device recording of Explore. The first Tonight loop (`portraitA`), final landscape timer (`landscapeC`), phone geometry/materials, camera, lighting, entry, float, screen-change thresholds, and GSAP choreography remain unchanged. No Section 02 work was introduced.

## Recorded story

Wide constellation field → slow approach to Rain & Storms → zoom in until sound names become readable → horizontal pan to Nature → diagonal pan to Noise → calm return → zoom out → original wide field.

These are actual app gestures and rendered UI. The recording uses native pinch and pan, not a website animation of a still screenshot. Gestures use cosine easing. Sound taps were intentionally omitted to keep the active mix unchanged and avoid leaving a sheet, selected-state change, or playback prompt at the loop boundary.

The source capture is approximately 68 seconds. Runtime playback is modestly retimed to 1.4×, retaining slow multi-second gestures. Source 3–65 seconds supplies the tour. The final two source seconds overlap the initial wide-view source 1–3 seconds using cosine blending, closing residual shimmer differences after the camera returns. This produces an approximately 44.3-second loop with forward motion throughout, not a ping-pong recording.

## Assets and provenance

- Runtime: `public/opening/oryvelle-explore-loop.mp4`.
- Matching first-frame image: `public/opening/oryvelle-explore-screen-poster.jpg`.
- Master outside the repository: `/Users/yami/Documents/Next/noxelle-screen-recordings/oryvelle-explore-device-master-20261005.mp4`.
- Capture gesture timings: `/Users/yami/Documents/Next/noxelle-screen-recordings/oryvelle-explore-capture-phases.json`.
- Actual physical device: connected Oryvelle Android app, Explore screen, All category, existing active mix.
- Android source inspected read-only: `ExploreScreen.kt`, `StellarMapCanvas.kt`, `StellarMapGeometry.kt`.
- Format: H.264, 1080 × 2210, 30 fps, CRF 18, YUV420p, muted/silent, faststart. Cropped device status/navigation bars (90 pixels top, 40 bottom).
- Encoded duration: 44.266667 seconds / 1,328 frames. File size: 9,130,692 bytes (approximately 9.13 MB).

A temporary ADB gesture helper enabled smooth multi-pointer pinch without installing an app or modifying the Android project. Its device file and the pulled recording's temporary device copy were removed afterward. The app remains on its restored wide Explore view.

## Renderer integration

The existing video playback hook now accepts a semantic screen state. Separate owned instances supply Tonight and Explore textures through the same physical display material. Only the currently selected front-visible screen may play. Both pause behind the phone, offscreen, in a hidden tab, under the entry, or with reduced motion. No additional canvas, animation dependency, RAF scheduler, or authored progress owner was added.

Both recording posters and videos use the physical display's aspect ratio for centered cover fitting. The existing sRGB/video shader correction remains active. The display/glass boundary is unchanged. Explore retains a real first-frame image if its recording cannot load. Cleanup continues to own and release each video's texture, callback, observer, media source, and listeners.

## Review

Review URL: `http://localhost:3000/new` — scroll through the first physical turn to the returning front, then stop to watch Explore.

Media checkpoints were inspected at wide view, Rain, Nature, Noise, and restored wide view. No website/browser testing, lint, TypeScript, tests, or build was run, respecting the user's testing preference. Perceived seam quality and playback within the actual phone remain for user review.

Context7 guidance consulted: Three.js VideoTexture update, color-space annotation, and texture lifecycle.
