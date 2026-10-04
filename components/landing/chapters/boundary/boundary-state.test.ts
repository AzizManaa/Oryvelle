import { describe, expect, it } from "vitest";
import { boundaryState } from "./boundary-state";

describe("downstream formation contract", () => {
  it("leaves the approved settlement unchanged and finishes the supported exit", () => {
    expect(boundaryState(0)).toEqual({exit:0,bend:0,core:0,horizon:0,light:0});
    expect(boundaryState(1)).toEqual({exit:1,bend:1,core:1,horizon:1,light:1});
  });
  it("reconstructs every state without direction or previous-state dependence", () => {
    const forward = Array.from({length:101}, (_, i) => boundaryState(i/100));
    const reverse = Array.from({length:101}, (_, i) => boundaryState((100-i)/100)).reverse();
    expect(reverse).toEqual(forward);
    expect(boundaryState(.45).core).toBeGreaterThan(0);
    expect(boundaryState(.45).exit).toBeLessThan(1);
  });
});
