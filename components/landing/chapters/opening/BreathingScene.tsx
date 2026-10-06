"use client";

import { useEffect, useId, useRef, useState } from "react";
import { gsap } from "gsap";
import { PLAY_STORE_URL } from "@/app/site-config";
import { useDownloadPanel } from "./DownloadPanel";
import styles from "./breathing.module.css";
import { drawOryvelleOrb } from "@/app/_components/oryvelle-orb-renderer";

// Fixed app-backed 4-7-8 preview. Hold keeps pulling until its full seven seconds end.
const PHASES = [
  { label: "Inhale", seconds: 4, scale: 1.25, glow: .85, darkness: 0, ease: "sine.inOut" },
  { label: "Hold", seconds: 7, scale: 1.95, glow: .97, darkness: .72, ease: "none" },
  { label: "Exhale", seconds: 8, scale: 1, glow: .75, darkness: 0, ease: "sine.inOut" },
] as const;
export default function BreathingScene({ stationary = false }: { stationary?: boolean }) {
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(false);
  const syncRef = useRef<() => void>(() => {});
  const root = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const onDownload = useDownloadPanel();
  const handoffId = useId().replace(/:/g, "");
  useEffect(() => {
    const node = root.current;
    const canvas = canvasRef.current;
    if (!node || !canvas) return;
    const surface = canvas.getContext("2d", { alpha: true });
    const fallback = node.querySelector<HTMLElement>("[data-breath-orb-fallback]")!;
    if (!surface || typeof surface.createConicGradient !== "function") return;
    fallback.hidden = true;
    const cue = node.querySelector<HTMLElement>("[data-breath-phase]")!;
    const dots = node.querySelectorAll<HTMLElement>("[data-breath-dot]");
    const orbSurface = node.querySelector<HTMLElement>("[data-breath-orb-surface]")!;
    const state = { scale: 1, glow: stationary ? .85 : .75, darkness: 0 };
    let width = 0, height = 0, baseRadius = 0;
    let center = { x: 0, y: 0 };
    let visible = false;
    let loop: gsap.core.Timeline | undefined;
    const draw = () => {
      if (!width || !height) return;
      const formation = (stationary ? 1 : Number(node.dataset.breathFormation ?? 0)) * (1 - Number(node.dataset.breathDeparture ?? 0));
      const darkness = state.darkness * formation;
      node.style.setProperty("--breath-darkness", String(darkness));
      if (formation <= .001) { surface.clearRect(0, 0, width, height); return; }
      drawOryvelleOrb(surface, width, height, (loop?.totalTime() ?? 0) * 1000 + formation * 2600, {
        center, baseRadius,
        scale: state.scale * formation,
        glowStrength: state.glow,
      });

    };
    const resize = () => {
      const sceneBounds = node.getBoundingClientRect();
      const orbBounds = orbSurface.getBoundingClientRect();
      width = node.clientWidth; height = node.clientHeight;
      center = { x: orbBounds.left - sceneBounds.left + orbBounds.width / 2, y: orbBounds.top - sceneBounds.top + orbBounds.height / 2 };
      baseRadius = Math.min(orbBounds.width, orbBounds.height) / 2.25;
      node.style.setProperty("--orb-center-x", `${center.x}px`);
      node.style.setProperty("--orb-center-y", `${center.y}px`);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      surface.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(node);
    resizeObserver.observe(orbSurface);
    resize();
    if (stationary) return () => { resizeObserver.disconnect(); fallback.hidden = false; };
    const context = gsap.context(() => {
      loop = gsap.timeline({ paused: true, repeat: -1, onUpdate: draw });
      PHASES.forEach((phase, index) => {
        loop!.to(state, { scale: phase.scale, glow: phase.glow, darkness: phase.darkness, duration: phase.seconds, ease: phase.ease,
          onStart: () => {
            cue.textContent = phase.label;
            dots.forEach((dot, i) => { dot.dataset.current = String(i === index); });
          },
        });
      });
    }, node);
    cue.textContent = "Inhale";
    dots.forEach((dot, i) => { dot.dataset.current = String(i === 0); });
    draw();
    const reset = () => {
      // Reset absolute time, including repeats; don't replay phase callbacks on exit.
      loop?.pause().totalTime(0, true);
      state.scale = 1; state.glow = .75; state.darkness = 0;
      cue.textContent = "Inhale";
      dots.forEach((dot, i) => { dot.dataset.current = String(i === 0); });
      draw();
    };
    const sync = () => {
      const inChapter = node.dataset.breathActive === "true" && visible && Number(node.dataset.breathDeparture ?? 0) === 0;
      if (!inChapter) { reset(); return; }
      // Manual pause and tab hiding preserve the playhead; leaving the chapter doesn't.
      if (!document.hidden && !pausedRef.current) loop?.play(); else loop?.pause();
    };
    syncRef.current = sync;
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting && entry.intersectionRatio >= .5;
      sync();
    }, { threshold: [0, .5] });
    observer.observe(node);
    node.addEventListener("breathing-formation", draw);
    node.addEventListener("breathing-activation", sync);
    node.addEventListener("breathing-departure", sync);
    document.addEventListener("visibilitychange", sync);
    sync();
    return () => {
      observer.disconnect(); node.removeEventListener("breathing-formation", draw); node.removeEventListener("breathing-activation", sync);
      node.removeEventListener("breathing-departure", sync);
      document.removeEventListener("visibilitychange", sync); syncRef.current = () => {};
      context.revert(); resizeObserver.disconnect(); fallback.hidden = false;
      node.style.removeProperty("--breath-darkness");
      node.style.removeProperty("--orb-center-x"); node.style.removeProperty("--orb-center-y");
    };
  }, [stationary]);
  return <section ref={root} id="breathing" className={`${styles.scene} ${stationary ? styles.stationary : ""}`} data-breathing-scene="" aria-label="Guided breathing preview">
    <canvas ref={canvasRef} className={styles.orbCanvas} aria-hidden="true" />
    <div className={styles.vignette} aria-hidden="true" />
    {!stationary && <svg className={styles.handoff} data-breath-handoff="" aria-hidden="true">
      <defs><radialGradient id={handoffId}><stop stopColor="#e7dcff" stopOpacity=".6" /><stop offset=".25" stopColor="#b5a1db" stopOpacity=".25" /><stop offset="1" stopColor="#b5a1db" stopOpacity="0" /></radialGradient></defs>
      <path data-breath-handoff-thread="" fill="none" stroke="#b9a8d7" strokeOpacity=".5" strokeWidth="1" />
      <g data-breath-handoff-guide=""><circle r="19" fill={`url(#${handoffId})`} /><circle r="2" fill="#ece5ff" /></g>
    </svg>}
    <div className={styles.copy} data-breath-copy="">
      <p className={styles.eyebrow}>Guided breathing</p>
      <h2>Find your<br />rhythm.</h2>
      <p className={styles.description}>Follow the orb. Inhale for 4 seconds, hold for 7, then exhale for 8.</p>
      <div className={styles.controls}>
        {!stationary && <button className={styles.pause} type="button" aria-pressed={paused} onClick={() => {
          pausedRef.current = !pausedRef.current; setPaused(pausedRef.current); syncRef.current();
        }}>{paused ? "Resume preview" : "Pause preview"}</button>}
      </div>
      <a className={styles.download} href={PLAY_STORE_URL} onClick={onDownload}>Discover breathing in the app <span aria-hidden="true">↗</span></a>
    </div>
    <div className={styles.form} data-breath-form="">
      <div className={styles.orbSurface} data-breath-orb-surface="">
        <div className={styles.orbFallback} data-breath-orb-fallback="" aria-hidden="true" />
      </div>
      <div className={styles.cue} data-breath-cue="">
        <span data-breath-phase="">{stationary ? "4-7-8 rhythm" : "Inhale"}</span>
        <div className={styles.dots} aria-hidden="true">{PHASES.map((_, i) => <i key={i} data-breath-dot="" data-current={i === 0 ? "true" : "false"} />)}</div>
      </div>
    </div>
  </section>;
}
