import type { ReactNode } from "react";
import InformationChrome from "./InformationChrome";
import styles from "./information.module.css";

export default function InformationLayout({ children }: { children: ReactNode }) {
  return <div className={styles.page}>
    <InformationChrome>{children}</InformationChrome>
  </div>;
}
