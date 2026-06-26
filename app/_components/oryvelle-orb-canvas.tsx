"use client";

import { useEffect, useRef } from "react";

type OryvelleOrbCanvasProps = {
  primaryColor?: string;
  secondaryColor?: string;
  glowStrength?: number;
  className?: string;
  reducedMotion?: boolean;
};

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

type InfallStreamSpec = {
  startAngleDeg: number;
  outerRadiusFactor: number;
  windAngleDeg: number;
  swayDeg: number;
  wobbleDeg: number;
  motionSpeed: number;
  widthFactor: number;
  alpha: number;
  outerColor: string;
  innerColor: string;
  drawInFront: boolean;
  phaseOffset: number;
};

type DebrisSpec = {
  startAngleDeg: number;
  outerRadiusFactor: number;
  windAngleDeg: number;
  wobbleDeg: number;
  speed: number;
  sizeFactor: number;
  alpha: number;
  heatBias: number;
  phaseOffset: number;
  drawInFront: boolean;
  swirlDirection?: number;
};

type OrbStarSpec = {
  angleDeg: number;
  radiusFactor: number;
  alpha: number;
  size: number;
  twinkleSpeed: number;
  phaseOffset: number;
};

type GravityFieldConfig = {
  influenceRadius: number;
  eventHorizonRadius: number;
  maxPullPx: number;
  maxSwirlPx: number;
};

type GravitySample = {
  warpedPoint: Point;
  strength: number;
  inward: Point;
  tangent: Point;
  compression: number;
};

const VOID = "#05020A";
const ERROR_RED = "#EF4444";
const AURORA_AMBER = "#FFB87A";
const AURORA_LAVENDER = "#B89AFF";
const RAIN_BLUE = "#4FC3F7";
const MOONLIGHT = "#EDEAF5";

const EVENT_HORIZON_FACTOR = 0.46;
const DISK_RADIUS_FACTOR = 0.86;
const DISK_WIDTH_FACTOR = 0.1;
const DISK_FLATTENING = 0.18;
const TWO_PI = Math.PI * 2;
const DEG_TO_RAD = Math.PI / 180;

const STAR_FIELD_SPECS: OrbStarSpec[] = [
  { angleDeg: 15, radiusFactor: 1.35, alpha: 0.55, size: 0.006, twinkleSpeed: 1, phaseOffset: 0.3 },
  { angleDeg: 52, radiusFactor: 1.28, alpha: 0.45, size: 0.005, twinkleSpeed: 2, phaseOffset: 1.4 },
  { angleDeg: 88, radiusFactor: 1.42, alpha: 0.6, size: 0.007, twinkleSpeed: 1, phaseOffset: 2.1 },
  { angleDeg: 130, radiusFactor: 1.31, alpha: 0.4, size: 0.004, twinkleSpeed: 2, phaseOffset: 1.1 },
  { angleDeg: 175, radiusFactor: 1.38, alpha: 0.5, size: 0.006, twinkleSpeed: 1, phaseOffset: 0.7 },
  { angleDeg: 210, radiusFactor: 1.26, alpha: 0.65, size: 0.008, twinkleSpeed: 3, phaseOffset: 2.8 },
  { angleDeg: 255, radiusFactor: 1.44, alpha: 0.35, size: 0.005, twinkleSpeed: 2, phaseOffset: 2.4 },
  { angleDeg: 300, radiusFactor: 1.33, alpha: 0.55, size: 0.007, twinkleSpeed: 1, phaseOffset: 0.9 },
  { angleDeg: 345, radiusFactor: 1.29, alpha: 0.42, size: 0.005, twinkleSpeed: 2, phaseOffset: 0.4 },
];

const LENSING_ARC_SPECS: LensingArcSpec[] = [
  { startAngleDeg: 20, sweepAngleDeg: 118, radiusFactor: 0.76, bendFactor: 0.05, alpha: 0.24, phaseSpeed: 1, phaseAmplitudeDeg: 4, phaseOffset: 0.2, warpFrequency: 3.2 },
  { startAngleDeg: 220, sweepAngleDeg: 122, radiusFactor: 0.76, bendFactor: 0.05, alpha: 0.22, phaseSpeed: 1, phaseAmplitudeDeg: 4, phaseOffset: 2.2, warpFrequency: 3.2 },
  { startAngleDeg: 76, sweepAngleDeg: 188, radiusFactor: 0.84, bendFactor: 0.02, alpha: 0.08, phaseSpeed: 2, phaseAmplitudeDeg: 2, phaseOffset: 1.1, warpFrequency: 2.2 },
];

