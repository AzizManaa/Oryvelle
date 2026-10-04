import type { CSSProperties } from "react";
import { nightBackground } from "./night-atmosphere";
import styles from "./night-atmosphere.module.css";

// Identical predeclared fields at the boundary and world endpoint prevent a
// palette/exposure switch. Canvas core and stars render above this static field.
export default function NightAtmosphere() {
  return <div aria-hidden="true" className={styles.field} style={{
    "--night-desktop": nightBackground(false), "--night-mobile": nightBackground(true),
  } as CSSProperties} />;
}
