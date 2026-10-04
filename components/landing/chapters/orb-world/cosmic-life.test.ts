import { describe, expect, it } from "vitest";
import { cosmicEnergy, horizonInfluence, shootingStarAt, shootingStarEvent, starLife } from "./cosmic-life";
import { fieldStars } from "./cosmic-field";

describe("bounded cosmic life", () => {
  it("keeps seeded star positions/count stable and gives stars independent depth/shimmer", () => {
    const stars = fieldStars(38);
    expect(stars).toEqual(fieldStars(38));
    expect(stars).toHaveLength(38);
    const values = stars.map(star => starLife(star.phase, 9000, 0));
    expect(new Set(values.map(value => value.shimmer)).size).toBe(38);
    for (const value of values) {
      expect(value.depth).toBeGreaterThanOrEqual(.3);
      expect(value.depth).toBeLessThanOrEqual(1);
      expect(value.shimmer).toBeGreaterThan(.35);
      expect(value.shimmer).toBeLessThan(1.65);
    }
  });
  it("smoothly localizes distortion without affecting the far field", () => {
    expect(horizonInfluence(59, 100)).toBeCloseTo(1);
    expect(horizonInfluence(160, 100)).toBeLessThan(.000001);
    // No step at the previously implied circular warp edge.
    for (const distance of [40, 59, 77, 93]) {
      expect(Math.abs(horizonInfluence(distance, 100) - horizonInfluence(distance + .001, 100))).toBeLessThan(.0001);
    }
  });
  it("schedules isolated deterministic streaks with long quiet gaps", () => {
    const events = Array.from({ length: 40 }, (_, i) => shootingStarEvent(i));
    expect(events).toEqual(Array.from({ length: 40 }, (_, i) => shootingStarEvent(i)));
    expect(new Set(events.map(event => event.x)).size).toBe(40);
    for (let i = 1; i < events.length; i++) {
      expect(events[i].start - events[i - 1].start - events[i - 1].duration).toBeGreaterThan(9);
    }
    for (const event of events) {
      const midpoint = (event.start + event.duration / 2) * 1000;
      expect(shootingStarAt(midpoint, 0, false)?.light).toBeCloseTo(1);
      expect(shootingStarAt(midpoint, .55, false)).toBeNull();
      expect(shootingStarAt(midpoint, 0, true)).toBeNull();
      expect(shootingStarAt((event.start + event.duration + .01) * 1000, 0, false)).toBeNull();
    }
  });
  it("settles variation without freezing the world", () => {
    expect(cosmicEnergy(1)).toBeGreaterThan(0);
    expect(cosmicEnergy(1)).toBeLessThan(cosmicEnergy(0));
    const active = starLife(1.2, 8500, 0), resting = starLife(1.2, 8500, 1);
    expect(Math.abs(resting.shimmer - 1)).toBeLessThan(Math.abs(active.shimmer - 1));
  });
});
