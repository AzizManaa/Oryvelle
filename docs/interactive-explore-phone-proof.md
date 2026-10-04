# Interactive Explore phone proof

Date: 2026-10-05

## Review route and scope

Open `http://localhost:3000/new`. Scroll through the first turn to the returning front-facing phone, then choose **Explore sounds**. Following visual approval, the interactive Explore screen is now the default returning-front screen on `/new`, in development and production builds. The former `?explore=1` query is no longer required. The first Tonight video and final landscape timer are unchanged; the site's root route is unchanged.

This is a curated interactive web translation of Explore, not a port of the entire Android application. No Section 02 was restored. The Tonight recording, phone geometry/materials/lighting, scroll poses, screen thresholds, landscape timer, entry and stand were preserved.

Review refinement: playable stars use compact luminous points with soft radial falloff instead of cross-shaped rays. Selected stars retain a restrained selection ring. The screen header and accessible support text identify the experience as an interactive six-sound preview and direct visitors to discover more in the app, without claiming a catalog count or adding a competing download action. These refinements are also left for user-side testing.

## Product sources

- Read-only Android source: `/Users/yami/Documents/Android/AURA-Sleep`.
- Explore screen, StellarMapCanvas/geometry, category definitions and constellation path cache informed map behavior and placement.
- Rain, Nature and Wave Android vector geometry is translated into `explore-art.json`. Noise uses the product's Wave artwork. Category centers and sound-node ordering follow the actual map conventions; featured Calming Rain occupies its dedicated node.
- Public catalog `https://cdn.oryvelle.app/catalogs/sounds/4/current.json`, schema 4 / catalogVersion 5, inspected on this date. Included sounds are ACTIVE/PUBLIC: Calming Rain, Soft Drizzle, Campfire, Forest Night, Brown Noise and White Noise.
- Six 30-second AAC previews were extracted from matching local Oryvelle audio masters, with short entry/exit fades. They stop at the end; these are not claimed to be seamless loops. Provenance and original vector notices are retained in `public/explore/PROVENANCE.md`.

## Rendering and ownership

The existing physical display mesh receives a 768×1620 CanvasTexture. This remains inside the persistent GLB; there is no floating HTML screen or additional WebGL canvas. The glass and current display material remain intact. Texture color space is sRGB, `flipY=false`, linear filtering, without mipmaps.

Canvas 2D draws restrained product atmosphere, the actual constellation paths, quiet background stars, real sound names, category tabs and selected-light feedback. It owns map coordinates only. GSAP continues to own the physical phone pose; the existing float remains its separate additive transform.

Pointer coordinates are raycast against the physical display, then transformed through the texture's UV matrix. Dragging pans; pinch and Ctrl+wheel zoom around a map position; category controls navigate the curated map. This is fixed-camera screen content, not camera manipulation of the phone.

The R3F `useFrame` callback services drawing, capped to approximately 30 texture updates per second. It uses existing demand invalidation rather than adding RAF/tickers. The approved phone float/video may independently keep the existing renderer active. Actual cost has not been benchmarked.

## Interaction and audio

- Explicit Explore mode exposes touch interactions without capturing mobile scrolling beforehand. Done/Escape exits; Escape/Done return focus to the entry button when available.
- Normal wheel scrolling remains page scrolling; Ctrl+wheel zooms the map while active.
- All map sound/category/zoom actions have keyboard-accessible DOM alternatives. Selected sounds expose independent volume controls and polite status messages.
- At most two previews play simultaneously. This is a web-proof limit, not a claim about the Android mix limit.
- Audio is created/requested only on selection and playback originates from that user gesture. Previews default to 30% volume. Selection toggles playback; Stop audio clears the mix.
- Playback stops when the display turns away, leaves its portrait-B state, becomes offscreen, the tab becomes hidden, or the renderer is removed. It does not automatically resume audio on returning.
- Screen-local selected glow reflects the mix. No website background animation was added.

## Lifecycle and fallbacks

The portrait-B recording is disabled on `/new`; its poster remains the screen initialization fallback. The demo supplies B's texture through the existing source contract. Its owned texture and audio are released on cleanup; the original static B texture is restored. Cached GLB assets are not disposed by this module.

Entry readiness remains with the prepared phone renderer. Interactive eligibility requires entry release, visible canvas, front-facing portrait B, visible document and a live WebGL context. Canvas 2D creation failure retains the static screen source. WebGL/reduced-motion poster behavior remains with the opening's existing fallback owner; interactive controls are excluded there. Touch capture is also removed in fallback, avoiding a scroll trap after context loss.

## Assets and footprint

- Geometry JSON: 25,802 bytes, before compression.
- Six audio previews: approximately 1.4 MiB filesystem total; no eager audio preload.
- One generated 768×1620 RGBA screen texture (about 4.75 MiB base pixel storage, excluding browser Canvas/driver overhead).
- No new dependency, canvas element, global scroll store or animation scheduler.

## Files changed

- `app/new/page.tsx`: enable the approved interactive Explore screen by default.
- `OpeningChapter.tsx` and its CSS: interaction controls/state and scoped active-touch handling.
- `PhoneCanvas.tsx`: connect the screen adapter and skip B video for this proof.
- `phone-model.ts`: expose the prepared display mesh for UV picking.
- `usePhoneScreenVideo.ts`: optional replacement guard.
- New `device/explore/` modules: data, imperative renderer/audio owner, R3F lifecycle adapter, accessible controls and scoped CSS.
- New `public/explore/` previews and provenance.

## Documentation consulted

Context7 Three.js guidance on CanvasTexture dirty updates, raycaster UV hits, texture-coordinate transforms and resource disposal informed the implementation. In particular: the Three.js raycaster texture example and CanvasTexture manual. No additional rendering library was introduced.

## Validation and review limitations

Source/catalog/media inspection was performed. Per the user's instruction, **no browser testing, lint, TypeScript check, test suite or production build was run**. This is implemented but not yet validated in-browser.

Review especially physical-screen UV picking, mobile pinch behavior, controls' spatial separation, audio playback permissions and rapid scroll reversals. The curated constellation renderer is not full Android UI parity; it intentionally excludes premium catalogs, every advanced control and unrelated navigation. Production exposure and broader UI fidelity require a subsequent explicit review decision.
