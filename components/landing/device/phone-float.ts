// Amplitudes are local model units/radians, independent of authored scroll pose.
export const FLOAT_APPROACH_START = 0.78;
export const FLOAT_CONTACT = 0.905;
export function floatStrength(progress: number) {
  const t = Math.max(0, Math.min(1, (progress - FLOAT_APPROACH_START) / (FLOAT_CONTACT - FLOAT_APPROACH_START)));
  return 1 - t * t * (3 - 2 * t);
}
const wave = (time: number, period: number, phase: number) => Math.sin(time * Math.PI * 2 / period + phase);
export function samplePhoneFloat(time: number, strength: number) {
return {
  x: strength * .024 * wave(time, 11.7, 1.1),
  y: strength * .090 * (.78 * wave(time, 8.8, .4) + .22 * wave(time, 15.3, 2.2)),
  z: strength * .018 * wave(time, 17.1, 2.4),
  pitch: strength * .020 * wave(time, 14.7, .7),
  yaw: strength * .036 * wave(time, 12.3, 2.0),
  roll: strength * .024 * wave(time, 10.1, 1.4),
};
}
