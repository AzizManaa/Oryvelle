# Cinematic Atmosphere Lift Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give each of the 5 parallax moments a distinct canvas identity — sound satellites orbiting the orb, a timer arc, ghost traces — and add nebula hue reactivity and per-scene orb glow strength.

**Architecture:** Replace `drawCanvasConstellation` in `parallax-landing-experience.tsx` with a scene dispatcher that calls per-scene draw functions (Arrival, Constellations, Mix, Fade, Final) using a blend value computed from scroll progress. Add `glowStrength` prop to `OryvelleOrbCanvas` to let the host dim/brighten the orb per scene. Thread the active moment's accent color into `drawPageSky` so the dominant nebula blob shifts hue with each scene.

**Tech Stack:** Next.js 16 / React 19 / TypeScript / HTML Canvas 2D API / Tailwind CSS v4. No new dependencies.

**Spec:** `docs/superpowers/specs/2026-06-11-cinematic-atmosphere-lift-design.md`

---

## File Map

| File | Change |
|---|---|
| `app/_components/oryvelle-orb-canvas.tsx` | Add `glowStrength` prop; multiply it into internal `glowStrength` variable |
| `app/_components/parallax-landing-experience.tsx` | Add blend helpers; add `SCENE_GLOW`; update `drawPageSky` signature; add `drawSceneCanvas` dispatcher; add 5 scene draw functions; wire `glowStrength` to `OryvelleOrbCanvas` |

---

## Task 1: Add `glowStrength` prop to `OryvelleOrbCanvas`

**Files:**
- Modify: `app/_components/oryvelle-orb-canvas.tsx:5-10` (props type)
- Modify: `app/_components/oryvelle-orb-canvas.tsx:131-142` (component signature + colorsRef)
- Modify: `app/_components/oryvelle-orb-canvas.tsx:172-181` (drawFrame — multiply external glow)

- [ ] **Step 1: Add `glowStrength` to the props type**

In `oryvelle-orb-canvas.tsx`, replace:
```ts
type OryvelleOrbCanvasProps = {
  primaryColor?: string;
  secondaryColor?: string;
  className?: string;
  reducedMotion?: boolean;
};
```
With:
```ts
type OryvelleOrbCanvasProps = {
  primaryColor?: string;
  secondaryColor?: string;
  glowStrength?: number;
  className?: string;
  reducedMotion?: boolean;
};
```

- [ ] **Step 2: Destructure `glowStrength` in the component and add it to `colorsRef`**

Replace:
```ts
export function OryvelleOrbCanvas({
  primaryColor = "#00E0C7",
  secondaryColor = "#B89AFF",
  className,
  reducedMotion = false,
}: OryvelleOrbCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const colorsRef = useRef({ primaryColor, secondaryColor, reducedMotion });

  useEffect(() => {
    colorsRef.current = { primaryColor, secondaryColor, reducedMotion };
  }, [primaryColor, secondaryColor, reducedMotion]);
```
With:
```ts
export function OryvelleOrbCanvas({
  primaryColor = "#00E0C7",
  secondaryColor = "#B89AFF",
  glowStrength = 1,
  className,
  reducedMotion = false,
}: OryvelleOrbCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const colorsRef = useRef({ primaryColor, secondaryColor, glowStrength, reducedMotion });

  useEffect(() => {
    colorsRef.current = { primaryColor, secondaryColor, glowStrength, reducedMotion };
  }, [primaryColor, secondaryColor, glowStrength, reducedMotion]);
```

- [ ] **Step 3: Multiply external `glowStrength` into the draw loop's internal glow variable**

In `drawFrame`, replace:
```ts
const { primaryColor: primary, secondaryColor: secondary, reducedMotion: isReduced } =
  colorsRef.current;
const elapsed = isReduced ? 0 : time;
const diskProgress = wrapLoopProgress(0.28 + elapsed / 26000);
const flowProgress = wrapLoopProgress(0.34 + elapsed / 11500);
const pulseProgress = wrapLoopProgress(0.14 + elapsed / 8500);
const glowWave = 0.5 + 0.5 * loopSin(pulseProgress, 1);
const turbulenceWave = 0.5 + 0.5 * loopSin(flowProgress, 2, 0.4);
const glowStrength = 0.72 * (0.92 + glowWave * 0.12);
```
With:
```ts
const { primaryColor: primary, secondaryColor: secondary, glowStrength: externalGlowStrength, reducedMotion: isReduced } =
  colorsRef.current;
const elapsed = isReduced ? 0 : time;
const diskProgress = wrapLoopProgress(0.28 + elapsed / 26000);
const flowProgress = wrapLoopProgress(0.34 + elapsed / 11500);
const pulseProgress = wrapLoopProgress(0.14 + elapsed / 8500);
const glowWave = 0.5 + 0.5 * loopSin(pulseProgress, 1);
const turbulenceWave = 0.5 + 0.5 * loopSin(flowProgress, 2, 0.4);
const glowStrength = externalGlowStrength * (0.72 * (0.92 + glowWave * 0.12));
```

