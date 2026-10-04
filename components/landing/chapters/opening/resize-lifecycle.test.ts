import { describe, expect, it } from "vitest";
import { gsap } from "gsap";
import { addPhonePoseTrack } from "./opening.timeline";
import { OPENING_POSES, openingScreenAt, responsivePose } from "./opening-poses";

describe("responsive renderer reconstruction", () => {
  it("preserves authored poses after silent refresh rewinds and repeated invalidation", () => {
    const pose = { ...OPENING_POSES[0] };
    const timeline = gsap.timeline({ paused: true });
    addPhonePoseTrack(timeline, pose);
    try {
      // Exercise GSAP's real mutable target and suppressed-callback restoration.
      const checkpoints = [.19, .32, .55, .77, .91, 1];
      const baseline = checkpoints.map(progress => {
        timeline.progress(progress);
        return { ...pose };
      });
      for (let resize = 0; resize < 6; resize++) {
        for (let i = 0; i < checkpoints.length; i++) {
          timeline.progress(0, true).invalidate().progress(checkpoints[i], true);
          for (const field of ["yaw", "pitch", "roll", "scale", "x", "y"] as const) {
            expect(pose[field]).toBeCloseTo(baseline[i][field], 5);
          }
          const responsive = responsivePose(pose, resize % 2 === 0);
          expect(responsive.roll).toBe(pose.roll);
          if (checkpoints[i] >= .91) {
            expect(responsive.roll).toBeCloseTo(-Math.PI / 2, 5);
            expect(openingScreenAt(checkpoints[i])).toBe("landscapeC");
          }
        }
      }
    } finally { timeline.kill(); }
  });
});
