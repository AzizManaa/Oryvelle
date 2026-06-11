# Android Sky Port Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the existing gravity-lensing spike-star sky with a faithful port of the Android home screen sky: simple white twinkling circles, three additively-blended drifting nebula orbs, and a time-of-day colour palette.

**Architecture:** All changes are confined to `drawPageSky` in `parallax-landing-experience.tsx`. Add `SkyPalette` type, `computeSkyPalette` (time-adaptive), `ANDROID_STARS` constant, and `drawAndroidShootingStar`. Replace the old body of `drawPageSky` with three sequential layers (gradient → nebulas → stars → shooting star). Delete the eight helper functions that only served the old sky.

**Tech Stack:** Next.js 16 / React 19 / TypeScript / HTML Canvas 2D API. No new dependencies.

**Spec:** `docs/superpowers/specs/2026-06-11-android-sky-port-design.md`

---

## File Map

| File | Change |
|---|---|
| `app/_components/parallax-landing-experience.tsx` | Add `AndroidStar` + `SkyPalette` types; add `SKY_BANDS`, `computeSkyPalette`, `createAndroidStars`, `ANDROID_STARS`; add `drawAndroidShootingStar`; replace body of `drawPageSky`; remove `PAGE_SKY_STARS`, `SkyStar` type, and 8 unused helper functions |

---

## Task 1: Add `AndroidStar` / `SkyPalette` types, palette data, and `ANDROID_STARS`

**Files:**
- Modify: `app/_components/parallax-landing-experience.tsx` — insert after `ORBIT_TILT` constant (~line 160), before `PAGE_SKY_STARS`

- [ ] **Step 1: Insert types, band data, `computeSkyPalette`, and star constant**

Find this line (currently around line 160):
```ts
const PAGE_SKY_STARS = createPageSkyStars(128);
```

Insert the following block **immediately before** that line:

```ts
type AndroidStar = {
  x: number;
  y: number;
  baseAlpha: number;
  radius: number;
  phase: number;
};

type SkyPalette = {
  deepFieldTop: string;
  deepFieldBottom: string;
  nebulaPrimary: string;
  nebulaPrimaryAlpha: number;
  nebulaSecondary: string;
  nebulaSecondaryAlpha: number;
  starVisibility: number;
};

const SKY_BANDS: Array<{ startHour: number; palette: SkyPalette }> = [
  {
    startHour: 0,
    palette: { deepFieldTop: "#080510", deepFieldBottom: "#0A0822", nebulaPrimary: "#00E0C7", nebulaPrimaryAlpha: 0.60, nebulaSecondary: "#B89AFF", nebulaSecondaryAlpha: 0.50, starVisibility: 1.00 },
  },
  {
    startHour: 5,
    palette: { deepFieldTop: "#0F1B36", deepFieldBottom: "#6F5751", nebulaPrimary: "#67D7FF", nebulaPrimaryAlpha: 1.0, nebulaSecondary: "#FFB87A", nebulaSecondaryAlpha: 1.0, starVisibility: 0.40 },
  },
  {
    startHour: 8,
    palette: { deepFieldTop: "#152544", deepFieldBottom: "#44315E", nebulaPrimary: "#B89AFF", nebulaPrimaryAlpha: 0.70, nebulaSecondary: "#67D7FF", nebulaSecondaryAlpha: 0.60, starVisibility: 0.05 },
  },
  {
    startHour: 17,
    palette: { deepFieldTop: "#1A2B3F", deepFieldBottom: "#3F1F44", nebulaPrimary: "#00E0C7", nebulaPrimaryAlpha: 1.0, nebulaSecondary: "#FF6B9D", nebulaSecondaryAlpha: 1.0, starVisibility: 0.30 },
  },
  {
    startHour: 20,
    palette: { deepFieldTop: "#0D0820", deepFieldBottom: "#2A1855", nebulaPrimary: "#B89AFF", nebulaPrimaryAlpha: 1.0, nebulaSecondary: "#FFB87A", nebulaSecondaryAlpha: 1.0, starVisibility: 0.70 },
  },
  {
    startHour: 23,
    palette: { deepFieldTop: "#080510", deepFieldBottom: "#0A0822", nebulaPrimary: "#00E0C7", nebulaPrimaryAlpha: 0.60, nebulaSecondary: "#B89AFF", nebulaSecondaryAlpha: 0.50, starVisibility: 1.00 },
  },
];

function computeSkyPalette(nowMs: number): SkyPalette {
  const d = new Date(nowMs);
  const fracHour = d.getHours() + d.getMinutes() / 60;

  let bandIndex = SKY_BANDS.length - 1;
  for (let i = 0; i < SKY_BANDS.length; i += 1) {
    if (fracHour < SKY_BANDS[i].startHour) {
      bandIndex = i - 1;
      break;
    }
  }
  if (bandIndex < 0) bandIndex = SKY_BANDS.length - 1;

  const current = SKY_BANDS[bandIndex].palette;
  const nextIndex = (bandIndex + 1) % SKY_BANDS.length;
  const next = SKY_BANDS[nextIndex].palette;

  let nextHour = SKY_BANDS[nextIndex].startHour;
  if (nextHour <= SKY_BANDS[bandIndex].startHour) nextHour += 24;
  const hoursRemaining = nextHour - fracHour;
  const blendT = hoursRemaining < 0.5 ? 1 - hoursRemaining / 0.5 : 0;

  if (blendT <= 0) return current;

  return {
    deepFieldTop: hexLerp(current.deepFieldTop, next.deepFieldTop, blendT),
    deepFieldBottom: hexLerp(current.deepFieldBottom, next.deepFieldBottom, blendT),
    nebulaPrimary: hexLerp(current.nebulaPrimary, next.nebulaPrimary, blendT),
    nebulaPrimaryAlpha: current.nebulaPrimaryAlpha + (next.nebulaPrimaryAlpha - current.nebulaPrimaryAlpha) * blendT,
    nebulaSecondary: hexLerp(current.nebulaSecondary, next.nebulaSecondary, blendT),
    nebulaSecondaryAlpha: current.nebulaSecondaryAlpha + (next.nebulaSecondaryAlpha - current.nebulaSecondaryAlpha) * blendT,
    starVisibility: current.starVisibility + (next.starVisibility - current.starVisibility) * blendT,
  };
}

function createAndroidStars(count: number): AndroidStar[] {
  let seed = 42;
  const random = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
  return Array.from({ length: count }, () => ({
    x: random(),
    y: random() * 0.85,
    baseAlpha: 0.4 + random() * 0.5,
    radius: 0.5 + random() * 1.5,
    phase: random(),
  }));
}

const ANDROID_STARS = createAndroidStars(80);
```

