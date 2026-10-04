"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { Component, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import type { PhoneController, PhonePose } from "../../device/phone-model";
import { OPENING_POSES, openingScreenAt, responsivePose } from "./opening-poses";
import Stand from "./Stand";
import HeroAvailability from "./HeroAvailability";
import { createOpeningTimeline } from "./opening.timeline";
import styles from "./opening.module.css";
import { PLAY_STORE_URL } from "@/app/site-config";
import GlobalEntry from "../../entry/GlobalEntry";
const PhoneCanvas = dynamic(() => import("../../device/PhoneCanvas"), { ssr: false });
gsap.registerPlugin(ScrollTrigger, useGSAP);
class RendererBoundary extends Component<{ children: ReactNode; onError(): void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onError(); }
  render() { return this.state.failed ? null : this.props.children; }
}
export default function OpeningChapter({ preview, debug = false, posterOnly = false }: { preview?: string; debug?: boolean; posterOnly?: boolean; }) {
  const checkpoint = OPENING_POSES.find(p => p.name === preview) ?? OPENING_POSES[0];
  const chapter = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const product = useRef<HTMLDivElement>(null);
  const controller = useRef<PhoneController | null>(null);
  const current = useRef<PhonePose>({ ...checkpoint });
  const progress = useRef(checkpoint.at);
  const meter = useRef<HTMLInputElement>(null);
  const stats = useRef<HTMLOutputElement>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [preferencesReady, setPreferencesReady] = useState(false);
  const [fontsReady, setFontsReady] = useState(false);
  const [layoutReady, setLayoutReady] = useState(false);
  const posterImage = useRef<HTMLImageElement>(null);
  const [posterReady, setPosterReady] = useState(false);
  const [entryReleased, setEntryReleased] = useState(Boolean(preview));
  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => { setReduced(motion.matches); setPreferencesReady(true); };
    update(); motion.addEventListener("change", update);
    return () => { motion.removeEventListener("change", update); };
  }, []);
  useEffect(() => {
    let disposed = false;
    void document.fonts.ready.then(() => { if (!disposed) setFontsReady(true); });
    return () => { disposed = true; };
  }, []);
  useEffect(() => {
    // Cached SSR images can finish before React attaches the load handler.
    if (posterImage.current?.complete) setPosterReady(true);
  }, []);
  const fallback = failed || reduced || posterOnly;
  const onReady = useCallback((next: PhoneController) => {
    controller.current = next;
    next.setAmbientProgress(progress.current);
    next.apply(responsivePose(current.current, window.matchMedia("(max-width: 760px)").matches), openingScreenAt(progress.current));
  }, []);
  const onPresented = useCallback(() => { setReady(true); }, []);
  const onLost = useCallback(() => { controller.current = null; setFailed(true); setReady(false); }, []);
  const onRelease = useCallback(() => { setEntryReleased(true); }, []);
  const onStats = useCallback((value: string) => { if (stats.current) stats.current.textContent = value; }, []);
  useGSAP(() => {
    Object.assign(current.current, checkpoint); progress.current = checkpoint.at;
    const apply = (value: number) => {
      progress.current = value;
      if (meter.current) meter.current.value = String(value);
      const pose = responsivePose(current.current, window.matchMedia("(max-width: 760px)").matches);
      // CSS owns screen-space framing; R3F owns the physical orientation.
      gsap.set(product.current, { xPercent: (pose.x ?? 0) * 100 });
      controller.current?.setAmbientProgress(value);
      controller.current?.apply(pose, openingScreenAt(value));
    };
    apply(progress.current);
    setLayoutReady(true);
    if (fallback || preview || !chapter.current || !stage.current) return;
    const timeline = createOpeningTimeline({ chapter: chapter.current, stage: stage.current, pose: current.current, onUpdate: apply });
    // Typography loading may change composition metrics. Never refresh per frame.
    let disposed = false;
    void document.fonts.ready.then(() => { if (!disposed) ScrollTrigger.refresh(); });
    return () => { disposed = true; timeline.scrollTrigger?.kill(); timeline.kill(); };
  }, { scope: chapter, dependencies: [preview, fallback, debug], revertOnUpdate: true });
  const seek = (value: number) => {
    if (!chapter.current || !stage.current) return;
    window.scrollTo({ top: chapter.current.offsetTop + value * (chapter.current.offsetHeight - stage.current.offsetHeight), behavior: "instant" });
  };
  const phase = checkpoint.at < .28 ? "hero" : checkpoint.at < .69 ? "return" : "desk";
  const entryReady = preferencesReady && layoutReady && (fallback ? posterReady : ready && fontsReady);
  return <>
    {!entryReleased && <GlobalEntry ready={entryReady} reduced={reduced} onRelease={onRelease} onFallback={onLost} />}
    <noscript><style>{`[data-opening-entry]{display:none} [data-opening-content]{visibility:visible} [data-opening-poster]{visibility:visible} html:has([data-opening-entry]){overflow:auto} [data-opening-chapter]{height:100svh}`}</style></noscript>
    <main id="main-content" className={styles.page} data-opening-content="" aria-busy={!entryReleased} data-readiness={debug ? JSON.stringify({ ready, fallback, reduced, failed, preferencesReady, fontsReady, layoutReady, posterReady }) : undefined}>
    <section className={`${styles.journey} ${preview ? styles.previewJourney : fallback ? styles.staticJourney : ""}`} aria-label="A quieter evening with Oryvelle" data-phase={phase} data-opening-chapter="">
      <div ref={chapter} className={`${styles.chapter} ${fallback || preview ? styles.staticChapter : ""}`} aria-hidden="true" />
      <div ref={stage} className={styles.stage}>
        <div className={styles.atmosphere} aria-hidden="true"><div className={styles.beam} /><div className={styles.deskGlow} /></div>
        <Link className={styles.brand} href="/" aria-label="Oryvelle home">Oryvelle</Link>
        <div className={`${styles.copy} ${styles.hero}`}>
          <h1>Quiet your<br />restless mind.</h1>
          <div className={styles.support}><p>Make space for rest with ambient sounds, guided meditations and a gentler evening routine.</p><a href={PLAY_STORE_URL} className={styles.download}>Download Oryvelle <span aria-hidden="true">↗</span></a><HeroAvailability /></div>
          <aside className={styles.capability} aria-label="Evening audio features"><h2>Your evening mix</h2><p>Combine ambient sounds.<br />Set a sleep timer.</p></aside>
        </div>
        <div className={`${styles.copy} ${styles.returnCopy}`}><h2>Leave the day.<br />Find your calm.</h2><div className={styles.support}><p>A moment to breathe.<br />A sound to settle into.<br />A little distance from the day.</p></div></div>
        <div className={`${styles.copy} ${styles.deskCopy}`}><h2>Rest comes<br />into focus.</h2><div className={styles.support}><p>Settle into your space.<br />Let a softer atmosphere accompany<br className={styles.desktopBreak} /> your evening.</p></div></div>
        <div className={`${styles.environment} ${styles.rear}`} aria-hidden="true"><Stand /></div>
        <div ref={product} className={styles.product} aria-hidden="true">
          <picture data-opening-poster="" className={`${styles.poster} ${fallback ? "" : styles.posterHidden}`}>
            <source media="(max-width: 760px)" srcSet="/opening/poster-narrow.png" />
            <img ref={posterImage} src="/opening/poster-desktop.png" width={2545} height={2658} alt="" loading="eager" onLoad={() => setPosterReady(true)} onError={() => setPosterReady(true)} />
          </picture>
          {!fallback && preferencesReady && <RendererBoundary onError={onLost}><div className={styles.renderer} data-presented={ready && !fallback}><PhoneCanvas onReady={onReady} onPresented={onPresented} onLost={onLost} onStats={debug ? onStats : undefined} ambientEnabled={entryReleased && !fallback} /></div></RendererBoundary>}
        </div>
        <div className={`${styles.environment} ${styles.foreground}`} aria-hidden="true"><Stand foreground /></div>
        <a className={styles.floatingNav} href={PLAY_STORE_URL} aria-label="Get Oryvelle for Android">O<span aria-hidden="true">↗</span></a>
        {debug && <div className={styles.debug}><output ref={stats}>Loading renderer</output><input ref={meter} aria-label="Development chapter progress" type="range" min="0" max="1" step=".001" defaultValue={0} onChange={e => seek(Number(e.target.value))} /><nav aria-label="Development compositions">{OPENING_POSES.map(p => <a key={p.name} href={`?pose=${p.name}&debug=1`}>{p.name}</a>)}</nav><nav aria-label="Native scroll checkpoints">{OPENING_POSES.map(p => <button type="button" key={p.name} onClick={() => seek(p.at)}>{p.name}</button>)}</nav><a href="?poster=1&debug=1">Poster fallback</a><button type="button" onClick={() => { const canvas = product.current?.querySelector("canvas"); canvas?.getContext("webgl2")?.getExtension("WEBGL_lose_context")?.loseContext(); }}>Test context loss</button></div>}
      </div>
    </section>
    <div className={styles.attribution} aria-label="Phone model attribution"><small>Model by <a href="https://sketchfab.com/3d-models/samsung-s-26-ultra-3d-model-3356099ca99d488d95a6a253d05577f7">achrixx</a> · <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a> · materials and display adapted.</small></div>
  </main></>;
}
