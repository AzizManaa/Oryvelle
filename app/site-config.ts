export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://oryvelle.app";

export const SITE_NAME = "Oryvelle";

export const SITE_DESCRIPTION =
  "Oryvelle helps you relax with ambient sounds, breathing, fade timers, and private notes that stay on your device.";

export const SITE_KEYWORDS = [
  "Oryvelle",
  "relaxation app",
  "ambient soundscapes",
  "calming sounds",
  "guided breathing",
  "wind down app",
  "sleep companion app",
  "ambient sleep sounds",
  "sleep timer",
  "private journal app",
  "privacy-first relaxation app",
  "Android relaxation app",
];

export function absoluteUrl(path = "/") {
  return new URL(path, SITE_URL).toString();
}
