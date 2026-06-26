import { withAlpha, lerpColor } from "../canvas-utils";

export type SkyPalette = {
  deepFieldTop: string;
  deepFieldBottom: string;
  nebulaPrimary: string;
  nebulaPrimaryAlpha: number;
  nebulaSecondary: string;
  nebulaSecondaryAlpha: number;
  starVisibility: number;
};

export type AndroidStar = {
  x: number;
  y: number;
  baseAlpha: number;
  radius: number;
  phase: number;
};

export const SKY_BANDS: Array<{ startHour: number; palette: SkyPalette }> = [
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

let _skyPaletteCache: { key: number; palette: SkyPalette } | null = null;

export function getCachedSkyPalette(nowMs: number): SkyPalette {
  const key = Math.floor(nowMs / 60_000); // recompute at most once per minute
  if (_skyPaletteCache?.key === key) return _skyPaletteCache.palette;
  const palette = computeSkyPalette(nowMs);
  _skyPaletteCache = { key, palette };
  return palette;
}

export function computeSkyPalette(nowMs: number): SkyPalette {
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
    deepFieldTop: lerpColor(current.deepFieldTop, next.deepFieldTop, blendT),
    deepFieldBottom: lerpColor(current.deepFieldBottom, next.deepFieldBottom, blendT),
    nebulaPrimary: lerpColor(current.nebulaPrimary, next.nebulaPrimary, blendT),
    nebulaPrimaryAlpha: current.nebulaPrimaryAlpha + (next.nebulaPrimaryAlpha - current.nebulaPrimaryAlpha) * blendT,
    nebulaSecondary: lerpColor(current.nebulaSecondary, next.nebulaSecondary, blendT),
    nebulaSecondaryAlpha: current.nebulaSecondaryAlpha + (next.nebulaSecondaryAlpha - current.nebulaSecondaryAlpha) * blendT,
    starVisibility: current.starVisibility + (next.starVisibility - current.starVisibility) * blendT,
  };
}

export function createAndroidStars(count: number): AndroidStar[] {
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

export const ANDROID_STARS = createAndroidStars(80);

export function drawNebulaBlob(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  radiusX: number,
  radiusY: number,
  color: string,
  alpha: number,
) {
  const gradient = context.createRadialGradient(x, y, 0, x, y, Math.max(radiusX, radiusY));

  gradient.addColorStop(0, withAlpha(color, alpha));
  gradient.addColorStop(0.48, withAlpha(color, alpha * 0.28));
  gradient.addColorStop(1, "rgba(0,0,0,0)");

  context.save();
  context.translate(x, y);
  context.scale(1, radiusY / radiusX);
  context.translate(-x, -y);
  context.fillStyle = gradient;
  context.beginPath();
  context.arc(x, y, radiusX, 0, Math.PI * 2);
  context.fill();
  context.restore();
}

export function drawAndroidShootingStar(
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

export function drawPageSky(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  _progress: number,
  time: number,
  nebulaAccent = "#00E0C7",
) {
  const palette = getCachedSkyPalette(Date.now());
  const seconds = time * 0.001;

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
  const NEBULA_RADIUS = Math.min(width, height) * 0.36;

  const nebulas: Array<{ baseX: number; baseY: number; phase: number; color: string; alpha: number }> = [
    { baseX: 0.30, baseY: 0.35, phase: 0.0, color: palette.nebulaPrimary, alpha: palette.nebulaPrimaryAlpha },
    { baseX: 0.70, baseY: 0.55, phase: 0.33, color: nebulaAccent, alpha: 0.40 },
    { baseX: 0.50, baseY: 0.20, phase: 0.66, color: palette.nebulaSecondary, alpha: palette.nebulaSecondaryAlpha },
  ];

  context.save();
  context.globalCompositeOperation = "lighter";
  nebulas.forEach(({ baseX, baseY, phase, color, alpha }) => {
    const angle = (((seconds / DRIFT_PERIOD) + phase) % 1) * Math.PI * 2;
    drawNebulaBlob(
      context,
      width * baseX + Math.cos(angle) * DRIFT_H,
      height * baseY + Math.sin(angle) * DRIFT_V,
      NEBULA_RADIUS,
      NEBULA_RADIUS,
      color,
      alpha * 0.20,
    );
  });
  context.restore();

  // Layer 2: Starfield — simple white circles (no spikes, no gravity)
  const twinkleT = (time % 4000) / 4000;
  const sizeRef = Math.min(width, height) / 900;

  ANDROID_STARS.forEach((star) => {
    const flicker = 0.5 + 0.5 * Math.sin((twinkleT + star.phase) * Math.PI * 2);
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
  drawAndroidShootingStar(context, width, height, time);
}
