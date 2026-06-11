# Cinematic Atmosphere Lift — Design Spec

**Date:** 2026-06-11  
**Status:** Approved  
**Scope:** `app/_components/parallax-landing-experience.tsx` and `app/_components/oryvelle-orb-canvas.tsx`

---

## Problem

The 5-moment parallax scroll experience currently shares one static canvas draw behavior across all scenes. `drawCanvasConstellation` draws the same `TIMER_PATH` shape regardless of which moment is active. The orb moves and scales but its visual character stays constant. Scrolling through the 5 moments feels like reading captions on the same backdrop rather than traveling through a night ritual.

---

## Goal

Give each of the 5 moments a distinct canvas identity so that scrolling feels like a cinematic scene change. Implement the sound-satellite orbit system (the core missing piece from the vision doc). Lift the overall atmospheric quality holistically — background nebula reactivity, orb character shifts, and scene-specific canvas content.

---

## Architecture

### Scene Dispatch

Replace the body of `drawCanvasConstellation` with a scene dispatcher. The dispatcher computes:

- `activeScene` — integer 0–4 derived from `progress` (same as `sceneIndex` in the scroll handler)
- `sceneBlend` — float 0→1 representing position within the current scene
- `prevBlend` — float 1→0 for the outgoing scene during crossfade windows

Each scene has its own draw function:

```
drawArrivalCanvas(ctx, width, height, blend, moment, time)
drawConstellationsCanvas(ctx, width, height, blend, moment, time, stars)
drawMixCanvas(ctx, width, height, blend, moment, time, orbCenter, orbRadius)
drawFadeCanvas(ctx, width, height, blend, moment, time, orbCenter, orbRadius)
drawFinalCanvas(ctx, width, height, blend, moment, time)
```