- [ ] **Step 4: Type-check**

```bash
cd /Users/yami/Documents/Next/noxelle && npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add app/_components/oryvelle-orb-canvas.tsx
git commit -m "feat: add glowStrength prop to OryvelleOrbCanvas"
```

---

## Task 2: Add blend + color helpers to `parallax-landing-experience.tsx`

**Files:**
- Modify: `app/_components/parallax-landing-experience.tsx` — append helpers before the final `clamp` function

These are pure utility functions needed by all subsequent tasks. Add them just before the existing `clamp` function at the bottom of the file (around line 1370).

- [ ] **Step 1: Add `smoothstepBlend`, `SceneState` type, `computeSceneState`, and `hexLerp`**

Add the following code block before the existing `clamp` function:
```ts
type SceneState = {
  activeScene: number;
  nextScene: number;
  sceneBlend: number;
  outBlend: number;
  inBlend: number;
  crossfading: boolean;
};

function smoothstepBlend(t: number): number {
  const x = Math.max(0, Math.min(1, t));
  return x * x * (3 - 2 * x);
}

function computeSceneState(progress: number, sceneCount: number): SceneState {
  const CROSSFADE = 0.15;
  const segment = 1 / sceneCount;
  const rawIndex = progress / segment;
  const activeScene = Math.min(sceneCount - 1, Math.floor(rawIndex));
  const segmentProgress = Math.max(0, Math.min(1, rawIndex - activeScene));
  const sceneBlend = smoothstepBlend(segmentProgress);
  const crossfadeProgress =
    segmentProgress > 1 - CROSSFADE
      ? (segmentProgress - (1 - CROSSFADE)) / CROSSFADE
      : 0;
  const crossfading = crossfadeProgress > 0;
  const outBlend = crossfading ? 1 - smoothstepBlend(crossfadeProgress) : 1;
  const inBlend = crossfading ? smoothstepBlend(crossfadeProgress) : 0;
  const nextScene = Math.min(sceneCount - 1, activeScene + 1);
  return { activeScene, nextScene, sceneBlend, outBlend, inBlend, crossfading };
}

function hexLerp(from: string, to: string, t: number): string {
  if (!from.startsWith("#") || from.length !== 7 || !to.startsWith("#") || to.length !== 7) {
    return from;
  }
  const fr = Number.parseInt(from.slice(1, 3), 16);
  const fg = Number.parseInt(from.slice(3, 5), 16);
  const fb = Number.parseInt(from.slice(5, 7), 16);
  const tr = Number.parseInt(to.slice(1, 3), 16);
  const tg = Number.parseInt(to.slice(3, 5), 16);
  const tb = Number.parseInt(to.slice(5, 7), 16);
  const r = Math.round(fr + (tr - fr) * t);
  const g = Math.round(fg + (tg - fg) * t);
  const b = Math.round(fb + (tb - fb) * t);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}
```

- [ ] **Step 2: Type-check**

```bash
cd /Users/yami/Documents/Next/noxelle && npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add app/_components/parallax-landing-experience.tsx
git commit -m "feat: add scene blend and color helpers to parallax experience"
```

---

## Task 3: Add nebula accent reactivity to `drawPageSky`

**Files:**
- Modify: `app/_components/parallax-landing-experience.tsx:443-566` (`drawPageSky`)

- [ ] **Step 1: Add `nebulaAccent` parameter to `drawPageSky` signature**

Find the `drawPageSky` function signature:
```ts
function drawPageSky(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  progress: number,
  time: number,
  reducedMotion: boolean,
) {
```
Replace with:
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
```

- [ ] **Step 2: Blend the dominant nebula blob toward the scene accent**

Inside `drawPageSky`, find the first `drawNebulaBlob` call:
```ts
  drawNebulaBlob(
    context,
    width * 0.28 + Math.cos(seconds * 0.08) * width * 0.025,
    height * 0.34 + Math.sin(seconds * 0.07) * height * 0.018,
    maxSize * 0.34,
    maxSize * 0.22,
    "#00E0C7",
    0.22,
  );
