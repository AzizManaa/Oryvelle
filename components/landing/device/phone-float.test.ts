import { describe, expect, it } from "vitest";
import { floatStrength, samplePhoneFloat, FLOAT_CONTACT } from "./phone-float";

describe("phone ambient support contract", () => {
  it("attenuates monotonically and reaches exact zero before support contact", () => {
    let previous = 1;
    for (let progress = 0; progress <= 1; progress += .001) {
      const strength = floatStrength(progress);
      expect(strength).toBeGreaterThanOrEqual(0);
      expect(strength).toBeLessThanOrEqual(previous);
      previous = strength;
    }
    expect(floatStrength(FLOAT_CONTACT)).toBe(0);
    expect(floatStrength(1)).toBe(0);
    expect(floatStrength(FLOAT_CONTACT - .0001)).toBeLessThan(.00001);
  });
  it("supported states have no ambient offset at any phase", () => {
    for (const time of [0, 1, 7, 90, 1000]) {
      const offset = samplePhoneFloat(time, floatStrength(1));
      Object.values(offset).forEach(value => expect(Math.abs(value)).toBe(0));
    }
  });
  it("stays bounded and continuous through phase changes", () => {
    for (let time = 0; time < 60; time += .1) {
      const a = samplePhoneFloat(time, 1), b = samplePhoneFloat(time + .001, 1);
      expect(Math.hypot(a.x, a.y, a.z)).toBeLessThan(.1);
      expect(Math.hypot(a.pitch, a.yaw, a.roll)).toBeLessThan(3 * Math.PI / 180);
      (Object.keys(a) as (keyof typeof a)[]).forEach(key => expect(Math.abs(b[key] - a[key])).toBeLessThan(.0001));
    }
  });
});
