export type ParallaxMoment = {
  id: "arrival" | "constellations" | "mix" | "fade" | "final";
  label: string;
  eyebrow: string;
  title: string;
  body: string;
  accent: string;
  secondary: string;
  cue: string;
  panelBody: string;
};

export type CanvasPoint = {
  x: number;
  y: number;
};

export type SoundStar = {
  label: string;
  x: number;
  y: number;
  companions: Array<{ x: number; y: number; size: number }>;
};

export type PathPoint = {
  x: number;
  y: number;
};

export type OrbAnnotation = {
  label: string;
  value: string;
  detail: string;
  x: number;
  y: number;
  align?: "left" | "right";
};
