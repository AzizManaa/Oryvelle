"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { drawMixOrb } from "./orb-renderer";
import styles from "./mix.module.css";

export default function MixOrb() {
  const root = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [painted, setPainted] = useState(false);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const element = canvas.current;
    const host = root.current;
    if (!element || !host) return;
    const context = element.getContext("2d", { alpha: true });
    if (!context || typeof context.createConicGradient !== "function") return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    let frame = 0;
    let elapsed = 0;
    let previous = 0;
    let lastDraw = 0;
    let width = 0;
    let height = 0;
    let frames = 0;
    let disposed = false;
    let wasHidden = document.hidden;
    const draw = () => {
      const started = performance.now();
      drawMixOrb(context, width, height, elapsed);
      if (process.env.NODE_ENV === "development") {
        host.dataset.orbFrames = String(++frames);
        host.dataset.orbDrawMs = (performance.now() - started).toFixed(2);
      }
    };
    const tick = (now: number) => {
      elapsed += previous ? Math.min(now - previous, 100) : 0;
      previous = now;
      if (now - lastDraw >= 1000 / 30) { draw(); lastDraw = now; }
      frame = requestAnimationFrame(tick);
    };
    const sync = () => {
      cancelAnimationFrame(frame);
      previous = 0;
      if (process.env.NODE_ENV === "development") {
        if (document.hidden) host.dataset.orbHiddenPauseFrame = String(frames);
        else if (wasHidden) host.dataset.orbHiddenResumeFrame = String(frames);
      }
      wasHidden = document.hidden;
      const running = visible && !document.hidden && !reduced.matches;
      setActive(running);
      host.dataset.renderState = running ? "ambient" : "static";
      if (running) frame = requestAnimationFrame(tick);
    };
    const resize = () => {
      const bounds = element.getBoundingClientRect();
      width = bounds.width; height = bounds.height;
      const dpr = Math.min(devicePixelRatio || 1, 1.5);
      element.width = Math.round(width * dpr);
      element.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
      if (!disposed) setPainted(true);
    };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); }, { threshold: .05 });
    const size = new ResizeObserver(resize);
    resize();
    observer.observe(host); size.observe(element);
    document.addEventListener("visibilitychange", sync);
    reduced.addEventListener("change", sync);
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect(); size.disconnect();
      document.removeEventListener("visibilitychange", sync);
      reduced.removeEventListener("change", sync);
    };
  }, []);

  return <div ref={root} className={styles.orbObject} data-active={active}>
    <div className={styles.orbFallback} data-hidden={painted} aria-hidden="true"><i /><b /></div>
    <canvas ref={canvas} className={styles.orbCanvas} aria-hidden="true" />
    <div className={`${styles.satellite} ${styles.rainSatellite}`}>
      <Image src="/mix/calming-rain.webp" width={81} height={81} alt="" />
      <span>Calming Rain<small>50% · sound layer</small></span>
    </div>
    <div className={`${styles.satellite} ${styles.noiseSatellite}`}>
      <Image src="/mix/brown-noise.webp" width={81} height={81} alt="" />
      <span>Brown Noise<small>50% · sound layer</small></span>
    </div>
  </div>;
}
