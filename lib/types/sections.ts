/**
 * Section types for page layout
 */

export interface SkillsSection {
  label?: string;
  title?: string;
  titleHighlight?: string;
  description?: string;
  cta?: {
    label?: string;
    title?: string;
    description?: string;
    button?: {
      text?: string;
      href?: string;
    };
  };
}

export interface SkillsConfig {
  cta?: SkillsSection["cta"];
}

export interface AboutSection {
  label?: string;
  title?: string;
  titleHighlight?: string;
  /** Longer About story; blank lines split paragraphs. Falls back to `bio`. */
  description?: string;
  cta?: {
    secondary?: { text?: string };
  };
}

export interface ExperienceSection {
  label?: string;
  title?: string;
  titleHighlight?: string;
  description?: string;
  stats?: {
    yearsExp?: string;
    positions?: string;
    highlight?: {
      value?: string;
      label?: string;
    };
  };
}

export interface ProjectsSection {
  label?: string;
  title?: string;
  titleHighlight?: string;
  description?: string;
}

export interface CertificatesSection {
  label?: string;
  title?: string;
  titleHighlight?: string;
  description?: string;
}

export interface ContactInfo {
  icon: string;
  label: string;
  value: string;
  href: string;
  copyable: boolean;
}

export interface ContactConfig {
  form?: {
    title?: string;
    subtitle?: string;
    projectTypes?: string[];
  };
}

export interface ContactSection extends ContactConfig {
  label?: string;
  title?: string;
  titleHighlight?: string;
  description?: string;
  info?: ContactInfo[];
  form?: {
    title?: string;
    subtitle?: string;
    projectTypes?: string[];
  };
}