- [ ] **Step 2: Type-check**

```bash
cd /Users/yami/Documents/Next/noxelle && npx tsc --noEmit 2>&1
```
Expected: no errors (the new types and functions are additions; nothing is changed yet).

- [ ] **Step 3: Commit**

```bash
git add app/_components/parallax-landing-experience.tsx
git commit -m "feat: add SkyPalette, computeSkyPalette, and ANDROID_STARS"
```

---

## Task 2: Add `drawAndroidShootingStar`

**Files:**
- Modify: `app/_components/parallax-landing-experience.tsx` — insert immediately before `drawPageShootingStar` (currently ~line 909)

- [ ] **Step 1: Insert `drawAndroidShootingStar`**

Find:
```ts
function drawPageShootingStar(
```

Insert the following block **immediately before** that line:

```ts
function drawAndroidShootingStar(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
) {
  const INTERVAL_MS = 12000;
  const DURATION_MS = 400;
  const ANGLE = 225 * (Math.PI / 180);
  const LENGTH = width * 0.10;

  const intervalIndex = Math.floor(time / INTERVAL_MS);
  const elapsed = time % INTERVAL_MS;
  if (elapsed > DURATION_MS) return;

  let seed = ((intervalIndex * 1664525 + 1013904223) >>> 0);
  const random = () => {
    seed = ((seed * 1664525 + 1013904223) >>> 0);
    return seed / 4294967296;
  };

  const startX = 0.20 + random() * 0.70;
  const startY = 0.05 + random() * 0.45;
  const progress = elapsed / DURATION_MS;
  const alpha = Math.pow(1 - progress, 0.7);
  const travelPx = progress * LENGTH;
  const tailPx = Math.min(LENGTH * 0.55, travelPx);

  const headX = startX * width + Math.cos(ANGLE) * travelPx;
  const headY = startY * height + Math.sin(ANGLE) * travelPx;
  const tailX = headX - Math.cos(ANGLE) * tailPx;
  const tailY = headY - Math.sin(ANGLE) * tailPx;

  context.save();
  context.lineCap = "round";

  context.strokeStyle = withAlpha("#FFFFFF", alpha * 0.25);
  context.lineWidth = 3;
  context.beginPath();
  context.moveTo(tailX, tailY);
  context.lineTo(headX, headY);
  context.stroke();

  context.strokeStyle = withAlpha("#FFFFFF", alpha * 0.85);
  context.lineWidth = 1.2;
  context.beginPath();
  context.moveTo(tailX, tailY);
  context.lineTo(headX, headY);
  context.stroke();

  context.restore();
}

```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit 2>&1
```
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add app/_components/parallax-landing-experience.tsx
git commit -m "feat: add drawAndroidShootingStar"
```

