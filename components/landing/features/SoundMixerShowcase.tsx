"use client";

import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import styles from "./sound-mixer.module.css";

const SOUNDS = [
  { name: "Calming Rain", kind: "Rain & storms", color: "#8ecbdc", volume: 65, cover: "https://cdn.oryvelle.app/media/sounds/calming-rain/cover-78877f56d68f.webp" },
  { name: "Forest Night", kind: "Nature", color: "#91c9ae", volume: 40, cover: "https://cdn.oryvelle.app/media/sounds/deep-forest/cover-4aab0e6bdf98.webp" },
  { name: "Brown Noise", kind: "Noise", color: "#bdaddb", volume: 25, cover: "https://cdn.oryvelle.app/media/sounds/brown-noise/cover-faf6dfac77d1.webp" },
];

function DemoSlider({ label, value, marker }: { label: string; value: number; marker?: string }) {
  return <div className={styles.sliderLabel} data-demo-slider={marker}>
    {label}<span data-demo-value="">{value}%</span>
    <div className={styles.rail} style={{ "--level": `${value}%` } as CSSProperties}><i /><span /></div>
  </div>;
}

// Silent visual demonstration; the Explorer owns playable website audio.
export default function SoundMixerShowcase() {
  const id = useId();
  const root = useRef<HTMLElement>(null);
  const syncPlayback = useRef<(() => void) | null>(null);
  const pausedRef = useRef(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const section = root.current;
    if (!section) return;
    const stage = section.querySelector<HTMLElement>("[data-demo-stage]")!;
    const mix = section.querySelector<HTMLElement>("[data-demo-view=mix]")!;
    const tune = section.querySelector<HTMLElement>("[data-demo-view=tune]")!;
    const sliders = [...section.querySelectorAll<HTMLElement>("[data-demo-slider=volume]")];
    const panSlider = section.querySelector<HTMLElement>("[data-demo-slider=pan]")!;
    const panOrb = section.querySelector<HTMLElement>("[data-pan-orb]")!;
    const toggle = section.querySelector<HTMLElement>("[data-auto-pan]")!;
    const sweep = section.querySelector<HTMLElement>("[data-sweep-settings]")!;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const levels = SOUNDS.map(sound => ({ value: sound.volume }));
    const pan = { value: 0 };
    let visible = false;
    let timeline: gsap.core.Timeline;

    const renderLevels = () => sliders.forEach((slider, index) => {
      slider.querySelector<HTMLElement>(`.${styles.rail}`)!.style.setProperty("--level", `${levels[index].value}%`);
      slider.querySelector<HTMLElement>("[data-demo-value]")!.textContent = `${Math.round(levels[index].value)}%`;
    });
    const renderPan = () => {
      const position = `${(pan.value + 100) / 2}%`;
      panOrb.style.left = position;
      panSlider.querySelector<HTMLElement>(`.${styles.rail}`)!.style.setProperty("--level", position);
      panSlider.querySelector<HTMLElement>("[data-demo-value]")!.textContent = Math.abs(pan.value) < 1 ? "Centered" : `${Math.round(Math.abs(pan.value))}% ${pan.value < 0 ? "left" : "right"}`;
    };
    const selectView = (view: "mix" | "tune") => { section.dataset.view = view; };
    const setAutoPan = (on: boolean) => { toggle.dataset.on = String(on); sweep.dataset.on = String(on); };
    const context = gsap.context(() => {
      gsap.set(tune, { xPercent: 12, autoAlpha: 0 });
      timeline = gsap.timeline({ paused: true, repeat: -1, repeatDelay: 1.5, defaults: { ease: "power2.inOut" } });
      // Return to the exact resting mix before repeating, without a loop cut.
      timeline.to(levels[0], { value: 80, duration: 1.4, onUpdate: renderLevels }, .8)
        .to(levels[1], { value: 52, duration: 1.4, onUpdate: renderLevels }, 1.6)
        .to(levels[2], { value: 18, duration: 1.4, onUpdate: renderLevels }, 2.4)
        .to(levels[0], { value: 65, duration: 1.3, onUpdate: renderLevels }, 3.8)
        .to(levels[1], { value: 40, duration: 1.3, onUpdate: renderLevels }, 4.1)
        .to(levels[2], { value: 25, duration: 1.3, onUpdate: renderLevels }, 4.4)
        .call(() => selectView("tune"), [], 6.4)
        .to(mix, { xPercent: -12, autoAlpha: 0, duration: .85 }, 6.4)
        .to(tune, { xPercent: 0, autoAlpha: 1, duration: .85 }, 6.55)
        .to(pan, { value: -55, duration: 1.7, onUpdate: renderPan }, 8)
        .to(pan, { value: 55, duration: 2.5, onUpdate: renderPan }, 9.7)
        .to(pan, { value: 0, duration: 1.2, onUpdate: renderPan }, 12.2)
        .call(() => setAutoPan(true), [], 13.8)
        .to(pan, { value: -60, duration: 3, onUpdate: renderPan }, 14.3)
        .to(pan, { value: 60, duration: 6, onUpdate: renderPan }, 17.3)
        .to(pan, { value: 0, duration: 3, onUpdate: renderPan }, 23.3)
        .call(() => selectView("mix"), [], 27.1)
        .to(tune, { xPercent: 12, autoAlpha: 0, duration: .85 }, 27.1)
        .to(mix, { xPercent: 0, autoAlpha: 1, duration: .85 }, 27.25)
        .call(() => setAutoPan(false), [], 28.1);
    }, section);
    const sync = () => {
      if (reducedMotion.matches) {
        timeline.pause(0);
        selectView("mix");
        setAutoPan(false);
        levels.forEach((level, index) => { level.value = SOUNDS[index].volume; });
        pan.value = 0;
        renderLevels();
        renderPan();
      } else if (visible && !document.hidden && !pausedRef.current) timeline.play();
      else timeline.pause();
    };
    renderPan();
    syncPlayback.current = sync;
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting && entry.intersectionRatio >= .3; sync(); }, { threshold: .3 });
    observer.observe(stage);
    document.addEventListener("visibilitychange", sync);
    reducedMotion.addEventListener("change", sync);
    sync();
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
      reducedMotion.removeEventListener("change", sync);
      syncPlayback.current = null;
      context.revert();
    };
  }, []);

  return <section ref={root} id="sound-mixer" className={styles.section} data-sound-mixer="" data-view="mix" aria-labelledby={`${id}-title`}>
    <header className={styles.header} data-mixer-heading="">
      <p className={styles.eyebrow}>Sound mixing & audio controls</p>
      <h2 id={`${id}-title`}>Make the<br />night yours.</h2>
    </header>
    <div className={styles.layout}>
      <div className={styles.editorial} data-mixer-editorial="">
        {([
          ["mix", "Mix your favourite sounds.", "Combine rain, forest ambience and noise. Adjust each volume to create a soundscape that feels right for you."],
          ["tune", "Give sound room to move.", "Move each sound left or right. Add an automatic stereo sweep, and adjust its width and pace."],
        ] as const).map(([key, title, description], index) => <div key={key} className={styles.feature} data-feature={key}>
          <h3 className={styles.featureTitle}><span className={styles.number}>0{index + 1}</span><span>{title}</span><span className={styles.arrow} aria-hidden="true">↗</span></h3>
          <div className={styles.descriptionWrap}><div><p className={styles.featureDescription}>{description}</p></div></div>
        </div>)}
        <p className={styles.note}>A glimpse of how your soundscape comes together.<br />Audio plays in the app.</p>
        <button type="button" className={styles.playback} aria-pressed={paused} onClick={() => {
          pausedRef.current = !pausedRef.current;
          setPaused(pausedRef.current);
          syncPlayback.current?.();
        }}>{paused ? "Resume animation" : "Pause animation"}<span aria-hidden="true">{paused ? "▷" : "Ⅱ"}</span></button>
      </div>
      <div className={styles.stage} data-demo-stage="" style={{ "--sound-color": SOUNDS[0].color } as CSSProperties}>
        <div className={styles.sky} aria-hidden="true" />
        <div className={styles.panel} data-mixer-panel="" aria-hidden="true">
          <div className={styles.views}>
            <div className={styles.view} data-demo-view="mix">
              <div className={styles.panelHeader}><span className={styles.eyebrow}>Your evening mix</span><span className={styles.badge}>PREVIEW</span></div>
              <h3>A quiet place, made by you.</h3>
              <div className={styles.layers}>{SOUNDS.map(item => <div className={styles.layer} key={item.name} style={{ "--sound-color": item.color } as CSSProperties}>
                <div className={styles.layerHeading}>
                  <span className={styles.art} data-mixer-art=""><Image src={item.cover} alt="" width={50} height={50} /></span>
                  <div><h4>{item.name}</h4><p>{item.kind}</p></div><span className={styles.tuneIcon}>↗</span>
                </div>
                <DemoSlider label="Volume" value={item.volume} marker="volume" />
              </div>)}</div>
              <div className={styles.panelFooter}><span className={styles.dot} /><span>Three layers. One atmosphere.</span></div>
            </div>
            <div className={styles.view} data-demo-view="tune">
              <div className={styles.panelHeader}><span className={styles.eyebrow}>Fine-tune a layer</span><span className={styles.badge}>PREVIEW</span></div>
              <h3>Calming Rain</h3>
              <div className={styles.layerHeading}><span className={styles.art}><Image src={SOUNDS[0].cover} alt="" width={50} height={50} /></span><span className={styles.layerKind}>Rain & storms · Stereo audio</span></div>
              <div className={styles.stereo}><span>L</span><div><i data-pan-orb="" style={{ left: "50%" }} /><span /></div><span>R</span></div>
              <DemoSlider label="Stereo position" value={50} marker="pan" />
              <div className={styles.autoRow}><div><h4>Automatic pan</h4><p>A gentle left-to-right stereo sweep.</p></div><span className={styles.switch} data-auto-pan="" data-on="false"><span /></span></div>
              <div className={styles.sweepSettings} data-sweep-settings="" data-on="false">
                <p className={styles.settingLabel}>Sweep width</p><div className={styles.widths}>{["Subtle", "Balanced", "Wide"].map(width => <span key={width} data-selected={width === "Balanced"}>{width}</span>)}</div>
                <div className={styles.sliderLabel}>Sweep duration<span>12 seconds</span><div className={styles.rail} style={{ "--level": "31%" } as CSSProperties}><i /><span /></div></div>
              </div>
              <div className={styles.panelFooter}><span className={styles.dot} /><span>Every layer has its own space.</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>;
}
