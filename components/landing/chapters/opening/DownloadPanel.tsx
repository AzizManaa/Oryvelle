"use client";

import { createContext, useContext, useEffect, useId, useRef, type MouseEvent, type ReactNode } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { PLAY_STORE_URL } from "@/app/site-config";
import styles from "./download-panel.module.css";

type DownloadAction = (event: MouseEvent<HTMLElement>, beforeOpen?: (open: () => void) => void) => void;
const DownloadContext = createContext<DownloadAction>(() => {});
export const useDownloadPanel = () => useContext(DownloadContext);

export default function DownloadPanel({ children, reduced }: { children: ReactNode; reduced: boolean }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const sheet = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const motion = useRef<gsap.core.Timeline | null>(null);
  const id = useId();
  const { contextSafe } = useGSAP({ scope: dialog });
  const finish = () => {
    dialog.current?.close();
    const target = opener.current;
    const visible = target && target.getClientRects().length > 0 && getComputedStyle(target).visibility !== "hidden";
    if (visible) target.focus({ preventScroll: true });
    else document.querySelector<HTMLButtonElement>('button[aria-label="Open Oryvelle menu"]')?.focus({ preventScroll: true });
  };
  const close = () => contextSafe(() => {
    if (reduced || !motion.current || motion.current.time() === 0) finish();
    else motion.current.eventCallback("onReverseComplete", finish).reverse();
  })();
  const open = (target: HTMLElement) => contextSafe(() => {
    if (!dialog.current || !sheet.current || dialog.current.open) return;
    opener.current = target;
    dialog.current.showModal();
    motion.current?.kill();
    const contents = sheet.current.querySelectorAll("[data-download-reveal]");
    if (reduced) {
      gsap.set(sheet.current, { xPercent: 0 });
      gsap.set(dialog.current, { "--shade": 1 });
      gsap.set(contents, { opacity: 1, y: 0 });
      return;
    }
    motion.current = gsap.timeline()
      .fromTo(dialog.current, { "--shade": 0 }, { "--shade": 1, duration: .4 }, 0)
      .fromTo(sheet.current, { xPercent: 100 }, { xPercent: 0, duration: .65, ease: "power3.inOut" }, 0)
      .fromTo(contents, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: .35, stagger: .06, ease: "power2.out" }, .27);
  })();
  const onDownload: DownloadAction = (event, beforeOpen) => {
    // Preserve modifier-click, ordinary mobile links and the no-JavaScript href.
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const mobileDevice = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    if (mobileDevice || !window.matchMedia("(min-width: 761px) and (hover: hover) and (pointer: fine)").matches) return;
    event.preventDefault();
    const target = event.currentTarget;
    const reveal = () => open(target);
    if (beforeOpen) beforeOpen(reveal);
    else reveal();
  };

  useEffect(() => {
    const node = dialog.current;
    const desktop = window.matchMedia("(min-width: 761px) and (hover: hover) and (pointer: fine)");
    const onChange = () => { if (!desktop.matches && node?.open) { motion.current?.kill(); node.close(); } };
    const blockWheel = (event: WheelEvent) => { if (node?.open) event.preventDefault(); };
    node?.addEventListener("wheel", blockWheel, { passive: false });
    desktop.addEventListener("change", onChange);
    return () => { node?.removeEventListener("wheel", blockWheel); desktop.removeEventListener("change", onChange); motion.current?.kill(); node?.close(); };
  }, []);

  return <DownloadContext.Provider value={onDownload}>
    {children}
    <dialog ref={dialog} id={id} className={styles.dialog} aria-labelledby={`${id}-title`} aria-describedby={`${id}-description`} onCancel={event => { event.preventDefault(); close(); }} onClick={event => { if (event.target === event.currentTarget) close(); }} onKeyDown={event => { if (["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End"].includes(event.key)) event.preventDefault(); }}>
      <div ref={sheet} className={styles.sheet}>
        <button className={styles.close} type="button" aria-label="Close download panel" autoFocus onClick={close}>×</button>
        <h2 id={`${id}-title`} data-download-reveal>Scan the<br />QR code.</h2>
        <p id={`${id}-description`} className={styles.description} data-download-reveal>Make space for rest with Oryvelle.<br />Get the app on your Android phone.</p>
        <div className={styles.qr} data-download-reveal>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/opening/oryvelle-google-play-qr.png" width="1254" height="1254" alt="Scan to get Oryvelle on Google Play" />
          <p>Open your phone’s camera and scan to visit Oryvelle on Google Play.</p>
        </div>
        <a className={styles.direct} href={PLAY_STORE_URL} data-download-reveal>Open Google Play directly <span aria-hidden="true">↗</span></a>
        <span className={styles.platform} data-download-reveal>Android · Google Play</span>
      </div>
    </dialog>
  </DownloadContext.Provider>;
}
