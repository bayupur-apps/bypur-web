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
        src: "/web-app-manifest-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/web-app-manifest-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    theme_color: "#09090b",
    background_color: "#09090b",
    display: "standalone",
    start_url: "/",
    scope: "/",
  };
}
