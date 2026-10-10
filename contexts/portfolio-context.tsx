"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { portfolioApi } from "@/lib/api/portfolio";
import { profileDataDefault } from "@/lib/data/profile.default";
import { servicesDefault } from "@/lib/data/services.default";
import { skillsDefault } from "@/lib/data/skills.default";
import { experiencesDefault } from "@/lib/data/experiences.default";
import { projectsDefault } from "@/lib/data/projects.default";
import { certificatesDefault } from "@/lib/data/certificates.default";
import type { Profile, Service, Skill, Experience, Project, Certificate } from "@/lib/types";

interface PortfolioData {
  profile: Profile;
  services: Service[];
  skills: Skill[];
  experiences: Experience[];
  projects: Project[];
  certificates: Certificate[];
}

interface PortfolioContextType extends PortfolioData {
  loading: boolean;
  refetch: () => Promise<void>;
}

const DEFAULT_DATA: PortfolioData = {
  profile: profileDataDefault,
  services: servicesDefault,
  skills: skillsDefault,
  experiences: experiencesDefault,
  projects: projectsDefault,
  certificates: certificatesDefault,
};

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<PortfolioData>(DEFAULT_DATA);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;

    portfolioApi
      .getAllPortfolioData()
      .then((res) => {
        if (active) setData(res);
      })
      .catch((error) => {
        console.error("Failed to fetch portfolio data:", error);
      });

    return () => {
      active = false;
    };
  }, []);

  const refetch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await portfolioApi.getAllPortfolioData();
      setData(res);
    } catch (error) {
      console.error("Failed to fetch portfolio data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <PortfolioContext.Provider value={{ ...data, loading, refetch }}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error("usePortfolio must be used within a PortfolioProvider");
  }
  return context;
}
