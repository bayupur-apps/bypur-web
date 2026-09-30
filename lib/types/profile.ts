/**
 * Main Profile type - single source of truth for profile data structure
 */

import type { ProfileStat, MobileStat, SocialLinks, Highlight, CTA } from "./common";
import type { SkillsSection, AboutSection, ExperienceSection, ProjectsSection, CertificatesSection, ContactSection } from "./sections";

export interface Profile {
  name: string;
  title: string;
  tagline?: string;
  taglineHighlight?: string;
  bio: string;
  email: string;
  phone?: string;
  location: string;
  avatar: string;
  resumeUrl?: string;
  isCvVisible?: boolean;
  roles?: string[];
  rolesLabel?: string;
  /** Short availability note shown as a pill above the hero headline; hidden when empty. */
  availability?: string;
  techStack?: string[];
  stats?: ProfileStat[];
  mobileStats?: MobileStat[];
  highlights?: Highlight[];
  skills?: SkillsSection;
  about?: AboutSection;
  experience?: ExperienceSection;
  projects?: ProjectsSection;
  certificates?: CertificatesSection;
  contact?: ContactSection;
  cta?: {
    primary?: CTA;
    secondary?: CTA;
  };
  socials: SocialLinks;
}
