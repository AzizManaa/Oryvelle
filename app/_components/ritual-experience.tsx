"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { OryvelleOrbCanvas } from "./oryvelle-orb-canvas";

export type RitualScene = {
  id: "arrive" | "sounds" | "timer" | "notes";
  label: string;
  eyebrow: string;
  title: string;
  body: string;
  accent: string;
  secondary: string;
  cue: string;
  satellites: string[];
};

type RitualExperienceProps = {
  scenes: RitualScene[];
};

type Star = {
  x: number;
  y: number;
  radius: number;
  alpha: number;
  drift: number;
};

type SoundSatellite = {
  label: string;
  volume: string;
  angle: number;
  distance: number;
  delay: number;
};

const STARS: Star[] = [
  { x: 0.08, y: 0.18, radius: 0.8, alpha: 0.44, drift: 0.08 },
  { x: 0.14, y: 0.58, radius: 1.1, alpha: 0.32, drift: 0.05 },
  { x: 0.22, y: 0.34, radius: 0.7, alpha: 0.42, drift: 0.07 },
  { x: 0.3, y: 0.76, radius: 1.2, alpha: 0.26, drift: 0.05 },
  { x: 0.39, y: 0.2, radius: 0.9, alpha: 0.4, drift: 0.08 },
  { x: 0.48, y: 0.62, radius: 0.7, alpha: 0.32, drift: 0.04 },
  { x: 0.56, y: 0.14, radius: 1.1, alpha: 0.44, drift: 0.07 },
  { x: 0.65, y: 0.44, radius: 0.8, alpha: 0.38, drift: 0.06 },
  { x: 0.74, y: 0.26, radius: 1.1, alpha: 0.3, drift: 0.05 },
  { x: 0.82, y: 0.58, radius: 0.9, alpha: 0.4, drift: 0.07 },
  { x: 0.9, y: 0.18, radius: 0.7, alpha: 0.32, drift: 0.05 },
  { x: 0.94, y: 0.72, radius: 1.2, alpha: 0.28, drift: 0.04 },
  { x: 0.12, y: 0.82, radius: 0.7, alpha: 0.22, drift: 0.06 },
  { x: 0.7, y: 0.78, radius: 0.6, alpha: 0.24, drift: 0.05 },
];

const SOUND_SATELLITES: SoundSatellite[] = [
  { label: "Rain", volume: "82%", angle: 152, distance: 43, delay: 0 },
  { label: "Cabin", volume: "64%", angle: 258, distance: 39, delay: 120 },
  { label: "Forest", volume: "72%", angle: 22, distance: 42, delay: 220 },
  { label: "Noise", volume: "48%", angle: 306, distance: 33, delay: 320 },
];

const NAV_LOCK_MS = 760;

