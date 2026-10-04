import Constellation from "./Constellation";
import MixOrb from "./MixOrb";
import styles from "./mix.module.css";

export default function MixChapter() {
  return (
    <section id="your-mix" className={styles.chapter} aria-labelledby="mix-title">
      <div className={styles.inner}>
        <header className={styles.heading}>
          <span className={styles.eyebrow}>02 / Your sound field</span>
          <h2 id="mix-title">Your night. Your mix.</h2>
          <p>Choose your sounds. Balance each layer. Set a sleep timer.</p>
        </header>
        <div className={styles.world}>
          <Constellation />
          <figure className={styles.mix} aria-label="Active mix: Calming Rain and Brown Noise, each at 50 percent">
            <MixOrb />
            <figcaption className={styles.mixCaption}><span className={styles.eyebrow}>Two sounds. One mix.</span><p>Balance each layer independently.</p></figcaption>
            <dl className={styles.levels} aria-label="Illustrated mix levels">
              <div><dt>Calming Rain</dt><dd><span className={styles.level} aria-hidden="true" /><span>50%</span></dd></div>
              <div><dt>Brown Noise</dt><dd><span className={styles.level} aria-hidden="true" /><span>50%</span></dd></div>
            </dl>
            <div className={styles.timer} aria-label="Sleep timer: 30 minutes, fade out enabled">
              <svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="16" /><path d="M20 9V20L27 24" /><path d="M20 4A16 16 0 0 1 36 20" className={styles.timerAccent} /></svg>
              <span><strong>Sleep timer · 30 min</strong><small>Fade out</small></span>
            </div>
            <small className={styles.explanation}>Illustrated mix state · controls live in the app</small>
          </figure>
        </div>
      </div>
    </section>
  );
}
