export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://oryvelle.nekodesk.com";

export const SITE_NAME = "Oryvelle";

export const SITE_DESCRIPTION =
  "Oryvelle is a privacy-first sleep companion for ambient soundscapes, gentle fade timers, guided breathing, and a private sleep journal.";

export const SITE_KEYWORDS = [
  "Oryvelle",
  "sleep companion app",
  "ambient sleep sounds",
  "sleep timer",
  "sleep journal",
  "guided breathing",
  "privacy-first sleep app",
  "Android sleep app",
];

export function absoluteUrl(path = "/") {
  return new URL(path, SITE_URL).toString();
}
