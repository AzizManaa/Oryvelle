export type ScreenState = "portraitA" | "portraitB" | "landscapeC";
// Choreography selects a semantic state; playback owns the texture's lifetime.
// A future video adapter supplies its VideoTexture through the same setScreen
// boundary and invalidates only while visible playback produces new frames.
export const SCREEN_SOURCES: Record<ScreenState, { kind: "static"; url: string }> = {
  portraitA: { kind: "static", url: "/opening/portrait-a.svg" },
  portraitB: { kind: "static", url: "/opening/portrait-b.svg" },
  landscapeC: { kind: "static", url: "/opening/landscape-c.svg" },
};
export const SCREEN_KEYS: ScreenState[] = ["portraitA", "portraitB", "landscapeC"];
