import type { ReactNode } from "react";
import styles from "./link-label.module.css";

export default function LinkLabel({ children }: { children: ReactNode }) {
  return <span className={styles.label}>{children}</span>;
}
