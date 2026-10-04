import { describe, expect, it } from "vitest";
import { OPENING_POSES, openingScreenAt, responsivePose } from "./opening-poses";

describe("opening's reversible screen and rotation contract", () => {
  it("changes content only on rear-facing poses, independently of direction", () => {
    for (const [threshold, before, after] of [[.32, "portraitA", "portraitB"], [.77, "portraitB", "landscapeC"]] as const) {
      const pose = OPENING_POSES.find(p => p.at === threshold)!;
      expect(Math.cos(pose.yaw)).toBeLessThan(-.9);
      expect(openingScreenAt(threshold - .001)).toBe(before);
      expect(openingScreenAt(threshold + .001)).toBe(after);
      expect(openingScreenAt(threshold - .001)).toBe(before);
    }
  });
  it("retains both physical backs and landscape on narrower layouts", () => {
    for (const name of ["back", "second", "stand"]) {
      const source = OPENING_POSES.find(p => p.name === name)!;
      const mobile = responsivePose(source, true);
      expect(mobile.yaw).toBe(source.yaw);
      expect(mobile.roll).toBe(source.roll);
    }
    expect(OPENING_POSES.at(-1)!.yaw).toBe(4 * Math.PI);
    expect(OPENING_POSES.at(-1)!.roll).toBe(-Math.PI / 2);
  });
});
