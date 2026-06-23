/**
 * Section types for page layout
 */

import type { SkillCategory } from "./common";

export interface SkillsSection {
  label: string;
  title: string;
  titleHighlight: string;
  description: string;
  primaryStack: SkillCategory[];
  familiarWith: string[];
  cta: {
    label: string;
    title: string;
    description: string;
    button: {
      text: string;
      href: string;
    };
  };
}

export interface SkillsConfig {
  cta?: SkillsSection["cta"];
}

export interface AboutSection {
  label: string;
  title: string;
  titleHighlight: string;
  headline: string;
  description: string;
  yearLabel: string;
  cta: {
    primary: { text: string; href: string };
    secondary: { text: string; href: string };
  };
}

export interface ExperienceSection {
  label: string;
  title: string;
  titleHighlight: string;
  description: string;
  stats: {
    yearsExp: string;
    positions: string;
    highlight: {
      value: string;
      label: string;
    };
  };
}

export interface ProjectsSection {
  label: string;
  title: string;
  titleHighlight: string;
  description: string;
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
  label: string;
  title: string;
  titleHighlight: string;
  description: string;
  info: ContactInfo[];
  form: {
    title: string;
    subtitle: string;
    projectTypes: string[];
  };
}
