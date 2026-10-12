/**
 * Selected projects from the current resume.
 */

import type { Project } from "@/lib/types";

export const projectsDefault: Project[] = [
  {
    id: "waos",
    title: "WAOS - WhatsApp Automation Service",
    featured: true,
    description:
      "Built the core workflow orchestration engine for a WhatsApp automation platform, covering routing, forms, approvals, and notifications.",
    content:
      "The Go backend uses a DDD modular monolith, tenant-scoped isolation, and asynchronous background workers. Webhook processing is idempotent, with retries and dead-letter queue handling for provider failures. Deployments are containerized and automated for staging and production.",
    techStack: [
      "Go",
      "React",
      "TypeScript",
      "PostgreSQL",
      "Redis",
      "Docker",
      "Jenkins CI/CD",
      "SonarQube",
    ],
  },
  {
    id: "personal-portfolio-cms",
    title: "Personal Portfolio CMS - by.pur_",
    featured: true,
    description:
      "Built a Go REST API and PostgreSQL backend for the public portfolio and CMS admin. The React and TypeScript dashboard manages content, and the Next.js site presents the portfolio.",
    content:
      "Cloudflare R2 stores and serves portfolio media and assets. GitHub Actions automates build, test, and deployment workflows for the CMS admin and public site.",
    techStack: [
      "Go",
      "Next.js",
      "React",
      "TypeScript",
      "PostgreSQL",
      "Cloudflare R2",
      "GitHub Actions",
    ],
    liveUrl: "https://bypur.my.id",
    repoUrl: "https://github.com/bayupaths/bypur-web",
  },
  {
    id: "damas-oms",
    title: "DAMAS - Data Management System (OMS)",
    description:
      "Built Laravel REST APIs for order processing and real-time integration with internal systems.",
    content:
      "Designed database structures and business logic in Laravel and MySQL to preserve data accuracy across the order lifecycle, using API contracts and validation rules based on stakeholder requirements.",
    techStack: ["Laravel", "REST API", "MySQL", "SQL"],
  },
];
