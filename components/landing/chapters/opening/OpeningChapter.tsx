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
import NightField from "./NightField";
import HeroActions from "./HeroActions";
import OpeningDock from "./OpeningDock";
import OryvelleMark from "./OryvelleMark";
import DownloadPanel from "./DownloadPanel";
import JourneyFooter from "./JourneyFooter";
import { createOpeningTimeline } from "./opening.timeline";
import MeditationScene from "./MeditationScene";
import { createMeditationTimeline } from "./meditation.timeline";
import BreathingScene from "./BreathingScene";
import SoundMixerShowcase from "../../features/SoundMixerShowcase";
import { createMixerHandoff } from "./mixer-handoff";
import { createBreathingTimeline } from "./breathing.timeline";
import styles from "./opening.module.css";
import GlobalEntry from "../../entry/GlobalEntry";
import ExploreControls from "../../device/explore/ExploreControls";
import type { ExploreEngine, ExploreSnapshot } from "../../device/explore/explore-engine";
const PhoneCanvas = dynamic(() => import("../../device/PhoneCanvas"), { ssr: false });
gsap.registerPlugin(ScrollTrigger, useGSAP);
class RendererBoundary extends Component<{ children: ReactNode; onError(): void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onError(); }
  render() { return this.state.failed ? null : this.props.children; }
}
export default function OpeningChapter() {
  const initialPose = OPENING_POSES[0];
  const chapter = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const meditationMarker = useRef<HTMLDivElement>(null);
  const breathingMarker = useRef<HTMLDivElement>(null);
  const mixer = useRef<HTMLDivElement>(null);
  const mixerLights = useRef<SVGSVGElement>(null);
  const product = useRef<HTMLDivElement>(null);
  const controller = useRef<PhoneController | null>(null);
  const current = useRef<PhonePose>({ ...initialPose });
  const progress = useRef(initialPose.at);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [preferencesReady, setPreferencesReady] = useState(false);
  const [fontsReady, setFontsReady] = useState(false);
  const [layoutReady, setLayoutReady] = useState(false);
  const posterImage = useRef<HTMLImageElement>(null);
  const [posterReady, setPosterReady] = useState(false);
  const [entryReleased, setEntryReleased] = useState(false);
  const exploreController = useRef<ExploreEngine | null>(null);
  const [exploreState, setExploreState] = useState<ExploreSnapshot | null>(null);
  const onExploreReady = useCallback((demo: ExploreEngine | null) => { exploreController.current = demo; }, []);
  const onExploreChange = useCallback((snapshot: ExploreSnapshot) => { setExploreState(snapshot); }, []);
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
  const fallback = failed || reduced;
  const onReady = useCallback((next: PhoneController) => {
    controller.current = next;
    next.setAmbientProgress(progress.current);
    next.apply(responsivePose(current.current, window.matchMedia("(max-width: 760px)").matches), openingScreenAt(progress.current));
  }, []);
  const onPresented = useCallback(() => { setReady(true); }, []);
  const onLost = useCallback(() => { controller.current = null; setFailed(true); setReady(false); }, []);
  const onRelease = useCallback(() => { setEntryReleased(true); }, []);
  useEffect(() => {
    if (!entryReleased || !window.location.hash) return;
    // Entry starts at the top; honor incoming section links after its lock is gone.
    const frame = requestAnimationFrame(() => {
      document.getElementById(window.location.hash.slice(1))?.scrollIntoView({ behavior: "instant" });
    });
    return () => cancelAnimationFrame(frame);
  }, [entryReleased]);
  useGSAP(() => {
    Object.assign(current.current, initialPose); progress.current = initialPose.at;
    const apply = (value: number) => {
      progress.current = value;
      const pose = responsivePose(current.current, window.matchMedia("(max-width: 760px)").matches);
      // CSS owns screen-space framing; R3F owns the physical orientation.
      gsap.set(product.current, { xPercent: (pose.x ?? 0) * 100 });
      controller.current?.setAmbientProgress(value);
      controller.current?.apply(pose, openingScreenAt(value));
    };
    apply(progress.current);
    setLayoutReady(true);
    if (fallback || !chapter.current || !stage.current) return;
    const timeline = createOpeningTimeline({ chapter: chapter.current, stage: stage.current, pose: current.current, onUpdate: apply });
    const meditation = meditationMarker.current ? createMeditationTimeline({ marker: meditationMarker.current, stage: stage.current }) : null;
    const breathing = breathingMarker.current ? createBreathingTimeline({ marker: breathingMarker.current, stage: stage.current }) : null;
    const cleanMixer = mixer.current && mixerLights.current ? createMixerHandoff(stage.current, mixer.current, mixerLights.current) : undefined;
    // Typography loading may change composition metrics. Never refresh per frame.
    let disposed = false;
    void document.fonts.ready.then(() => { if (!disposed) ScrollTrigger.refresh(); });
    return () => { disposed = true; cleanMixer?.(); breathing?.scrollTrigger?.kill(); breathing?.kill(); meditation?.scrollTrigger?.kill(); meditation?.kill(); timeline.scrollTrigger?.kill(); timeline.kill(); };
  }, { scope: chapter, dependencies: [fallback], revertOnUpdate: true });
  const seek = (value: number, smooth = false) => {
    if (!chapter.current || !stage.current) return;
    window.scrollTo({ top: chapter.current.offsetTop + value * (chapter.current.offsetHeight - stage.current.offsetHeight), behavior: smooth && !reduced ? "smooth" : "instant" });
  };
  const entryReady = preferencesReady && layoutReady && (fallback ? posterReady : ready && fontsReady);
  return <DownloadPanel reduced={reduced}>
    {!entryReleased && <GlobalEntry ready={entryReady} reduced={reduced} onRelease={onRelease} onFallback={onLost} />}
    <noscript><style>{`[data-opening-entry]{display:none} [data-opening-content]{visibility:visible} [data-opening-poster]{visibility:visible} html:has([data-opening-entry]){overflow:auto} [data-opening-chapter]{height:100svh}`}</style></noscript>
    <main id="main-content" className={styles.page} data-opening-content="" aria-busy={!entryReleased}>
    <section className={`${styles.journey} ${fallback ? styles.staticJourney : styles.guidedJourney}`} aria-label="A quieter evening with Oryvelle" data-opening-chapter="">
      <div ref={chapter} className={`${styles.chapter} ${fallback ? styles.staticChapter : ""}`} aria-hidden="true" />
      {!fallback && <div ref={meditationMarker} className={styles.meditationMarker} aria-hidden="true" />}
      {!fallback && <div ref={breathingMarker} className={styles.breathingMarker} aria-hidden="true" />}
      <div ref={stage} className={styles.stage} data-explore-available={!fallback && exploreState?.available ? "true" : undefined} data-explore-active={!fallback && exploreState?.active && exploreState.available ? "true" : undefined}>
        <div className={styles.atmosphere} aria-hidden="true"><NightField animate={entryReleased && !reduced && !fallback} /><div className={styles.beam} /><div className={styles.deskGlow} /></div>
        {!fallback && <MeditationScene />}
        {!fallback && <BreathingScene />}
        <Link className={styles.brand} href="/" aria-label="Oryvelle home"><OryvelleMark /><span>Oryvelle</span></Link>
        <div className={`${styles.copy} ${styles.hero}`}>
          <h1>Quiet your<br />restless mind.</h1>
          <div className={styles.support}><p>Wind down with ambient sounds, guided meditations and breathing practices at your own pace.</p><HeroActions onAdvance={fallback ? undefined : () => seek(.57, true)} /></div>
          <aside className={styles.capability} aria-label="Evening audio features"><h2>Your evening mix</h2><p>Combine ambient sounds.<br />Set a sleep timer.</p></aside>
        </div>
        <div className={`${styles.copy} ${styles.returnCopy}`}><h2>Find your<br />soundscape.</h2><div className={styles.support}><p>Explore a sky of sounds.<br />Tap a star to listen, then combine<br className={styles.desktopBreak} /> the sounds you love.</p><HeroActions utilitiesOnly advanceLabel="Scroll to the sleep timer" onAdvance={fallback ? undefined : () => seek(.94, true)} /></div></div>
        <div className={`${styles.copy} ${styles.deskCopy}`}><h2>Drift into<br />the night.</h2><div className={styles.support}><p>Set a sleep timer.<br />Let your sound mix gently fade<br className={styles.desktopBreak} /> as the countdown ends.</p></div></div>
        <div className={`${styles.environment} ${styles.rear}`} aria-hidden="true"><Stand /></div>
        <div ref={product} className={styles.product} aria-hidden="true">
          <picture data-opening-poster="" className={`${styles.poster} ${fallback ? "" : styles.posterHidden}`}>
            <source media="(max-width: 760px)" srcSet="/opening/poster-narrow.png" />
            <img ref={posterImage} src="/opening/poster-desktop.png" width={2545} height={2658} alt="" loading="eager" onLoad={() => setPosterReady(true)} onError={() => setPosterReady(true)} />
          </picture>
          {!fallback && preferencesReady && <RendererBoundary onError={onLost}><div className={styles.renderer} data-presented={ready && !fallback}><PhoneCanvas onReady={onReady} onPresented={onPresented} onLost={onLost} ambientEnabled={entryReleased && !fallback} onExploreReady={onExploreReady} onExploreChange={onExploreChange} /></div></RendererBoundary>}
        </div>
        <div className={`${styles.environment} ${styles.foreground}`} aria-hidden="true"><Stand foreground /></div>
        <OpeningDock reduced={reduced} canExplore={!fallback} onNavigate={value => seek(value, true)} />
        {!fallback && <ExploreControls controller={exploreController} state={exploreState} />}
      </div>
    </section>
    {fallback && <MeditationScene stationary />}
    {fallback && <BreathingScene stationary />}
    <div ref={mixer} className={styles.mixerContinuation}><SoundMixerShowcase /></div>
    {!fallback && <svg ref={mixerLights} className={styles.mixerLights} aria-hidden="true">
      {["#8ecbdc", "#91c9ae", "#bdaddb"].map(color => <g key={color}>
        <path data-mixer-thread="" fill="none" stroke={color} strokeWidth="1" />
        <g data-mixer-light="">
          <circle r="18" fill={color} opacity=".035" />
          <circle r="9" fill={color} opacity=".09" />
          <circle r="4" fill={color} opacity=".25" />
          <circle r="1.8" fill={color} />
          <circle r=".7" fill="#f5efff" />
        </g>
      </g>)}
    </svg>}
    <JourneyFooter reduced={reduced} />
  </main></DownloadPanel>;
}
