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
  resume_url?: string | null;
  isCvVisible?: boolean | null;
  is_cv_visible?: boolean | null;
  socialLinks?: BackendSocialLink[];
  social_links?: BackendSocialLink[];
  // Hero section content
  roles?: string[];
  rolesLabel?: string | null;
  roles_label?: string | null;
  tagline?: string | null;
  taglineHighlight?: string | null;
  tagline_highlight?: string | null;
  ctaPrimaryText?: string | null;
  cta_primary_text?: string | null;
  ctaPrimaryHref?: string | null;
  cta_primary_href?: string | null;
  ctaSecondaryText?: string | null;
  cta_secondary_text?: string | null;
  ctaSecondaryHref?: string | null;
  cta_secondary_href?: string | null;
  highlights?: { label: string; icon: string }[];
  highlights_?: { label: string; icon: string }[];
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

function parseJsonStringArray(raw: string): string[] {
  if (!raw) return [];
  try {
    let parsed: unknown = JSON.parse(raw);
    if (typeof parsed === "string") {
      try {
        parsed = JSON.parse(parsed);
      } catch {
        // use string fallback
      }
    }
    if (Array.isArray(parsed)) {
      return parsed
        .map((v) => String(v).replace(/[[\]"\\']/g, "").trim())
        .filter(Boolean);
    }
    if (typeof parsed === "string") {
      return parsed
        .replace(/[[\]"\\']/g, "")
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean);
    }
    return [];
  } catch {
    return String(raw)
      .replace(/[[\]"\\']/g, "")
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);
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
  const links = be.social_links ?? be.socialLinks ?? [];
  for (const link of links) {
    const key = link.platform?.toLowerCase();
    if (key && isSocialLinkKey(key)) {
      socials[key] = link.url;
    }
  }

  const resumeUrl = be.resume_url || be.resumeUrl;
  const isCvVisible = be.is_cv_visible ?? be.isCvVisible;
  const rolesLabel = be.roles_label || be.rolesLabel;
  const taglineHighlight = be.tagline_highlight || be.taglineHighlight;
  const ctaPrimaryText = be.cta_primary_text || be.ctaPrimaryText;
  const ctaPrimaryHref = be.cta_primary_href || be.ctaPrimaryHref;
  const ctaSecondaryText = be.cta_secondary_text || be.ctaSecondaryText;
  const ctaSecondaryHref = be.cta_secondary_href || be.ctaSecondaryHref;

  return {
    ...fallback,
    name: be.name || fallback.name,
    title: be.title || fallback.title,
    bio: be.description || fallback.bio,
    email: be.email || fallback.email,
    phone: be.phone || fallback.phone,
    location: be.location || fallback.location,
    avatar: be.avatar || fallback.avatar,
    resumeUrl: resumeUrl || fallback.resumeUrl,
    isCvVisible: isCvVisible ?? fallback.isCvVisible ?? true,
    socials,
    roles: be.roles?.length ? be.roles : fallback.roles,
    rolesLabel: rolesLabel || fallback.rolesLabel,
    tagline: be.tagline || fallback.tagline,
    taglineHighlight: taglineHighlight || fallback.taglineHighlight,
    highlights: be.highlights?.length ? be.highlights : fallback.highlights,
    cta: {
      primary: {
        text: ctaPrimaryText || fallback.cta?.primary?.text || "",
        href: ctaPrimaryHref || fallback.cta?.primary?.href || "",
      },
      secondary: {
        text: ctaSecondaryText || fallback.cta?.secondary?.text || "",
        href: ctaSecondaryHref || fallback.cta?.secondary?.href || "",
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
