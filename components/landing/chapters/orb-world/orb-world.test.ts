import { describe, expect, it } from "vitest";
import { drawOrbFormation } from "../mix/orb-renderer";

function drawing() {
  const calls: unknown[] = [];
  const context = new Proxy({}, {
    get: (_target, key) => (...args: unknown[]) => {
      calls.push([key, ...args]);
      if (String(key).startsWith("create")) return { addColorStop: (...stops: unknown[]) => calls.push(["stop", ...stops]) };
    },
    set: (_target, key, value) => { calls.push([key, typeof value === "object" ? "[gradient]" : value]); return true; },
  }) as CanvasRenderingContext2D;
  return { calls, context };
}
describe("approved boundary drawing contract", () => {
  it("preserves identical default drawing at every boundary phase when world motion is absent", () => {
    for (const progress of [0, .167, .378, .6, 1]) {
      const boundary = drawing(), world = drawing();
      drawOrbFormation(boundary.context, 1440, 900, progress);
      drawOrbFormation(world.context, 1440, 900, progress, { elapsed: 0, settle: 0 });
      expect(world.calls).toEqual(boundary.calls);
    }
  });
});
