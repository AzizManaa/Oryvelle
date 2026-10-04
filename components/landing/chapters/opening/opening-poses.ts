import type { PhonePose } from "../../device/phone-model";
import type { ScreenState } from "../../device/screen-sources";
export type OpeningPose = PhonePose & { at: number; name: string; x: number };
const pi = Math.PI;
// Authored compositions, normalized to chapter travel. Full rotations stay
// unwrapped so interpolation cannot choose the shortcut around the back.
export const OPENING_POSES: OpeningPose[] = [
  { at: 0, name: "hero", yaw: -.12, pitch: .06, roll: -.18, scale: 1.38, x: .035, y: -.29 },
  { at: .10, name: "front", yaw: .08, pitch: .03, roll: -.10, scale: 1.27, x: .09, y: -.17 },
  { at: .19, name: "quarter", yaw: pi*.29, pitch: .06, roll: -.09, scale: 1.18, x: .13, y: -.08 },
  { at: .24, name: "edge", yaw: pi*.50, pitch: .04, roll: -.09, scale: 1.18, x: .15, y: -.03 },
  { at: .32, name: "back", yaw: pi, pitch: .035, roll: -.10, scale: 1.15, x: .16, y: -.01 },
  { at: .39, name: "back-hold", yaw: pi*1.12, pitch: .035, roll: -.10, scale: 1.13, x: .17, y: 0 },
  { at: .47, name: "return-edge", yaw: pi*1.50, pitch: .04, roll: -.05, scale: 1.12, x: .20, y: 0 },
  { at: .55, name: "return", yaw: pi*1.97, pitch: .03, roll: -.03, scale: 1.08, x: .22, y: 0 },
  { at: .63, name: "return-hold", yaw: pi*2.03, pitch: .03, roll: -.02, scale: 1.08, x: .22, y: 0 },
  { at: .70, name: "second-edge", yaw: pi*2.50, pitch: .08, roll: -.18*pi, scale: 1.12, x: .18, y: -.015 },
  { at: .77, name: "second", yaw: pi*3.04, pitch: .04, roll: -.27*pi, scale: 1.16, x: .08, y: -.02 },
  { at: .84, name: "approach", yaw: pi*3.67, pitch: .12, roll: -.43*pi, scale: 1.05, x: .03, y: -.02 },
  { at: .91, name: "stand", yaw: pi*4, pitch: -.045, roll: -pi/2, scale: 1, x: 0, y: -.035 },
  { at: 1, name: "release", yaw: pi*4, pitch: -.045, roll: -pi/2, scale: 1, x: 0, y: -.035 },
];
export function openingScreenAt(progress: number): ScreenState {
  return progress < .32 ? "portraitA" : progress < .77 ? "portraitB" : "landscapeC";
}
export function responsivePose(pose: PhonePose, narrow: boolean): PhonePose {
  return narrow ? { ...pose, x: (pose.x ?? 0) * .18, y: pose.y * .4 - .06, scale: pose.scale * .88 } : pose;
}