```
Replace with:
```ts
  drawNebulaBlob(
    context,
    width * 0.28 + Math.cos(seconds * 0.08) * width * 0.025,
    height * 0.34 + Math.sin(seconds * 0.07) * height * 0.018,
    maxSize * 0.34,
    maxSize * 0.22,
    hexLerp("#00E0C7", nebulaAccent, 0.4),
    0.22,
  );
```

- [ ] **Step 3: Thread `nebulaAccent` from the canvas draw loop**

In the canvas `useEffect` draw loop, find:
```ts
      drawPageSky(context, width, height, progress, time, reducedMotion);
```
Replace with:
```ts
      drawPageSky(context, width, height, progress, time, reducedMotion, activeMomentRef.current.accent);
```

- [ ] **Step 4: Type-check**

```bash
cd /Users/yami/Documents/Next/noxelle && npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 5: Visual check — nebula tint shifts per scene**

```bash
cd /Users/yami/Documents/Next/noxelle && npm run dev
```
Open `http://localhost:3000`. Scroll slowly through all 5 scenes. The left nebula blob should subtly shift hue — teal in Arrival/Constellations, cyan-teal in Mix, amber-warm in Fade, rose in Final.

- [ ] **Step 6: Commit**

```bash
git add app/_components/parallax-landing-experience.tsx
git commit -m "feat: make page sky nebula reactive to active scene accent color"
```

---

## Task 4: Scaffold the scene dispatcher and wire `glowStrength`

**Files:**
- Modify: `app/_components/parallax-landing-experience.tsx`

This task replaces `drawCanvasConstellation` with the dispatcher scaffold. All 5 scene draw functions are stubbed as empty `context.save()/restore()` blocks — they get filled in Tasks 5–9.

- [ ] **Step 1: Add `SCENE_GLOW` constant and satellite orbit constants**

Add these constants near `SOUND_STARS` and `TIMER_PATH` at the top of the file (around line 65):
```ts
const SCENE_GLOW: Record<ParallaxMoment["id"], number> = {
  arrival: 0.55,
  constellations: 0.65,
  mix: 1.0,
  fade: 0.72,
  final: 0.45,
};

const SATELLITE_ORBIT_SPEEDS = [0.12, 0.142, 0.164, 0.186] as const;
const SATELLITE_ORBIT_RADII = [0.82, 0.91, 1.0, 1.09] as const;
const SATELLITE_BASE_ANGLES = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2] as const;
const ORBIT_SCALE_X = 1.0;
const ORBIT_SCALE_Y = 0.74;
const ORBIT_TILT = (-12 * Math.PI) / 180;
```

- [ ] **Step 2: Add stub scene draw functions**

