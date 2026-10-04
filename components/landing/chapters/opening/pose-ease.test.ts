import { expect, it } from "vitest";
import { poseEase } from "./pose-ease";
it("preserves edge/back checkpoints without overshooting and joins angular velocity", () => {
  const points = [{ at: 0, value: 0 }, { at: .24, value: Math.PI / 2 }, { at: .32, value: Math.PI }, { at: .55, value: Math.PI * 2 }];
  const epsilon = 1e-5;
  const a = poseEase(points, 0), b = poseEase(points, 1);
  expect(a(0)).toBe(0); expect(a(1)).toBe(1);
  for (let i = 0; i <= 100; i++) { expect(b(i / 100)).toBeGreaterThanOrEqual(0); expect(b(i / 100)).toBeLessThanOrEqual(1); }
  const leftVelocity = (a(1) - a(1 - epsilon)) / epsilon * (Math.PI / 2) / .24;
  const rightVelocity = (b(epsilon) - b(0)) / epsilon * (Math.PI / 2) / .08;
  expect(leftVelocity).toBeCloseTo(rightVelocity, 2);
});
