import type { MetadataRoute } from "next";
import { absoluteUrl } from "./site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  // Omit lastModified until actual significant content-update dates are maintained.
  return [
    { url: absoluteUrl() },
    { url: absoluteUrl("/privacy") },
    { url: absoluteUrl("/support") },
    { url: absoluteUrl("/terms") },
  ];
}
