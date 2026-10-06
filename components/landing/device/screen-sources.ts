export type ScreenState = "portraitA" | "portraitB" | "landscapeC";
// Choreography selects a semantic state; playback owns the texture's lifetime.
// Video playback is independent of the authored phone pose.
type ScreenSource = { kind: "static"; url: string } | { kind: "video"; url: string; poster: string };
export const SCREEN_SOURCES: Record<ScreenState, ScreenSource> = {
  portraitA: { kind: "video", url: "/opening/oryvelle-tonight-loop.mp4", poster: "/opening/oryvelle-tonight-screen-poster.jpg" },
  portraitB: { kind: "static", url: "/opening/oryvelle-explore-screen-poster.jpg" },
  landscapeC: { kind: "static", url: "/opening/oryvelle-sleep-timer-poster.svg" },
};
export const SCREEN_KEYS: ScreenState[] = ["portraitA", "portraitB", "landscapeC"];