Add these stub functions after `drawCanvasConstellation` (around line 990):
```ts
function drawArrivalCanvas(
  _context: CanvasRenderingContext2D,
  _width: number,
  _height: number,
  _sceneBlend: number,
  _moment: ParallaxMoment,
  _seconds: number,
) {}

function drawConstellationsCanvas(
  _context: CanvasRenderingContext2D,
  _width: number,
  _height: number,
  _sceneBlend: number,
  _moment: ParallaxMoment,
  _seconds: number,
) {}

function drawMixCanvas(
  _context: CanvasRenderingContext2D,
  _width: number,
  _height: number,
  _sceneBlend: number,
  _moment: ParallaxMoment,
  _seconds: number,
  _orbCenter: CanvasPoint,
  _orbRadius: number,
) {}

function drawFadeCanvas(
  _context: CanvasRenderingContext2D,
  _width: number,
  _height: number,
  _sceneBlend: number,
  _moment: ParallaxMoment,
  _seconds: number,
  _orbCenter: CanvasPoint,
  _orbRadius: number,
) {}

function drawFinalCanvas(
  _context: CanvasRenderingContext2D,
  _width: number,
  _height: number,
  _sceneBlend: number,
  _moment: ParallaxMoment,
  _seconds: number,
  _orbCenter: CanvasPoint,
  _orbRadius: number,
) {}

function drawSceneForIndex(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  progress: number,
  sceneIndex: number,
  sceneBlend: number,
  displayAlpha: number,
  moment: ParallaxMoment,
  seconds: number,
  orbCenter: CanvasPoint,
  orbRadius: number,
) {
  context.save();
  context.globalAlpha = displayAlpha;
  switch (sceneIndex) {
    case 0:
      drawArrivalCanvas(context, width, height, sceneBlend, moment, seconds);
      break;
    case 1:
      drawConstellationsCanvas(context, width, height, sceneBlend, moment, seconds);
      break;
    case 2:
      drawMixCanvas(context, width, height, sceneBlend, moment, seconds, orbCenter, orbRadius);
      break;
    case 3:
      drawFadeCanvas(context, width, height, sceneBlend, moment, seconds, orbCenter, orbRadius);
      break;
    case 4:
      drawFinalCanvas(context, width, height, sceneBlend, moment, seconds, orbCenter, orbRadius);
      break;
  }
  context.restore();
}

function drawSceneCanvas(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  progress: number,
  state: SceneState,
  moment: ParallaxMoment,
  time: number,
  reducedMotion: boolean,
) {
  const seconds = reducedMotion ? 0 : time * 0.001;
  const orbCenter: CanvasPoint = {
    x: width * (0.58 + progress * 0.14),
    y: height * (0.52 - progress * 0.08),
  };
  const minSize = Math.min(width, height);
  const orbRadius = minSize * (0.34 + progress * 0.08);

  drawSceneForIndex(
    context, width, height, progress,
    state.activeScene, state.sceneBlend, state.outBlend,
    moment, seconds, orbCenter, orbRadius,
  );

  if (state.crossfading) {
    drawSceneForIndex(
      context, width, height, progress,
      state.nextScene, 0, state.inBlend,
      moment, seconds, orbCenter, orbRadius,
    );
  }
}
```

- [ ] **Step 3: Replace `drawCanvasConstellation` call with `drawSceneCanvas` in the draw loop**

Find in the canvas `useEffect`:
```ts
      drawCanvasConstellation(
        context,
        width,
        height,
        progress,
        activeMomentRef.current,
        reducedMotion,
      );
```
Replace with:
```ts
      const sceneState = computeSceneState(progress, moments.length);
      drawSceneCanvas(
        context,
        width,
        height,
        progress,
        sceneState,
        activeMomentRef.current,
        time,
        reducedMotion,
      );
```

Note: `time` in the draw loop refers to the `time` parameter of the `draw` function. The existing signature is `const draw = (time = 0) => {` — `time` is already available.

- [ ] **Step 4: Wire `glowStrength` prop to `OryvelleOrbCanvas`**

Find the `OryvelleOrbCanvas` usage in the JSX (around line 345):
```tsx
            <OryvelleOrbCanvas
              primaryColor={activeMoment.accent}
              secondaryColor={activeMoment.secondary}
              className="h-full w-full opacity-95"
            />
```
Replace with:
```tsx
            <OryvelleOrbCanvas
              primaryColor={activeMoment.accent}
              secondaryColor={activeMoment.secondary}
              glowStrength={SCENE_GLOW[activeMoment.id]}
              className="h-full w-full opacity-95"
            />
```

- [ ] **Step 5: Type-check**

```bash
cd /Users/yami/Documents/Next/noxelle && npx tsc --noEmit
```
Expected: no errors. (The old `drawCanvasConstellation` function is now unused — either keep it or delete it. Delete it to keep the file clean.)

Find and delete the `drawCanvasConstellation` function (around lines 932–990).

Re-run:
```bash
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 6: Visual check — page still renders, orb dims on Arrival/Final**

```bash
npm run dev
```
Open `http://localhost:3000`. The page should look identical to before (all scene stubs are empty). Scroll through — the orb should visibly dim on Arrival (0.55) and Final (0.45), and brighten on Mix (1.0) since `glowStrength` is now wired.

- [ ] **Step 7: Commit**

```bash
git add app/_components/parallax-landing-experience.tsx
git commit -m "feat: scaffold scene canvas dispatcher and wire glowStrength to orb"
```

---

## Task 5: Implement Scene 0 — Arrival

**Files:**
- Modify: `app/_components/parallax-landing-experience.tsx` — `drawArrivalCanvas`

- [ ] **Step 1: Implement `drawArrivalCanvas`**

