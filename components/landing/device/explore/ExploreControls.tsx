'use client';

import { useEffect, useRef, type RefObject } from 'react';
import { EXPLORE_SOUNDS, type ExploreEngine, type ExploreSnapshot } from './explore-engine';
import styles from './explore.module.css';

export default function ExploreControls({ controller, state }: { controller: RefObject<ExploreEngine | null>; state: ExploreSnapshot | null }) {
  const entryButton = useRef<HTMLButtonElement>(null);
  const wasActive = useRef(false);
  useEffect(() => {
    if (wasActive.current && state?.available && !state.active) entryButton.current?.focus();
    wasActive.current = Boolean(state?.active);
  }, [state?.active, state?.available]);
  if (!state?.available) return null;
  return <aside className={styles.controls} aria-label="Interactive Explore preview">
    <div className={styles.toolbar}>
      {!state.active ? <button ref={entryButton} type="button" onClick={() => controller.current?.activate()}>Explore sounds <span aria-hidden="true">↗</span></button>
        : <><button type="button" onClick={() => controller.current?.close()}>Done</button><button type="button" onClick={() => controller.current?.stop()}>Stop audio</button></>}
    </div>
    {state.active && <>
      <details className={styles.details}>
        <summary>Preview controls</summary>
        <div className={styles.panel}>
          <p className={styles.hint}>Interactive preview · 6 sounds to try.<br />Discover more in the Oryvelle app.</p>
          <p className={styles.hint}>Drag the phone’s map. Tap a sound.<br />Pinch or use the zoom controls. Escape exits.</p>
          <div className={styles.row} aria-label="Explore categories">
            {(['ALL', 'RAIN', 'NATURE', 'NOISE'] as const).map((id, i) => <button type="button" key={id} aria-pressed={state.category === id} onClick={() => controller.current?.category(id)}>{['All', 'Rain', 'Nature', 'Noise'][i]}</button>)}
          </div>
          <div className={styles.row}><button type="button" aria-label="Zoom out" onClick={() => controller.current?.zoom(1 / 1.2)}>−</button><button type="button" aria-label="Zoom in" onClick={() => controller.current?.zoom(1.2)}>+</button><button type="button" onClick={() => controller.current?.category('ALL')}>Reset map</button></div>
          <div className={styles.sounds}>
            {EXPLORE_SOUNDS.map(sound => <div key={sound.id}>
              <button type="button" aria-pressed={state.selected.includes(sound.id)} onClick={() => controller.current?.select(sound.id)}>{sound.name}{state.selected.includes(sound.id) ? ' · Stop' : ''}</button>
              {state.selected.includes(sound.id) && <label>{Math.round((state.volumes[sound.id] ?? .3) * 100)}%<input type="range" min="0" max="1" step=".01" value={state.volumes[sound.id] ?? .3} aria-label={`${sound.name} volume`} onChange={event => controller.current?.volume(sound.id, Number(event.target.value))} /></label>}
            </div>)}
          </div>
        </div>
      </details>
      <p className={styles.status} role="status" aria-live="polite">{state.status}</p>
    </>}
  </aside>;
}
