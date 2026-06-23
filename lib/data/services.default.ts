/**
 * Services Data (Default/Static)
 * Fallback untuk jika API tidak tersedia
 * Dapat juga digunakan untuk testing & development
 */

import type { Service } from "@/lib/types";

export const servicesDefault: Service[] = [
  {
    id: "web-applications",
    title: "Web Applications",
    slug: "web-applications",
    icon: "Layout",
    description:
      "Modern, responsive web apps with Next.js and Vue.js. Clean architecture and optimal performance.",
  },
  {
    id: "backend-systems",
    title: "Backend & APIs",
    slug: "backend-systems",
    icon: "Server",
    description:
      "Scalable backend systems with Laravel and Node.js. Database design, API development, and integration.",
  },
  {
    id: "enterprise-apps",
    title: "Enterprise Solutions",
    slug: "enterprise-apps",
    icon: "Building2",
    description:
      "Full-stack enterprise systems with RBAC, audit logs, and multi-layer architecture.",
  },
  {
    id: "ci-cd-deployment",
    title: "DevOps & CI/CD",
    slug: "ci-cd-deployment",
    icon: "Workflow",
    description:
      "Production-ready CI/CD pipelines, Docker containerization, and automated deployment workflows.",
  },
  {
    id: "database-solutions",
    title: "Database Solutions",
    slug: "database-solutions",
    icon: "Database",
    description:
      "Database architecture, optimization, and migration. PostgreSQL, MySQL, and MongoDB expertise.",
  },
  {
    id: "ai-integration",
    title: "AI Integration",
    slug: "ai-integration",
    icon: "Sparkles",
    description:
      "AI-powered features and intelligent automation. LLM integration, chatbots, and smart workflows.",
  },
];
