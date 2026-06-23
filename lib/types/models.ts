/**
 * Data model types
 */

export interface Project {
  id: number;
  title: string;
  description: string;
  techStack: string[];
  experienceId?: number;
  imageUrl?: string;
  liveUrl?: string;
  repoUrl?: string;
}

export interface Skill {
  name: string;
  category: "frontend" | "backend" | "tools" | "ai" | "other";
  icon?: string;
}

export interface Experience {
  id: number;
  company: string;
  role: string;
  period: string;
  location?: string;
  type?: string;
  description: string[];
  techStack?: string[];
}

export interface Service {
  id?: string;
  title: string;
  slug: string;
  description: string;
  icon?: string;
  skillIds?: string[];
  priceFrom?: number | null;
  isActive?: boolean;
}
