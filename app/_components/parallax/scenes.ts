import { withAlpha, clamp } from "../canvas-utils";
import type { ParallaxMoment, CanvasPoint, SoundStar, PathPoint } from "./types";
import type { SceneState } from "./scene-state";

export const SOUND_STARS: SoundStar[] = [
  {
    label: "Rain",
    x: 30,
    y: 39,
    companions: [
      { x: -5.2, y: -4.2, size: 0.42 },
      { x: -8.4, y: 2.6, size: 0.28 },
      { x: 4.4, y: 4.8, size: 0.34 },
    ],
  },
  {
    label: "Cabin",
    x: 48,
    y: 25,
    companions: [
      { x: -4.2, y: 5.2, size: 0.36 },
      { x: 4.8, y: -5.4, size: 0.28 },
      { x: 7.6, y: 1.8, size: 0.24 },
    ],
  },
  {
    label: "Forest",
    x: 70,
    y: 38,
    companions: [
      { x: -4.8, y: 4.4, size: 0.3 },
      { x: 5.6, y: -4.8, size: 0.4 },
      { x: 8.2, y: 2.4, size: 0.26 },
    ],
  },
  {
    label: "Noise",
    x: 58,
    y: 65,
    companions: [
      { x: -5, y: -4.4, size: 0.26 },
      { x: 4.8, y: 4.8, size: 0.32 },
      { x: 8, y: -1.8, size: 0.22 },
    ],
  },
];

const TIMER_PATH: PathPoint[] = [
  { x: 32, y: 58 },
  { x: 42, y: 44 },
  { x: 56, y: 40 },
  { x: 70, y: 47 },
  { x: 78, y: 62 },
];

const SATELLITE_ORBIT_SPEEDS = [0.12, 0.142, 0.164, 0.186] as const;
const SATELLITE_ORBIT_RADII = [0.82, 0.91, 1.0, 1.09] as const;
const SATELLITE_BASE_ANGLES = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2] as const;
const ORBIT_SCALE_X = 1.0;
const ORBIT_SCALE_Y = 0.74;
const ORBIT_TILT = (-12 * Math.PI) / 180;

function drawStarSpike(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  length: number,
  angle: number,
  color: string,
  alpha: number,
  width: number,
) {
  const dx = Math.cos(angle) * length;
  const dy = Math.sin(angle) * length;
  const gradient = context.createLinearGradient(x - dx, y - dy, x + dx, y + dy);

  gradient.addColorStop(0, "rgba(255,255,255,0)");
  gradient.addColorStop(0.45, withAlpha(color, alpha * 0.18));
  gradient.addColorStop(0.5, withAlpha("#FFFFFF", alpha));
  gradient.addColorStop(0.55, withAlpha(color, alpha * 0.18));
  gradient.addColorStop(1, "rgba(255,255,255,0)");

  context.save();
  context.strokeStyle = gradient;
  context.lineWidth = width;
  context.lineCap = "round";
  context.beginPath();
  context.moveTo(x - dx, y - dy);
  context.lineTo(x + dx, y + dy);
  context.stroke();
  context.restore();
}

function drawGlowingCanvasStar(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  glowRadius: number,
  color: string,
  alpha: number,
) {
  const glow = context.createRadialGradient(x, y, 0, x, y, glowRadius);

  glow.addColorStop(0, withAlpha("#FFFFFF", alpha * 0.32));
  glow.addColorStop(0.2, withAlpha(color, alpha * 0.22));
  glow.addColorStop(0.55, withAlpha(color, alpha * 0.06));
  glow.addColorStop(1, "rgba(0,0,0,0)");

  context.globalAlpha = 1;
  context.fillStyle = glow;
  context.beginPath();
  context.arc(x, y, glowRadius, 0, Math.PI * 2);
  context.fill();

  drawStarSpike(context, x, y, glowRadius * 1.15, 0, "#FFFFFF", alpha * 0.2, 0.62);
  drawStarSpike(context, x, y, glowRadius * 0.88, Math.PI / 2, "#FFFFFF", alpha * 0.16, 0.52);

  context.fillStyle = withAlpha(color, alpha * 0.28);
  context.beginPath();
  context.arc(x, y, radius * 1.8, 0, Math.PI * 2);
  context.fill();

  context.fillStyle = withAlpha("#FFFFFF", alpha);
  context.beginPath();
  context.arc(x, y, Math.max(radius * 0.34, 0.42), 0, Math.PI * 2);
  context.fill();
}

