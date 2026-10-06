import type { ReactNode } from "react";
import { Outfit } from "next/font/google";
import InformationChrome from "./InformationChrome";
import styles from "./information.module.css";

const outfit = Outfit({ subsets: ["latin"], weight: ["300", "400"], variable: "--font-opening", display: "swap" });

export default function InformationLayout({ page, children }: { page: "privacy" | "terms" | "support"; children: ReactNode }) {
  return <div className={`${outfit.variable} ${styles.page}`} data-information-page={page}>
    <InformationChrome>{children}</InformationChrome>
  </div>;
}
