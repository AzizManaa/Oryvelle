import { describe, expect, it } from "vitest";
import { openingNight, boundaryNight, worldNight, nightBackground } from "./night-atmosphere";

describe("night exposure handoff", () => {
  it("keeps the recognized boundary and world at identical far-field exposure", () => {
    expect(openingNight(1) + boundaryNight(1)).toBeCloseTo(worldNight(0, 0), 12);
    expect(boundaryNight(0)).toBe(0);
    expect(openingNight(0)).toBe(.22);
    expect(openingNight(0) + boundaryNight(1, openingNight(0))).toBeCloseTo(worldNight(0, 0), 12);
  });
  it("reconstructs exposure independently of scroll direction and retains settled depth", () => {
    const samples = [0, .1, .5, .9, 1];
    expect(samples.map(progress => boundaryNight(progress))).toEqual([...samples].reverse().map(progress => boundaryNight(progress)).reverse());
    expect(worldNight(1, 1)).toBeCloseTo(.85);
    expect(worldNight(1, 1)).toBeGreaterThan(worldNight(0, 0));
  });
  it("provides deterministic portrait and desktop fields without viewport-specific randomness", () => {
    expect(nightBackground(true)).not.toEqual(nightBackground(false));
    expect(nightBackground(true)).toEqual(nightBackground(true));
    expect(nightBackground(false)).not.toContain("url(");
  });
});