const INFALL_STREAM_SPECS: InfallStreamSpec[] = [
  { startAngleDeg: 28, outerRadiusFactor: 1.14, windAngleDeg: 98, swayDeg: 16, wobbleDeg: 10, motionSpeed: 1, widthFactor: 0.026, alpha: 0.84, outerColor: lerpColor(ERROR_RED, AURORA_AMBER, 0.44), innerColor: lerpColor(AURORA_AMBER, MOONLIGHT, 0.22), drawInFront: false, phaseOffset: 0.2 },
  { startAngleDeg: 204, outerRadiusFactor: 1.12, windAngleDeg: 90, swayDeg: 14, wobbleDeg: 9, motionSpeed: 2, widthFactor: 0.02, alpha: 0.76, outerColor: lerpColor(ERROR_RED, AURORA_AMBER, 0.38), innerColor: lerpColor(RAIN_BLUE, MOONLIGHT, 0.2), drawInFront: false, phaseOffset: 1.6 },
  { startAngleDeg: 96, outerRadiusFactor: 1.08, windAngleDeg: 112, swayDeg: 18, wobbleDeg: 12, motionSpeed: 1, widthFactor: 0.018, alpha: 0.66, outerColor: lerpColor(AURORA_LAVENDER, RAIN_BLUE, 0.34), innerColor: lerpColor(ERROR_RED, AURORA_AMBER, 0.36), drawInFront: true, phaseOffset: 0.9 },
  { startAngleDeg: 284, outerRadiusFactor: 1.11, windAngleDeg: 104, swayDeg: 15, wobbleDeg: 11, motionSpeed: 2, widthFactor: 0.016, alpha: 0.62, outerColor: lerpColor(ERROR_RED, AURORA_AMBER, 0.22), innerColor: lerpColor(AURORA_AMBER, MOONLIGHT, 0.3), drawInFront: true, phaseOffset: 2.2 },
  { startAngleDeg: 342, outerRadiusFactor: 1.05, windAngleDeg: 82, swayDeg: 12, wobbleDeg: 8, motionSpeed: 1, widthFactor: 0.01, alpha: 0.36, outerColor: lerpColor(AURORA_LAVENDER, RAIN_BLUE, 0.26), innerColor: MOONLIGHT, drawInFront: false, phaseOffset: 1.2 },
];

