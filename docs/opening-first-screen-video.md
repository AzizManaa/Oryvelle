# Section 01 — Real Tonight screen recording

## Scope

Only `portraitA` now uses the supplied Android screen recording. The returning `portraitB` and final `landscapeC` states remain unchanged. No opening choreography, camera, lighting, materials, typography, supporting UI, stand, or Section 02 implementation was changed.

## Assets

The initial recording described below was superseded by the device-captured loop documented at the end of this report.

- Incoming recording: `public/assests/Screen_Recording_20261004_233153_Oryvelle.mp4`.
- Renamed runtime recording: `public/opening/oryvelle-tonight-screen.mp4`.
- Matching first-frame fallback: `public/opening/oryvelle-tonight-screen-poster.jpg`.
- Recording: H.264, 1080 × 2210, 60 fps, approximately 24.78 seconds, approximately 11.7 MB, no audio stream.
- MP4 was remuxed with `faststart` for progressive loading. No lossy re-encoding or content trimming was applied.

The beginning, middle, and near-end media frames were inspected. They show the real Tonight screen, its animated orb, and the Campfire + Forest Night mix. This is a recording loop, not a specially authored seamless loop; its end-to-start satellite positions may differ.

## Screen mapping and lifecycle

The existing physical display mesh receives a Three.js `VideoTexture`; no HTML overlay or new renderer is involved. Front glass remains separate. The texture uses sRGB, `flipY=false`, linear filtering, and no mipmaps. Both the video and matching poster use centered cover fitting calculated from the inspected model's display aspect ratio, preserving image proportions with a small lateral crop.

The matching first frame is assigned while the prepared phone initializes. Video data replaces that texture only once a decoded frame is available. The existing global entry and prepared-first-frame contract remain intact; a video failure does not trap the entry.

Playback is muted, inline, and looping. It is independent of scroll progress. It starts after entry release while the initial screen faces the viewer and the canvas is visible. It pauses when the phone turns away, changes semantic screen, leaves the viewport, or the tab is hidden. Reverse scroll restores the initial semantic screen and resumes the recording from its paused time. No authored pose thresholds changed.

Reduced motion prevents playback. Video-load failure retains the matching static screen. Existing renderer-unavailable and context-loss phone-poster fallbacks remain unchanged.

## Rendering and ownership

R3F remains in demand mode. `requestVideoFrameCallback` schedules invalidation for decoded video frames while eligible. Browsers without that API use the existing R3F frame scheduler while playback is active. No independent RAF, GSAP timeline, or animation dependency was added.

The playback hook owns its video element, VideoTexture, callback, observer, and listeners. Cleanup pauses playback, cancels its callback, disconnects observation, removes listeners, releases the media source, restores the static texture, and disposes its owned VideoTexture. Cached loader textures remain untouched.

The original 1080-pixel/60-fps recording has been retained at full quality. Actual decoding cost and visual loop continuity remain for user review; no performance improvement is claimed.

## Review status

Review route: `http://localhost:3000/new`.

Per the user's standing request to handle testing, no browser checks, lint, TypeScript, tests, or production build were run. This is an implementation ready for review, not a browser-validated completion claim.

Documentation consulted through Context7: Three.js VideoTexture/resource cleanup and React Three Fiber demand rendering/invalidation guidance.

## Washed-out video correction

The reported comparison showed lifted dark tones on the phone. Source inspection established that `setScreen()` changed the material map without marking its shader dirty. The prepared first frame uses an image texture; Three.js performs video sRGB decoding inside its shader through `DECODE_VIDEO_TEXTURE`. The installed WebGL renderer does not automatically reselect this variant merely because a non-null image map becomes a non-null video map. Consequently the previously compiled image shader could interpret encoded video values as linear and brighten them again during output conversion.

`setScreen()` now marks the display material `needsUpdate` only when its texture identity changes. This selects the correct shader variant for image → video and video → image transitions, including reverse scroll. Repeated pose updates with the same texture do nothing to the shader lifecycle. The existing sRGB annotation, glass, lighting, exposure, recording, and framing were preserved. Browser validation remains with the user; no tests were run for this correction.

## Physical-device loop replacement

Captured the open Tonight screen directly from the connected physical Android device through ADB, without modifying Android source or interacting with its active mix. Capture master: `/Users/yami/Documents/Next/noxelle-screen-recordings/oryvelle-tonight-device-master-20261005.mp4` (approximately 65 seconds, 1080 × 2340). The original user recording is preserved alongside it as `oryvelle-tonight-original-user-recording.mp4`.

Android source inspection established a 25-second sound-avatar orbit and independently timed orb disk/flow/pulse cycles. Therefore an arbitrary raw recording endpoint is not a natural whole-scene loop. A media-only comparison searched for closely matching three-second intervals one orbit apart, selecting 19.1–22.1 seconds and 44.1–47.1 seconds. The low-resolution moving-world comparison had a mean channel difference of approximately 1.05/255; this is an alignment measure, not a perceptual guarantee.

The final clip begins at source 22.1 seconds and advances normally. Its last three seconds blend the corresponding next-orbit interval into source 19.1–22.1 seconds with cosine easing, so the restart continues from the end of that matched interval. The sound avatars retain forward motion; no ping-pong reversal was used. This short overlap smooths the remaining independent ring/light differences. It is an edited recording, not a claim that every Android animation naturally shares one exact cycle.

- Runtime: `public/opening/oryvelle-tonight-loop.mp4`.
- Duration: exactly 25 seconds / 750 frames.
- Dimensions: 1080 × 2210; device status/navigation bars removed (90 pixels top, 40 bottom).
- Codec: H.264, 30 fps, CRF 18, YUV420p, silent, faststart.
- File size: 2,889,680 bytes (approximately 2.89 MB).
- The matching first-frame poster was replaced too.

Only the media assets and semantic source URL changed. The video-texture lifecycle, phone geometry/materials, opening choreography, and later screens remain unchanged. Beginning/end and alignment frames were inspected as media preparation; website/browser tests, lint, typecheck, and build remain unrun at the user's request. Review the repeated loop in `/new`, particularly the final three-second overlap and restart. Browser decoder-loop latency remains a separate consideration if a pause persists despite matching visual endpoints.
