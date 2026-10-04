import { RAIN_PATHS, WAVE_PATHS } from "./constellation-paths";
import styles from "./mix.module.css";

// Editorial map, not a reproduction of the app's catalog coordinates.
const quietStars = [[84,169],[173,75],[489,155],[560,302],[692,90],[995,170],[1105,423],[784,471],[108,450],[439,430],[649,536],[962,537]];
export default function Constellation() {
  return <div className={styles.constellation} aria-label="Sound discovery: Calming Rain and Brown Noise selected">
    <svg viewBox="0 0 1200 620" fill="none" className={styles.field} aria-hidden="true">
      <g className={styles.rainArtwork} stroke="#68aec6" strokeWidth="2" opacity=".24">{RAIN_PATHS.map((d,i) => <path d={d} key={i} />)}</g>
      <g className={styles.waveArtwork} stroke="#a491c4" strokeWidth="2" opacity=".21">{WAVE_PATHS.map((d,i) => <path d={d} key={i} />)}</g>
      <g fill="#b0c0cc">{quietStars.map(([x,y],i) => <g key={i} opacity={i % 3 === 0 ? .5 : .23}><circle cx={x} cy={y} r={i % 3 === 0 ? 1.8 : 1} /></g>)}</g>
      <g strokeWidth="1" strokeDasharray="2 10">
        <path d="M312 205 C325 345 437 419 558 562" stroke="#73b7bb" opacity=".23" />
        <path d="M879 350 C818 458 699 481 639 562" stroke="#a391c2" opacity=".23" />
      </g>
    </svg>
    <div className={`${styles.soundNode} ${styles.rainNode}`}><span className={styles.selectedStar} aria-hidden="true">✦</span><span>Calming Rain<small>Selected</small></span></div>
    <div className={`${styles.soundNode} ${styles.noiseNode}`}><span className={styles.selectedStar} aria-hidden="true">✦</span><span>Brown Noise<small>Selected</small></span></div>
    <span className={styles.discoveryLabel}>Explore your sound field</span>
  </div>;
}
