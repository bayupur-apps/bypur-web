/**
 * Portfolio API
 * Simple API layer: Try backend API, fallback to static data if unavailable
 */

import { fetchFromAPI, postToAPI } from "@/lib/config/axios";
import { env } from "@/lib/config/env";
import { calculateYearsExp } from "@/lib/helpers";
import { certificatesDefault } from "@/lib/data/certificates.default";
import { experiencesDefault } from "@/lib/data/experiences.default";
import { profileDataDefault } from "@/lib/data/profile.default";
import { projectsDefault } from "@/lib/data/projects.default";
import { servicesDefault } from "@/lib/data/services.default";
import { skillsDefault } from "@/lib/data/skills.default";
import type { Certificate, Experience, Profile, Project, Service, Skill } from "@/lib/types";
import {
  mapCertificate,
  mapExperience,
  mapOffering,
  mapProfile,
  mapProject,
  mapSkill,
  type BackendCertificate,
  type BackendExperience,
  type BackendOffering,
  type BackendProfile,
  type BackendProject,
  type BackendSkill,
} from "./mappers";

export interface ContactSubmission {
  name: string;
  email: string;
  subject: string;
  message: string;
}

/** Get Profile - hybrid merge of backend bio fields onto the static default */
export async function getProfile(): Promise<Profile> {
  const be = await fetchFromAPI<BackendProfile | null>("/profile", null);
  return be ? mapProfile(be, profileDataDefault) : profileDataDefault;
}

/** Get Services (backed by the be's "offerings") - fallback to static data if API unavailable */
export async function getServices(): Promise<Service[]> {
  const offerings = await fetchFromAPI<BackendOffering[] | null>("/offerings", null);
  return offerings ? offerings.map(mapOffering) : servicesDefault;
}

/** Get Skills - fallback to static data if API unavailable */
export async function getSkills(): Promise<Skill[]> {
  const skills = await fetchFromAPI<BackendSkill[] | null>("/skills", null);
  return skills ? skills.map(mapSkill) : skillsDefault;
}

/** Get Experiences - fallback to static data if API unavailable */
export async function getExperiences(): Promise<Experience[]> {
  const experiences = await fetchFromAPI<BackendExperience[] | null>("/experiences", null);
  return experiences ? experiences.map(mapExperience) : experiencesDefault;
}

/** Get Projects - fallback to static data if API unavailable */
export async function getProjects(): Promise<Project[]> {
  const projects = await fetchFromAPI<BackendProject[] | null>("/projects", null);
  return projects ? projects.map(mapProject) : projectsDefault;
}

/** Get Certificates - fallback to static data (empty by default) if API unavailable */
export async function getCertificates(): Promise<Certificate[]> {
  const certificates = await fetchFromAPI<BackendCertificate[] | null>("/certificates", null);
  return certificates ? certificates.map(mapCertificate) : certificatesDefault;
}

/**
 * Submit the contact form to the backend. Unlike the getters above, this
 * throws on failure - the caller needs to tell the visitor it didn't go
 * through instead of silently pretending it worked.
 */
export async function submitContact(payload: ContactSubmission): Promise<void> {
  if (!env.useBackend || !env.apiUrl) {
    throw new Error("Contact backend is not configured");
  }
  await postToAPI<unknown, ContactSubmission>("/contact", payload);
}

/**
 * Fills in the hero section's data-driven stats (years of experience,
 * projects shipped, primary tech stack) from the live skills/experiences/
 * projects instead of the hand-typed numbers in profile.default.ts, so
 * they can't go stale. Only applied when the backend is actually wired up
 * - in pure static mode the curated default copy is left untouched.
 */
function withDerivedHeroStats(
  profile: Profile,
  skills: Skill[],
  experiences: Experience[],
  projects: Project[]
): Profile {
  const topSkills = [...skills]
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map((s) => s.name);
  const yearsExp = calculateYearsExp(experiences);

  return {
    ...profile,
    techStack: topSkills.length ? topSkills.slice(0, 8) : profile.techStack,
    stats: [
      { value: `${projects.length}+`, label: "Projects shipped" },
      { value: `${yearsExp}+`, label: "Years professional experience" },
      { value: `${skills.length}+`, label: "Technologies used" },
    ],
    mobileStats: [
      { value: `${yearsExp}+`, label: "years in production", accent: true, icon: "ti-briefcase" },
      { value: `${projects.length}+`, label: "systems shipped", accent: true, icon: "ti-rocket" },
      {
        value: topSkills[0] || profile.techStack?.[0] || "Full Stack",
        label: "primary stack",
        accent: false,
        icon: "ti-server",
      },
      { value: "100%", label: "remote ready", accent: false, icon: "ti-world" },
    ],
  };
}

/** Get all portfolio data (parallel fetch) */
export async function getAllPortfolioData() {
  const [profile, services, skills, experiences, projects, certificates] = await Promise.all([
    getProfile(),
    getServices(),
    getSkills(),
    getExperiences(),
    getProjects(),
    getCertificates(),
  ]);

  const resolvedProfile =
    env.useBackend && env.apiUrl
      ? withDerivedHeroStats(profile, skills, experiences, projects)
      : profile;

  return { profile: resolvedProfile, services, skills, experiences, projects, certificates };
}

export async function sendChatMessage(messages: { role: string; content: string }[]): Promise<string> {
  if (!env.useBackend || !env.apiUrl) {
    return "Layanan AI Chat belum terhubung ke backend API. Silakan hubungi Bayu via formulir kontak.";
  }
  const res = await postToAPI<{ message: string }, { messages: { role: string; content: string }[] }>("/chat", { messages });
  return res?.message || "Tidak ada jawaban yang dikembalikan dari AI backend.";
}

/** Get Settings map - fallback to empty object if API unavailable */
export async function getSettingsMap(): Promise<Record<string, string>> {
  const map = await fetchFromAPI<Record<string, string> | null>("/settings/map", null);
  return map || {};
}

/** Unified API export */
export const portfolioApi = {
  getProfile,
  getServices,
  getSkills,
  getExperiences,
  getCertificates,
  getProjects,
  getSettingsMap,
  getAllPortfolioData,
  submitContact,
  sendChatMessage,
};

