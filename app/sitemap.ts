import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://bypur.my.id",
      lastModified: new Date("2026-07-21"),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