---

## Task 3: Replace `drawPageSky` body

**Files:**
- Modify: `app/_components/parallax-landing-experience.tsx:462–586` — replace entire function body

- [ ] **Step 1: Replace the `drawPageSky` function**

Find the entire function (from the signature to its closing brace):
```ts
function drawPageSky(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  progress: number,
  time: number,
  reducedMotion: boolean,
  nebulaAccent = "#00E0C7",
) {
  const minSize = Math.min(width, height);
  const maxSize = Math.max(width, height);
  const seconds = reducedMotion ? 0 : time * 0.001;
  const orbCenter = {
    x: width * (0.58 + progress * 0.14),
    y: height * (0.52 - progress * 0.08),
  };
  const orbRadius = minSize * (0.34 + progress * 0.08);
  const background = context.createLinearGradient(0, 0, 0, height);

  background.addColorStop(0, "#080510");
  background.addColorStop(0.44, "#0B0920");
  background.addColorStop(1, "#0A0822");

  context.fillStyle = background;
  context.fillRect(0, 0, width, height);

  context.save();
  context.globalCompositeOperation = "lighter";

  drawNebulaBlob(
    context,
    width * 0.28 + Math.cos(seconds * 0.08) * width * 0.025,
    height * 0.34 + Math.sin(seconds * 0.07) * height * 0.018,
    maxSize * 0.34,
    maxSize * 0.22,
    hexLerp("#00E0C7", nebulaAccent, 0.4),
    0.22,
  );
  drawNebulaBlob(
    context,
    width * 0.72 + Math.cos(seconds * 0.06 + 2.1) * width * 0.028,
    height * 0.56 + Math.sin(seconds * 0.09 + 1.4) * height * 0.02,
    maxSize * 0.39,
    maxSize * 0.25,
    "#B89AFF",
    0.2,
  );
  drawNebulaBlob(
    context,
    width * 0.5 + Math.cos(seconds * 0.05 + 4.2) * width * 0.018,
    height * 0.2 + Math.sin(seconds * 0.08 + 3.1) * height * 0.016,
    maxSize * 0.28,
    maxSize * 0.18,
    "#FFB87A",
    0.11,
  );
  drawAmbientGravityHaze(context, orbCenter, orbRadius, seconds);
  drawGravityLensingField(context, orbCenter, orbRadius, seconds, progress);

  PAGE_SKY_STARS.forEach((star) => {
    const basePoint = {
      x: star.x * width,
      y: star.y * height,
    };
    const sample = sampleAmbientGravityField(
      basePoint,
      orbCenter,
      {
        influenceRadius: orbRadius * 1.75,
        eventHorizonRadius: orbRadius * 0.46,
        maxPullPx: orbRadius * 0.12,
        maxSwirlPx: orbRadius * 0.2,
      },
      seconds,
    );
    const flicker = reducedMotion
      ? 0.78
      : 0.68 + Math.sin(seconds * 1.6 + star.phase * Math.PI * 2) * 0.22;
    const tint = starTint(star.paletteIndex);
    const coreRadius = Math.max(minSize * star.coreRadiusFactor, 0.8);
    const glowRadius = coreRadius * star.glowScale * (1 + sample.strength * 0.34);
    const coreAlpha = star.coreAlpha * flicker * (1 + sample.strength * 0.38);
    const glowAlpha = star.glowAlpha * flicker * (1 + sample.strength * 1.1);
    const compressedCore = Math.max(coreRadius * (1 - sample.strength * 0.22), 0.65);

    drawSoftStar(
      context,
      sample.warpedPoint.x,
      sample.warpedPoint.y,
      compressedCore,
      glowRadius,
      tint,
      coreAlpha,
      glowAlpha,
      star.spikeStrength + sample.strength * 0.18,
    );

    if (sample.strength > 0.34) {
      const streakBoost = clamp((sample.strength - 0.34) / 0.66, 0, 1);
      const streakLength = coreRadius * (2.8 + sample.strength * 5.5);

      context.save();
      context.strokeStyle = withAlpha("#FFFFFF", coreAlpha * streakBoost * 0.16);
      context.lineWidth = compressedCore * (0.32 + streakBoost * 0.42);
      context.lineCap = "round";
      context.beginPath();
      context.moveTo(
        sample.warpedPoint.x - sample.tangent.x * streakLength,
        sample.warpedPoint.y - sample.tangent.y * streakLength,
      );
      context.lineTo(
        sample.warpedPoint.x + sample.tangent.x * streakLength,
        sample.warpedPoint.y + sample.tangent.y * streakLength,
      );
      context.stroke();
      context.restore();
    }
  });

  if (!reducedMotion) {
    drawPageShootingStar(context, width, height, seconds);
  }

  context.restore();
}
```

