import type { Metadata } from "next";
import Link from "next/link";
import { Outfit } from "next/font/google";
import OryvelleMark from "@/components/landing/chapters/opening/OryvelleMark";
import NightField from "@/components/landing/chapters/opening/NightField";
import styles from "./not-found.module.css";

const outfit = Outfit({ subsets: ["latin"], weight: ["300", "400"], variable: "--font-opening", display: "swap" });
const CONSTELLATIONS = [
  [[112, 80], [76, 146], [34, 232], [106, 232], [167, 232]],
  [[140, 150], [140, 232], [140, 320]],
  [[267, 80], [219, 117], [203, 207], [219, 289], [267, 320], [313, 284], [327, 193], [310, 112], [267, 80]],
  [[475, 80], [438, 151], [398, 232], [465, 232], [531, 232]],
  [[505, 150], [505, 232], [505, 320]],
];

export const metadata: Metadata = {
  title: "Page not found",
  description: "A little off course. Find your way back to Oryvelle.",
};

export default function NotFound() {
  return <div className={`${outfit.variable} ${styles.page}`}>
    <div className={styles.atmosphere} aria-hidden="true"><NightField animate={false} /></div>
    <header className={styles.header}>
      <Link href="/" aria-label="Oryvelle home"><OryvelleMark />Oryvelle</Link>
    </header>
    <main id="main-content" className={styles.main}>
      <div className={styles.copy}>
        <p className={styles.eyebrow}>404 · Page not found</p>
        <h1>A little<br />off course.</h1>
        <p className={styles.description}>This page has drifted beyond our map.<br />{" "}Let’s bring you back to somewhere quiet.</p>
        <div className={styles.actions}>
          <Link href="/" className={styles.home}>Back to calm<span aria-hidden="true">↗</span></Link>
          <Link href="/support" className={styles.support}>Ask support<span aria-hidden="true">↗</span></Link>
        </div>
      </div>
      <figure className={styles.constellation} aria-hidden="true">
        <svg viewBox="0 0 565 410" fill="none" focusable="false">
          <ellipse className={styles.orbit} cx="267" cy="200" rx="257" ry="168" transform="rotate(-18 267 200)" />
          <g className={styles.lines}>{CONSTELLATIONS.map((points, index) => <polyline key={index} points={points.map(point => point.join(",")).join(" ")} pathLength="1" />)}</g>
          <g className={styles.stars}>{CONSTELLATIONS.map((points, group) => points.slice(0, group === 2 ? -1 : undefined).map(([x, y], index) => <circle key={`${group}-${index}`} cx={x} cy={y} r={index % 3 === 0 ? 2.8 : 1.6} opacity={index % 3 === 0 ? .95 : .55} />))}</g>
          <circle className={styles.halo} cx="267" cy="200" r="16" />
          <circle className={styles.lostStar} cx="267" cy="200" r="3" />
          <path className={styles.guide} d="M267 223V352" />
        </svg>
        <figcaption>A quiet detour.</figcaption>
      </figure>
    </main>
    <footer className={styles.footer}>
      <p>Somewhere quiet is still here.</p>
      <nav aria-label="Information"><Link href="/terms">Terms of use</Link><Link href="/privacy">Privacy policy</Link></nav>
    </footer>
  </div>;
}
