"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { OryvelleOrbCanvas } from "./oryvelle-orb-canvas";

export type ParallaxMoment = {
  id: "arrival" | "constellations" | "mix" | "fade" | "final";
  label: string;
  eyebrow: string;
  title: string;
  body: string;
  accent: string;
  secondary: string;
  cue: string;
  panelBody: string;
};

type ParallaxLandingExperienceProps = {
  moments: ParallaxMoment[];
};


type CanvasPoint = {
  x: number;
  y: number;
};

type SoundStar = {
  label: string;
  x: number;
  y: number;
  companions: Array<{ x: number; y: number; size: number }>;
};

type PathPoint = {
  x: number;
  y: number;
};

type OrbAnnotation = {
  label: string;
  value: string;
  detail: string;
  x: number;
  y: number;
  align?: "left" | "right";
};

const SOUND_STARS: SoundStar[] = [
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

const ORB_ANNOTATIONS: Record<ParallaxMoment["id"], OrbAnnotation[]> = {
  arrival: [
    { label: "field", value: "forming", detail: "quiet entry", x: 18, y: 22 },
    { label: "pressure", value: "none", detail: "no dashboard", x: 75, y: 35, align: "right" },
    { label: "note", value: "morning", detail: "one soft line", x: 28, y: 74 },
  ],
  constellations: [
    { label: "rain", value: "82", detail: "front layer", x: 14, y: 28 },
    { label: "cabin", value: "64", detail: "warm air", x: 74, y: 25, align: "right" },
    { label: "forest", value: "72", detail: "hush field", x: 82, y: 65, align: "right" },
    { label: "noise", value: "48", detail: "soft floor", x: 24, y: 70 },
  ],
  mix: [
    { label: "mix", value: "live", detail: "4 layers", x: 18, y: 26 },
    { label: "balance", value: "80", detail: "held softly", x: 80, y: 46, align: "right" },
    { label: "orbit", value: "slow", detail: "never crowded", x: 32, y: 78 },
  ],
  fade: [
    { label: "timer", value: "45", detail: "min fade", x: 20, y: 28 },
    { label: "audio", value: "bg", detail: "keeps playing", x: 78, y: 42, align: "right" },
    { label: "close", value: "soft", detail: "no hard stop", x: 30, y: 76 },
  ],
  final: [
    { label: "status", value: "soon", detail: "first calm", x: 22, y: 32 },
    { label: "privacy", value: "quiet", detail: "by design", x: 78, y: 48, align: "right" },
    { label: "return", value: "when ready", detail: "no hard sell", x: 34, y: 76 },
  ],
};

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

let _skyPaletteCache: { key: number; palette: SkyPalette } | null = null;

function getCachedSkyPalette(nowMs: number): SkyPalette {
  const key = Math.floor(nowMs / 60_000); // recompute at most once per minute
  if (_skyPaletteCache?.key === key) return _skyPaletteCache.palette;
  const palette = computeSkyPalette(nowMs);
  _skyPaletteCache = { key, palette };
  return palette;
}

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

export function ParallaxLandingExperience({
  moments,
}: ParallaxLandingExperienceProps) {
  const trackRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeMoment = moments[activeIndex];
  const activeMomentRef = useRef(activeMoment);
  const style = {
    "--scene-accent": activeMoment.accent,
    "--scene-secondary": activeMoment.secondary,
  } as CSSProperties;

  useEffect(() => {
    activeMomentRef.current = activeMoment;
  }, [activeMoment]);

  useEffect(() => {
    const track = trackRef.current;
    const stage = stageRef.current;

    if (!track || !stage) {
      return;
    }

    let frame = 0;
    let lastIndex = -1;

    const update = () => {
      frame = 0;

      const rect = track.getBoundingClientRect();
      const scrollable = Math.max(1, rect.height - window.innerHeight);
      const progress = clamp(-rect.top / scrollable, 0, 1);
      const sceneIndex = Math.min(
        moments.length - 1,
        Math.round(progress * (moments.length - 1)),
      );
      const orbX = 58 + progress * 14;
      const orbY = 52 - progress * 8;
      const orbScale = 0.72 + progress * 0.42;
      const textY = (progress * (moments.length - 1) - sceneIndex) * -34;

      progressRef.current = progress;
      stage.style.setProperty("--orb-x", `${orbX}%`);
      stage.style.setProperty("--orb-y", `${orbY}%`);
      stage.style.setProperty("--orb-scale", orbScale.toFixed(4));
      stage.style.setProperty("--constellation-y", `${progress * -44}vh`);
      stage.style.setProperty("--text-y", `${textY}px`);

      if (sceneIndex !== lastIndex) {
        lastIndex = sceneIndex;
        setActiveIndex(sceneIndex);
      }
    };

    const requestUpdate = () => {
      if (frame) {
        return;
      }

      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      if (frame) {
        window.cancelAnimationFrame(frame);
      }

      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, [moments.length]);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d", { alpha: true });

    if (!context) {
      return;
    }

    let frame = 0;
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

    const draw = (time = 0) => {
      const progress = progressRef.current;

      context.clearRect(0, 0, width, height);
      drawPageSky(context, width, height, progress, time, activeMomentRef.current.accent);
      const sceneState = computeSceneState(progress, moments.length);
      drawSceneCanvas(
        context,
        width,
        height,
        progress,
        sceneState,
        activeMomentRef.current,
        time,
      );

      frame = window.requestAnimationFrame(draw);
    };

    resize();
    frame = window.requestAnimationFrame(draw);
    window.addEventListener("resize", resize);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, [moments.length]);

  return (
    <section
      ref={trackRef}
      aria-label="Oryvelle cinematic scroll story"
      className="relative min-h-[500svh] bg-background text-foreground"
    >
      <div
        ref={stageRef}
        className="sticky top-0 h-[100svh] overflow-hidden"
        style={style}
      >
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="absolute inset-0 z-0 h-full w-full"
        />

        <div
          aria-hidden="true"
          className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_70%_38%,color-mix(in_srgb,var(--scene-accent)_12%,transparent),transparent_42%),linear-gradient(180deg,rgba(8,5,16,0),rgba(8,5,16,0.24)_92%)]"
        />

        <div
          aria-hidden="true"
          className="absolute inset-0 z-[1] opacity-80"
          style={{
            transform: "translate3d(0, var(--constellation-y, 0), 0)",
          }}
        >
          <ConstellationMap activeIndex={activeIndex} />
        </div>

        <div
          aria-hidden="true"
          className="absolute inset-0 z-[2]"
          style={{
            transform:
              "translate3d(calc(var(--orb-x, 62%) - 50%), calc(var(--orb-y, 50%) - 50%), 0) scale(var(--orb-scale, 0.82))",
          }}
        >
          <div className="absolute left-1/2 top-1/2 h-[min(110vw,104vh)] w-[min(110vw,104vh)] -translate-x-1/2 -translate-y-1/2">
            <div className="absolute inset-[5%] rounded-full border border-white/[0.035]" />
            <div className="absolute inset-[14%] rounded-full border border-[var(--scene-accent)]/10" />
            <OryvelleOrbCanvas
              primaryColor={activeMoment.accent}
              secondaryColor={activeMoment.secondary}
              glowStrength={SCENE_GLOW[activeMoment.id]}
              className="h-full w-full opacity-95"
            />
          </div>
        </div>

        <div
          aria-hidden="true"
          className="absolute inset-0 z-[3] bg-[radial-gradient(circle_at_68%_44%,transparent_0%,rgba(8,5,16,0.02)_36%,rgba(8,5,16,0.48)_86%),linear-gradient(90deg,rgba(8,5,16,0.84)_0%,rgba(8,5,16,0.56)_34%,rgba(8,5,16,0.02)_100%)]"
        />

        <div className="relative z-10 mx-auto grid h-full w-full max-w-7xl grid-rows-[1fr_auto] px-5 pt-24 pb-5 sm:px-8 lg:pt-28">
          <div className="grid min-h-0 items-center gap-8 lg:grid-cols-[minmax(0,0.82fr)_minmax(420px,1.18fr)]">
            <div
              className="relative z-20 max-w-[42rem]"
              style={{
                transform: "translate3d(0, var(--text-y, 0), 0)",
              }}
            >
              <p className="mb-5 flex items-center gap-3 text-[0.68rem] font-medium tracking-[0.34em] text-[var(--scene-accent)] uppercase">
                <span className="h-px w-10 bg-[var(--scene-accent)]/55" />
                {activeMoment.eyebrow}
              </p>

              <h1
                key={activeMoment.id}
                className="animate-[sceneText_680ms_ease_both] text-balance text-4xl leading-[1.02] font-semibold tracking-normal text-[#F7F3FF] drop-shadow-[0_12px_60px_rgba(0,0,0,0.42)] sm:text-5xl lg:text-6xl"
              >
                {activeMoment.title}
              </h1>

              <p
                key={`${activeMoment.id}-body`}
                className="mt-6 max-w-xl animate-[sceneText_760ms_ease_70ms_both] text-base leading-8 text-[#B8B5C7] sm:text-lg"
              >
                {activeMoment.body}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  disabled
                  className="rounded-full border border-[var(--scene-accent)]/35 bg-[var(--scene-accent)]/12 px-5 py-3 text-sm font-medium text-[#F7F3FF] shadow-[0_0_30px_color-mix(in_srgb,var(--scene-accent)_16%,transparent)]"
                >
                  Coming soon
                </button>
                <span className="text-sm text-[#7C8094]">
                  Private by design. Quiet by default.
                </span>
              </div>

              <MobileNightNote moment={activeMoment} activeIndex={activeIndex} />
            </div>

            <div className="relative hidden min-h-[70vh] lg:block">
              <OrbAnnotations moment={activeMoment} activeIndex={activeIndex} />
            </div>
          </div>

          <ProgressRail moments={moments} activeIndex={activeIndex} />
        </div>

        <ol className="sr-only">
          {moments.map((moment) => (
            <li key={moment.id}>
              {moment.label}: {moment.title}. {moment.body}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function drawPageSky(
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

function drawNebulaBlob(
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

function drawArrivalCanvas(
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

function drawConstellationsCanvas(
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

function drawFadeCanvas(
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

function drawSceneCanvas(
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

function ConstellationMap({ activeIndex }: { activeIndex: number }) {
  const opacity = activeIndex === 0 ? 0.18 : activeIndex === 4 ? 0.32 : 0.72;

  return (
    <svg
      className="h-full w-full"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <filter id="star-soft-glow">
          <feGaussianBlur stdDeviation="0.45" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <path
        d={soundStarPath(SOUND_STARS)}
        fill="none"
        stroke="var(--scene-accent)"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeOpacity={opacity * 0.52}
        strokeWidth="0.08"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d={soundStarPath(SOUND_STARS)}
        fill="none"
        stroke="#EDEAF5"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeOpacity="0.12"
        strokeWidth="0.035"
        vectorEffect="non-scaling-stroke"
      />
      {SOUND_STARS.map((star) => (
        <g key={star.label} opacity={activeIndex === 0 ? 0.45 : 0.92}>
          {star.companions.map((point) => (
            <g key={`${star.label}-${point.x}-${point.y}`}>
              <circle
                cx={star.x + point.x}
                cy={star.y + point.y}
                r={point.size * 6.4}
                fill="#EDEAF5"
                opacity="0.026"
              />
              <circle
                cx={star.x + point.x}
                cy={star.y + point.y}
                r={point.size * 0.38}
                fill="#FFFFFF"
                opacity="0.94"
              />
              <circle
                cx={star.x + point.x}
                cy={star.y + point.y}
                r={point.size * 0.9}
                fill="#EDEAF5"
                opacity="0.18"
                filter="url(#star-soft-glow)"
              />
              <path
                d={starSparkPath(star.x + point.x, star.y + point.y, point.size * 5.2)}
                stroke="#EDEAF5"
                strokeLinecap="round"
                strokeOpacity="0.46"
                strokeWidth="0.045"
                vectorEffect="non-scaling-stroke"
              />
            </g>
          ))}
          <circle
            cx={star.x}
            cy={star.y}
            r="7.2"
            fill="var(--scene-accent)"
            opacity="0.035"
          />
          <circle
            cx={star.x}
            cy={star.y}
            r="1.35"
            fill="var(--scene-accent)"
            opacity="0.26"
            filter="url(#star-soft-glow)"
          />
          <circle
            cx={star.x}
            cy={star.y}
            r="0.34"
            fill="#FFFFFF"
            opacity="0.96"
          />
          <path
            d={starSparkPath(star.x, star.y, 6.4)}
            stroke="#F7F3FF"
            strokeLinecap="round"
            strokeOpacity="0.62"
            strokeWidth="0.06"
            vectorEffect="non-scaling-stroke"
          />
        </g>
      ))}
    </svg>
  );
}

function OrbAnnotations({
  moment,
  activeIndex,
}: {
  moment: ParallaxMoment;
  activeIndex: number;
}) {
  const annotations = ORB_ANNOTATIONS[moment.id];

  return (
    <div key={moment.id} className="pointer-events-none absolute inset-0 hidden lg:block">
      <div className="absolute left-1/2 top-1/2 h-[68vh] max-h-[44rem] min-h-[30rem] w-[68vh] min-w-[30rem] max-w-[44rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.035]" />
      <div className="absolute left-1/2 top-1/2 h-[48vh] max-h-[32rem] min-h-[22rem] w-[48vh] min-w-[22rem] max-w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[var(--scene-accent)]/10" />

      <div
        className="absolute left-1/2 top-[14%] flex -translate-x-1/2 items-center gap-3 text-[0.66rem] font-medium tracking-[0.26em] text-[var(--scene-accent)] uppercase opacity-90"
        aria-hidden="true"
      >
        <span className="h-px w-10 bg-[var(--scene-accent)]/40" />
        {moment.cue}
        <span className="h-px w-10 bg-[var(--scene-accent)]/40" />
      </div>

      {annotations.map((annotation, index) => (
        <div
          key={`${moment.id}-${annotation.label}`}
          className={[
            "absolute flex w-48 animate-[sceneText_620ms_ease_both] items-center gap-3",
            annotation.align === "right" ? "-translate-x-full text-right" : "",
          ].join(" ")}
          style={{
            left: `${annotation.x}%`,
            top: `${annotation.y}%`,
            animationDelay: `${index * 90}ms`,
          }}
        >
          {annotation.align === "right" ? (
            <>
              <AnnotationText annotation={annotation} />
              <AnnotationStar />
            </>
          ) : (
            <>
              <AnnotationStar />
              <AnnotationText annotation={annotation} />
            </>
          )}
        </div>
      ))}

      <div className="absolute bottom-[12%] right-[5%] w-56 animate-[sceneText_720ms_ease_180ms_both] border-t border-[var(--scene-accent)]/20 pt-4 text-right">
        <p className="text-[0.66rem] font-medium tracking-[0.28em] text-[#D8D4E8]/55 uppercase">
          scene 0{activeIndex + 1}
        </p>
        <p className="mt-1 text-sm leading-6 text-[#F7F3FF]/78">
          {moment.panelBody}
        </p>
      </div>
    </div>
  );
}

function AnnotationStar() {
  return (
    <span className="relative grid h-7 w-7 shrink-0 place-items-center">
      <span className="absolute h-px w-7 bg-[#F7F3FF]/35" />
      <span className="absolute h-7 w-px bg-[#F7F3FF]/25" />
      <span className="h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_16px_rgba(255,255,255,0.85),0_0_28px_var(--scene-accent)]" />
    </span>
  );
}

function AnnotationText({ annotation }: { annotation: OrbAnnotation }) {
  return (
    <span className="min-w-0">
      <span className="block text-[0.62rem] font-medium tracking-[0.24em] text-[var(--scene-accent)] uppercase">
        {annotation.label}
      </span>
      <span className="mt-1 block text-xl leading-none font-semibold text-[#F7F3FF]">
        {annotation.value}
      </span>
      <span className="mt-1 block text-xs tracking-[0.08em] text-[#B8B5C7]/70 uppercase">
        {annotation.detail}
      </span>
    </span>
  );
}

function MobileNightNote({
  moment,
  activeIndex,
}: {
  moment: ParallaxMoment;
  activeIndex: number;
}) {
  const annotations = ORB_ANNOTATIONS[moment.id].slice(0, 2);

  return (
    <aside
      key={moment.id}
      className="mt-8 animate-[sceneText_680ms_ease_120ms_both] border-l border-[var(--scene-accent)]/35 pl-4 lg:hidden"
      aria-label={`${moment.label} calm note`}
    >
      <div className="flex items-center justify-between gap-4">
        <p className="text-[0.66rem] font-medium tracking-[0.28em] text-[var(--scene-accent)] uppercase">
          Calm note 0{activeIndex + 1}
        </p>
        <span className="h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_16px_var(--scene-accent)]" />
      </div>
      <p className="mt-3 max-w-sm text-sm leading-6 text-[#F7F3FF]/78">
        {moment.panelBody}
      </p>
      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
        {annotations.map((annotation) => (
          <span key={annotation.label} className="text-xs tracking-[0.14em] text-[#B8B5C7]/70 uppercase">
            <span className="text-[#F7F3FF]/90">{annotation.value}</span>{" "}
            {annotation.label}
          </span>
        ))}
      </div>
    </aside>
  );
}

function ProgressRail({
  moments,
  activeIndex,
}: {
  moments: ParallaxMoment[];
  activeIndex: number;
}) {
  return (
    <div
      aria-hidden="true"
      className="relative z-30 mx-auto mb-1 flex w-fit items-center justify-center gap-3 px-2 py-1"
    >
      {moments.map((moment, index) => (
        <span
          key={moment.id}
          className={[
            "h-1.5 rounded-full transition-all duration-500",
            activeIndex === index
              ? "w-10 bg-[var(--scene-accent)] shadow-[0_0_18px_var(--scene-accent)]"
              : "w-4 bg-white/18",
          ].join(" ")}
        />
      ))}
    </div>
  );
}

function soundStarPath(stars: SoundStar[]) {
  return stars
    .map((star, index) => (index === 0 ? `M ${star.x} ${star.y}` : `L ${star.x} ${star.y}`))
    .join(" ");
}

function starSparkPath(x: number, y: number, radius: number) {
  return [
    `M ${x - radius} ${y} L ${x + radius} ${y}`,
    `M ${x} ${y - radius} L ${x} ${y + radius}`,
    `M ${x - radius * 0.58} ${y - radius * 0.58} L ${x + radius * 0.58} ${y + radius * 0.58}`,
    `M ${x + radius * 0.58} ${y - radius * 0.58} L ${x - radius * 0.58} ${y + radius * 0.58}`,
  ].join(" ");
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

function withAlpha(hex: string, alpha: number) {
  if (!hex.startsWith("#") || hex.length !== 7) {
    return hex;
  }

  const red = Number.parseInt(hex.slice(1, 3), 16);
  const green = Number.parseInt(hex.slice(3, 5), 16);
  const blue = Number.parseInt(hex.slice(5, 7), 16);

  return `rgba(${red},${green},${blue},${alpha})`;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

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
