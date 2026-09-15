/**
 * Mappers: backend API response shapes -> frontend domain types
 *
 * The be models are intentionally leaner than the FE types (which also
 * carry UI/marketing copy that has no backend equivalent), and a few
 * fields need real transformation (JSON-string columns, computed date
 * ranges), so responses are never passed straight through to components.
 */

import type { Certificate, Experience, Profile, Project, Service, Skill } from "@/lib/types";

// ─── Backend response shapes (only the fields we consume) ──────────────────

export interface BackendSocialLink {
  platform: string;
  url: string;
}

export interface BackendProfile {
  name: string;
  email: string;
  title: string;
  description?: string | null;
  avatar?: string | null;
  location?: string | null;
  phone?: string | null;
  resumeUrl?: string | null;
  isCvVisible?: boolean | null;
  socialLinks?: BackendSocialLink[];
  // Hero section content
  roles?: string[];
  rolesLabel?: string | null;
  tagline?: string | null;
  taglineHighlight?: string | null;
  ctaPrimaryText?: string | null;
  ctaPrimaryHref?: string | null;
  ctaSecondaryText?: string | null;
  ctaSecondaryHref?: string | null;
  highlights?: { label: string; icon: string }[];
}

export interface BackendOffering {
  id: string;
  title: string;
  slug: string;
  description: string;
  icon?: string | null;
  isActive: boolean;
}

export interface BackendSkill {
  id: string;
  name: string;
  category: "frontend" | "backend" | "tools" | "ai" | "other";
  level?: number | null;
  icon?: string | null;
  order?: number;
}

export interface BackendExperience {
  id: string;
  company: string;
  role: string;
  description: string; // JSON array string, e.g. '["task 1","task 2"]'
  techStack?: string | null; // JSON array string, e.g. '["Laravel","Vue.js"]'
  location?: string | null;
  startDate: string;
  endDate?: string | null;
  isCurrently: boolean;
}

export interface BackendProject {
  id: string;
  title: string;
  description: string;
  content?: string | null;
  techStack: string; // JSON array string, e.g. '["Go","React"]'
  image?: string | null;
  url?: string | null;
  github?: string | null;
  featured: boolean;
}

export interface BackendCertificate {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expirationDate?: string | null;
  isLifetime: boolean;
  credentialId?: string | null;
  credentialUrl?: string | null;
  image?: string | null;
}

// ─── Helpers ─────────────────────────────────────────────────────────────

/** Backend stores techStack/description-list columns as a JSON array string. */
function parseJsonStringArray(raw: string): string[] {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((v) => typeof v === "string") : [];
  } catch {
    return [];
  }
}

function formatMonthYear(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function formatPeriod(startDate: string, endDate: string | null | undefined, isCurrently: boolean): string {
  const start = formatMonthYear(startDate);
  const end = isCurrently ? "Present" : endDate ? formatMonthYear(endDate) : "Present";
  return start ? `${start} - ${end}` : end;
}

const SOCIAL_LINK_KEYS = ["github", "linkedin", "instagram", "whatsapp", "twitter", "youtube", "website", "email"] as const;
type SocialLinkKey = (typeof SOCIAL_LINK_KEYS)[number];

function isSocialLinkKey(platform: string): platform is SocialLinkKey {
  return (SOCIAL_LINK_KEYS as readonly string[]).includes(platform.toLowerCase());
}

// ─── Mappers ─────────────────────────────────────────────────────────────

/**
 * Hybrid merge: every field the backend actually models (identity, bio,
 * contact, and now the hero section's roles/tagline/cta/highlights) comes
 * from the backend and is editable via the CMS; section config that has no
 * backend equivalent (skills/about/projects/contact section copy, stats
 * labels) stays as static default content. A backend field only overrides
 * its default when it's actually set, so an unconfigured hero field falls
 * back to the curated static copy instead of rendering empty.
 */
export function mapProfile(be: BackendProfile, fallback: Profile): Profile {
  const socials = { ...fallback.socials };
  for (const link of be.socialLinks ?? []) {
    const key = link.platform?.toLowerCase();
    if (key && isSocialLinkKey(key)) {
      socials[key] = link.url;
    }
  }

  return {
    ...fallback,
    name: be.name || fallback.name,
    title: be.title || fallback.title,
    bio: be.description || fallback.bio,
    email: be.email || fallback.email,
    phone: be.phone || fallback.phone,
    location: be.location || fallback.location,
    avatar: be.avatar || fallback.avatar,
    resumeUrl: be.resumeUrl || fallback.resumeUrl,
    isCvVisible: be.isCvVisible ?? fallback.isCvVisible ?? true,
    socials,
    roles: be.roles?.length ? be.roles : fallback.roles,
    rolesLabel: be.rolesLabel || fallback.rolesLabel,
    tagline: be.tagline || fallback.tagline,
    taglineHighlight: be.taglineHighlight || fallback.taglineHighlight,
    highlights: be.highlights?.length ? be.highlights : fallback.highlights,
    cta: {
      primary: {
        text: be.ctaPrimaryText || fallback.cta.primary.text,
        href: be.ctaPrimaryHref || fallback.cta.primary.href,
      },
      secondary: {
        text: be.ctaSecondaryText || fallback.cta.secondary.text,
        href: be.ctaSecondaryHref || fallback.cta.secondary.href,
      },
    },
  };
}

export function mapOffering(o: BackendOffering): Service {
  return {
    id: o.id,
    title: o.title,
    slug: o.slug,
    description: o.description,
    icon: o.icon ?? undefined,
    isActive: o.isActive,
  };
}

export function mapSkill(s: BackendSkill): Skill {
  return {
    id: s.id,
    name: s.name,
    category: s.category,
    level: s.level ?? undefined,
    icon: s.icon ?? undefined,
    order: s.order ?? 0,
  };
}

export function mapExperience(e: BackendExperience): Experience {
  return {
    id: e.id,
    company: e.company,
    role: e.role,
    period: formatPeriod(e.startDate, e.endDate, e.isCurrently),
    location: e.location ?? undefined,
    isCurrent: e.isCurrently,
    description: parseJsonStringArray(e.description),
    techStack: e.techStack ? parseJsonStringArray(e.techStack) : undefined,
  };
}

export function mapCertificate(c: BackendCertificate): Certificate {
  return {
    id: c.id,
    name: c.name,
    issuer: c.issuer,
    issueDate: c.issueDate,
    expirationDate: c.expirationDate ?? undefined,
    isLifetime: c.isLifetime,
    credentialId: c.credentialId ?? undefined,
    credentialUrl: c.credentialUrl ?? undefined,
    image: c.image ?? undefined,
  };
}

export function mapProject(p: BackendProject): Project {
  return {
    id: p.id,
    title: p.title,
    description: p.description,
    content: p.content ?? undefined,
    techStack: parseJsonStringArray(p.techStack),
    imageUrl: p.image ?? undefined,
    liveUrl: p.url ?? undefined,
    repoUrl: p.github ?? undefined,
    featured: p.featured,
  };
}
