/**
 * CDN Configuration
 * Reads dari environment variable dengan fallback ke default URL
 */

export const CDN_BASE = process.env.NEXT_PUBLIC_CDN_BASE || "https://cdn.bypur.my.id";

export const profileAssets = {
  avatar: `${CDN_BASE}/profile/bayu-purnomo.webp`,
  resume: `${CDN_BASE}/resume/curiculum-vitae-bayu-purnomo.pdf`,
} as const;

