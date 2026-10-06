"use client";

import Image from "next/image";
import { useId } from "react";
import { PLAY_STORE_URL } from "@/app/site-config";
import { useDownloadPanel } from "./DownloadPanel";
import styles from "./meditation.module.css";

const JOURNEYS = [
  { key: "wind", title: "7 Nights of Wind Down", detail: "7-night guided journey", session: "Arriving in the Present", cover: "seven-nights-wind-down.webp" },
  { key: "thought", title: "Overthinking Loop", detail: "5 sessions · ~6 min each", cover: "overthinking-loop.webp" },
  { key: "ritual", title: "The Closing Ritual", detail: "5 sessions · ~4 min each", cover: "closing-ritual.webp" },
] as const;

function Constellation({ mobile = false }: { mobile?: boolean }) {
  const glowId = useId().replace(/:/g, "");
  const guidePath = mobile
    ? "M700 90 C880 190 800 330 530 420 C310 480 210 510 70 565"
    : "M700 90 C890 170 905 305 810 430";
  const paths = mobile ? [
    "M700 90 C860 140 900 245 825 345",
    "M825 345 C940 440 930 510 845 580 L800 620 L730 645 L640 667 L550 690 L450 710 L350 730",
    "M350 730 C205 765 160 825 150 855 M550 690 C670 745 785 785 820 830",
  ] : [
    "M700 90 L780 160 C720 180 670 210 665 230",
    "M665 230 C710 250 840 295 810 430 L830 490 L858 540 L889 585 L919 625 L944 668 L965 712",
    "M965 712 C955 800 735 865 575 810 C530 790 545 732 510 705",
  ];
  const points = mobile ? [[700,90],[825,345],[845,580],[800,620],[730,645],[640,667],[550,690],[450,710],[350,730],[150,855],[820,830]] : [[700,90],[780,160],[665,230],[810,430],[830,490],[858,540],[889,585],[919,625],[944,668],[965,712],[575,810],[510,705]];
  return <svg className={mobile ? styles.mobileMap : styles.desktopMap} viewBox="0 0 1000 1000" preserveAspectRatio="none" aria-hidden="true">
    <defs><radialGradient id={glowId}>
      <stop stopColor="#e1d5ff" stopOpacity=".65" />
      <stop offset=".18" stopColor="#c7b1ef" stopOpacity=".25" />
      <stop offset="1" stopColor="#b4a2e8" stopOpacity="0" />
    </radialGradient></defs>
    <path data-meditation-thread="" d={guidePath} pathLength="1" fill="none" stroke="#bdb1dc" strokeOpacity=".6" strokeWidth="1" vectorEffect="non-scaling-stroke" strokeDasharray="1" strokeDashoffset="1" />
    {paths.map((d, i) => <path key={d} data-meditation-path={i} d={d} pathLength="1" fill="none" stroke="currentColor" strokeWidth=".8" vectorEffect="non-scaling-stroke" strokeDasharray="1" strokeDashoffset="1" />)}
    {points.map(([x,y], i) => <g key={i} data-meditation-star={i} style={{ opacity: 0 }}>
      <ellipse cx={x} cy={y} rx={i === 0 ? 6 : 4} ry={i === 0 ? 6 : 4} fill={i === 0 ? "#70d9d0" : "#bfb3e2"} opacity=".13" />
      <circle cx={x} cy={y} r={i === 0 ? 1.8 : 1.25} fill={i === 0 ? "#b8fff3" : "#d2c6ea"} />
    </g>)}
    <g data-meditation-guide="" className={styles.guide}>
      <circle r="20" fill={`url(#${glowId})`} />
      <circle r="2.1" fill="#ece5ff" />
    </g>
  </svg>;
}

export default function MeditationScene({ stationary = false }: { stationary?: boolean }) {
  const onDownload = useDownloadPanel();
  return <section id="meditation" className={`${styles.scene} ${stationary ? styles.stationary : ""}`} data-meditation-scene="" aria-label="Guided meditation journeys">
    <Constellation /><Constellation mobile />
    <div className={styles.copy} data-meditation-copy="">
      <p className={styles.eyebrow}>Guided meditation</p>
      <h2>A little space<br />within.</h2>
      <p className={styles.description}>Wind down with short guided sessions and evening meditation journeys.</p>
      <a className={styles.explore} href={PLAY_STORE_URL} onClick={onDownload}>Explore meditations <span aria-hidden="true">↗</span></a>
    </div>
    {JOURNEYS.map(journey => <article key={journey.key} className={`${styles.journey} ${styles[journey.key]}`} data-meditation-journey={journey.key}>
      <div className={styles.art} data-meditation-art="">
        <Image src={`/meditation/${journey.cover}`} alt="" fill sizes={journey.key === "wind" ? "(max-width: 760px) 96vw, 48vw" : "(max-width: 760px) 64vw, 30vw"} />
      </div>
      <div className={styles.label} data-meditation-label="">
        <a href={PLAY_STORE_URL} onClick={onDownload} aria-label={`Explore ${journey.title} in the Oryvelle app`}><h3>{journey.title}</h3></a>
        <p>{journey.detail}</p>
        {"session" in journey && <p className={styles.session}>{journey.session}</p>}
      </div>
    </article>)}
  </section>;
}
