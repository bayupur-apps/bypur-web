import {
  Bot,
  Boxes,
  Briefcase,
  Cloud,
  Code2,
  Database,
  Layers,
  Monitor,
  Server,
  Smartphone,
  type LucideIcon,
} from "lucide-react";
import type { Profile, MobileStat } from "@/lib/types";

// Default mobile stats fallback
export const getDefaultMobileStats = (profileData: Profile): MobileStat[] => [
  {
    value: profileData.stats?.[1]?.value || "5+",
    label: profileData.stats?.[1]?.label.toLowerCase() || "years experience",
    accent: true,
    icon: "ti-briefcase",
  },
  {
    value: profileData.stats?.[0]?.value || "40+",
    label: profileData.stats?.[0]?.label.toLowerCase() || "projects shipped",
    accent: true,
    icon: "ti-rocket",
  },
  {
    value: profileData.techStack?.[0] || "Laravel",
    label: "primary stack",
    accent: false,
    icon: "ti-server",
  },
  {
    value: "100%",
    label: "remote ready",
    accent: false,
    icon: "ti-world",
  },
];

// First matching rule wins, so more specific roles come first.
const ROLE_ICON_RULES: [RegExp, LucideIcon][] = [
  [/full\s*-?\s*stack/i, Layers],
  [/laravel|php/i, Code2],
  [/back\s*-?\s*end|\bapi\b/i, Server],
  [/front\s*-?\s*end|\bui\b|react|vue|next/i, Monitor],
  [/devops|cloud|infra/i, Cloud],
  [/data/i, Database],
  [/\bai\b|machine learning|\bml\b/i, Bot],
  [/mobile|android|ios|flutter/i, Smartphone],
  [/architect/i, Boxes],
];

// Map roles with icons
export const mapRolesToIcons = (roles: string[] = []) =>
  roles.map((role) => ({
    label: role,
    icon: ROLE_ICON_RULES.find(([pattern]) => pattern.test(role))?.[1] ?? Briefcase,
  }));

/** Escapes a CMS-provided string so it can be embedded in a RegExp literally. */
export const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * Splits a stat like "4+", "~12k" or "100%" into prefix / integer / suffix so
 * the number can be animated. Returns null for non-numeric values
 * ("Full Stack") or decimals, which are shown as-is.
 */
export const parseStatValue = (value: string) => {
  const match = /^(\D*)(\d+)(\D*)$/.exec(value.trim());
  if (!match) return null;
  return { prefix: match[1], number: Number(match[2]), suffix: match[3] };
};
