/**
 * Types - Single source of truth for application types
 * 
 * Organized by domain:
 * - common.ts: Shared types (ProfileStat, SocialLinks, etc.)
 * - models.ts: Data entities (Project, Skill, Experience, Service)
 * - sections.ts: Page sections (SkillsSection, ContactSection, etc.)
 * - profile.ts: Main Profile type
 */

export * from "./common";
export * from "./models";
export * from "./sections";
export * from "./profile";
