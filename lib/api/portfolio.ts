/**
 * Portfolio API
 * Simple API layer: Try backend API, fallback to static data if unavailable
 */

import { fetchFromAPI } from "@/lib/config/axios";
import { experiencesDefault } from "@/lib/data/experiences.default";
import { profileDataDefault } from "@/lib/data/profile.default";
import { projectsDefault } from "@/lib/data/projects.default";
import { servicesDefault } from "@/lib/data/services.default";
import { skillsDefault } from "@/lib/data/skills.default";
import type { Experience, Profile, Project, Service, Skill } from "@/lib/types";

/** Get Profile - fallback to static data if API unavailable */
export async function getProfile(): Promise<Profile> {
  return fetchFromAPI("/profile", profileDataDefault);
}

/** Get Services - fallback to static data if API unavailable */
export async function getServices(): Promise<Service[]> {
  return fetchFromAPI("/services", servicesDefault);
}

/** Get Skills - fallback to static data if API unavailable */
export async function getSkills(): Promise<Skill[]> {
  return fetchFromAPI("/skills", skillsDefault);
}

/** Get Experiences - fallback to static data if API unavailable */
export async function getExperiences(): Promise<Experience[]> {
  return fetchFromAPI("/experiences", experiencesDefault);
}

/** Get Projects - fallback to static data if API unavailable */
export async function getProjects(): Promise<Project[]> {
  return fetchFromAPI("/projects", projectsDefault);
}

/** Get all portfolio data (parallel fetch) */
export async function getAllPortfolioData() {
  const [profile, services, skills, experiences, projects] = await Promise.all([
    getProfile(),
    getServices(),
    getSkills(),
    getExperiences(),
    getProjects(),
  ]);

  return { profile, services, skills, experiences, projects };
}

/** Unified API export */
export const portfolioApi = {
  getProfile,
  getServices,
  getSkills,
  getExperiences,
  getProjects,
  getAllPortfolioData,
};
