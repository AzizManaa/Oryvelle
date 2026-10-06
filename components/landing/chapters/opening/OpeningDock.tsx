"use client";

import { useEffect, useId, useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { PLAY_STORE_URL } from "@/app/site-config";
import styles from "./opening-dock.module.css";
import { useDownloadPanel } from "./DownloadPanel";
import OryvelleMark from "./OryvelleMark";

gsap.registerPlugin(useGSAP);

export default function OpeningDock({ reduced, canExplore, onNavigate, links }: {
  links?: { label: string; href: string }[];
  reduced: boolean;
  canExplore: boolean;
  onNavigate(progress: number): void;
}) {
  const onDownload = useDownloadPanel();
  const root = useRef<HTMLDivElement>(null);
  const dockRef = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const motion = useRef<gsap.core.Timeline | null>(null);
  const afterClose = useRef<(() => void) | null>(null);
  const [open, setOpen] = useState(false);
  const id = useId();
  const { contextSafe } = useGSAP({ scope: root });

  useGSAP((_, safe) => {
    const dock = dockRef.current;
    if (!dock || !safe) return;
    const download = dock.querySelector<HTMLAnchorElement>("a");
    let lastY = window.scrollY;
    let travel = 0;
    let compact = false;
    gsap.set(dock, { "--dock-compact": 0 });
    dock.dataset.compact = "false";
    if (download) download.tabIndex = 0;
    const onScroll = safe(() => {
      const y = window.scrollY;
      const delta = y - lastY;
      lastY = y;
      if (dialog.current?.open || Math.abs(delta) < .5) return;
      travel = Math.sign(delta) === Math.sign(travel) ? travel + delta : delta;
      if (y > 0 && Math.abs(travel) < 8) return;
      const next = y > 0 && travel > 0;
      if (next === compact) return;
      compact = next;
      // Direction changes, not chapter progress, control this independent UI.
      // Only start a tween when intent changes; never animate on every event.
      if (!next) dock.dataset.compact = "false";
      if (download) download.tabIndex = next ? -1 : 0;
      gsap.to(dock, {
        "--dock-compact": next ? 1 : 0, duration: reduced ? 0 : .45,
        ease: "power3.out", overwrite: true,
        onComplete: () => { dock.dataset.compact = String(next); },
      });
    });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, { scope: root, dependencies: [reduced], revertOnUpdate: true });

  useEffect(() => () => { motion.current?.kill(); dialog.current?.close(); }, []);
  useEffect(() => {
    if (!open) return;
    // Keep chapter progress and scrollbar geometry intact while the modal is open.
    const blockWheel = (event: WheelEvent) => event.preventDefault();
    const node = dialog.current;
    node?.addEventListener("wheel", blockWheel, { passive: false });
    return () => node?.removeEventListener("wheel", blockWheel);
  }, [open]);

  const finishClose = () => contextSafe(() => {
    gsap.set(dockRef.current, { autoAlpha: 1, "--dock-open": 0, "--dock-content": 1 });
    dialog.current?.close();
    setOpen(false);
    trigger.current?.focus({ preventScroll: true });
    const action = afterClose.current;
    afterClose.current = null;
    action?.();
  })();
  const close = (action?: () => void) => contextSafe(() => {
    afterClose.current = action ?? null;
    if (reduced || !motion.current || motion.current.time() === 0) finishClose();
    else motion.current.eventCallback("onReverseComplete", finishClose).reverse();
  })();
  const show = () => contextSafe(() => {
    if (!dialog.current || !panel.current || dialog.current.open) return;
    dialog.current.showModal();
    setOpen(true);
    motion.current?.kill();
    const contents = panel.current.querySelectorAll("[data-dock-reveal]");
    if (reduced) {
      gsap.set(dockRef.current, { autoAlpha: 0, "--dock-open": 1, "--dock-content": 0 });
      gsap.set(closeButton.current, { autoAlpha: 1 });
      gsap.set(panel.current, { clipPath: "inset(0% 0% 0% round 32px)", y: 0 });
      gsap.set(contents, { opacity: 1, y: 0 });
      return;
    }
    const height = panel.current.offsetHeight;
    const side = Math.max(0, (panel.current.offsetWidth - 52) / 2);
    motion.current = gsap.timeline()
      // The dock contracts into the close control before the same pale surface
      // opens upward. Reversing restores the bar only after the panel collapses.
      .to(dockRef.current, { "--dock-open": 1, "--dock-content": 0, duration: .22, ease: "power2.inOut" }, 0)
      .set(dockRef.current, { autoAlpha: 0 }, .22)
      .fromTo(closeButton.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: .16 }, .22)
      .fromTo(panel.current, { clipPath: `inset(${height - 52}px ${side}px 0px round 18px)`, y: 74 }, {
        clipPath: "inset(0px 0% 0px round 32px)", y: 0, duration: .62, ease: "power3.inOut",
      }, .22)
      .fromTo(contents, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: .34, stagger: .055, ease: "power2.out" }, .51);
  })();

  return <div ref={root} className={styles.root}>
    <div ref={dockRef} className={styles.dock}>
      <button ref={trigger} className={styles.menuButton} type="button" aria-label="Open Oryvelle menu" aria-haspopup="dialog" aria-controls={id} aria-expanded={open} onClick={show}>
        <span /><span />
      </button>
      <button className={styles.mark} type="button" aria-label="Return to the opening" onClick={() => onNavigate(0)}><OryvelleMark /></button>
      <a className={styles.download} href={PLAY_STORE_URL} onClick={onDownload} aria-label="Download Oryvelle on Google Play"><span className={styles.rolling}><span className={styles.word}>Download</span></span><span aria-hidden="true">↗</span></a>
    </div>
    <dialog ref={dialog} id={id} className={styles.dialog} aria-labelledby={`${id}-title`} onCancel={event => { event.preventDefault(); close(); }} onClick={event => { if (event.target === event.currentTarget) close(); }} onKeyDown={event => { if (["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End"].includes(event.key)) event.preventDefault(); }}>
      <div ref={panel} className={styles.panel}>
        <header data-dock-reveal><h2 id={`${id}-title`}>Oryvelle</h2><OryvelleMark /></header>
        <nav aria-label="Oryvelle pages" data-dock-reveal>
          {links ? links.map(link => <a key={link.href} href={link.href} onClick={event => {
            if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
            event.preventDefault(); close(() => window.location.assign(link.href));
          }}>{link.label}<span aria-hidden="true">↗</span></a>) : <>
          <button type="button" autoFocus onClick={() => close(() => onNavigate(0))}>The opening <span aria-hidden="true">↗</span></button>
          {canExplore && <button type="button" onClick={() => close(() => onNavigate(.57))}>Explore sounds <span aria-hidden="true">↗</span></button>}
          </>}
        </nav>
        <nav className={styles.information} aria-label="Information" data-dock-reveal>
          {[
            { label: "Support", href: "/support" },
            { label: "Terms of use", href: "/terms" },
            { label: "Privacy policy", href: "/privacy" },
          ].map(link => <a key={link.href} href={link.href} onClick={event => {
            if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
            event.preventDefault(); close(() => window.location.assign(link.href));
          }}>{link.label}</a>)}
        </nav>
        <a className={styles.panelDownload} href={PLAY_STORE_URL} onClick={event => onDownload(event, reveal => close(reveal))} data-dock-reveal>Download Oryvelle <span aria-hidden="true">↗</span></a>
      </div>
      <button ref={closeButton} className={styles.close} type="button" aria-label="Close Oryvelle menu" onClick={() => close()}>×</button>
    </dialog>
  </div>;
}
