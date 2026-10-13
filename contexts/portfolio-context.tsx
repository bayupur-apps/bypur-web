"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { portfolioApi } from "@/lib/api/portfolio";
import type { Profile, Service, Skill, Experience, Project, Certificate } from "@/lib/types";

export interface PortfolioData {
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

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export function PortfolioProvider({ children, initialData }: Readonly<{ children: ReactNode; initialData: PortfolioData }>) {
  const [data, setData] = useState<PortfolioData>(initialData);
  const [loading, setLoading] = useState(false);

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
