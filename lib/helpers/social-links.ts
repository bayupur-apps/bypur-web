import { SOCIAL_SVG_PATHS } from "@/lib/config/constants";
import type { SocialLinks } from "@/lib/types";

export interface SocialLinkItem {
  label: string;
  href: string;
  /** Brand SVG path, or null to fall back to a generic globe icon. */
  path: string | null;
}

/**
 * Social links the user has actually configured in the CMS, in display
 * order - no dead "#" links for platforms that were never set.
 */
export function getSocialLinks(socials: SocialLinks): SocialLinkItem[] {
  return [
    { label: "GitHub", href: socials.github, path: SOCIAL_SVG_PATHS.github },
    { label: "LinkedIn", href: socials.linkedin, path: SOCIAL_SVG_PATHS.linkedin },
    { label: "Twitter / X", href: socials.twitter, path: SOCIAL_SVG_PATHS.twitter },
    { label: "Instagram", href: socials.instagram, path: SOCIAL_SVG_PATHS.instagram },
    { label: "YouTube", href: socials.youtube, path: SOCIAL_SVG_PATHS.youtube },
    { label: "WhatsApp", href: socials.whatsapp, path: SOCIAL_SVG_PATHS.whatsapp },
    { label: "Website", href: socials.website, path: null },
  ].filter((s): s is SocialLinkItem => Boolean(s.href));
}
