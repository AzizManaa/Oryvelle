import type { MetadataRoute } from "next";
import { absoluteUrl, SITE_DESCRIPTION, SITE_NAME } from "./site-config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: SITE_NAME,
    description: SITE_DESCRIPTION,
    start_url: absoluteUrl(),
    scope: absoluteUrl(),
    display: "standalone",
    background_color: "#080510",
    theme_color: "#080510",
  };
}
