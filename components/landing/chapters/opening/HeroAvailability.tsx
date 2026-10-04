"use client";

import { useEffect, useId, useRef } from "react";
import { PLAY_STORE_URL } from "@/app/site-config";
import styles from "./opening.module.css";

export default function HeroAvailability() {
  const trigger = useRef<HTMLButtonElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const id = useId();

  useEffect(() => {
    const button = trigger.current;
    const panel = dialog.current;
    if (!button || !panel) return;
    // Interaction eligibility only: choreography remains owned by the parent hero.
    const desktop = window.matchMedia("(min-width: 1100px) and (min-height: 700px) and (hover: hover) and (pointer: fine)");
    const close = () => { if (panel.open) panel.close(); };
    const onResize = () => { if (!desktop.matches) close(); };
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || entry.intersectionRatio < 1) close();
    }, { threshold: [0, 1] });
    observer.observe(button);
    desktop.addEventListener("change", onResize);
    return () => { observer.disconnect(); desktop.removeEventListener("change", onResize); close(); };
  }, []);

  return <>
    <div className={styles.availability}>
      <span>Android · Google Play</span>
      <button ref={trigger} className={styles.scan} type="button" aria-label="Scan QR code to get Oryvelle on Google Play" aria-haspopup="dialog" aria-controls={id} onClick={() => dialog.current?.showModal()}>
        <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true"><path d="M2 7V2h5M13 2h5v5M18 13v5h-5M7 18H2v-5" /><path d="M6 6h3v3H6zM12 6h2v3h-2zM6 12h3v2H6zM12 12h2v2h-2z" /></svg>
        <span>Scan</span>
      </button>
    </div>
    <dialog ref={dialog} id={id} className={styles.qrDialog} aria-labelledby={`${id}-title`} aria-describedby={`${id}-description`} onClose={() => {
      const button = trigger.current;
      if (button && button.getBoundingClientRect().top >= 0 && button.offsetWidth > 0) button.focus({ preventScroll: true });
      else button?.closest("section")?.querySelector<HTMLAnchorElement>('a[aria-label="Get Oryvelle for Android"]')?.focus({ preventScroll: true });
    }}>
      <button type="button" className={styles.qrClose} aria-label="Close QR code" autoFocus onClick={() => dialog.current?.close()}>×</button>
      <h2 id={`${id}-title`}>Oryvelle on Android</h2>
      <p id={`${id}-description`}>Scan with your phone to open Google Play.</p>
      {/* Static, locally generated QR; its encoded destination is PLAY_STORE_URL. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/opening/google-play-qr.svg" width="216" height="216" alt="QR code for Oryvelle on Google Play" />
      <a href={PLAY_STORE_URL}>Open Google Play <span aria-hidden="true">↗</span></a>
    </dialog>
  </>;
}
