export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://oryvelle.app";

export const SITE_NAME = "Oryvelle";

export const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.nekodesk.oryvelle";

export const SITE_DESCRIPTION =
  "Oryvelle is a private Android sleep companion with layered ambient sounds, guided meditations, breathing, bedtime routines, a sleep journal, and local insights.";

export const SITE_KEYWORDS = [
  "Oryvelle",
  "relaxation app",
  "ambient soundscapes",
  "calming sounds",
  "guided breathing",
  "guided sleep meditation",
  "bedtime routine app",
  "wind down app",
  "sleep companion app",
  "ambient sleep sounds",
  "sleep timer",
  "private journal app",
  "sleep journal and insights",
  "privacy-first relaxation app",
  "Android relaxation app",
];

export function absoluteUrl(path = "/") {
  return new URL(path, SITE_URL).toString();
}