Replace the stub:
```ts
function drawArrivalCanvas(
  _context: CanvasRenderingContext2D,
  _width: number,
  _height: number,
  _sceneBlend: number,
  _moment: ParallaxMoment,
  _seconds: number,
) {}
```
With:
```ts
function drawArrivalCanvas(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  sceneBlend: number,
  moment: ParallaxMoment,
  _seconds: number,
) {
  const points = TIMER_PATH.map((point) => ({
    x: (point.x / 100) * width,
    y: (point.y / 100) * height,
  }));
  const pathAlpha = 0.04 + sceneBlend * 0.04;

  context.save();
  context.lineCap = "round";
  context.lineJoin = "round";
  context.strokeStyle = withAlpha(moment.secondary, pathAlpha);
  context.lineWidth = 0.6;
  context.beginPath();
  points.forEach((point, index) => {
    if (index === 0) {
      context.moveTo(point.x, point.y);
      return;
    }
    const previous = points[index - 1];
    const controlX = (previous.x + point.x) / 2;
    const controlY = (previous.y + point.y) / 2 - height * 0.02;
    context.quadraticCurveTo(controlX, controlY, point.x, point.y);
  });
  context.stroke();

  points.forEach((point) => {
    drawGlowingCanvasStar(context, point.x, point.y, 0.8, 6, moment.secondary, pathAlpha * 0.7);
  });
  context.restore();
}
```

- [ ] **Step 2: Visual check**

```bash
npm run dev
```
On the first scene (Arrival), a very faint ghost path should be barely visible. It should feel like deep space before anything begins.

- [ ] **Step 3: Commit**

```bash
git add app/_components/parallax-landing-experience.tsx
git commit -m "feat: implement Arrival canvas scene (ghost path)"
```

---

## Task 6: Implement Scene 1 — Constellations

**Files:**
- Modify: `app/_components/parallax-landing-experience.tsx` — `drawConstellationsCanvas`

- [ ] **Step 1: Implement `drawConstellationsCanvas`**

Replace the stub with:
```ts
function drawConstellationsCanvas(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  sceneBlend: number,
  moment: ParallaxMoment,
  _seconds: number,
) {
  const starPixels = SOUND_STARS.map((s) => ({
    x: (s.x / 100) * width,
    y: (s.y / 100) * height,
    label: s.label,
  }));

  context.save();
  context.lineCap = "round";
  context.lineJoin = "round";

  // Draw connecting paths with sequential reveal
  starPixels.forEach((star, index) => {
    if (index === 0) return;
    const prev = starPixels[index - 1];
    const pathReveal = clamp((sceneBlend - index * 0.18) / 0.22, 0, 1);
    if (pathReveal <= 0) return;

    const ctrlX = (prev.x + star.x) / 2;
    const ctrlY = (prev.y + star.y) / 2 - height * 0.04;
    const SEGMENTS = 20;
    const drawCount = Math.round(SEGMENTS * pathReveal);

    context.strokeStyle = withAlpha(moment.secondary, 0.18 * sceneBlend);
    context.lineWidth = 0.8;
    context.beginPath();
    for (let step = 0; step <= drawCount; step += 1) {
      const t = step / SEGMENTS;
      const mt = 1 - t;
      const x = mt * mt * prev.x + 2 * mt * t * ctrlX + t * t * star.x;
      const y = mt * mt * prev.y + 2 * mt * t * ctrlY + t * t * star.y;
      if (step === 0) context.moveTo(x, y);
      else context.lineTo(x, y);
    }
    context.stroke();
  });

  // Draw nodes appearing sequentially
  starPixels.forEach((star, index) => {
    const nodeReveal = clamp((sceneBlend - index * 0.18) / 0.22, 0, 1);
    if (nodeReveal <= 0) return;
    drawGlowingCanvasStar(context, star.x, star.y, 2.2, 20, moment.accent, 0.72 * nodeReveal);
  });

  context.restore();
}
```

- [ ] **Step 2: Visual check**

```bash
npm run dev
```
Scroll to the second scene (Constellations). The 4 sound star nodes (Rain, Cabin, Forest, Noise) should light up one by one as you scroll through the scene. Connecting paths should draw on between them. The nodes should glow with the scene accent color (cyan-blue).

- [ ] **Step 3: Commit**

```bash
git add app/_components/parallax-landing-experience.tsx
git commit -m "feat: implement Constellations canvas scene (sequential node reveal)"
```

---

## Task 7: Implement Scene 2 — Mix (sound satellite orbits)

**Files:**
- Modify: `app/_components/parallax-landing-experience.tsx` — `drawMixCanvas`

This is the most important scene — the orbiting satellites are the core missing piece from the vision doc.

