# Android-Faithful Sky Port — Design Spec

**Date:** 2026-06-11  
**Status:** Approved  
**Scope:** `app/_components/parallax-landing-experience.tsx` — `drawPageSky` only

---

## Problem

The current `drawPageSky` renders a complex gravity-lensing starfield with spike stars pulled toward the orb. This looks technically impressive but bears little resemblance to the Android home screen sky, which uses simple small white twinkling circles, three additively-blended nebula orbs drifting on slow elliptical paths, and a time-of-day color palette.

---

## Goal

Replace `drawPageSky` internals with a faithful port of the Android `SkyScene` — same visual layers, same star style, same nebula blend mode, same time-adaptive palette bands, matching color values — while keeping the existing function signature and all surrounding canvas code unchanged.

---

## Android Source Reference

Files read:
- `ui/home/sky/SkyScene.kt`
- `ui/home/sky/Plane0DeepField.kt`
- `ui/home/sky/Plane1Nebulas.kt`
- `ui/home/sky/Plane2Starfield.kt`
- `ui/home/sky/Plane4ShootingStars.kt`
- `ui/home/sky/HourPalette.kt`
- `ui/theme/Palette2026.kt`

---

## Visual Layers (matching Android)

### Layer 0 — Deep Field Gradient

Vertical linear gradient, two stops:
- Top: `deepFieldTop` from active time-band palette
- Bottom: `deepFieldBottom` from active time-band palette

No photo overlay (web has no active sound image).

### Layer 1 — Nebula Orbs (Additive)

