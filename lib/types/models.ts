/**
 * Data model types
 */

export interface ProjectEndpoint {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "WS";
  path: string;
  description: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  content?: string;
  techStack: string[];
  imageUrl?: string;
  liveUrl?: string;
  repoUrl?: string;
  featured?: boolean;
  architectureHighlights?: string[];
  endpoints?: ProjectEndpoint[];
}

export interface Skill {
  id?: string;
  name: string;
  category: "frontend" | "backend" | "tools" | "ai" | "other";
  level?: number;
  icon?: string;
  order?: number;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  period: string;
  location?: string;
  isCurrent?: boolean;
  description: string[];
  techStack?: string[];
}

export interface Service {
  id?: string;
  title: string;
  slug: string;
  description: string;
  icon?: string;
  isActive?: boolean;
}

export interface Certificate {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expirationDate?: string;
  isLifetime?: boolean;
  credentialId?: string;
  credentialUrl?: string;
  image?: string;
}