The dispatcher calls both the outgoing and incoming scene during transition windows (the last ~15% of an outgoing scene's scroll range overlaps with the first ~15% of the incoming scene). Elements crossfade via `globalAlpha` interpolation — no hard cuts.

### Blend Calculation

Scene boundaries divide `progress` (0→1) into 5 equal segments of 0.2 each. Within each segment:

```
segmentProgress = (progress - segmentStart) / 0.2   // 0→1
sceneBlend = smoothstep(segmentProgress)             // eased 0→1
```

Crossfade window = the final 15% of each segment. During this window:

```
outBlend = 1 - smoothstep((segmentProgress - 0.85) / 0.15)
inBlend  = smoothstep((nextSegmentProgress) / 0.15)
```

### Nebula Reactivity

`drawPageSky` currently uses hardcoded colors for `drawNebulaBlob` calls. Change the dominant nebula blob to blend toward the current scene's accent color. Blend weight: 40% scene accent, 60% base teal. Use the `sceneBlend` value from the scroll handler (passed via a ref, same pattern as `progressRef`) to lerp between the outgoing and incoming accent.

---

## Scene Signatures

### Scene 0 — Arrival

**Intent:** The field before anything begins. Intentional emptiness.

**Canvas additions:**
- The existing `TIMER_PATH` constellation draws at very low alpha (0.04 + blend × 0.04). Nearly invisible — a ghost.
- No new canvas elements.
- Background nebula: pure teal (`#00E0C7`) dominant.

**Orb character:** `glowStrength = 0.55`. Quiet, barely alive.

---

### Scene 1 — Constellations

**Intent:** Sound nodes light up and connect. The sky becomes a sound map.

**Canvas additions:**
- Draw the 4 `SOUND_STARS` (Rain, Cabin, Forest, Noise) as canvas glowing nodes at their SVG percentage positions translated to canvas pixels.
- Each node: a `drawGlowingCanvasStar` call with the scene accent color, radius ~3px, glow radius ~22px.
- Nodes appear sequentially: node `i` starts fading in at `blend = i * 0.18`, fully visible at `blend = i * 0.18 + 0.22`.
- Draw connecting paths between nodes using the same quadratic curve logic as `TIMER_PATH`. Paths draw on via `strokeDashoffset` animation equivalent: draw only the fraction `blend` of each segment's total length.
- Path color: scene secondary color at alpha 0.18.
- `TIMER_PATH` stays at its Arrival alpha (not increasing yet).

**Orb character:** `glowStrength = 0.65`. Slightly more present as sounds gather.

---

### Scene 2 — Mix

**Intent:** Sound nodes orbit the orb. Active playback state.

**Canvas additions:**
- 4 sound satellites orbit the orb. Each satellite:
  - Orbital radius: `orbRadius × (0.82 + i × 0.09)` — slightly different per satellite
  - Base orbital speed: `0.12 + i × 0.022` radians/second — different per satellite
  - Starting angle: distributed at roughly 90° apart with per-satellite phase offset
  - Orbital path: slightly elliptical (scaleX 1.0, scaleY 0.74, rotated ~−12°)
  - Satellite appearance: `drawGlowingCanvasStar` with radius 2.4px, glow 18px, using scene accent color
  - Tail: a short arc segment (last 0.4 radians of travel) drawn at decreasing alpha — the orbital trail
  - Label: small text label (Rain/Cabin/Forest/Noise) at 7px, `#EDEAF5` at alpha 0.45, offset 14px outward from satellite
- Fade in: satellites appear as `blend` goes from 0 to 0.4. Full presence by blend=0.4.
- Carry-forward: the Scene 3 draw function receives a `satellitePresence` value (float 0→1) from the dispatcher representing how present the satellites were at the Scene 2 → Scene 3 boundary. Scene 3 starts at `satellitePresence = 1.0` and dims from there, avoiding a pop when Scene 2 fades out.
- `TIMER_PATH` continues at low alpha.
- Background nebula shifts to more teal-cyan (mix of `#00E0C7` and `#67D7FF`).

**Orb character:** `glowStrength = 1.0`. Full intensity — the active playback home state.

---

### Scene 3 — Fade Timer

**Intent:** The night is winding down. A timer arc wraps the orb.

**Canvas additions:**
- Draw a circular arc centered on the orb at radius `orbRadius × 1.18`.
- Arc spans 0° to `270° × blend` (draws on as the scene enters).
- Color: amber `#FFB87A` at alpha 0.52.
- Line width: `Math.max(1.2, orbRadius × 0.004)`.
- Arc cap: round.
- A second thinner arc at radius `orbRadius × 1.22`, same span, white at alpha 0.12 — the bright edge.
- Sound satellites from Scene 2 carry over but dim: opacity transitions from 1.0 at start of scene to 0.28 by blend=0.6. Satellites slow: speed multiplied by `(1 - blend × 0.7)`.
- Orbital trails dissolve first (alpha × `1 - blend`).
- Background nebula warms: blend toward amber `#FFB87A` at 25% weight.

**Orb character:** `glowStrength = 0.72`. Glowing but cooling.

---

### Scene 4 — Final

**Intent:** Everything composes. The night has passed.

**Canvas additions:**
- Ghost orbital traces: 4 thin elliptical arcs (the satellite orbits) drawn as complete ellipses at alpha 0.06. Static, no animation.
- Timer arc ghost: same geometry as Scene 3 but at alpha `0.08 × blend`.
- Sound nodes back at their fixed `SOUND_STARS` positions, drawn at alpha 0.28.
- Connecting paths from Scene 1 visible at alpha 0.08.
- Background nebula: blend toward rose `#FF6B9D` at 12% weight, soft and cool.

**Orb character:** `glowStrength = 0.45`. Soft and still. The night has passed.

---

## OryvelleOrbCanvas Changes

Add a `glowStrength` prop (number, default 1.0). This scales:
- The outer glow/bloom radius multiplier
- The alpha of the outer haze layers
- The brightness of infalling filaments

The host (`ParallaxLandingExperience`) passes `glowStrength` computed by lerping between the outgoing and incoming scene's target values using `sceneBlend`.

---

## Transition Model

Crossfade window: the final 15% of each scene's scroll segment (blend > 0.85 triggers the outgoing fade while the next scene's first 15% fades in).

During a crossfade:
- Both scenes draw simultaneously.
- Outgoing scene uses `ctx.globalAlpha = outBlend` for all scene-specific elements.
- Incoming scene uses `ctx.globalAlpha = inBlend`.
- Background nebula color lerps between the two scenes' accent targets.
- `glowStrength` interpolates linearly between the two scenes' target values.

The crossfade is invisible to the user as intentional overlap — it reads as a smooth dissolve.

---

## Reduced Motion

The `reducedMotion` path (`ReducedMotionLanding`) is unchanged. It doesn't use the canvas scene system. All scene-specific canvas work is inside the animation loop which already returns early when `reducedMotion` is true.

---

## Files Changed

| File | Change |
|---|---|
| `app/_components/parallax-landing-experience.tsx` | Replace `drawCanvasConstellation` with scene dispatcher + 5 scene draw functions. Add nebula reactivity. Pass `glowStrength` to `OryvelleOrbCanvas`. |
| `app/_components/oryvelle-orb-canvas.tsx` | Add `glowStrength` prop. Scale bloom/haze layers by it. |

No new dependencies. No new files.

---

## Acceptance Criteria

- Scrolling through the 5 moments produces visually distinct canvas states.
- The Mix scene shows 4 labeled satellites orbiting the orb.
- The Fade scene shows an amber arc around the orb.
- The Final scene shows composited ghost traces.
- Scene transitions crossfade smoothly — no visible hard cuts.
- The orb visibly dims/brightens across scenes.
- The background nebula shifts hue with each scene.
- `prefers-reduced-motion` behavior is unchanged.
- No new npm dependencies.
- No TypeScript errors.
