"use client";

import { PLAY_STORE_URL } from "@/app/site-config";
import { useDownloadPanel } from "./DownloadPanel";
import styles from "./opening.module.css";

export default function HeroActions({ onAdvance }: { onAdvance?: () => void }) {
  const onDownload = useDownloadPanel();
  return <div className={styles.heroActions}>
    <div className={styles.actionRow}>
      <a href={PLAY_STORE_URL} className={styles.download} onClick={onDownload}>
        <span className={styles.downloadLabel}><span>Download Oryvelle</span><span aria-hidden="true">Download Oryvelle</span></span>
      </a>
      <button className={`${styles.actionIcon} ${styles.scan}`} type="button" aria-label="Scan QR code to get Oryvelle on Google Play" aria-haspopup="dialog" onClick={onDownload}>
        <svg viewBox="0 0 24 24" width="23" height="23" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M3 3h7v7H3V3Zm2 2v3h3V5H5ZM14 3h7v7h-7V3Zm2 2v3h3V5h-3ZM3 14h7v7H3v-7Zm2 2v3h3v-3H5Z"/><path d="M14 14h3v3h-3zM19 14h2v2h-2zM18 18h3v3h-3zM14 19h2v2h-2z"/></svg>
      </button>
      {onAdvance && <button className={`${styles.actionIcon} ${styles.scrollArrow}`} type="button" aria-label="Scroll to Explore Oryvelle" onClick={onAdvance}>
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M12 4v15m-6-6 6 6 6-6"/></svg>
      </button>}
    </div>
    <div className={styles.availability}>Android · Google Play</div>
  </div>;
}