export function drawArrivalCanvas(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  sceneBlend: number,
  moment: ParallaxMoment,
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

export function drawConstellationsCanvas(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  sceneBlend: number,
  moment: ParallaxMoment,
) {
  const starPixels = SOUND_STARS.map((s) => ({
    x: (s.x / 100) * width,
    y: (s.y / 100) * height,
    label: s.label,
  }));

  context.save();
  context.lineCap = "round";
  context.lineJoin = "round";

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

  starPixels.forEach((star, index) => {
    const nodeReveal = clamp((sceneBlend - index * 0.18) / 0.22, 0, 1);
    if (nodeReveal <= 0) return;
    drawGlowingCanvasStar(context, star.x, star.y, 2.2, 20, moment.accent, 0.72 * nodeReveal);
  });

  context.restore();
}

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

export function drawMixCanvas(
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

    const pos = orbitPoint(orbCenter, radius, currentAngle);
    drawGlowingCanvasStar(context, pos.x, pos.y, 2.4, 18, moment.accent, 0.88 * satellitePresence);

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

export function drawFadeCanvas(
  context: CanvasRenderingContext2D,
  _width: number,
  _height: number,
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

  context.strokeStyle = withAlpha("#FFB87A", 0.52 * sceneBlend);
  context.lineWidth = Math.max(1.2, orbRadius * 0.004);
  context.beginPath();
  context.arc(orbCenter.x, orbCenter.y, arcRadius, arcStart, arcStart + arcSweep);
  context.stroke();

  context.strokeStyle = withAlpha("#FFFFFF", 0.12 * sceneBlend);
  context.lineWidth = Math.max(0.6, orbRadius * 0.002);
  context.beginPath();
  context.arc(orbCenter.x, orbCenter.y, orbRadius * 1.22, arcStart, arcStart + arcSweep);
  context.stroke();

  const satellitePresence = Math.max(0.28, 1 - (sceneBlend / 0.6) * (1 - 0.28));
  const speedMultiplier = 1 - sceneBlend * 0.7;
  const trailSweep = 0.4 * (1 - sceneBlend);
  const TRAIL_STEPS = 12;

  SOUND_STARS.forEach((_, index) => {
    const speed = SATELLITE_ORBIT_SPEEDS[index] * speedMultiplier;
    const radius = orbRadius * SATELLITE_ORBIT_RADII[index];
    const currentAngle = SATELLITE_BASE_ANGLES[index] + seconds * speed;

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

    const pos = orbitPoint(orbCenter, radius, currentAngle);
    drawGlowingCanvasStar(context, pos.x, pos.y, 2.4, 18, moment.accent, 0.88 * satellitePresence);
  });

  context.restore();
}

export function drawFinalCanvas(
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

  context.strokeStyle = withAlpha("#FFB87A", 0.08 * sceneBlend);
  context.lineWidth = Math.max(0.8, orbRadius * 0.003);
  context.beginPath();
  context.arc(orbCenter.x, orbCenter.y, orbRadius * 1.18, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * 0.75);
  context.stroke();

  const starPixels = SOUND_STARS.map((s) => ({
    x: (s.x / 100) * width,
    y: (s.y / 100) * height,
  }));
  starPixels.forEach((p) => {
    drawGlowingCanvasStar(context, p.x, p.y, 1.4, 12, moment.accent, 0.28);
  });

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
      drawArrivalCanvas(context, width, height, sceneBlend, moment);
      break;
    case 1:
      drawConstellationsCanvas(context, width, height, sceneBlend, moment);
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

export function drawSceneCanvas(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  progress: number,
  state: SceneState,
  moment: ParallaxMoment,
  time: number,
) {
  const seconds = time * 0.001;
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
