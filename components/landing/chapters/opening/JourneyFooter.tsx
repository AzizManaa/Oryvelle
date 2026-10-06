"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { PLAY_STORE_URL } from "@/app/site-config";
import { useDownloadPanel } from "./DownloadPanel";
import OryvelleMark from "./OryvelleMark";
import styles from "./journey-footer.module.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function JourneyFooter({ reduced = false, mainHref, showAttribution = true }: { reduced?: boolean; mainHref?: string; showAttribution?: boolean }) {
  const root = useRef<HTMLElement>(null);
  const onDownload = useDownloadPanel();
  useGSAP(() => {
    if (reduced || !root.current) return;
    const reveal = gsap.fromTo(root.current.querySelectorAll("[data-footer-reveal]"), { y: 52 }, {
      y: 0, ease: "none", stagger: .07,
      scrollTrigger: { trigger: root.current, start: "top bottom", end: "top 30%", scrub: true, invalidateOnRefresh: true },
    });
    return () => { reveal.scrollTrigger?.kill(); reveal.kill(); };
  }, { scope: root, dependencies: [reduced], revertOnUpdate: true });
  const toTop = () => window.scrollTo({ top: 0, behavior: reduced ? "instant" : "smooth" });

  return <footer ref={root} className={styles.footer} aria-labelledby="journey-footer-title">
    <div className={styles.wash} aria-hidden="true" />
    <div className={styles.invitation} data-footer-reveal="">
      <h2 id="journey-footer-title">A quieter night<br className={styles.mobileBreak} /> starts here.</h2>
      <p>Sounds, meditation and breathing.<br />An evening routine at your own pace.</p>
      <a className={styles.download} href={PLAY_STORE_URL} onClick={onDownload}><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M5 3.5v17l15-8.5Z" /></svg>Get it on Google Play<span aria-hidden="true">↗</span></a>
      <span className={styles.platform}>Available on Android</span>
    </div>
    <div className={styles.navigation} data-footer-reveal="">
      <div className={styles.qrGroup}>
        <a className={styles.qr} href={PLAY_STORE_URL} onClick={onDownload} aria-label="Open Oryvelle download QR code"><Image src="/opening/oryvelle-google-play-qr.png" alt="Scan to download Oryvelle on Google Play" width={1254} height={1254} sizes="120px" /></a>
        <div><p>Bring a little calm<br />to your phone.</p><a href={PLAY_STORE_URL} onClick={onDownload}>Scan to download <span aria-hidden="true">↗</span></a></div>
      </div>
      <nav aria-label="Explore Oryvelle">{mainHref ? <Link href={mainHref}>The opening</Link> : <button type="button" onClick={toTop}>The opening</button>}<a href={`${mainHref ?? ""}#sound-mixer`}>Sound mixing</a><a href={PLAY_STORE_URL} onClick={onDownload}>Download</a></nav>
      <nav aria-label="Information"><Link href="/support">Support</Link><Link href="/terms">Terms of use</Link><Link href="/privacy">Privacy policy</Link></nav>
      <button type="button" className={styles.top} onClick={toTop} aria-label="Back to top">↑</button>
    </div>
    <div className={styles.bottom} data-footer-reveal="">
      <span className={styles.brand}><OryvelleMark />Oryvelle</span>
      <p>Made by <a href="https://aziz-manaa.com" target="_blank" rel="noopener noreferrer">NekoDesk</a></p>
      {showAttribution && <small>Phone model by <a href="https://sketchfab.com/3d-models/samsung-s-26-ultra-3d-model-3356099ca99d488d95a6a253d05577f7">achrixx</a> · <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a> · materials and display adapted.</small>}
    </div>
  </footer>;
}
