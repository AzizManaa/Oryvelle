import { describe, expect, it } from "vitest";
import { clamp, hexToRgb, lerpColor, rgbToHex, withAlpha } from "./canvas-utils";

describe("clamp", () => {
  it("returns value when within range", () => {
    expect(clamp(5, 0, 10)).toBe(5);
  });
  it("clamps to min", () => {
    expect(clamp(-3, 0, 10)).toBe(0);
  });
  it("clamps to max", () => {
    expect(clamp(15, 0, 10)).toBe(10);
  });
  it("handles equal min and max", () => {
    expect(clamp(5, 7, 7)).toBe(7);
  });
});

describe("hexToRgb", () => {
  it("parses a 6-char hex", () => {
    expect(hexToRgb("#080510")).toEqual({ r: 8, g: 5, b: 16 });
  });
  it("parses white", () => {
    expect(hexToRgb("#ffffff")).toEqual({ r: 255, g: 255, b: 255 });
  });
  it("parses a 3-char shorthand hex", () => {
    expect(hexToRgb("#fff")).toEqual({ r: 255, g: 255, b: 255 });
  });
  it("parses without leading hash", () => {
    expect(hexToRgb("00e0c7")).toEqual({ r: 0, g: 224, b: 199 });
  });
});

describe("rgbToHex", () => {
  it("converts rgb to hex", () => {
    expect(rgbToHex({ r: 0, g: 224, b: 199 })).toBe("#00e0c7");
  });
  it("pads single-digit channels", () => {
    expect(rgbToHex({ r: 8, g: 5, b: 16 })).toBe("#080510");
  });
  it("round-trips with hexToRgb", () => {
    const hex = "#b89aff";
    expect(rgbToHex(hexToRgb(hex))).toBe(hex);
  });
});

describe("withAlpha", () => {
  it("produces an rgba string", () => {
    expect(withAlpha("#00e0c7", 0.5)).toBe("rgba(0,224,199,0.5)");
  });
  it("clamps alpha above 1 to 1", () => {
    expect(withAlpha("#ffffff", 1.5)).toBe("rgba(255,255,255,1)");
  });
  it("clamps alpha below 0 to 0", () => {
    expect(withAlpha("#ffffff", -0.2)).toBe("rgba(255,255,255,0)");
  });
  it("handles alpha = 0", () => {
    expect(withAlpha("#080510", 0)).toBe("rgba(8,5,16,0)");
  });
});

describe("lerpColor", () => {
  it("returns from-color at t=0", () => {
    expect(lerpColor("#000000", "#ffffff", 0)).toBe("#000000");
  });
  it("returns to-color at t=1", () => {
    expect(lerpColor("#000000", "#ffffff", 1)).toBe("#ffffff");
  });
  it("interpolates midpoint", () => {
    expect(lerpColor("#000000", "#ffffff", 0.5)).toBe("#808080");
  });
  it("interpolates brand colors", () => {
    const result = lerpColor("#00e0c7", "#b89aff", 0.5);
    // r=round((0+184)/2)=92=0x5c, g=round((224+154)/2)=189=0xbd, b=round((199+255)/2)=227=0xe3
    expect(result).toBe("#5cbde3");
    const { r, g, b } = hexToRgb(result);
    expect(r).toBe(Math.round((0 + 184) / 2));
    expect(g).toBe(Math.round((224 + 154) / 2));
    expect(b).toBe(Math.round((199 + 255) / 2));
  });
});