Three radial gradient orbs rendered with `ctx.globalCompositeOperation = "lighter"` (equivalent to Android's `BlendMode.Plus`).

**Positions (normalized, matching Android):**
- Nebula A: base X 30%, base Y 35%
- Nebula B: base X 70%, base Y 55%
- Nebula C: base X 50%, base Y 20%

**Drift animation:**
- Loop: 60 seconds
- Each nebula drifts on an ellipse: horizontal radius = width × 0.10, vertical radius = height × 0.06
- Phase offsets: A = 0.0, B = 0.33, C = 0.66
- Speed multiplied by `motionProgress` (from `time`)
- In `reducedMotion` mode: frozen at phase 0

**Gradient per nebula:**
- Radius: 45% of `Math.min(width, height)`
- 3-stop radial gradient:
  - Stop 0 (center): `color @ 0.40 alpha`
  - Stop 0.55: `color @ 0.10 alpha`
  - Stop 1.0: transparent
- Colors:
  - Nebula A: `palette.nebulaPrimary`
  - Nebula B: `nebulaAccent` (passed in from `moment.accent` — existing reactivity kept)
  - Nebula C: `palette.nebulaSecondary`

**Important:** The `"lighter"` composite mode must be saved/restored with `ctx.save()` / `ctx.restore()` so it doesn't affect other draw calls.

### Layer 2 — Starfield

80 white twinkling circles. Seeded LCG (seed = 42, same as Android) for deterministic positions across reloads.

**Per star (randomized at creation time, not per frame):**
- X: 0..1 (full width)
- Y: 0..0.85 (top 85%)
- baseAlpha: 0.4 + random × 0.5 (range 0.4–0.9)
- radius: 0.5 + random × 1.5 px (range 0.5–2.0)
- phase: 0..1 (twinkle offset)

**Per-frame twinkle:**
- Loop: 4 seconds
- flicker = `0.5 + 0.5 × sin(t × 2π + star.phase × 2π)` where `t = (time % 4000) / 4000`
- In `reducedMotion`: flicker = 0.78 (static)
- finalAlpha = `star.baseAlpha × palette.starVisibility × flicker`
- Skip drawing if finalAlpha < 0.05

**Rendering:**
- White filled circle at `finalAlpha`
- Radius: `star.radius × Math.min(width, height) / 900` (scale to canvas size, calibrated to 900px reference)

**No spikes. No glow halos. No gravity effects.**

### Layer 3 — Shooting Stars

2-line rendering per star matching Android's Plane4ShootingStars exactly.

**Spawn:**
- One star at a time (simplified from Android's 2 max)
- Interval: 12 seconds
- Only when `!reducedMotion`

**Per star:**
- Duration: 400ms
- Start X: 0.20 + random × 0.70, Start Y: 0.05 + random × 0.45
- Angle: 225° (midpoint of Android's 210–240° range)
- Length: 10% of width

**Per-frame rendering:**
- progress = elapsed / 400, clamped 0..1
- headX/Y: start + cos/sin(angle) × progress × length
- tailX/Y: head − cos/sin(angle) × min(0.55 × length, progress × length)
- alpha = `(1 − progress) ** 0.7`
- Line 1 (glow): white @ alpha × 0.25, lineWidth = 3px, lineCap round
- Line 2 (core): white @ alpha × 0.85, lineWidth = 1.2px, lineCap round

---

## Time-Adaptive Palette

Computed from `new Date().getHours()` + minutes for cross-fade. Evaluated once per canvas draw call (cheap integer comparison).

### Palette Bands

| Band | Hours | `deepFieldTop` | `deepFieldBottom` | `nebulaPrimary` | `nebulaSecondary` | `starVisibility` |
|---|---|---|---|---|---|---|
| `DEEP_NIGHT` | 23–5 | `#080510` | `#0A0822` | `#00E0C7` @ 0.60 | `#B89AFF` @ 0.50 | 1.00 |
| `TWILIGHT` | 20–23 | `#0D0820` | `#2A1855` | `#B89AFF` @ 1.0 | `#FFB87A` @ 1.0 | 0.70 |
| `PRE_DAWN` | 5–8 | `#0F1B36` | `#FFB87A` @ 0.40 blend | `#67D7FF` @ 1.0 | `#FFB87A` @ 1.0 | 0.40 |
| `DAY` | 8–17 | `#152544` | `#44315E` | `#B89AFF` @ 0.70 | `#67D7FF` @ 0.60 | 0.05 |
| `DUSK` | 17–20 | `#1A2B3F` | `#3F1F44` | `#00E0C7` @ 1.0 | `#FF6B9D` @ 1.0 | 0.30 |

`deepFieldBottom` for PRE_DAWN is a blend: `color-mix(in srgb, #FFB87A 40%, #0F1B36)` = approximately `#2B2030` — compute via `hexLerp("#0F1B36", "#FFB87A", 0.40)`.

### Cross-Fade Between Bands

30-minute transition windows at each band boundary. Within a window, linearly interpolate all palette values between the outgoing and incoming band.

Band boundaries (hour): 5, 8, 17, 20, 23.

The palette function signature:
```ts
type SkyPalette = {
  deepFieldTop: string;       // hex
  deepFieldBottom: string;    // hex
  nebulaPrimary: string;      // hex (pure color, alpha applied at draw time)
  nebulaPrimaryAlpha: number; // center stop alpha for nebula A
  nebulaSecondary: string;    // hex
  nebulaSecondaryAlpha: number; // center stop alpha for nebula C
  starVisibility: number;     // 0..1
};

function computeSkyPalette(nowMs: number): SkyPalette
```

`nowMs` is passed in from the draw loop (`Date.now()` called once per frame outside the function for testability). The returned palette is used directly by the draw functions.

---

## Function Signatures After Change

```ts
// New internal function — replaces current drawPageSky body
function drawPageSky(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  progress: number,
  time: number,           // rAF timestamp (ms since navigation start)
  reducedMotion: boolean,
  nebulaAccent: string,   // moment.accent — Nebula B color (kept from prior work)
): void
```

The call site in the canvas `useEffect` is unchanged.

---

## Functions Removed

The following helper functions become unused and are deleted:

- `drawAmbientGravityHaze`
- `drawGravityLensingField`
- `drawInfallFilaments`
- `sampleAmbientGravityField`
- `drawSoftStar`
- `drawStarSpike`
- `starTint`
- `PAGE_SKY_STARS` constant and `createPageSkyStars`

**Kept:**
- `drawNebulaBlob` — reused by the new nebula layer
- `drawPageShootingStar` — replaced by new implementation (delete old, add new)
- All scene draw functions, dispatcher, blend helpers — untouched

---

## Shooting Star State

The current `drawPageShootingStar` derives timing purely from `seconds % cycle` — no persistent state. The new implementation needs a spawn timestamp. This is stored in a `useRef` inside `ParallaxLandingExperience` alongside the canvas ref, not in module scope.

A `shootingStarRef = useRef<{ spawnMs: number; startX: number; startY: number } | null>(null)` is passed into the draw loop via closure (same pattern as `progressRef`).

---

## Files Changed

| File | Change |
|---|---|
| `app/_components/parallax-landing-experience.tsx` | Replace `drawPageSky` internals; add `computeSkyPalette`; add `SkyPalette` type; add new `drawShootingStar`; remove unused helpers; add `shootingStarRef` |

No other files changed. No new dependencies.

---

## Acceptance Criteria

- The background gradient changes noticeably between day and night hours.
- Three nebula orbs are visible at Android's positions, using additive blending (lighter blend mode).
- Stars are simple small white dots — no spikes, no gravity pull.
- A shooting star appears roughly every 12 seconds and fades with the Android curve.
- `prefers-reduced-motion` freezes all animation (nebulas static, stars at fixed alpha, no shooting stars).
- No TypeScript errors. Production build passes.
- The orb, annotations, scene canvas layers, and layout are visually unchanged.
