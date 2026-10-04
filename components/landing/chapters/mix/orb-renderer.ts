import { boundaryState } from "../boundary/boundary-state";

// Adapted from the existing website's Canvas 2D orb drawing layers.
// Independent of the old landing-page state, palette and animation scheduler.
type Point = {
  x: number;
  y: number;
};

type LensingArcSpec = {
  startAngleDeg: number;
  sweepAngleDeg: number;
  radiusFactor: number;
  bendFactor: number;
  alpha: number;
  phaseSpeed: number;
  phaseAmplitudeDeg: number;
  phaseOffset: number;
  warpFrequency: number;
};


const EVENT_HORIZON_FACTOR = 0.46;
const DISK_RADIUS_FACTOR = 0.86;
const DISK_WIDTH_FACTOR = 0.1;
const DISK_FLATTENING = 0.18;
const TWO_PI = Math.PI * 2;
const DEG_TO_RAD = Math.PI / 180;
const LENSING_ARC_SPECS: LensingArcSpec[] = [
  { startAngleDeg: 20, sweepAngleDeg: 118, radiusFactor: 0.76, bendFactor: 0.05, alpha: 0.24, phaseSpeed: 1, phaseAmplitudeDeg: 4, phaseOffset: 0.2, warpFrequency: 3.2 },
  { startAngleDeg: 220, sweepAngleDeg: 122, radiusFactor: 0.76, bendFactor: 0.05, alpha: 0.22, phaseSpeed: 1, phaseAmplitudeDeg: 4, phaseOffset: 2.2, warpFrequency: 3.2 },
  { startAngleDeg: 76, sweepAngleDeg: 188, radiusFactor: 0.84, bendFactor: 0.02, alpha: 0.08, phaseSpeed: 2, phaseAmplitudeDeg: 2, phaseOffset: 1.1, warpFrequency: 2.2 },
];