- [ ] **Step 1: Add orbit position helper**

Add this pure function just before `drawMixCanvas`. It computes a point on the tilted elliptical orbit:
```ts
function orbitPoint(
  center: CanvasPoint,
  orbitRadius: number,
  angle: number,
): CanvasPoint {
  const rawX = Math.cos(angle) * orbitRadius * ORBIT_SCALE_X;
  const rawY = Math.sin(angle) * orbitRadius * ORBIT_SCALE_Y;
  return {
    x: center.x + rawX * Math.cos(ORBIT_TILT) - rawY * Math.sin(ORBIT_TILT),
    y: center.y + rawX * Math.sin(ORBIT_TILT) + rawY * Math.cos(ORBIT_TILT),
  };
}
```

- [ ] **Step 2: Implement `drawMixCanvas`**

Replace the stub with:
```ts
function drawMixCanvas(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  sceneBlend: number,
  moment: ParallaxMoment,
  seconds: number,
  orbCenter: CanvasPoint,
  orbRadius: number,
) {
  const satellitePresence = clamp(sceneBlend / 0.4, 0, 1);
  const TRAIL_SWEEP = 0.4;
  const TRAIL_STEPS = 18;

  context.save();

  SOUND_STARS.forEach((star, index) => {
    const speed = SATELLITE_ORBIT_SPEEDS[index];
    const radius = orbRadius * SATELLITE_ORBIT_RADII[index];
    const currentAngle = SATELLITE_BASE_ANGLES[index] + seconds * speed;

    // Orbital trail
    for (let step = 0; step < TRAIL_STEPS; step += 1) {
      const t = step / (TRAIL_STEPS - 1);
      const angleA = currentAngle - TRAIL_SWEEP * (1 - t);
      const angleB = currentAngle - TRAIL_SWEEP * (1 - (step + 1) / (TRAIL_STEPS - 1));
      const pointA = orbitPoint(orbCenter, radius, angleA);
      const pointB = orbitPoint(orbCenter, radius, Math.min(currentAngle, angleB));
      context.strokeStyle = withAlpha(moment.accent, 0.35 * satellitePresence * t);
      context.lineWidth = 0.7;
      context.lineCap = "round";
      context.beginPath();
      context.moveTo(pointA.x, pointA.y);
      context.lineTo(pointB.x, pointB.y);
      context.stroke();
    }

    // Satellite glow
    const pos = orbitPoint(orbCenter, radius, currentAngle);
    drawGlowingCanvasStar(context, pos.x, pos.y, 2.4, 18, moment.accent, 0.88 * satellitePresence);

    // Label
    const dx = pos.x - orbCenter.x;
    const dy = pos.y - orbCenter.y;
    const len = Math.max(Math.hypot(dx, dy), 1);
    context.font = "7px system-ui, sans-serif";
    context.fillStyle = withAlpha("#EDEAF5", 0.45 * satellitePresence);
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(star.label, pos.x + (dx / len) * 14, pos.y + (dy / len) * 14);
  });

  context.restore();
}
```

- [ ] **Step 3: Visual check**

```bash
npm run dev
```
Scroll to the third scene (Active Mix). Four labeled satellites (Rain, Cabin, Forest, Noise) should orbit the central orb in an elliptical pattern, each on a slightly different radius and speed. Each should leave a short glowing trail. The orb should be at maximum brightness.

- [ ] **Step 4: Commit**

```bash
git add app/_components/parallax-landing-experience.tsx
git commit -m "feat: implement Mix canvas scene (orbiting sound satellites)"
```

---

## Task 8: Implement Scene 3 — Fade Timer

**Files:**
- Modify: `app/_components/parallax-landing-experience.tsx` — `drawFadeCanvas`

- [ ] **Step 1: Implement `drawFadeCanvas`**

