import type { MetadataRoute } from "next";
import { getProfile } from "@/lib/api/portfolio";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const profile = await getProfile();

  return {
    name: `${profile.name} - ${profile.title}`,
    short_name: profile.name,
    description: profile.bio,
    icons: [
      {
        src: "/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
    theme_color: "#0F172A",
    background_color: "#F1F5F9",
    display: "standalone",
    start_url: "/",
    scope: "/",
  };
}
