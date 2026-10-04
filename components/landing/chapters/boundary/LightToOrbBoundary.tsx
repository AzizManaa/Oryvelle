"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { drawOrbFormation } from "../mix/orb-renderer";
import { drawCosmicField, fieldStars } from "../orb-world/cosmic-field";
import { boundaryNight } from "../../atmosphere/night-atmosphere";
import NightAtmosphere from "../../atmosphere/NightAtmosphere";
import { boundaryState, smoothPhase } from "./boundary-state";
import styles from "./boundary.module.css";

gsap.registerPlugin(ScrollTrigger);

type Props = {
  journey: RefObject<HTMLElement | null>;
  openingRange: RefObject<HTMLDivElement | HTMLElement | null>;
  stage: RefObject<HTMLDivElement | null>;
  assembly: RefObject<HTMLDivElement | null>;
  atmosphere: RefObject<HTMLDivElement | null>;
  reduced: boolean;
  debug: boolean;
  forceFallback?: boolean;
  staticOpening: boolean;
};

export default function LightToOrbBoundary({ journey, openingRange, stage, assembly, atmosphere, reduced, debug, forceFallback = false, staticOpening }: Props) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const root = useRef<HTMLDivElement>(null);
  const [unavailable, setUnavailable] = useState(false);

  useEffect(() => {
    const element = canvas.current, host = root.current;
    const parent = journey.current, range = openingRange.current, viewport = stage.current, hardware = assembly.current, lighting = atmosphere.current;
    if (!element || !host || !parent || !range || !viewport || !hardware || !lighting) return;
    const context = element.getContext("2d", { alpha: true });
    const supported = !forceFallback && context && typeof context.createConicGradient === "function";
    setUnavailable(!supported);
    const mobile = matchMedia("(max-width: 760px)");
    const stars = fieldStars(38);
    let width = 0, height = 0, draws = 0;
    const state = { progress: 0 };
    let drawMs = 0;
    const paint = () => {
      const formation = boundaryState(state.progress);
      const openingExposure = Number(viewport.style.getPropertyValue("--night-opening")) || .22;
      viewport.style.setProperty("--night-boundary", String(boundaryNight(state.progress, openingExposure)));
      host.style.setProperty("--formation", String(formation.light));
      host.style.setProperty("--core", String(formation.core));
      if (supported && width && height) {
        const started = performance.now();
        const formationProgress = mobile.matches ? Math.min(1, state.progress / .86) : state.progress;
        const field = mobile.matches ? smoothPhase(state.progress, .04, .70) : 0;
        drawOrbFormation(context, width, height, formationProgress, mobile.matches ? {
          elapsed: 0, settle: 0, mobileComposition: true,
          contour: 1 - .65 * field, radiance: 1 + 1.8 * field,
        } : undefined);
        if (mobile.matches && field > 0) drawCosmicField(context, width, height, stars, 0, field, 0, true);
        drawMs = performance.now() - started;
      }
      if (debug) {
        host.dataset.boundaryProgress = state.progress.toFixed(4);
        host.dataset.boundaryDraws = String(++draws);
        host.dataset.boundaryDrawMs = drawMs.toFixed(2);
        host.dataset.boundarySize = `${width}x${height}`;
        host.dataset.hardwareVisible = String(formation.exit < .90);
      }
    };
    const resize = () => {
      const bounds = element.getBoundingClientRect();
      width = bounds.width; height = bounds.height;
      const dpr = Math.min(devicePixelRatio || 1, 1.5);
      element.width = Math.round(width * dpr); element.height = Math.round(height * dpr);
      context?.setTransform(dpr, 0, 0, dpr, 0, 0);
      paint();
    };
    const scope = gsap.matchMedia();
    scope.add({ mobile: "(max-width: 760px)", desktop: "(min-width: 761px)" }, () => {
      if (reduced) { state.progress = 1; paint(); return; }
      let refreshing = false;
      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: parent,
          start: () => `top+=${range.offsetHeight - viewport.offsetHeight} top`,
          end: () => `top+=${parent.offsetHeight - viewport.offsetHeight} top`,
          scrub: true, invalidateOnRefresh: true,
          onRefreshInit() { refreshing = true; },
          onRefresh() { refreshing = false; paint(); },
        },
        onUpdate: () => { if (!refreshing) paint(); },
      });
      // These are created inside the context so resize/unmount reverts both
      // the outer transform and persistent atmosphere ownership.
      timeline.to(state, { progress: 1, duration: 1 }, 0)
        .to(hardware, { yPercent: -118, duration: 1, ease: p => boundaryState(p).exit }, 0)
        .fromTo(lighting, { opacity: 1 }, { opacity: 0, duration: .68 }, 0);
      // matchMedia refreshes all chapters after rebuilding; an individual
      // refresh here clears its saved scroll position before restoration.
    }, host);
    const observer = new ResizeObserver(resize);
    observer.observe(element); resize();
    return () => { observer.disconnect(); scope.revert(); viewport.style.removeProperty("--night-boundary"); };
  }, [journey, openingRange, stage, assembly, atmosphere, reduced, debug, forceFallback, staticOpening]);

  return <div ref={root} className={`${styles.world} ${reduced ? styles.reduced : ""}`} role="img" aria-label="Lavender light from the supported phone becomes Oryvelle’s dark ringed orb">
    {reduced && <NightAtmosphere />}
    <canvas ref={canvas} aria-hidden="true" />
    <div className={styles.fallback} data-active={unavailable} aria-hidden="true"><i /><b /></div>
    <noscript><div className={styles.noScriptOrb} /></noscript>
  </div>;
}
