"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, type RefObject } from "react";
import { LinearFilter, SRGBColorSpace, VideoTexture, type Texture } from "three";
import type { PhonePose } from "./phone-model";
import { SCREEN_SOURCES, type ScreenState } from "./screen-sources";

// Center-cover the recording on the model's physical display without stretching.
export function fitScreenTexture(texture: Texture, displayAspect: number, sourceAspect: number) {
  texture.repeat.set(Math.min(1, displayAspect / sourceAspect), Math.min(1, sourceAspect / displayAspect));
  texture.offset.set((1 - texture.repeat.x) / 2, (1 - texture.repeat.y) / 2);
}

export function usePhoneScreenVideo({ state, enabled, screen, pose, sources, phone, replaced = false }: {
  replaced?: boolean;
  state: ScreenState;
  enabled: boolean;
  screen: RefObject<ScreenState>;
  pose: RefObject<PhonePose>;
  sources: Record<ScreenState, Texture>;
  phone: { displayAspect: number; setScreen(texture: Texture): void };
}) {
  const { gl, invalidate } = useThree();
  const synchronize = useRef<() => void>(() => {});
  const enabledRef = useRef(enabled);
  const fallbackFrame = useRef<() => void>(() => {});

  useEffect(() => {
    if (replaced) return;
    const source = SCREEN_SOURCES[state];
    if (source.kind !== "video") return;
    const poster = sources[state];
    const video = document.createElement("video");
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.loop = true;
    video.preload = "auto";
    const texture = new VideoTexture(video);
    texture.flipY = false;
    texture.colorSpace = SRGBColorSpace;
    texture.minFilter = LinearFilter;
    texture.magFilter = LinearFilter;
    texture.generateMipmaps = false;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let inView = false;
    let ready = false;
    let disposed = false;
    let starting = false;
    let callback: number | undefined;
    const hasVideoFrames = typeof video.requestVideoFrameCallback === "function";
    const eligible = () => enabledRef.current && ready && inView && !document.hidden && !motion.matches
      && screen.current === state && Math.cos(pose.current.yaw) > .08 && !gl.getContext().isContextLost();
    const cancelFrame = () => {
      if (callback !== undefined) video.cancelVideoFrameCallback(callback);
      callback = undefined;
    };
    const scheduleFrame = () => {
      if (!hasVideoFrames || callback !== undefined || disposed || !eligible() || video.paused) return;
      callback = video.requestVideoFrameCallback(() => {
        callback = undefined;
        if (disposed || !eligible()) return;
        invalidate();
        scheduleFrame();
      });
    };
    const sync = () => {
      if (disposed) return;
      if (!eligible()) { video.pause(); cancelFrame(); return; }
      if (!video.paused) { scheduleFrame(); return; }
      if (starting) return;
      starting = true;
      void video.play().then(() => {
        starting = false;
        if (disposed || !eligible()) { video.pause(); return; }
        scheduleFrame(); invalidate();
      }).catch(() => { starting = false; }); // A denied autoplay leaves the real first frame usable.
    };
    const loaded = () => {
      if (disposed || ready) return;
      ready = true;
      fitScreenTexture(texture, phone.displayAspect, video.videoWidth / video.videoHeight);
      sources[state] = texture;
      if (screen.current === state) phone.setScreen(texture);
      invalidate(); sync();
    };
    const failed = () => {
      ready = false;
      video.pause(); cancelFrame();
      sources[state] = poster;
      if (screen.current === state) phone.setScreen(poster);
      invalidate();
    };
    synchronize.current = sync;
    fallbackFrame.current = () => { if (!hasVideoFrames && eligible() && !video.paused) invalidate(); };
    const observer = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; sync(); });
    observer.observe(gl.domElement);
    video.addEventListener("loadeddata", loaded);
    video.addEventListener("error", failed);
    document.addEventListener("visibilitychange", sync);
    motion.addEventListener("change", sync);
    video.src = source.url;
    video.load();
    return () => {
      disposed = true;
      synchronize.current = () => {};
      fallbackFrame.current = () => {};
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
      motion.removeEventListener("change", sync);
      video.removeEventListener("loadeddata", loaded);
      video.removeEventListener("error", failed);
      video.pause(); cancelFrame();
      video.removeAttribute("src"); video.load();
      if (sources[state] === texture) {
        sources[state] = poster;
        if (screen.current === state) phone.setScreen(poster);
      }
      texture.dispose();
    };
  }, [gl, invalidate, phone, pose, screen, sources, state, replaced]);
  useEffect(() => { enabledRef.current = enabled; synchronize.current(); }, [enabled]);
  useFrame(() => fallbackFrame.current());
  return synchronize;
}
