"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { OryvelleOrbCanvas } from "./oryvelle-orb-canvas";
import { clamp } from "./canvas-utils";
import type { OrbAnnotation, SoundStar } from "./parallax/types";
import { computeSceneState } from "./parallax/scene-state";
import { drawPageSky } from "./parallax/sky";
import { SOUND_STARS, drawSceneCanvas } from "./parallax/scenes";

export type { ParallaxMoment } from "./parallax/types";
import type { ParallaxMoment } from "./parallax/types";

type ParallaxLandingExperienceProps = {
  moments: ParallaxMoment[];
};

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
      const sceneIndex = computeSceneState(progress, moments.length).activeScene;
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

    };

    const tick = (time: number) => {
      draw(time);
      frame = window.requestAnimationFrame(tick);
    };

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const start = () => {
      window.cancelAnimationFrame(frame);
      if (motionQuery.matches) {
        draw(0);
        return;
      }
      frame = window.requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) start();
        else window.cancelAnimationFrame(frame);
      },
      { threshold: 0 },
    );

    resize();
    start();
    io.observe(canvas);
    window.addEventListener("resize", resize);
    motionQuery.addEventListener("change", start);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      motionQuery.removeEventListener("change", start);
      io.disconnect();
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
