"use client";

import { useEffect, useRef, type RefObject } from "react";
import { useThree } from "@react-three/fiber";
import { CanvasTexture, LinearFilter, SRGBColorSpace, type Texture } from "three";
import { gsap } from "gsap";
import type { PhonePose, ScreenState } from "./phone-model";
import { CONSTELLATION_REVEAL_MS, drawSleepTimer, SLEEP_TIMER_SECONDS } from "./sleep-timer-screen";

export function usePhoneSleepTimer({ enabled, screen, pose, sourcesRef, phone }: {
  enabled: boolean; screen: RefObject<ScreenState>; pose: RefObject<PhonePose>;
  sourcesRef: RefObject<Record<ScreenState, Texture>>; phone: { setScreen(texture: Texture): void };
}) {
  const { gl, invalidate } = useThree();
  const synchronize = useRef<() => void>(() => {});
  const enabledRef = useRef(enabled);
  const deadline = useRef<number | null>(null);
  useEffect(() => {
    const activeScreen = screen;
    const sourceTextures = sourcesRef.current;
    const canvas = document.createElement("canvas"); canvas.width = 600; canvas.height = 1266;
    const context = canvas.getContext("2d");
    if (!context) return;
    const fallback = sourceTextures.landscapeC;
    const texture = new CanvasTexture(canvas);
    texture.flipY = false; texture.colorSpace = SRGBColorSpace;
    texture.minFilter = texture.magFilter = LinearFilter; texture.generateMipmaps = false;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false, subscribed = false, lastSecond = -1, lastProgress = -1;
    let constellationStartedAt: number | null = null;
    const remaining = () => deadline.current === null ? SLEEP_TIMER_SECONDS : Math.max(0, Math.ceil((deadline.current - Date.now()) / 1000));
    const revealProgress = () => constellationStartedAt === null ? 0 : Math.min(1, (Date.now() - constellationStartedAt) / CONSTELLATION_REVEAL_MS);
    const draw = (seconds: number, progress = 0) => {
      if (lastSecond === seconds && lastProgress === progress) return;
      lastSecond = seconds; lastProgress = progress;
      drawSleepTimer(context, seconds, motion.matches ? undefined : deadline.current ?? undefined, progress);
      texture.needsUpdate = true;
      if (screen.current === "landscapeC") { phone.setScreen(texture); if (!document.hidden) invalidate(); }
    };
    const eligible = () => enabledRef.current && visible && !document.hidden && !motion.matches
      && screen.current === "landscapeC" && Math.cos(pose.current.yaw) > .08 && !gl.getContext().isContextLost();
    const tick = () => { const seconds = remaining(); if (seconds === 0) sync(); else draw(seconds); };
    const sync = () => {
      const eligibleNow = eligible();
      if (eligibleNow && deadline.current === null) { deadline.current = Date.now() + SLEEP_TIMER_SECONDS * 1000; lastSecond = -1; }
      const seconds = remaining();
      if (eligibleNow && seconds === 0 && constellationStartedAt === null) constellationStartedAt = Date.now();
      if (motion.matches) draw(SLEEP_TIMER_SECONDS);
      else if (eligibleNow) draw(seconds, seconds === 0 ? revealProgress() : 0);
      const running = eligibleNow && (seconds > 0 || revealProgress() < 1);
      if (running === subscribed) return;
      subscribed = running;
      if (running) gsap.ticker.add(tick); else gsap.ticker.remove(tick);
    };
    draw(SLEEP_TIMER_SECONDS); sourceTextures.landscapeC = texture;
    synchronize.current = sync;
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
    observer.observe(gl.domElement);
    document.addEventListener("visibilitychange", sync); motion.addEventListener("change", sync);
    sync();
    return () => {
      synchronize.current = () => {}; gsap.ticker.remove(tick); observer.disconnect();
      document.removeEventListener("visibilitychange", sync); motion.removeEventListener("change", sync);
      if (sourceTextures.landscapeC === texture) { sourceTextures.landscapeC = fallback; if (activeScreen.current === "landscapeC") phone.setScreen(fallback); }
      texture.dispose(); canvas.width = canvas.height = 0;
    };
  }, [gl, invalidate, screen, pose, sourcesRef, phone]);
  useEffect(() => { enabledRef.current = enabled; synchronize.current(); }, [enabled]);
  return synchronize;
}
