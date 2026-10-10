import { SOCIAL_SVG_PATHS } from "@/lib/config/constants";
import type { SocialLinks } from "@/lib/types";

export interface SocialLinkItem {
  label: string;
  href: string;
  /** Brand SVG path, or null to fall back to a generic globe icon. */
  path: string | null;
}

export function normalizeExternalUrl(url?: string): string {
  if (!url) return "";
  const trimmed = url.trim();
  if (!trimmed) return "";
  if (/^(https?:\/\/|mailto:|tel:)/i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

/**
 * Social links the user has actually configured in the CMS, in display
 * order - no dead "#" links for platforms that were never set.
 */
export function getSocialLinks(socials: SocialLinks): SocialLinkItem[] {
  return [
    { label: "GitHub", href: normalizeExternalUrl(socials.github), path: SOCIAL_SVG_PATHS.github },
    { label: "LinkedIn", href: normalizeExternalUrl(socials.linkedin), path: SOCIAL_SVG_PATHS.linkedin },
    { label: "Twitter / X", href: normalizeExternalUrl(socials.twitter), path: SOCIAL_SVG_PATHS.twitter },
    { label: "Instagram", href: normalizeExternalUrl(socials.instagram), path: SOCIAL_SVG_PATHS.instagram },
    { label: "YouTube", href: normalizeExternalUrl(socials.youtube), path: SOCIAL_SVG_PATHS.youtube },
    { label: "WhatsApp", href: normalizeExternalUrl(socials.whatsapp), path: SOCIAL_SVG_PATHS.whatsapp },
    { label: "Website", href: normalizeExternalUrl(socials.website), path: null },
  ].filter((s): s is SocialLinkItem => Boolean(s.href));
}

