"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import styles from "./entry.module.css";

declare global { interface Window { __openingScrollRestoration?: ScrollRestoration } }

export default function GlobalEntry({ ready, reduced, onRelease, onFallback }: {
  ready: boolean; reduced: boolean; onRelease(): void; onFallback(): void;
}) {
  const cover = useRef<HTMLDivElement>(null);
  const line = useRef<HTMLSpanElement>(null);
  const [minimumComplete, setMinimumComplete] = useState(false);

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
    // A short underline introduction, not simulated download progress.
    const tween = gsap.fromTo(line.current, { scaleX: 0 }, {
      scaleX: 1, duration: reduced ? 0 : .28, ease: "power2.out",
      onComplete: () => setMinimumComplete(true),
    });
    return () => { tween.kill(); };
  }, [reduced]);

  useEffect(() => {
    if (!ready || !minimumComplete) return;
    const tween = gsap.to(cover.current, {
      yPercent: reduced ? 0 : -100, opacity: reduced ? 0 : 1,
      duration: reduced ? .12 : .76, ease: "power3.inOut",
      onComplete: onRelease,
    });
    return () => { tween.kill(); };
  }, [ready, minimumComplete, reduced, onRelease]);

  // Parent unmounts this component on release, removing the scroll lock.
  return <div ref={cover} className={styles.cover} data-opening-entry="active">
    <div className={styles.light} aria-hidden="true" />
    <div className={styles.identity} role="status" aria-live="polite">
      <span className={styles.wordmark}>Oryvelle</span>
      <span ref={line} className={styles.line} aria-hidden="true" />
      <span className={styles.srOnly}>Preparing your quieter evening.</span>
    </div>
    <button className={styles.fallback} type="button" onClick={onFallback}>View static version</button>
  </div>;
}
