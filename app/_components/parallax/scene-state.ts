export type SceneState = {
  activeScene: number;
  nextScene: number;
  sceneBlend: number;
  outBlend: number;
  inBlend: number;
  crossfading: boolean;
};

export function smoothstepBlend(t: number): number {
  const x = Math.max(0, Math.min(1, t));
  return x * x * (3 - 2 * x);
}

export function computeSceneState(progress: number, sceneCount: number): SceneState {
  const CROSSFADE = 0.15;
  const segment = 1 / sceneCount;
  const rawIndex = progress / segment;
  const activeScene = Math.min(sceneCount - 1, Math.floor(rawIndex));
  const segmentProgress = Math.max(0, Math.min(1, rawIndex - activeScene));
  const sceneBlend = smoothstepBlend(segmentProgress);
  const crossfadeProgress =
    segmentProgress > 1 - CROSSFADE
      ? (segmentProgress - (1 - CROSSFADE)) / CROSSFADE
      : 0;
  const crossfading = crossfadeProgress > 0;
  const outBlend = crossfading ? 1 - smoothstepBlend(crossfadeProgress) : 1;
  const inBlend = crossfading ? smoothstepBlend(crossfadeProgress) : 0;
  const nextScene = Math.min(sceneCount - 1, activeScene + 1);
  return { activeScene, nextScene, sceneBlend, outBlend, inBlend, crossfading };
}
