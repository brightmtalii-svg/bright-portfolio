import type { MetadataRoute } from "next";
import { person } from "@/data/personal";
import { site } from "@/data/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${person.name} — ${site.role}`,
    short_name: person.firstName,
    description: site.description,
    start_url: "/",
    display: "standalone",
    background_color: site.themeColorDark,
    theme_color: site.themeColorDark,
    icons: [
      { src: "/icon", sizes: "32x32", type: "image/png" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