Replace the entire function with:
```ts
function drawPageSky(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  _progress: number,
  time: number,
  reducedMotion: boolean,
  nebulaAccent = "#00E0C7",
) {
  const palette = computeSkyPalette(Date.now());
  const seconds = reducedMotion ? 0 : time * 0.001;

  // Layer 0: Deep field gradient
  const bg = context.createLinearGradient(0, 0, 0, height);
  bg.addColorStop(0, palette.deepFieldTop);
  bg.addColorStop(1, palette.deepFieldBottom);
  context.fillStyle = bg;
  context.fillRect(0, 0, width, height);

  // Layer 1: Nebula orbs — additive blend (Android BlendMode.Plus)
  const DRIFT_PERIOD = 60;
  const DRIFT_H = width * 0.10;
  const DRIFT_V = height * 0.06;
  const NEBULA_RADIUS = Math.min(width, height) * 0.45;

  const nebulas: Array<{ baseX: number; baseY: number; phase: number; color: string; alpha: number }> = [
    { baseX: 0.30, baseY: 0.35, phase: 0.0, color: palette.nebulaPrimary, alpha: palette.nebulaPrimaryAlpha },
    { baseX: 0.70, baseY: 0.55, phase: 0.33, color: nebulaAccent, alpha: 0.40 },
    { baseX: 0.50, baseY: 0.20, phase: 0.66, color: palette.nebulaSecondary, alpha: palette.nebulaSecondaryAlpha },
  ];

  context.save();
  context.globalCompositeOperation = "lighter";
  nebulas.forEach(({ baseX, baseY, phase, color, alpha }) => {
    const angle = ((seconds / DRIFT_PERIOD) + phase) % 1 * Math.PI * 2;
    drawNebulaBlob(
      context,
      width * baseX + Math.cos(angle) * DRIFT_H,
      height * baseY + Math.sin(angle) * DRIFT_V,
      NEBULA_RADIUS,
      NEBULA_RADIUS,
      color,
      alpha * 0.40,
    );
  });
  context.restore();

  // Layer 2: Starfield — simple white circles (no glow, no spikes)
  const twinkleT = (time % 4000) / 4000;
  const sizeRef = Math.min(width, height) / 900;

  ANDROID_STARS.forEach((star) => {
    const flicker = reducedMotion
      ? 0.78
      : 0.5 + 0.5 * Math.sin((twinkleT + star.phase) * Math.PI * 2);
    const finalAlpha = star.baseAlpha * palette.starVisibility * flicker;
    if (finalAlpha < 0.05) return;

    context.fillStyle = withAlpha("#FFFFFF", finalAlpha);
    context.beginPath();
    context.arc(
      star.x * width,
      star.y * height,
      Math.max(0.5, star.radius * sizeRef),
      0,
      Math.PI * 2,
    );
    context.fill();
  });

  // Layer 3: Shooting star
  if (!reducedMotion) {
    drawAndroidShootingStar(context, width, height, time);
  }
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit 2>&1
```
Expected: no errors (the old helpers are still present but now unused).

- [ ] **Step 3: Commit**

```bash
git add app/_components/parallax-landing-experience.tsx
git commit -m "feat: replace drawPageSky with Android-faithful sky implementation"
```

---

## Task 4: Remove unused helpers