const DEBRIS_SPECS: DebrisSpec[] = [
  { startAngleDeg: 18, outerRadiusFactor: 1.04, windAngleDeg: 106, wobbleDeg: 10, speed: 1, sizeFactor: 0.024, alpha: 0.72, heatBias: 0.82, phaseOffset: 0.04, drawInFront: false },
  { startAngleDeg: 72, outerRadiusFactor: 1.08, windAngleDeg: 124, wobbleDeg: 12, speed: 2, sizeFactor: 0.02, alpha: 0.66, heatBias: 0.74, phaseOffset: 0.18, drawInFront: false },
  { startAngleDeg: 138, outerRadiusFactor: 1.06, windAngleDeg: 112, wobbleDeg: 9, speed: 1, sizeFactor: 0.018, alpha: 0.58, heatBias: 0.62, phaseOffset: 0.31, drawInFront: false },
  { startAngleDeg: 206, outerRadiusFactor: 1.1, windAngleDeg: 118, wobbleDeg: 11, speed: 2, sizeFactor: 0.022, alpha: 0.7, heatBias: 0.68, phaseOffset: 0.47, drawInFront: true },
  { startAngleDeg: 268, outerRadiusFactor: 1.05, windAngleDeg: 108, wobbleDeg: 10, speed: 1, sizeFactor: 0.019, alpha: 0.54, heatBias: 0.78, phaseOffset: 0.63, drawInFront: true },
  { startAngleDeg: 324, outerRadiusFactor: 1.09, windAngleDeg: 122, wobbleDeg: 13, speed: 2, sizeFactor: 0.017, alpha: 0.5, heatBias: 0.56, phaseOffset: 0.79, drawInFront: true },
];

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

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d", { alpha: true });

    if (!context) {
      return;
    }

    let animationFrame = 0;
    let width = 0;
    let height = 0;
    let pixelRatio = 1;

    const resize = () => {
      pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = Math.floor(width * pixelRatio);
      canvas.height = Math.floor(height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    };

    const drawFrame = (time: number) => {
      const { primaryColor: primary, secondaryColor: secondary, glowStrength: externalGlowStrength, reducedMotion: isReduced } =
        colorsRef.current;
      const elapsed = isReduced ? 0 : time;
      const diskProgress = wrapLoopProgress(0.28 + elapsed / 26000);
      const flowProgress = wrapLoopProgress(0.34 + elapsed / 11500);
      const pulseProgress = wrapLoopProgress(0.14 + elapsed / 8500);
      const glowWave = 0.5 + 0.5 * loopSin(pulseProgress, 1);
      const turbulenceWave = 0.5 + 0.5 * loopSin(flowProgress, 2, 0.4);
      const glowStrength = externalGlowStrength * (0.72 * (0.92 + glowWave * 0.12));
      const jetStrength = 0.055 * (0.92 + turbulenceWave * 0.08);
      const palette = blackHolePalette(primary, secondary);
      const center = { x: width / 2, y: height / 2 };
      const baseRadius = Math.min(width, height) / 2.25;

      context.clearRect(0, 0, width, height);
      drawDeepSpaceGlow(context, center, baseRadius, glowStrength, flowProgress, palette);
      drawRelativisticJets(context, center, baseRadius, jetStrength, palette);
      drawLensingArcs(context, center, baseRadius, flowProgress, palette);
      drawAccretionDiskBack(context, center, baseRadius, diskProgress, flowProgress, glowStrength, palette);
      drawInterstellarBands(context, center, baseRadius, diskProgress, glowStrength, palette);
      drawInfallingDebris(context, center, baseRadius, flowProgress, glowStrength, palette, false);
      drawInfallStreams(context, center, baseRadius, flowProgress, false, palette);
      drawEventHorizonShadow(context, center, baseRadius, glowStrength, palette);
      drawSingularity(context, center, baseRadius, palette);
      drawAccretionDiskFront(context, center, baseRadius, diskProgress, flowProgress, glowStrength, palette);
      drawInfallingDebris(context, center, baseRadius, flowProgress, glowStrength, palette, true);
      drawInfallStreams(context, center, baseRadius, flowProgress, true, palette);
      drawPhotonSphere(context, center, baseRadius, diskProgress, glowStrength, palette);

      if (!isReduced) {
        animationFrame = window.requestAnimationFrame(drawFrame);
      }
    };

    resize();
    animationFrame = window.requestAnimationFrame(drawFrame);
    window.addEventListener("resize", resize);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className={className} />;
}

function drawDeepSpaceGlow(
  context: CanvasRenderingContext2D,
  center: Point,
  baseRadius: number,
  glowStrength: number,
  loopProgress: number,
  palette: ReturnType<typeof blackHolePalette>,
) {
  fillRadial(context, center, baseRadius * 2.15, [
    [0, withAlpha(palette.quantumPurple, glowStrength * 0.015)],
    [0.46, withAlpha(palette.hotOrange, glowStrength * 0.008)],
    [1, "rgba(0,0,0,0)"],
  ]);

  const nebulaOffset = {
    x: center.x - baseRadius * 0.18 * loopSin(loopProgress, 1),
    y: center.y + baseRadius * 0.1 * loopSin(loopProgress, 2, 0.85),
  };
  fillRadial(context, nebulaOffset, baseRadius * 1.15, [
    [0, withAlpha(palette.diskBlue, glowStrength * 0.012)],
    [0.48, withAlpha(palette.quantumPurple, glowStrength * 0.01)],
    [1, "rgba(0,0,0,0)"],
  ]);

  STAR_FIELD_SPECS.forEach((star) => {
    const angle = star.angleDeg * DEG_TO_RAD;
    const starCenter = polarOffset(center, angle, baseRadius * star.radiusFactor);
    const pulse = 0.78 + 0.22 * loopSin(loopProgress, star.twinkleSpeed, star.phaseOffset);
    const glowRadius = baseRadius * star.size * 2.2;

    fillRadial(context, starCenter, glowRadius, [
      [0, withAlpha(palette.lensedWhite, star.alpha * glowStrength * pulse * 0.08)],
      [1, "rgba(0,0,0,0)"],
    ]);
    fillCircle(context, starCenter, baseRadius * star.size * 0.84, withAlpha(palette.lensedWhite, star.alpha * glowStrength * pulse * 0.45));
  });
}