Replace the stub with:
```ts
function drawFadeCanvas(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  sceneBlend: number,
  moment: ParallaxMoment,
  seconds: number,
  orbCenter: CanvasPoint,
  orbRadius: number,
) {
  const arcRadius = orbRadius * 1.18;
  const arcStart = -Math.PI / 2;
  const arcSweep = Math.PI * 2 * 0.75 * sceneBlend;

  context.save();
  context.lineCap = "round";

  // Amber timer arc
  context.strokeStyle = withAlpha("#FFB87A", 0.52 * sceneBlend);
  context.lineWidth = Math.max(1.2, orbRadius * 0.004);
  context.beginPath();
  context.arc(orbCenter.x, orbCenter.y, arcRadius, arcStart, arcStart + arcSweep);
  context.stroke();

  // Bright outer edge
  context.strokeStyle = withAlpha("#FFFFFF", 0.12 * sceneBlend);
  context.lineWidth = Math.max(0.6, orbRadius * 0.002);
  context.beginPath();
  context.arc(orbCenter.x, orbCenter.y, orbRadius * 1.22, arcStart, arcStart + arcSweep);
  context.stroke();

  // Carry-over satellites from Mix — dimming and slowing
  const satellitePresence = Math.max(0.28, 1 - (sceneBlend / 0.6) * (1 - 0.28));
  const speedMultiplier = 1 - sceneBlend * 0.7;
  const trailSweep = 0.4 * (1 - sceneBlend);
  const TRAIL_STEPS = 12;

  SOUND_STARS.forEach((star, index) => {
    const speed = SATELLITE_ORBIT_SPEEDS[index] * speedMultiplier;
    const radius = orbRadius * SATELLITE_ORBIT_RADII[index];
    const currentAngle = SATELLITE_BASE_ANGLES[index] + seconds * speed;

    // Dissolving trail
    if (trailSweep > 0.01) {
      for (let step = 0; step < TRAIL_STEPS; step += 1) {
        const t = step / (TRAIL_STEPS - 1);
        const angleA = currentAngle - trailSweep * (1 - t);
        const angleB = currentAngle - trailSweep * (1 - (step + 1) / (TRAIL_STEPS - 1));
        const pointA = orbitPoint(orbCenter, radius, angleA);
        const pointB = orbitPoint(orbCenter, radius, Math.min(currentAngle, angleB));
        context.strokeStyle = withAlpha(moment.accent, 0.35 * satellitePresence * (1 - sceneBlend) * t);
        context.lineWidth = 0.7;
        context.beginPath();
        context.moveTo(pointA.x, pointA.y);
        context.lineTo(pointB.x, pointB.y);
        context.stroke();
      }
    }

    // Satellite glow, dimming
    const pos = orbitPoint(orbCenter, radius, currentAngle);
    drawGlowingCanvasStar(context, pos.x, pos.y, 2.4, 18, moment.accent, 0.88 * satellitePresence);
  });

  context.restore();
}
```

- [ ] **Step 2: Visual check**

```bash
npm run dev
```
Scroll to the fourth scene (Fade Timer). An amber arc should draw around the orb as you scroll deeper into this scene. The satellites from the Mix scene should still be visible but dimmer and slower. The orb itself should be slightly less bright than in Mix.

- [ ] **Step 3: Commit**

```bash
git add app/_components/parallax-landing-experience.tsx
git commit -m "feat: implement Fade Timer canvas scene (amber arc + dimming satellites)"
```

---

## Task 9: Implement Scene 4 — Final

**Files:**
- Modify: `app/_components/parallax-landing-experience.tsx` — `drawFinalCanvas`

- [ ] **Step 1: Implement `drawFinalCanvas`**

Replace the stub with:
```ts
function drawFinalCanvas(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  sceneBlend: number,
  moment: ParallaxMoment,
  _seconds: number,
  orbCenter: CanvasPoint,
  orbRadius: number,
) {
  context.save();
  context.lineCap = "round";

  // Ghost orbital traces — full static ellipses
  SATELLITE_ORBIT_RADII.forEach((radiusMultiplier) => {
    const radius = orbRadius * radiusMultiplier;
    const STEPS = 60;
    context.strokeStyle = withAlpha(moment.accent, 0.06);
    context.lineWidth = 0.5;
    context.beginPath();
    for (let step = 0; step <= STEPS; step += 1) {
      const angle = (step / STEPS) * Math.PI * 2;
      const p = orbitPoint(orbCenter, radius, angle);
      if (step === 0) context.moveTo(p.x, p.y);
      else context.lineTo(p.x, p.y);
    }
    context.closePath();
    context.stroke();
  });

  // Timer arc ghost
  context.strokeStyle = withAlpha("#FFB87A", 0.08 * sceneBlend);
  context.lineWidth = Math.max(0.8, orbRadius * 0.003);
  context.beginPath();
  context.arc(orbCenter.x, orbCenter.y, orbRadius * 1.18, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * 0.75);
  context.stroke();

  // Sound nodes at fixed SVG positions
  const starPixels = SOUND_STARS.map((s) => ({
    x: (s.x / 100) * width,
    y: (s.y / 100) * height,
  }));
  starPixels.forEach((p) => {
    drawGlowingCanvasStar(context, p.x, p.y, 1.4, 12, moment.accent, 0.28);
  });

  // Connecting path ghost
  context.strokeStyle = withAlpha(moment.secondary, 0.08);
  context.lineWidth = 0.6;
  context.beginPath();
  starPixels.forEach((p, index) => {
    if (index === 0) {
      context.moveTo(p.x, p.y);
      return;
    }
    const prev = starPixels[index - 1];
    context.quadraticCurveTo(
      (prev.x + p.x) / 2,
      (prev.y + p.y) / 2 - height * 0.04,
      p.x,
      p.y,
    );
  });
  context.stroke();

  context.restore();
}
```