export function RitualExperience({ scenes }: RitualExperienceProps) {
  const [activeScene, setActiveScene] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerRef = useRef({ x: 0.55, y: 0.42, active: false });
  const activeSceneRef = useRef(0);
  const lockUntilRef = useRef(0);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const scene = scenes[activeScene];
  const sceneProgress =
    scenes.length <= 1 ? 0 : activeScene / (scenes.length - 1);
  const sceneStyle = {
    "--scene-accent": scene.accent,
    "--scene-secondary": scene.secondary,
    "--scene-progress": sceneProgress,
  } as CSSProperties;

  const goToScene = useCallback(
    (nextScene: number) => {
      const clampedScene = Math.max(0, Math.min(scenes.length - 1, nextScene));

      setActiveScene((currentScene) =>
        currentScene === clampedScene ? currentScene : clampedScene,
      );
    },
    [scenes.length],
  );

  const moveScene = useCallback(
    (direction: 1 | -1) => {
      const now = window.performance.now();

      if (now < lockUntilRef.current) {
        return;
      }

      lockUntilRef.current = now + NAV_LOCK_MS;
      goToScene(activeSceneRef.current + direction);
    },
    [goToScene],
  );

  const handleSelectScene = useCallback(
    (index: number) => {
      lockUntilRef.current = window.performance.now() + NAV_LOCK_MS;
      goToScene(index);
    },
    [goToScene],
  );

  useEffect(() => {
    activeSceneRef.current = activeScene;
  }, [activeScene]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleMotionChange = () => setReducedMotion(mediaQuery.matches);

    handleMotionChange();
    mediaQuery.addEventListener("change", handleMotionChange);

    return () => mediaQuery.removeEventListener("change", handleMotionChange);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        event.preventDefault();
        moveScene(1);
      }

      if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        event.preventDefault();
        moveScene(-1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [moveScene]);

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
    let devicePixelRatio = 1;

    const resize = () => {
      devicePixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = Math.floor(width * devicePixelRatio);
      canvas.height = Math.floor(height * devicePixelRatio);
      context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    };

    const draw = (time: number) => {
      const currentScene = scenes[activeSceneRef.current];
      const progress =
        scenes.length <= 1 ? 0 : activeSceneRef.current / (scenes.length - 1);
      const pointer = pointerRef.current;
      const parallaxX = pointer.active ? (pointer.x - 0.5) * 22 : 0;
      const parallaxY = pointer.active ? (pointer.y - 0.5) * 14 : 0;
      const cameraX = (0.5 - progress) * width * 0.16;
      const glowX = width * (0.28 + progress * 0.34) + parallaxX * 0.8;
      const glowY = height * (0.68 - progress * 0.2) + parallaxY * 0.8;
      const glow = context.createRadialGradient(
        glowX,
        glowY,
        0,
        glowX,
        glowY,
        Math.max(width, height) * 0.72,
      );

      glow.addColorStop(0, `${currentScene.accent}26`);
      glow.addColorStop(0.42, `${currentScene.secondary}13`);
      glow.addColorStop(1, "rgba(0,0,0,0)");

      context.clearRect(0, 0, width, height);
      context.fillStyle = glow;
      context.fillRect(0, 0, width, height);

      drawConstellationPath(
        context,
        width,
        height,
        cameraX,
        parallaxX,
        parallaxY,
        currentScene,
      );

      STARS.forEach((star, index) => {
        const twinkle = reducedMotion
          ? 0.78
          : 0.68 + Math.sin(time * star.drift * 0.01 + index) * 0.2;
        const x = star.x * width + cameraX * star.drift + parallaxX * star.drift;
        const y = star.y * height + parallaxY * star.drift;

        context.fillStyle = `rgba(237,234,245,${star.alpha * twinkle})`;
        context.beginPath();
        context.arc(x, y, star.radius, 0, Math.PI * 2);
        context.fill();
      });

      if (!reducedMotion) {
        animationFrame = window.requestAnimationFrame(draw);
      }
    };

    resize();
    draw(0);
    window.addEventListener("resize", resize);

    if (!reducedMotion) {
      animationFrame = window.requestAnimationFrame(draw);
    }

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
    };
  }, [reducedMotion, scenes]);

  return (
    <section
      aria-label="Oryvelle night ritual preview"
      className="relative min-h-[100svh] overflow-hidden"
      style={sceneStyle}
      onPointerMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();

        pointerRef.current = {
          x: (event.clientX - rect.left) / rect.width,
          y: (event.clientY - rect.top) / rect.height,
          active: true,
        };
      }}
      onPointerLeave={() => {
        pointerRef.current.active = false;
      }}
      onWheel={(event) => {
        const direction = event.deltaY > 0 ? 1 : -1;
        moveScene(direction);
      }}
      onTouchStart={(event) => {
        const touch = event.touches[0];
        touchStartRef.current = { x: touch.clientX, y: touch.clientY };
      }}
      onTouchEnd={(event) => {
        const start = touchStartRef.current;
        const touch = event.changedTouches[0];

        if (!start) {
          return;
        }

        const deltaX = touch.clientX - start.x;
        const deltaY = touch.clientY - start.y;
        const isHorizontalSwipe = Math.abs(deltaX) > Math.abs(deltaY);
        const distance = isHorizontalSwipe ? deltaX : deltaY;

        if (Math.abs(distance) > 42) {
          moveScene(distance < 0 ? 1 : -1);
        }

        touchStartRef.current = null;
      }}
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute inset-0 z-0 h-full w-full"
      />

      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_72%_46%,color-mix(in_srgb,var(--scene-accent)_16%,transparent),transparent_36%),linear-gradient(180deg,rgba(8,5,16,0.18),#080510_90%)] transition-[background] duration-700" />

      <div className="pointer-events-none absolute inset-0 z-[1]">
        <div className="absolute left-1/2 top-[52%] h-[min(118vw,84vh)] w-[min(118vw,84vh)] -translate-x-1/2 -translate-y-1/2 sm:h-[min(94vw,94vh)] sm:w-[min(94vw,94vh)] lg:left-[66%] lg:h-[min(82vw,112vh)] lg:w-[min(82vw,112vh)]">
          <div className="absolute inset-[9%] rounded-full border border-white/[0.035]" />
          <div className="absolute inset-[2%] rounded-full border border-[var(--scene-accent)]/10 opacity-70" />
          <OryvelleOrbCanvas
            primaryColor={scene.accent}
            secondaryColor={scene.secondary}
            reducedMotion={reducedMotion}
            className="h-full w-full opacity-95 transition-opacity duration-700"
          />
          <SatelliteField scene={scene} activeScene={activeScene} />
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 z-[2] bg-[radial-gradient(circle_at_66%_48%,transparent_0%,rgba(8,5,16,0.1)_36%,rgba(8,5,16,0.72)_78%),linear-gradient(90deg,#080510_0%,rgba(8,5,16,0.86)_34%,rgba(8,5,16,0.08)_100%)]" />

      <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-7xl flex-col px-5 pt-24 pb-5 sm:px-8 lg:pt-28">
        <div className="grid flex-1 items-center gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(460px,1.1fr)]">
          <div className="relative z-20 max-w-3xl pt-4 lg:pt-0">
            <p className="mb-4 text-xs font-medium tracking-[0.34em] text-[var(--scene-accent)] uppercase transition-colors duration-700">
              {scene.eyebrow}
            </p>

            <h1
              key={scene.id}
              className="animate-[sceneText_700ms_ease_both] text-balance text-5xl leading-[0.94] font-semibold tracking-normal text-[#F7F3FF] sm:text-7xl lg:max-w-3xl lg:text-8xl"
            >
              {scene.title}
            </h1>

            <p
              key={`${scene.id}-body`}
              className="mt-6 max-w-2xl animate-[sceneText_760ms_ease_80ms_both] text-base leading-8 text-[#B8B5C7] sm:text-lg"
            >
              {scene.body}
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
          </div>

          <div className="relative min-h-[42vh] lg:min-h-[70vh]">
            <ActiveMixPanel scene={scene} activeScene={activeScene} />
          </div>
        </div>

        <SceneRail
          activeScene={activeScene}
          scenes={scenes}
          onSelect={handleSelectScene}
        />
      </div>

      <ol className="sr-only">
        {scenes.map((item) => (
          <li key={item.id}>
            {item.label}: {item.title}. {item.body}
          </li>
        ))}
      </ol>
    </section>
  );
}

function drawConstellationPath(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  cameraX: number,
  parallaxX: number,
  parallaxY: number,
  scene: RitualScene,
) {
  const points = [
    { x: 0.12, y: 0.72 },
    { x: 0.34, y: 0.54 },
    { x: 0.54, y: 0.64 },
    { x: 0.76, y: 0.43 },
    { x: 0.92, y: 0.58 },
  ];

  context.strokeStyle = `${scene.secondary}28`;
  context.lineWidth = 1;
  context.beginPath();

  points.forEach((point, index) => {
    const x = point.x * width + cameraX + parallaxX * (index + 1) * 0.08;
    const y = point.y * height + parallaxY * (index + 1) * 0.08;

    if (index === 0) {
      context.moveTo(x, y);
    } else {
      context.lineTo(x, y);
    }
  });

  context.stroke();

  points.forEach((point, index) => {
    const x = point.x * width + cameraX + parallaxX * (index + 1) * 0.08;
    const y = point.y * height + parallaxY * (index + 1) * 0.08;

    context.fillStyle = index === 2 ? scene.accent : scene.secondary;
    context.globalAlpha = index === 2 ? 0.62 : 0.24;
    context.beginPath();
    context.arc(x, y, index === 2 ? 3 : 2, 0, Math.PI * 2);
    context.fill();
  });

  context.globalAlpha = 1;
}

function SatelliteField({
  scene,
  activeScene,
}: {
  scene: RitualScene;
  activeScene: number;
}) {
  const visibleSatellites = SOUND_SATELLITES.filter((satellite) =>
    scene.satellites.includes(satellite.label),
  );

  return (
    <div className="absolute inset-0">
      {visibleSatellites.map((satellite) => {
        const angle = (satellite.angle * Math.PI) / 180;
        const x = 50 + Math.cos(angle) * satellite.distance;
        const y = 50 + Math.sin(angle) * satellite.distance;

        return (
          <div
            key={`${scene.id}-${satellite.label}`}
            className="absolute hidden -translate-x-1/2 -translate-y-1/2 animate-[satelliteIn_680ms_ease_both] items-center gap-2 rounded-full border border-white/[0.1] bg-[#080510]/58 px-3 py-2 text-xs text-[#EDEAF5] shadow-[0_0_28px_color-mix(in_srgb,var(--scene-accent)_18%,transparent)] backdrop-blur-xl sm:flex"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              animationDelay: `${satellite.delay}ms`,
            }}
          >
            <span
              className="h-2.5 w-2.5 rounded-full bg-[var(--scene-accent)] shadow-[0_0_18px_var(--scene-accent)]"
              aria-hidden="true"
            />
            <span>{satellite.label}</span>
            {activeScene > 0 ? (
              <span className="text-[#7C8094]">{satellite.volume}</span>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

function ActiveMixPanel({
  scene,
  activeScene,
}: {
  scene: RitualScene;
  activeScene: number;
}) {
  const isFinalScene = scene.id === "notes";
  const mixTitle =
    activeScene === 0
      ? "A quiet path is forming"
      : activeScene === 1
        ? "Rain + 3 more"
        : activeScene === 2
          ? "Fade set for 45 min"
          : "Morning note ready";

  return (
    <div className="absolute inset-x-0 bottom-4 mx-auto w-full max-w-[35rem] animate-[scenePreview_720ms_ease_140ms_both] rounded-[2rem] border border-white/[0.08] bg-[#101421]/68 p-5 shadow-[0_24px_90px_rgba(0,0,0,0.34)] backdrop-blur-2xl lg:bottom-10 lg:right-0 lg:mx-0">
      <div className="flex items-start justify-between gap-5">
        <div className="min-w-0">
          <p className="mb-2 text-xs font-medium tracking-[0.24em] text-[var(--scene-accent)] uppercase">
            {scene.cue}
          </p>
          <h2 className="text-2xl font-semibold text-[#F7F3FF]">{mixTitle}</h2>
          <p className="mt-2 text-sm leading-6 text-[#9EA1B4]">
            {isFinalScene
              ? "A small reflection, held lightly."
              : "A living preview of the ritual, not a fake app screenshot."}
          </p>
        </div>

        <div className="flex shrink-0 -space-x-3 pt-1" aria-hidden="true">
          {scene.satellites.slice(0, 3).map((item) => (
            <span
              key={item}
              className="grid h-11 w-11 place-items-center rounded-full border border-white/[0.12] bg-[#080510]/70 text-[10px] font-medium text-[#EDEAF5] shadow-[0_0_24px_color-mix(in_srgb,var(--scene-accent)_18%,transparent)]"
            >
              {item.slice(0, 1)}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-5 grid grid-cols-[1fr_auto] items-center gap-4">
        <div className="h-2 rounded-full bg-white/[0.08]">
          <div
            className="h-full rounded-full bg-[var(--scene-accent)] shadow-[0_0_18px_var(--scene-accent)] transition-[width] duration-700"
            style={{ width: `${34 + activeScene * 18}%` }}
          />
        </div>
        <span className="text-sm font-medium text-[#B8B5C7]">
          {activeScene === 2 ? "fade" : activeScene === 3 ? "note" : "80%"}
        </span>
      </div>
    </div>
  );
}

function SceneRail({
  activeScene,
  scenes,
  onSelect,
}: {
  activeScene: number;
  scenes: RitualScene[];
  onSelect: (index: number) => void;
}) {
  return (
    <nav
      aria-label="Night ritual progress"
      className="relative z-30 mx-auto mt-4 flex w-full max-w-2xl items-center justify-center gap-2 rounded-full border border-white/[0.08] bg-[#080510]/56 p-2 text-xs text-[#7C8094] backdrop-blur-xl"
    >
      {scenes.map((scene, index) => {
        const isActive = activeScene === index;

        return (
          <button
            key={scene.id}
            type="button"
            aria-current={isActive ? "step" : undefined}
            className={[
              "group flex min-h-10 min-w-10 flex-1 items-center justify-center gap-2 rounded-full px-3 text-left transition-colors hover:bg-white/[0.05] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--scene-accent)]",
              isActive ? "text-[#F7F3FF]" : "text-[#7C8094]",
            ].join(" ")}
            onClick={() => onSelect(index)}
          >
            <span
              className={[
                "h-2.5 w-2.5 shrink-0 rounded-full border transition-all duration-500",
                isActive
                  ? "scale-125 border-[var(--scene-accent)] bg-[var(--scene-accent)] shadow-[0_0_18px_var(--scene-accent)]"
                  : "border-white/18 bg-white/8",
              ].join(" ")}
            />
            <span className="hidden sm:inline">{scene.label}</span>
            <span className="sr-only">{scene.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