function drawRelativisticJets(
  context: CanvasRenderingContext2D,
  center: Point,
  baseRadius: number,
  strength: number,
  palette: ReturnType<typeof blackHolePalette>,
) {
  const eventRadius = baseRadius * EVENT_HORIZON_FACTOR;
  const jets = [
    { angleDeg: -90, lengthFactor: 0.14, widthFactor: 0.008, alpha: 0.12 },
    { angleDeg: 90, lengthFactor: 0.1, widthFactor: 0.006, alpha: 0.08 },
  ];

  jets.forEach((jet) => {
    const base = polarOffset(center, jet.angleDeg * DEG_TO_RAD, eventRadius * 0.9);
    const tip = polarOffset(center, jet.angleDeg * DEG_TO_RAD, eventRadius + baseRadius * jet.lengthFactor);

    strokeLine(context, base, tip, withAlpha(palette.jetBlue, strength * jet.alpha * 0.05), baseRadius * jet.widthFactor * 1.4);
    const gradient = context.createLinearGradient(base.x, base.y, tip.x, tip.y);
    gradient.addColorStop(0, withAlpha(palette.jetBlue, strength * jet.alpha * 0.1));
    gradient.addColorStop(0.45, withAlpha(palette.lensedWhite, strength * jet.alpha * 0.04));
    gradient.addColorStop(1, "rgba(0,0,0,0)");
    strokeLine(context, base, tip, gradient, baseRadius * jet.widthFactor * 0.42);
  });
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

function drawInfallStreams(
  context: CanvasRenderingContext2D,
  center: Point,
  baseRadius: number,
  phase: number,
  drawInFront: boolean,
  palette: ReturnType<typeof blackHolePalette>,
) {
  INFALL_STREAM_SPECS.forEach((spec) => {
    if (spec.drawInFront !== drawInFront) {
      return;
    }

    const points = buildInfallStream(center, baseRadius, spec, phase);
    const first = points[0];
    const last = points[points.length - 1];
    const midColor = lerpColor(spec.outerColor, spec.innerColor, 0.38);
    const alphaScale = drawInFront ? 0.42 : 0.18;

    strokePath(context, points, withAlpha(midColor, spec.alpha * alphaScale * 0.05), baseRadius * spec.widthFactor * 1.35);
    const gradient = context.createLinearGradient(first.x, first.y, last.x, last.y);
    gradient.addColorStop(0, withAlpha(spec.outerColor, spec.alpha * alphaScale * 0.03));
    gradient.addColorStop(0.55, withAlpha(midColor, spec.alpha * alphaScale * 0.16));
    gradient.addColorStop(1, withAlpha(spec.innerColor, spec.alpha * alphaScale * 0.28));
    strokePath(context, points, gradient, baseRadius * spec.widthFactor);
    drawLocalizedBloom(context, last, baseRadius * spec.widthFactor * 1.1, spec.innerColor, palette.hotOrange, spec.alpha * alphaScale * 0.04);
  });
}

function drawInfallingDebris(
  context: CanvasRenderingContext2D,
  center: Point,
  baseRadius: number,
  flowProgress: number,
  glowStrength: number,
  palette: ReturnType<typeof blackHolePalette>,
  drawInFront: boolean,
) {
  const fieldConfig = {
    influenceRadius: baseRadius * 1.16,
    eventHorizonRadius: baseRadius * EVENT_HORIZON_FACTOR * 1.04,
    maxPullPx: baseRadius * 0.1,
    maxSwirlPx: baseRadius * 0.14,
  };

  DEBRIS_SPECS.forEach((spec) => {
    if (spec.drawInFront !== drawInFront) {
      return;
    }

    const particle = sampleDebrisParticle(center, baseRadius, spec, flowProgress, fieldConfig);

    if (particle.alpha <= 0.004) {
      return;
    }

    const streakColor = lerpColor(palette.hotOrange, palette.lensedWhite, spec.heatBias);
    const haloColor = lerpColor(streakColor, palette.diskBlue, 0.22);
    const widthScale = 0.8 + particle.strength * 1.1;

    strokeLine(context, particle.tail, particle.head, withAlpha(haloColor, particle.alpha * glowStrength * 0.2), baseRadius * spec.sizeFactor * 1.5 * widthScale);

    const gradient = context.createLinearGradient(particle.tail.x, particle.tail.y, particle.head.x, particle.head.y);
    gradient.addColorStop(0, "rgba(0,0,0,0)");
    gradient.addColorStop(0.58, withAlpha(streakColor, particle.alpha * glowStrength * 0.52));
    gradient.addColorStop(1, withAlpha(palette.lensedWhite, particle.alpha * glowStrength * 0.9));
    strokeLine(context, particle.tail, particle.head, gradient, baseRadius * spec.sizeFactor * 0.72 * widthScale);
    drawLocalizedBloom(context, particle.head, baseRadius * spec.sizeFactor * (1.2 + particle.strength * 0.7), palette.lensedWhite, streakColor, particle.alpha * glowStrength * 0.22);
  });
}

function sampleDebrisParticle(
  center: Point,
  baseRadius: number,
  spec: DebrisSpec,
  flowProgress: number,
  fieldConfig: GravityFieldConfig,
) {
  const cycleProgress = wrapLoopProgress(flowProgress * spec.speed + spec.phaseOffset);
  const lifeFade = Math.max(Math.sin(cycleProgress * Math.PI), 0) ** 0.85;
  const eventRadius = fieldConfig.eventHorizonRadius * 1.04;
  const outerRadius = baseRadius * spec.outerRadiusFactor;
  const radius = outerRadius + (eventRadius - outerRadius) * cycleProgress ** 0.74;
  const wobbleDeg = loopSin(cycleProgress, 1, spec.phaseOffset * TWO_PI) * spec.wobbleDeg;
  const angle = (spec.startAngleDeg + spec.windAngleDeg * cycleProgress + wobbleDeg) * DEG_TO_RAD;
  const basePoint = polarOffset(center, angle, radius);
  const fieldSample = sampleBlackHoleField(basePoint, center, fieldConfig, flowProgress, spec.swirlDirection ?? 1);
  const rawDirection = {
    x: fieldSample.inward.x * (0.8 + fieldSample.strength * 0.5) + fieldSample.tangent.x * (0.24 + fieldSample.strength * 0.22),
    y: fieldSample.inward.y * (0.8 + fieldSample.strength * 0.5) + fieldSample.tangent.y * (0.24 + fieldSample.strength * 0.22),
  };
  const directionLength = Math.max(distance(rawDirection), 0.001);
  const direction = {
    x: rawDirection.x / directionLength,
    y: rawDirection.y / directionLength,
  };
  const streakLength = baseRadius * spec.sizeFactor * (0.8 + fieldSample.strength * 1.15);

  return {
    head: fieldSample.warpedPoint,
    tail: {
      x: fieldSample.warpedPoint.x - direction.x * streakLength,
      y: fieldSample.warpedPoint.y - direction.y * streakLength,
    },
    alpha: spec.alpha * lifeFade * (0.56 + fieldSample.strength * 0.44),
    strength: fieldSample.strength,
  };
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

function buildInfallStream(center: Point, baseRadius: number, spec: InfallStreamSpec, phase: number) {
  const points: Point[] = [];
  const count = 30;
  const eventRadius = baseRadius * EVENT_HORIZON_FACTOR * 1.02;
  const outerRadius = baseRadius * spec.outerRadiusFactor;
  const animatedStartDeg = spec.startAngleDeg + loopSin(phase, spec.motionSpeed, spec.phaseOffset) * spec.swayDeg;
  const startAngle = animatedStartDeg * DEG_TO_RAD;

  for (let index = 0; index < count; index += 1) {
    const t = index / (count - 1);
    const radius = outerRadius + (eventRadius - outerRadius) * t ** 0.72;
    const wobble = loopSin(phase, spec.motionSpeed, spec.phaseOffset + t * TWO_PI) * spec.wobbleDeg * DEG_TO_RAD * (1 - t);
    const angle = startAngle + spec.windAngleDeg * DEG_TO_RAD * t + wobble;
    points.push(polarOffset(center, angle, radius));
  }

  return points;
}

function sampleBlackHoleField(
  point: Point,
  center: Point,
  config: GravityFieldConfig,
  flowProgress: number,
  swirlDirection = 1,
): GravitySample {
  const vector = { x: point.x - center.x, y: point.y - center.y };
  const pointDistance = distance(vector);

  if (pointDistance <= 0.001 || pointDistance >= config.influenceRadius) {
    return {
      warpedPoint: point,
      strength: 0,
      inward: { x: 0, y: 0 },
      tangent: { x: 0, y: 0 },
      compression: 1,
    };
  }

  const outward = { x: vector.x / pointDistance, y: vector.y / pointDistance };
  const inward = { x: -outward.x, y: -outward.y };
  const tangent = { x: -outward.y * swirlDirection, y: outward.x * swirlDirection };
  const usableRadius = Math.max(config.influenceRadius - config.eventHorizonRadius, 1);
  const normalizedDistance = clamp((pointDistance - config.eventHorizonRadius) / usableRadius, 0, 1);
  const proximity = 1 - normalizedDistance;
  const strength = proximity ** 2.35;
  const phaseOffset = (outward.x * 1.7 + outward.y * 0.9) * Math.PI;
  const swirlPulse = 0.74 + 0.26 * loopSin(flowProgress, 1, phaseOffset);
  const pull = multiply(inward, config.maxPullPx * strength * (0.4 + 0.8 * strength));
  const swirl = multiply(tangent, config.maxSwirlPx * strength * swirlPulse * (0.32 + 0.78 * strength));
  const unclamped = add(point, add(pull, swirl));
  const horizonLimit = config.eventHorizonRadius * 1.04;
  const warpedVector = { x: unclamped.x - center.x, y: unclamped.y - center.y };
  const warpedDistance = distance(warpedVector);
  const warpedPoint =
    warpedDistance < horizonLimit && warpedDistance > 0.001
      ? add(center, multiply({ x: warpedVector.x / warpedDistance, y: warpedVector.y / warpedDistance }, horizonLimit))
      : unclamped;

  return {
    warpedPoint,
    strength,
    inward,
    tangent,
    compression: clamp(1 - strength * 0.22, 0.72, 1),
  };
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

function strokeLine(
  context: CanvasRenderingContext2D,
  start: Point,
  end: Point,
  strokeStyle: string | CanvasGradient,
  lineWidth: number,
) {
  context.strokeStyle = strokeStyle;
  context.lineWidth = lineWidth;
  context.lineCap = "round";
  context.beginPath();
  context.moveTo(start.x, start.y);
  context.lineTo(end.x, end.y);
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

function blackHolePalette(primaryColor: string, secondaryColor: string) {
  return {
    void: VOID,
    hotRed: lerpColor(ERROR_RED, AURORA_AMBER, 0.12),
    hotOrange: lerpColor(ERROR_RED, AURORA_AMBER, 0.22),
    hotYellow: lerpColor(AURORA_AMBER, MOONLIGHT, 0.28),
    quantumPurple: lerpColor(VOID, secondaryColor, 0.08),
    jetBlue: lerpColor(VOID, primaryColor, 0.14),
    diskBlue: lerpColor(MOONLIGHT, RAIN_BLUE, 0.04),
    lensedWhite: MOONLIGHT,
  };
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

function add(a: Point, b: Point) {
  return { x: a.x + b.x, y: a.y + b.y };
}

function multiply(point: Point, scalar: number) {
  return { x: point.x * scalar, y: point.y * scalar };
}

function distance(point: Point) {
  return Math.hypot(point.x, point.y);
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function lerpColor(from: string, to: string, amount: number) {
  const a = hexToRgb(from);
  const b = hexToRgb(to);

  return rgbToHex({
    r: Math.round(a.r + (b.r - a.r) * amount),
    g: Math.round(a.g + (b.g - a.g) * amount),
    b: Math.round(a.b + (b.b - a.b) * amount),
  });
}

function withAlpha(hex: string, alpha: number) {
  const rgb = hexToRgb(hex);
  return `rgba(${rgb.r},${rgb.g},${rgb.b},${clamp(alpha, 0, 1)})`;
}

function hexToRgb(hex: string) {
  const normalized = hex.replace("#", "");
  const value = Number.parseInt(
    normalized.length === 3
      ? normalized
          .split("")
          .map((digit) => digit + digit)
          .join("")
      : normalized,
    16,
  );

  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
  };
}

function rgbToHex({ r, g, b }: { r: number; g: number; b: number }) {
  return `#${[r, g, b]
    .map((channel) => channel.toString(16).padStart(2, "0"))
    .join("")}`;
}
