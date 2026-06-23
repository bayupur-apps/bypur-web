/**
 * Common types used across the application
 */

export interface ProfileStat {
  value: string;
  label: string;
}

export interface MobileStat {
  value: string;
  label: string;
  accent?: boolean;
  icon?: string;
}

export interface SocialLinks {
  github?: string;
  linkedin?: string;
  instagram?: string;
  whatsapp?: string;
  twitter?: string;
  email?: string;
}

export interface Highlight {
  label: string;
  icon: string;
}

export interface SkillCategory {
  name: string;
  desc: string;
  icon: string;
}

// Type alias untuk consistency dengan component naming
export type PrimaryStackItem = SkillCategory;

export interface CTA {
  text: string;
  href: string;
}
