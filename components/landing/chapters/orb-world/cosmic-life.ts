// Pure, deterministic ambient sampling. No wall-clock time, particle simulation,
// scroll ownership, or animation scheduler lives here.
const TAU = Math.PI * 2;
const clamp = (value: number) => Math.max(0, Math.min(1, value));
export function cosmicEnergy(settle: number) { return 1 - .50 * clamp(settle); }
export function horizonInfluence(distance: number, radius: number) {
  // Soft overlapping falloffs, not a circular clipping/warp boundary. The core
  // ends near .46R; the shadow feathers outward beyond it.
  return Math.exp(-(((distance / radius - .59) / .18) ** 2));
}
export function starLife(phase: number, elapsed: number, settle: number) {
  const depth = .30 + .70 * (.5 + .5 * Math.sin(phase * 2.37 + .8));
  const period = 3.5 + 5 * (.5 + .5 * Math.sin(phase * 1.71));
  const amplitude = (.30 + .32 * depth) * cosmicEnergy(settle);
  const seconds = elapsed / 1000;
  const shimmer = 1 + amplitude * (.72 * Math.sin(seconds * TAU / period + phase) + .28 * Math.sin(seconds * TAU / (period * 1.63) + phase * 2.1));
  const sparkle = Math.max(0, Math.sin(seconds * TAU / period + phase)) ** 8 * cosmicEnergy(settle);
  return { depth, shimmer, sparkle };
}
function random(index: number, salt: number) {
  // Integer hash: repeatable on the server, client and tests.
  let value = Math.imul(index + 1, 0x45d9f3b) ^ salt;
  value = Math.imul(value ^ (value >>> 16), 0x45d9f3b);
  return ((value ^ (value >>> 16)) >>> 0) / 4294967296;
}
export function shootingStarEvent(index: number) {
  const x = .08 + random(index, 17) * .38;
  const y = .08 + random(index, 83) * .23;
  return {
    start: 2.5 + index * 16 + random(index, 41) * 4,
    duration: 1.6 + random(index, 61) * .9,
    x, y, dx: .15 + random(index, 101) * .10, dy: .06 + random(index, 131) * .05,
  };
}
export function shootingStarAt(elapsed: number, settle: number, reduced: boolean) {
  if (reduced || settle >= .55 || elapsed < 2500) return null;
  const seconds = elapsed / 1000;
  const index = Math.floor((seconds - 2.5) / 16);
  const event = shootingStarEvent(index);
  const progress = (seconds - event.start) / event.duration;
  if (progress < 0 || progress > 1) return null;
  return { ...event, progress, light: Math.sin(progress * Math.PI) ** 2 * (1 - clamp(settle / .55)) };
}
