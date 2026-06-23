"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { portfolioApi } from "@/lib/api/portfolio";
import { profileDataDefault } from "@/lib/data/profile.default";
import { servicesDefault } from "@/lib/data/services.default";
import { skillsDefault } from "@/lib/data/skills.default";
import { experiencesDefault } from "@/lib/data/experiences.default";
import { projectsDefault } from "@/lib/data/projects.default";
import type { Profile, Service, Skill, Experience, Project } from "@/lib/types";

interface PortfolioContextType {
  profile: Profile;
  services: Service[];
  skills: Skill[];
  experiences: Experience[];
  projects: Project[];
  loading: boolean;
  refetch: () => Promise<void>;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(
  undefined,
);

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile>(profileDataDefault);
  const [services, setServices] = useState<Service[]>(servicesDefault);
  const [skills, setSkills] = useState<Skill[]>(skillsDefault);
  const [experiences, setExperiences] =
    useState<Experience[]>(experiencesDefault);
  const [projects, setProjects] = useState<Project[]>(projectsDefault);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        if (!cancelled) {
          setLoading(true);
        }

        // Use portfolioApi for unified fetching with automatic fallback
        const data = await portfolioApi.getAllPortfolioData();

        if (!cancelled) {
          setProfile(data.profile);
          setServices(data.services);
          setSkills(data.skills);
          setExperiences(data.experiences);
          setProjects(data.projects);
        }
      } catch (error) {
        console.error("Failed to fetch portfolio data:", error);
        // Already using defaults from initial state
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, []);

  const refetch = async () => {
    try {
      setLoading(true);
      const data = await portfolioApi.getAllPortfolioData();
      setProfile(data.profile);
      setServices(data.services);
      setSkills(data.skills);
      setExperiences(data.experiences);
      setProjects(data.projects);
    } catch (error) {
      console.error("Failed to fetch portfolio data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PortfolioContext.Provider
      value={{
        profile,
        services,
        skills,
        experiences,
        projects,
        loading,
        refetch,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (context === undefined) {
    throw new Error("usePortfolio must be used within a PortfolioProvider");
  }
  return context;
}
