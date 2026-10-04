// Shared far-field colors and geometry. No animation or scroll ownership here.
export const NIGHT_PALETTE = {
  base: "#080d1b", indigo: "#111329", blue: "#27354e",
  lavender: "#514464", teal: "#29444c", void: "#05030b",
} as const;

type Wash = { x: number; y: number; rx: number; ry: number; color: string; alpha: number };
const desktop: Wash[] = [
  { x: .31, y: .72, rx: .51, ry: .40, color: NIGHT_PALETTE.lavender, alpha: .88 },
  { x: .83, y: .18, rx: .46, ry: .37, color: NIGHT_PALETTE.blue, alpha: .82 },
  { x: .46, y: .43, rx: .27, ry: .23, color: NIGHT_PALETTE.teal, alpha: .65 },
  { x: .72, y: .60, rx: .40, ry: .39, color: NIGHT_PALETTE.indigo, alpha: .65 },
];
const mobile: Wash[] = [
  { x: .17, y: .26, rx: .85, ry: .36, color: NIGHT_PALETTE.blue, alpha: .88 },
  { x: .12, y: .71, rx: .83, ry: .32, color: NIGHT_PALETTE.lavender, alpha: .84 },
  { x: .60, y: .37, rx: .47, ry: .24, color: NIGHT_PALETTE.teal, alpha: .48 },
];
const rgba = (hex: string, alpha: number) => {
  const value = parseInt(hex.slice(1), 16);
  return `rgba(${value >> 16},${(value >> 8) & 255},${value & 255},${alpha})`;
};
export function nightBackground(narrow: boolean) {
  return (narrow ? mobile : desktop).map(wash =>
    `radial-gradient(ellipse ${wash.rx * 100}% ${wash.ry * 100}% at ${wash.x * 100}% ${wash.y * 100}%,${rgba(wash.color, wash.alpha)} 0%,${rgba(wash.color, wash.alpha * .35)} 46%,${rgba(wash.color, 0)} 100%)`
  ).join(",");
}
const phase = (value: number, start: number, end: number) => {
  const t = Math.max(0, Math.min(1, (value - start) / (end - start)));
  return t * t * (3 - 2 * t);
};
export const openingNight = (progress: number) => .22 + .16 * phase(progress, .73, 1);
export const boundaryNight = (progress: number, openingExposure = .38) => (.78 - openingExposure) * phase(progress, 0, 1);
export const worldNight = (progress: number, settled: number) => .78 + .22 * phase(progress, 0, .20) - .15 * settled;
