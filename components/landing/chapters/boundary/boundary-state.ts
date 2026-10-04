// Local boundary progress only. The approved opening retains its own 0–1.
export function smoothPhase(progress: number, start: number, end: number) {
  const value = Math.max(0, Math.min(1, (progress - start) / (end - start)));
  return value * value * (3 - 2 * value);
}
export function boundaryState(progress: number) {
  return {
    exit: smoothPhase(progress, 0, .62),
    bend: smoothPhase(progress, .04, .78),
    core: smoothPhase(progress, .16, .72),
    horizon: smoothPhase(progress, .30, .92),
    light: smoothPhase(progress, 0, .14),
  };
}
