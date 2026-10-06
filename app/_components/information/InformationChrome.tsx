"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import DownloadPanel from "@/components/landing/chapters/opening/DownloadPanel";
import JourneyFooter from "@/components/landing/chapters/opening/JourneyFooter";
import OpeningDock from "@/components/landing/chapters/opening/OpeningDock";
import OryvelleMark from "@/components/landing/chapters/opening/OryvelleMark";
import NightField from "@/components/landing/chapters/opening/NightField";
import styles from "./information.module.css";

const links = [
  { label: "The opening", href: "/" },
];

export default function InformationChrome({ children }: { children: ReactNode }) {
  const [reduced, setReduced] = useState(true);
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(preference.matches);
    sync(); preference.addEventListener("change", sync);
    return () => preference.removeEventListener("change", sync);
  }, []);
  return <DownloadPanel reduced={reduced}>
    <div className={styles.atmosphere} aria-hidden="true"><NightField animate={false} /></div>
    <header className={styles.header}><Link href="/" aria-label="Oryvelle home"><OryvelleMark />Oryvelle</Link></header>
    {children}
    <JourneyFooter reduced={reduced} mainHref="/" showAttribution={false} />
    <div className={styles.dock}><OpeningDock reduced={reduced} canExplore={false} links={links} onNavigate={() => window.location.assign("/")} /></div>
  </DownloadPanel>;
}
