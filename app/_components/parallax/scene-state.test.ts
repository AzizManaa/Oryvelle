import { describe, expect, it } from "vitest";
import { computeSceneState, smoothstepBlend } from "./scene-state";

describe("smoothstepBlend", () => {
  it("returns 0 at t=0", () => {
    expect(smoothstepBlend(0)).toBe(0);
  });
  it("returns 1 at t=1", () => {
    expect(smoothstepBlend(1)).toBe(1);
  });
  it("returns 0.5 at t=0.5", () => {
    expect(smoothstepBlend(0.5)).toBe(0.5);
  });
  it("clamps values below 0", () => {
    expect(smoothstepBlend(-1)).toBe(0);
  });
  it("clamps values above 1", () => {
    expect(smoothstepBlend(2)).toBe(1);
  });
  it("is symmetric around 0.5", () => {
    expect(smoothstepBlend(0.25)).toBeCloseTo(1 - smoothstepBlend(0.75), 10);
  });
});

describe("computeSceneState", () => {
  const SCENES = 5;

  it("returns scene 0 at progress=0", () => {
    const s = computeSceneState(0, SCENES);
    expect(s.activeScene).toBe(0);
    expect(s.nextScene).toBe(1);
    expect(s.crossfading).toBe(false);
    expect(s.inBlend).toBe(0);
    expect(s.outBlend).toBe(1);
  });

  it("returns last scene at progress=1", () => {
    const s = computeSceneState(1, SCENES);
    expect(s.activeScene).toBe(SCENES - 1);
    expect(s.nextScene).toBe(SCENES - 1);
  });

  it("transitions to scene 1 at progress just past 1/5", () => {
    const s = computeSceneState(0.21, SCENES);
    expect(s.activeScene).toBe(1);
  });

  it("stays on scene 0 just before 1/5", () => {
    const s = computeSceneState(0.19, SCENES);
    expect(s.activeScene).toBe(0);
  });

  it("is crossfading in the last 15% of a segment", () => {
    // segment = 0.2 wide; crossfade starts at 0.2 * 0.85 = 0.17 into segment
    const s = computeSceneState(0.19, SCENES); // 0.95 into first segment
    expect(s.crossfading).toBe(true);
    expect(s.inBlend).toBeGreaterThan(0);
    expect(s.outBlend).toBeLessThan(1);
  });

  it("is not crossfading at segment start", () => {
    const s = computeSceneState(0.001, SCENES);
    expect(s.crossfading).toBe(false);
  });

  it("nextScene never exceeds sceneCount-1", () => {
    const s = computeSceneState(0.999, SCENES);
    expect(s.nextScene).toBe(SCENES - 1);
  });

  it("outBlend + inBlend describe a valid crossfade", () => {
    const s = computeSceneState(0.185, SCENES);
    expect(s.crossfading).toBe(true);
    // outBlend and inBlend are independent smoothstep values, not required to sum to 1
    expect(s.outBlend).toBeGreaterThanOrEqual(0);
    expect(s.outBlend).toBeLessThanOrEqual(1);
    expect(s.inBlend).toBeGreaterThanOrEqual(0);
    expect(s.inBlend).toBeLessThanOrEqual(1);
  });

  it("works with sceneCount=1", () => {
    const s = computeSceneState(0.5, 1);
    expect(s.activeScene).toBe(0);
    expect(s.nextScene).toBe(0);
  });
});