- [ ] **Step 2: Visual check — full scroll journey**

```bash
npm run dev
```
Scroll through all 5 scenes end to end:
- **Arrival:** Barely visible ghost path. Field is mostly empty.
- **Constellations:** Sound nodes light up and paths draw on sequentially.
- **Mix:** 4 satellites orbiting the orb with trails and labels. Orb at max brightness.
- **Fade Timer:** Amber arc appears, satellites slow and dim.
- **Final:** Ghost orbital ellipses, faint timer arc ghost, static sound nodes. Orb is dim and still.

Crossfade transitions between scenes should be smooth with no visible hard cuts.

- [ ] **Step 3: Commit**

```bash
git add app/_components/parallax-landing-experience.tsx
git commit -m "feat: implement Final canvas scene (composed ghost traces)"
```

---

## Task 10: Build verification and polish pass

**Files:**
- Modify: `app/_components/parallax-landing-experience.tsx` (tweaks only if needed)

- [ ] **Step 1: Production build check**

```bash
cd /Users/yami/Documents/Next/noxelle && npm run build
```
Expected: successful build with no TypeScript errors.

- [ ] **Step 2: Check reduced-motion path**

In the browser dev tools, enable `prefers-reduced-motion` (Chrome: Rendering panel → Emulate CSS media feature: prefers-reduced-motion: reduce). Reload `http://localhost:3000`. The `ReducedMotionLanding` component should render instead of the parallax experience — all feature cards visible, no canvas.

- [ ] **Step 3: Mobile check**

In browser dev tools, switch to a mobile viewport (e.g. iPhone 14 Pro, 390×844). Scroll through all scenes. Verify:
- Text is readable and not overlapping the orb
- Progress rail dots are visible at the bottom
- No overflow or horizontal scroll

- [ ] **Step 4: Final commit if any tweaks made**

```bash
git add app/_components/parallax-landing-experience.tsx app/_components/oryvelle-orb-canvas.tsx
git commit -m "fix: polish pass after cinematic atmosphere lift"
```

---

## Self-Review Checklist

**Spec coverage:**
- ✅ Scene dispatcher replacing `drawCanvasConstellation`
- ✅ `smoothstep` blend + crossfade window
- ✅ Nebula accent reactivity (Task 3)
- ✅ Scene 0 Arrival — ghost TIMER_PATH at low alpha
- ✅ Scene 1 Constellations — sequential node reveal + path draw-on
- ✅ Scene 2 Mix — 4 orbiting satellites with trails + labels
- ✅ Scene 3 Fade — amber arc + satellite carry-over with dimming
- ✅ Scene 4 Final — ghost orbital ellipses + timer arc ghost + static nodes
- ✅ `OryvelleOrbCanvas glowStrength` prop (Task 1)
- ✅ Per-scene glow values wired (Task 4)
- ✅ Crossfade via `outBlend`/`inBlend` in dispatcher

**Spec item checked:** The spec mentions `satellitePresence` carry-forward from Scene 2 → Scene 3 to avoid a pop. Scene 3 starts at `satellitePresence = 1.0` computed from `Math.max(0.28, 1 - (sceneBlend / 0.6) * (1 - 0.28))` which equals 1.0 when `sceneBlend = 0`. ✅

**Type consistency:** `orbitPoint` returns `CanvasPoint`. `SATELLITE_ORBIT_SPEEDS`, `SATELLITE_ORBIT_RADII`, `SATELLITE_BASE_ANGLES` are `as const` tuples indexed by `index` (0–3) matching `SOUND_STARS.forEach` index. ✅

**No placeholders:** All steps have complete code. ✅
