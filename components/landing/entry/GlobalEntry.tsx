"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import OryvelleMark from "../chapters/opening/OryvelleMark";
import styles from "./entry.module.css";

declare global { interface Window { __openingScrollRestoration?: ScrollRestoration } }

export default function GlobalEntry({ ready, reduced, onRelease, onFallback }: {
  ready: boolean; reduced: boolean; onRelease(): void; onFallback(): void;
}) {
  const cover = useRef<HTMLDivElement>(null);
  const sky = useRef<SVGSVGElement>(null);
  const motion = useRef({ formation: 0, departure: 0 });

  useLayoutEffect(() => {
    const previousRestoration = window.__openingScrollRestoration ?? history.scrollRestoration;
    history.scrollRestoration = "manual";
    const content = document.querySelector<HTMLElement>("[data-opening-content]");
    if (content) content.inert = true;
    const anchor = () => window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    const prevent = (event: Event) => event.preventDefault();
    const keyboard = (event: KeyboardEvent) => {
      if ([" ", "ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End"].includes(event.key) && !(event.target instanceof HTMLButtonElement)) event.preventDefault();
    };
    anchor();
    window.addEventListener("wheel", prevent, { passive: false });
    window.addEventListener("touchmove", prevent, { passive: false });
    window.addEventListener("keydown", keyboard);
    window.addEventListener("scroll", anchor);
    window.addEventListener("pageshow", anchor);
    return () => {
      window.removeEventListener("wheel", prevent);
      window.removeEventListener("touchmove", prevent);
      window.removeEventListener("keydown", keyboard);
      window.removeEventListener("scroll", anchor);
      window.removeEventListener("pageshow", anchor);
      history.scrollRestoration = previousRestoration;
      if (content) content.inert = false;
      delete window.__openingScrollRestoration;
    };
  }, []);

  useEffect(() => {
    const scene = sky.current;
    if (!scene || reduced) return;
    const stars = [...scene.querySelectorAll<SVGGElement>("[data-entry-star]")];
    const trails = [...scene.querySelectorAll<SVGPathElement>("[data-entry-trail]")];
    const thread = scene.querySelector<SVGPathElement>("[data-entry-thread]");
    let elapsed = 0;
    const draw = (_time: number, delta: number) => {
      if (document.hidden) return;
      elapsed += Math.min(delta, 48) / 1000;
      const { formation, departure } = motion.current;
      const radius = 112 - formation * 48 + departure * 250;
      const points = stars.map((star, i) => {
        const angle = elapsed * .32 + i * Math.PI * 2 / 3 - Math.PI / 2;
        const point = (a: number) => ({ x: 200 + Math.cos(a) * radius, y: 200 + Math.sin(a) * radius * .82 });
        const p = point(angle), tail = point(angle - .48), middle = point(angle - .24);
        star.setAttribute("transform", `translate(${p.x} ${p.y})`);
        trails[i].setAttribute("d", `M${tail.x},${tail.y} Q${middle.x},${middle.y} ${p.x},${p.y}`);
        return p;
      });
      const arcs = points.map((p, i) => {
        const next = points[(i + 1) % points.length];
        const bow = 1 + formation * 2;
        const cx = 200 + ((p.x + next.x) / 2 - 200) * bow;
        const cy = 200 + ((p.y + next.y) / 2 - 200) * bow;
        return `Q${cx},${cy} ${next.x},${next.y}`;
      });
      thread?.setAttribute("d", `M${points[0].x},${points[0].y} ${arcs.join(" ")} Z`);
    };
    const introduction = gsap.timeline()
      .to(motion.current, { formation: 1, duration: .95, ease: "power2.inOut" }, 0)
      .to(scene.parentElement?.querySelector("[data-entry-mark]") ?? [], { opacity: 1, scale: 1, duration: .7, ease: "power2.out" }, .25);
    draw(0, 0);
    gsap.ticker.add(draw);
    return () => { gsap.ticker.remove(draw); introduction.kill(); };
  }, [reduced]);

  useEffect(() => {
    if (!ready || !cover.current) return;
    const root = cover.current;
    const transition = gsap.timeline({ onComplete: onRelease });
    if (reduced) {
      transition.to(root, { opacity: 0, duration: .15 });
    } else {
      // Readiness begins the handoff immediately; no artificial loading timer.
      transition.to(motion.current, { formation: 1, duration: .25, overwrite: "auto" }, 0)
        .to(root.querySelector("[data-entry-mark]"), { opacity: 1, scale: 1, duration: .25, overwrite: "auto" }, 0)
        .to(root.querySelectorAll("[data-entry-copy]"), { opacity: 0, y: -8, duration: .28 }, .08)
        .to(motion.current, { departure: 1, duration: 1, ease: "power3.in" }, .18)
        .to(root.querySelector("[data-entry-curtain]"), { "--aperture": "150vmax", duration: 1.05, ease: "power3.inOut" }, .18)
        .to(root.querySelector("[data-entry-universe]"), { scale: 3.5, duration: 1.05, ease: "power3.inOut" }, .18)
        .to(root.querySelectorAll("[data-entry-mark], [data-entry-thread], [data-entry-ring]"), { opacity: 0, duration: .32 }, .38)
        .to(root.querySelector("[data-entry-universe]"), { opacity: 0, duration: .28 }, .95);
    }
    return () => { transition.kill(); };
  }, [ready, reduced, onRelease]);

  // Parent unmounts this component on release, removing the scroll lock.
  return <div ref={cover} className={styles.cover} data-opening-entry="active">
    <div className={styles.curtain} data-entry-curtain="" aria-hidden="true" />
    <div className={styles.universe} data-entry-universe="" aria-hidden="true">
      <div className={styles.haze} />
      <svg ref={sky} className={styles.sky} viewBox="0 0 400 400">
        <defs><radialGradient id="entry-star-glow"><stop stopColor="#e0d9ff" stopOpacity=".5" /><stop offset=".28" stopColor="#b9a4df" stopOpacity=".16" /><stop offset="1" stopColor="#b9a4df" stopOpacity="0" /></radialGradient></defs>
        <circle className={styles.ring} data-entry-ring="" cx="200" cy="200" r="65" pathLength="1" />
        <path className={styles.thread} data-entry-thread="" />
        {[0, 1, 2].map(i => <g key={i}>
          <path className={styles.trail} data-entry-trail="" />
          <g data-entry-star="" transform={`translate(${200 + Math.cos(i * Math.PI * 2 / 3 - Math.PI / 2) * 112} ${200 + Math.sin(i * Math.PI * 2 / 3 - Math.PI / 2) * 92})`}>
            <circle r="18" fill="url(#entry-star-glow)" />
            <circle r={i === 0 ? 2 : 1.5} fill="#e9e3f7" />
            <circle r=".65" fill="#fff" />
          </g>
        </g>)}
        <circle className={styles.seed} cx="200" cy="200" r="1.8" />
      </svg>
      <div className={styles.mark} data-entry-mark=""><OryvelleMark /></div>
    </div>
    <div className={styles.identity} role="status" aria-live="polite" data-entry-copy="">
      <span className={styles.wordmark}>Oryvelle</span>
      <span className={styles.message}>A little space for you.</span>
      <span className={styles.srOnly}>Preparing your quieter evening.</span>
    </div>
    <button className={styles.fallback} data-entry-copy="" type="button" onClick={onFallback}>View static version</button>
  </div>;
}
