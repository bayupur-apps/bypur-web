/**
 * Service fallback based on work and skills listed in the current resume.
 */

import type { Service } from "@/lib/types";

export const servicesDefault: Service[] = [
  {
    id: "backend-api-systems",
    title: "Backend Systems & REST APIs",
    slug: "backend-api-systems",
    icon: "Server",
    description:
      "REST APIs and backend systems for business applications, built with Go, Node.js, or Laravel.",
  },
  {
    id: "full-stack-applications",
    title: "Full-Stack Applications",
    slug: "full-stack-applications",
    icon: "Layout",
    description:
      "Web applications using React, Next.js, TypeScript, and PHP with Laravel.",
  },
  {
    id: "database-design",
    title: "Database Design & Optimization",
    slug: "database-design",
    icon: "Database",
    description:
      "PostgreSQL and MySQL schema design, indexing, transactions, and query optimization.",
  },
  {
    id: "workflow-integrations",
    title: "Workflow & Webhook Integrations",
    slug: "workflow-integrations",
    icon: "Workflow",
    description:
      "Business workflow integrations with idempotent webhook processing, retries, and background workers.",
  },
  {
    id: "ci-cd-deployment",
    title: "CI/CD & Deployment",
    slug: "ci-cd-deployment",
    icon: "Workflow",
    description:
      "Docker-based deployments and CI/CD pipelines using Jenkins or GitHub Actions.",
  },
  {
    id: "llm-integration",
    title: "LLM Integration",
    slug: "llm-integration",
    icon: "Sparkles",
    description:
      "LLM API integrations, prompt engineering, and AI agent workflows.",
  },
];