**Files:**
- Modify: `app/_components/parallax-landing-experience.tsx` — delete 9 items

Delete each of the following in one edit pass. They are no longer called by anything.

- [ ] **Step 1: Delete `PAGE_SKY_STARS` constant**

Find and delete:
```ts
const PAGE_SKY_STARS = createPageSkyStars(128);
```
(one line, stands alone — delete entirely)

- [ ] **Step 2: Delete the `SkyStar` type**

Find and delete:
```ts
type SkyStar = {
  x: number;
  y: number;
  coreRadiusFactor: number;
  glowScale: number;
  coreAlpha: number;
  glowAlpha: number;
  phase: number;
  paletteIndex: number;
  spikeStrength: number;
};
```

- [ ] **Step 3: Delete `createPageSkyStars`**

Find and delete the entire function:
```ts
function createPageSkyStars(count: number): SkyStar[] {
```
through its closing `}` (~20 lines).

- [ ] **Step 4: Delete `drawGravityLensingField`, `drawInfallFilaments`, `drawAmbientGravityHaze`, `drawSoftStar`, `drawStarSpike`, `sampleAmbientGravityField`, `starTint`, `drawPageShootingStar`**

Delete each of the following functions in full (from their `function` keyword to their closing `}`):
- `drawGravityLensingField` (~55 lines)
- `drawInfallFilaments` (~45 lines)
- `drawAmbientGravityHaze` (~35 lines)
- `drawSoftStar` (~30 lines)
- `drawStarSpike` (~20 lines)
- `sampleAmbientGravityField` (~50 lines)
- `starTint` (~10 lines)
- `drawPageShootingStar` (~35 lines)

- [ ] **Step 5: Type-check**

```bash
npx tsc --noEmit 2>&1
```
Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add app/_components/parallax-landing-experience.tsx
git commit -m "chore: remove gravity-lensing sky helpers (replaced by Android sky)"
```

---

## Task 5: Build verification + visual check

**Files:** none

- [ ] **Step 1: Production build**

```bash
cd /Users/yami/Documents/Next/noxelle && npm run build 2>&1 | tail -15
```
Expected: `✓ Compiled successfully` with no TypeScript errors.

- [ ] **Step 2: Dev server visual check**

```bash
npm run dev
```

Open `http://localhost:3000`. Verify:
- Background is deep dark gradient (not flat black)
- Three soft nebula blobs visible — teal lower-left, accent upper-right area, secondary upper-center
- Stars are **small simple white dots** with a gentle twinkle — no spikes, no gravity pull toward the orb
- A shooting star appears roughly every 12 seconds, travels diagonally down-left, fades with a dual glow+core line
- Change your system clock to 8:00 AM and reload — stars should be nearly invisible (starVisibility = 0.05 for DAY)
- Change back to a night hour (e.g. 23:00) — full starfield returns

- [ ] **Step 3: Reduced-motion check**

In Chrome DevTools → Rendering → Emulate CSS media: `prefers-reduced-motion: reduce`. Reload. Stars should be present but static (no twinkle). Nebulas frozen. No shooting stars.

---

## Self-Review

**Spec coverage:**
- ✅ Time-adaptive palette — `computeSkyPalette` with 5 bands + 30-min crossfade
- ✅ Three nebula orbs at Android positions (30/35, 70/55, 50/20) with additive blend
- ✅ 60s drift on elliptical paths (DRIFT_H = width×0.10, DRIFT_V = height×0.06)
- ✅ Nebula B uses `nebulaAccent` (moment.accent — existing reactivity preserved)
- ✅ 80 seeded stars (seed=42), white circles 0.5–2px, 4s sine twinkle
- ✅ No spikes, no gravity pull
- ✅ Shooting stars: 2-line glow+core, 400ms, `(1-progress)^0.7` fade, 12s interval
- ✅ `reducedMotion` freezes nebulas + static star alpha + no shooting stars
- ✅ All removed helpers listed explicitly
- ✅ No new dependencies

**Type consistency:** `AndroidStar` defined in Task 1, used in `ANDROID_STARS` (Task 1) and `drawPageSky` (Task 3). `SkyPalette` defined in Task 1, returned by `computeSkyPalette` (Task 1), consumed in `drawPageSky` (Task 3). `drawAndroidShootingStar` defined in Task 2, called in `drawPageSky` (Task 3). ✅

**No placeholders:** All code blocks are complete. ✅