function blackHolePalette() {
  return { void: "#05030b", hotRed: "#52466b", hotOrange: "#527e87",
    hotYellow: "#a8ceca", quantumPurple: "#64517c", diskBlue: "#86babc", lensedWhite: "#deebe7" };
}
const palette = blackHolePalette();
function withAlpha(hex: string, alpha: number) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${Math.max(0, Math.min(1, alpha))})`;
}

export function drawMixOrb(context: CanvasRenderingContext2D, width: number, height: number, elapsed: number) {
  const center = { x: width / 2, y: height / 2 };
  const radius = Math.min(width, height) / 2.3;
  const disk = wrapLoopProgress(.28 + elapsed / 64000);
  const flow = wrapLoopProgress(.34 + elapsed / 41000);
  const glow = .88 + .045 * Math.sin(elapsed / 17000 * TWO_PI);
  context.clearRect(0, 0, width, height);
  fillRadial(context, center, radius * 1.45, [[0, withAlpha("#328983", .045)], [.5, withAlpha("#675384", .025)], [1,"rgba(0,0,0,0)"]]);
  drawLensingArcs(context, center, radius, flow, palette);
  drawAccretionDiskBack(context, center, radius, disk, flow, glow, palette);
  drawInterstellarBands(context, center, radius, disk, glow * .58, palette);
  drawEventHorizonShadow(context, center, radius, glow, palette);
  drawSingularity(context, center, radius, palette);
  drawAccretionDiskFront(context, center, radius, disk, flow, glow, palette);
  drawPhotonSphere(context, center, radius, disk, glow * .38, palette);
}


// Same drawing passes as the product orb; the boundary changes their geometry
// and material legibility, never trims a path like a line-drawing animation.
export function drawOrbFormation(context: CanvasRenderingContext2D, width: number, height: number, progress: number, ambient?: { elapsed: number; settle: number; contour?: number; radiance?: number; mobileComposition?: boolean; life?: number }) {
  const { bend, core, horizon, light } = boundaryState(progress);
  const elapsed = ambient?.elapsed ?? 0;
  const settle = ambient?.settle ?? 0;
  const radiance = ambient?.radiance ?? 1;
  // Only the downstream world opts into material life. Boundary defaults and
  // its zero-time recognized frame remain unchanged.
  const life = ambient?.life ?? 0;
  const energy = life * (1 - .50 * settle);
  const seconds = elapsed / 1000;
  const irregular = (a: number, b: number, phase: number) => Math.sin(seconds / a) + .43 * (Math.sin(seconds / b + phase) - Math.sin(phase));
  const disk = .28 + .006 * (1 - life * .50 * settle) * Math.sin(elapsed / 90000 * TWO_PI) + energy * .015 * irregular(4.5, 7.3, .7);
  const flow = .34 + .008 * (1 - life * .50 * settle) * Math.sin(elapsed / 71000 * TWO_PI) + energy * .020 * irregular(5.8, 9.1, 1.2);
  // Advect the existing material around the fixed flattened disk. Its passes
  // already use 1x / 2x / 3x angular phases: outer 56s, main 28s, inner ~19s.
  // Keep contour sampling separate so the shadow never turns like a planet.
  const circulation = life * elapsed / 56000;
  const materialDisk = disk + circulation;
  const materialFlow = flow + life * elapsed / 39000;
  const illumination = (1 - .10 * settle) * (1 + .018 * (1 - life * .50 * settle) * Math.sin(elapsed / 23000 * TWO_PI) + energy * .065 * irregular(3.9, 6.7, 2.1));
  const rearLight = 1 + energy * .12 * irregular(4.8, 8.3, .9);
  const frontLight = 1 + energy * .10 * irregular(5.4, 9.7, 2.4);
  const horizonLight = 1 + energy * .09 * irregular(6.1, 10.3, 1.5);
  // Defaults remain the exact approved boundary frame.
  // Boundary-only material calibration: keep the surrounding field dark.
  const ringPalette = { ...palette, hotRed: "#776187", hotOrange: "#648c93",
    hotYellow: "#b0bccb", quantumPurple: "#806494", diskBlue: "#7eaeb3",
    lensedWhite: "#c7b9d9" };
  const mix = (a: number, b: number, t: number) => a + (b - a) * t;
  const narrow = width < 760;
  const mobileComposition = ambient?.mobileComposition ?? false;
  const center = { x: mix(width * .83, width * (mobileComposition ? .60 : narrow ? .85 : .70), bend), y: mix(height * .73, height * (mobileComposition ? .57 : .67), bend) };
  const radius = mix(Math.max(width * .92, height * (mobileComposition ? .82 : 1.45)), mobileComposition ? Math.max(width * .72, height * .46) : Math.max(width * .55, height * (narrow ? .67 : width < height ? .73 : .95)), bend);
  context.clearRect(0, 0, width, height);
  if (!light) return;
  // Broad lavender light is present first. Focus narrows as its already-complete
  // ellipse bends, so there is no moving endpoint or progressively drawn line.
  context.save();
  context.globalAlpha = light;
  fillRadial(context, center, radius * 1.35, [[0, withAlpha("#746181", .05)], [.55, withAlpha("#706185", .045)], [1,"rgba(0,0,0,0)"]]);
  const flat = mix(.36, DISK_FLATTENING, bend);
  const angle = mix(-38, -7, bend);
  withRotation(context, center, angle, () => {
    context.save();
    context.translate(center.x, center.y); context.scale(1, flat); context.translate(-center.x, -center.y);
    const inner = mix(.54, .96, bend);
    fillRadial(context, center, radius * DISK_RADIUS_FACTOR * 1.08, [
      [0, "rgba(0,0,0,0)"], [inner, "rgba(0,0,0,0)"],
      [mix(.79, .985, bend), withAlpha("#ad9bc2", mix(.27, .36, bend) * illumination * radiance)],
      [1, "rgba(0,0,0,0)"],
    ]);
    context.restore();
  });
  context.globalAlpha = light * core;
  drawEventHorizonShadow(context, center, radius, .85, palette);
  drawSingularity(context, center, radius, palette);
  // Light survives across the black center: rear passes above, foreground disk
  // passes physically in front, rather than fading an entire finished orb in.
  context.globalAlpha = light * bend;
  drawAccretionDiskBack(context, center, radius, materialDisk, materialFlow, .90 * illumination * radiance * rearLight, ringPalette);
  // The world adds a lensed image of the rear disk above the dark center.
  // Its strength is zero in the approved boundary renderer.
  if (radiance > 1) {
    context.globalAlpha = light * bend * (radiance - 1) / 1.8;
    drawLensedCrown(context, center, radius, illumination * rearLight, ringPalette, materialDisk * 2, energy);
  }
  context.globalAlpha = light * core;
  drawSingularity(context, center, radius, palette);
  context.globalAlpha = light * bend;
  drawAccretionDiskFront(context, center, radius, materialDisk, materialFlow, .88 * illumination * radiance * frontLight, ringPalette);
  // Circular contours remain secondary to the flattened material bands.
  context.globalAlpha = light * horizon * .18 * (ambient?.contour ?? 1);
  drawLensingArcs(context, center, radius, flow, ringPalette);
  context.globalAlpha = light * horizon * (ambient?.contour ?? 1);
  drawPhotonSphere(context, center, radius * .74, disk, .07 * illumination * horizonLight, ringPalette);
  context.restore();
}



function drawLensedCrown(
  context: CanvasRenderingContext2D,
  center: Point,
  radius: number,
  illumination: number,
  colors: ReturnType<typeof blackHolePalette>,
  materialPhase = 0,
  motionStrength = 0,
) {
  const crown = radius * EVENT_HORIZON_FACTOR * 1.03;
  const points = Array.from({ length: 65 }, (_, index) => {
    const angle = Math.PI * (1.05 + index / 64 * .90);
    return { x: center.x + Math.cos(angle) * crown, y: center.y + Math.sin(angle) * crown * .94 };
  });
  context.save();
  const material = context.createLinearGradient(center.x - crown, 0, center.x + crown, 0);
  material.addColorStop(0, withAlpha(colors.quantumPurple, 0));
  material.addColorStop(.23, withAlpha(colors.hotRed, .28 * illumination));
  material.addColorStop(.53, withAlpha(colors.lensedWhite, .62 * illumination));
  material.addColorStop(.76, withAlpha(colors.diskBlue, .35 * illumination));
  material.addColorStop(1, withAlpha(colors.diskBlue, 0));
  context.lineCap = "round";
  for (const [width, alpha] of [[.055, .12], [.022, .26], [.007, .65]] as const) {
    context.save();
    context.globalAlpha *= alpha;
    context.strokeStyle = material;
    context.lineWidth = radius * width;
    context.beginPath();
    points.forEach((point, index) => index ? context.lineTo(point.x, point.y) : context.moveTo(point.x, point.y));
    context.stroke();
    context.restore();
  }
  if (motionStrength > 0) {
    // A lensed echo of the rear disk's circulating light, confined to the
    // existing crown path. No additional circular outline or moving geometry.
    const traveling = context.createConicGradient(materialPhase * TWO_PI, center.x, center.y);
    traveling.addColorStop(0, withAlpha(colors.lensedWhite, .30));
    traveling.addColorStop(.12, withAlpha(colors.diskBlue, .18));
    traveling.addColorStop(.30, withAlpha(colors.diskBlue, 0));
    traveling.addColorStop(.62, withAlpha(colors.hotRed, 0));
    traveling.addColorStop(.82, withAlpha(colors.hotRed, .14));
    traveling.addColorStop(1, withAlpha(colors.lensedWhite, .30));
    context.globalAlpha *= motionStrength * illumination;
    context.strokeStyle = traveling;
    context.lineWidth = radius * .008;
    context.beginPath();
    points.forEach((point, index) => index ? context.lineTo(point.x, point.y) : context.moveTo(point.x, point.y));
    context.stroke();
  }
  context.restore();
}

function drawLensingArcs(
  context: CanvasRenderingContext2D,
  center: Point,
  baseRadius: number,
  phase: number,
  palette: ReturnType<typeof blackHolePalette>,
) {
  LENSING_ARC_SPECS.forEach((spec) => {
    const points = buildLensingArc(center, baseRadius * spec.radiusFactor, spec, phase);
    strokePath(context, points, withAlpha(palette.quantumPurple, spec.alpha * 0.04), baseRadius * 0.03);
    strokePath(context, points, withAlpha(palette.lensedWhite, spec.alpha * 0.16), baseRadius * 0.011);
    strokePath(context, points, withAlpha(palette.lensedWhite, spec.alpha * 0.28), baseRadius * 0.0035);
  });
}

function drawInterstellarBands(
  context: CanvasRenderingContext2D,
  center: Point,
  baseRadius: number,
  rotationProgress: number,
  glowStrength: number,
  palette: ReturnType<typeof blackHolePalette>,
) {
  const diskRadius = baseRadius * DISK_RADIUS_FACTOR * 0.94;
  const diskWidth = baseRadius * DISK_WIDTH_FACTOR;
  const centers = [
    { x: center.x, y: center.y - baseRadius * 0.17, direction: 1 },
    { x: center.x, y: center.y + baseRadius * 0.17, direction: -1 },
  ];

  centers.forEach((bandCenter) => {
    withFlattenedRotation(context, bandCenter, DISK_FLATTENING * 0.82, loopRotationDeg(rotationProgress, bandCenter.direction, 10 * bandCenter.direction), () => {
      strokeSweepCircle(context, bandCenter, diskRadius, diskWidth * 0.42, [
        "rgba(0,0,0,0)",
        withAlpha(palette.lensedWhite, glowStrength * 0.62),
        withAlpha(palette.hotYellow, glowStrength * 0.46),
        withAlpha(palette.hotOrange, glowStrength * 0.18),
        "rgba(0,0,0,0)",
        "rgba(0,0,0,0)",
        withAlpha(palette.lensedWhite, glowStrength * 0.18),
        "rgba(0,0,0,0)",
      ]);
    });
  });
}

function drawAccretionDiskBack(
  context: CanvasRenderingContext2D,
  center: Point,
  baseRadius: number,
  rotationProgress: number,
  turbulenceProgress: number,
  glowStrength: number,
  palette: ReturnType<typeof blackHolePalette>,
) {
  const diskRadius = baseRadius * DISK_RADIUS_FACTOR;
  const diskWidth = baseRadius * DISK_WIDTH_FACTOR;
  const swirlShift = loopSin(turbulenceProgress, 1, 0.2) * 6;

  withFlattenedRotation(context, center, DISK_FLATTENING, loopRotationDeg(rotationProgress, 1) + swirlShift, () => {
    strokeSweepCircle(context, center, diskRadius * 1.16, diskWidth * 1.12, [
      "rgba(0,0,0,0)",
      withAlpha(palette.hotRed, glowStrength * 0.03),
      withAlpha(palette.hotOrange, glowStrength * 0.06),
      withAlpha(palette.hotYellow, glowStrength * 0.08),
      "rgba(0,0,0,0)",
      "rgba(0,0,0,0)",
      withAlpha(palette.quantumPurple, glowStrength * 0.015),
      "rgba(0,0,0,0)",
    ]);
  });

  withFlattenedRotation(context, center, DISK_FLATTENING, loopRotationDeg(rotationProgress, 2, -22), () => {
    strokeSweepCircle(context, center, diskRadius, diskWidth * 0.54, [
      withAlpha(palette.hotRed, glowStrength * 0.05),
      withAlpha(palette.hotOrange, glowStrength * 0.1),
      withAlpha(palette.hotYellow, glowStrength * 0.14),
      withAlpha(palette.hotOrange, glowStrength * 0.05),
      "rgba(0,0,0,0)",
      "rgba(0,0,0,0)",
      withAlpha(palette.quantumPurple, glowStrength * 0.012),
      withAlpha(palette.hotRed, glowStrength * 0.03),
    ]);
  });
}

function drawAccretionDiskFront(
  context: CanvasRenderingContext2D,
  center: Point,
  baseRadius: number,
  rotationProgress: number,
  turbulenceProgress: number,
  glowStrength: number,
  palette: ReturnType<typeof blackHolePalette>,
) {
  const diskRadius = baseRadius * DISK_RADIUS_FACTOR;
  const diskWidth = baseRadius * DISK_WIDTH_FACTOR;
  const hotspotPhase = 0.5 + 0.5 * loopSin(turbulenceProgress, 2, 0.6);

  withFlattenedRotation(context, center, DISK_FLATTENING, loopRotationDeg(rotationProgress, 2, 18), () => {
    strokeSweepCircle(context, center, diskRadius, diskWidth * 0.52, [
      "rgba(0,0,0,0)",
      withAlpha(palette.diskBlue, glowStrength * 0.18),
      withAlpha(palette.lensedWhite, glowStrength * 0.68),
      withAlpha(palette.hotYellow, glowStrength * 0.44),
      withAlpha(palette.hotOrange, glowStrength * 0.16),
      withAlpha(palette.hotRed, glowStrength * 0.04),
      "rgba(0,0,0,0)",
      "rgba(0,0,0,0)",
    ]);
  });

  withFlattenedRotation(context, center, DISK_FLATTENING, loopRotationDeg(rotationProgress, 3, 42), () => {
    strokeSweepCircle(context, center, diskRadius * 0.82, diskWidth * 0.11, [
      "rgba(0,0,0,0)",
      withAlpha(palette.lensedWhite, glowStrength * 0.64),
      withAlpha(palette.hotYellow, glowStrength * 0.38),
      "rgba(0,0,0,0)",
      "rgba(0,0,0,0)",
      "rgba(0,0,0,0)",
      "rgba(0,0,0,0)",
      "rgba(0,0,0,0)",
    ]);
  });

  drawLocalizedBloom(context, { x: center.x - diskRadius * 0.72, y: center.y - baseRadius * 0.045 }, baseRadius * (0.08 + hotspotPhase * 0.018), palette.lensedWhite, palette.diskBlue, glowStrength * 0.2);
  drawLocalizedBloom(context, { x: center.x + diskRadius * 0.56, y: center.y + baseRadius * 0.06 }, baseRadius * 0.05, palette.hotYellow, palette.hotRed, glowStrength * 0.1);
}

function drawEventHorizonShadow(
  context: CanvasRenderingContext2D,
  center: Point,
  baseRadius: number,
  glowStrength: number,
  palette: ReturnType<typeof blackHolePalette>,
) {
  const eventRadius = baseRadius * EVENT_HORIZON_FACTOR;

  fillRadial(context, center, eventRadius * 1.42, [
    [0, "rgba(0,0,0,0)"],
    [0.42, withAlpha(palette.quantumPurple, glowStrength * 0.04)],
    [0.65, withAlpha(palette.hotOrange, glowStrength * 0.02)],
    [1, "rgba(0,0,0,0)"],
  ]);
  fillRadial(context, center, eventRadius * 1.3, [
    [0, palette.void],
    [0.6, palette.void],
    [0.78, withAlpha(palette.void, 1)],
    [1, "rgba(0,0,0,0)"],
  ]);
}

function drawSingularity(
  context: CanvasRenderingContext2D,
  center: Point,
  baseRadius: number,
  palette: ReturnType<typeof blackHolePalette>,
) {
  const eventRadius = baseRadius * EVENT_HORIZON_FACTOR;

  fillRadial(context, center, eventRadius * 1.02, [
    [0, palette.void],
    [0.62, palette.void],
    [0.86, withAlpha(palette.void, 0.98)],
    [1, "rgba(0,0,0,0)"],
  ]);
}

function drawPhotonSphere(
  context: CanvasRenderingContext2D,
  center: Point,
  baseRadius: number,
  rotationProgress: number,
  glowStrength: number,
  palette: ReturnType<typeof blackHolePalette>,
) {
  const photonRadius = baseRadius * EVENT_HORIZON_FACTOR * 1.5;

  strokeCircle(context, center, photonRadius, baseRadius * 0.013, withAlpha(palette.lensedWhite, glowStrength * 0.13));
  withRotation(context, center, loopRotationDeg(rotationProgress, 1, 18), () => {
    strokeSweepCircle(context, center, photonRadius, baseRadius * 0.0065, [
      "rgba(0,0,0,0)",
      withAlpha(palette.lensedWhite, glowStrength * 0.68),
      withAlpha(palette.diskBlue, glowStrength * 0.12),
      "rgba(0,0,0,0)",
      "rgba(0,0,0,0)",
      withAlpha(palette.hotYellow, glowStrength * 0.14),
      "rgba(0,0,0,0)",
      "rgba(0,0,0,0)",
    ]);
  });
}

function buildLensingArc(center: Point, radius: number, spec: LensingArcSpec, phase: number) {
  const points: Point[] = [];
  const count = 36;
  const animatedOffsetDeg = loopSin(phase, spec.phaseSpeed, spec.phaseOffset) * spec.phaseAmplitudeDeg;
  const startRad = (spec.startAngleDeg + animatedOffsetDeg) * DEG_TO_RAD;
  const sweepRad = spec.sweepAngleDeg * DEG_TO_RAD;

  for (let index = 0; index < count; index += 1) {
    const t = index / (count - 1);
    const bend = Math.sin(t * Math.PI) * spec.bendFactor * radius;
    const turbulence = loopSin(phase, spec.phaseSpeed, t * TWO_PI * spec.warpFrequency + spec.phaseOffset) * radius * 0.012;
    const angle = startRad + sweepRad * t;
    points.push(polarOffset(center, angle, radius - bend + turbulence));
  }

  return points;
}

function drawLocalizedBloom(
  context: CanvasRenderingContext2D,
  center: Point,
  radius: number,
  innerColor: string,
  outerColor: string,
  alpha: number,
) {
  fillRadial(context, center, radius, [
    [0, withAlpha(innerColor, alpha)],
    [0.45, withAlpha(outerColor, alpha * 0.42)],
    [1, "rgba(0,0,0,0)"],
  ]);
}

function strokeSweepCircle(
  context: CanvasRenderingContext2D,
  center: Point,
  radius: number,
  lineWidth: number,
  colors: string[],
) {
  const gradient = context.createConicGradient(0, center.x, center.y);
  const lastIndex = colors.length - 1;

  colors.forEach((color, index) => {
    gradient.addColorStop(index / lastIndex, color);
  });

  strokeCircle(context, center, radius, lineWidth, gradient);
}

function fillRadial(
  context: CanvasRenderingContext2D,
  center: Point,
  radius: number,
  stops: Array<[number, string]>,
) {
  const gradient = context.createRadialGradient(center.x, center.y, 0, center.x, center.y, radius);
  stops.forEach(([stop, color]) => gradient.addColorStop(stop, color));
  fillCircle(context, center, radius, gradient);
}

function fillCircle(
  context: CanvasRenderingContext2D,
  center: Point,
  radius: number,
  fillStyle: string | CanvasGradient,
) {
  context.fillStyle = fillStyle;
  context.beginPath();
  context.arc(center.x, center.y, radius, 0, TWO_PI);
  context.fill();
}

function strokeCircle(
  context: CanvasRenderingContext2D,
  center: Point,
  radius: number,
  lineWidth: number,
  strokeStyle: string | CanvasGradient,
) {
  context.strokeStyle = strokeStyle;
  context.lineWidth = lineWidth;
  context.lineCap = "round";
  context.beginPath();
  context.arc(center.x, center.y, radius, 0, TWO_PI);
  context.stroke();
}

function strokePath(
  context: CanvasRenderingContext2D,
  points: Point[],
  strokeStyle: string | CanvasGradient,
  lineWidth: number,
) {
  if (points.length < 2) {
    return;
  }

  context.strokeStyle = strokeStyle;
  context.lineWidth = lineWidth;
  context.lineCap = "round";
  context.lineJoin = "round";
  context.beginPath();
  context.moveTo(points[0].x, points[0].y);
  points.slice(1).forEach((point) => context.lineTo(point.x, point.y));
  context.stroke();
}

function withFlattenedRotation(
  context: CanvasRenderingContext2D,
  center: Point,
  scaleY: number,
  degrees: number,
  draw: () => void,
) {
  context.save();
  context.translate(center.x, center.y);
  context.scale(1, scaleY);
  context.rotate(degrees * DEG_TO_RAD);
  context.translate(-center.x, -center.y);
  draw();
  context.restore();
}

function withRotation(
  context: CanvasRenderingContext2D,
  center: Point,
  degrees: number,
  draw: () => void,
) {
  context.save();
  context.translate(center.x, center.y);
  context.rotate(degrees * DEG_TO_RAD);
  context.translate(-center.x, -center.y);
  draw();
  context.restore();
}

function loopSin(progress: number, cycles: number, phaseOffset = 0) {
  return Math.sin(progress * TWO_PI * cycles + phaseOffset);
}

function loopRotationDeg(progress: number, turns: number, offsetDeg = 0) {
  return progress * 360 * turns + offsetDeg;
}

function wrapLoopProgress(progress: number) {
  return ((progress % 1) + 1) % 1;
}

function polarOffset(center: Point, angleRad: number, radius: number) {
  return {
    x: center.x + Math.cos(angleRad) * radius,
    y: center.y + Math.sin(angleRad) * radius,
  };
}
