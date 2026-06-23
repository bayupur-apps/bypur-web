/**
 * Projects Data (Default/Static)
 * Fallback untuk jika API tidak tersedia
 * Dapat juga digunakan untuk testing & development
 */

import type { Project } from "@/lib/types";

export const projectsDefault: Project[] = [
  {
    id: 1,
    title: "Order Management System (OMS)",
    description:
      "Large-scale order processing platform used at PT Ethos Kreatif Indonesia. Handles order creation, inventory tracking, fulfillment workflows, and real-time queue notifications for F&B chains and retailers.",
    techStack: ["Laravel", "Vue.js", "PostgreSQL", "Redis", "Pusher", "Docker"],
    experienceId: 1,
    imageUrl: "/images/projects/placeholder.svg",
  },
  {
    id: 2,
    title: "HR Operations & Attendance Platform",
    description:
      "Internal tool developed at PT Ethos Kreatif Indonesia to manage employee attendance, payroll processing, leave management, and personnel data. Features RBAC, audit logs, and automated reporting.",
    techStack: ["Laravel", "Vue.js", "MySQL", "Redis", "Docker"],
    experienceId: 1,
    imageUrl: "/images/projects/placeholder.svg",
  },
  {
    id: 3,
    title: "Compliance & Asset Management System",
    description:
      "Enterprise web application for tracking and managing company assets, compliance requirements, and audit trails. Integrates with other internal systems via REST APIs.",
    techStack: ["Laravel", "Node.js", "PostgreSQL", "Docker", "CI/CD"],
    experienceId: 1,
    imageUrl: "/images/projects/placeholder.svg",
  },
  {
    id: 4,
    title: "Attendance SaaS Platform",
    description:
      "Cloud-based employee attendance and management platform built as freelance project. Features employee scheduling, real-time attendance tracking, payroll integration, and admin dashboard.",
    techStack: ["Golang", "Vue.js", "PostgreSQL", "Docker", "REST API"],
    experienceId: 2,
    imageUrl: "/images/projects/placeholder.svg",
    liveUrl: "https://example.com",
  },
  {
    id: 5,
    title: "by.pur_ Studio - Personal Portfolio",
    description:
      "Personal studio site showcasing work and projects. A custom-built portfolio with modern design system, smooth animations, and responsive layout. Built as a playground for exploring latest frontend tech.",
    techStack: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    experienceId: 2,
    imageUrl: "/images/projects/placeholder.svg",
    liveUrl: "https://bypur.my.id",
    repoUrl: "https://github.com/bayupaths/bypur-web",
  },
  {
    id: 6,
    title: "Laravel API Boilerplate & DevOps Kit",
    description:
      "Open-source boilerplate for building production-ready Laravel APIs with built-in authentication, RBAC, OpenAPI documentation, and CI/CD pipelines. Reusable across multiple projects.",
    techStack: ["Laravel", "Node.js", "Docker", "GitHub Actions", "Terraform"],
    experienceId: 2,
    imageUrl: "/images/projects/placeholder.svg",
    repoUrl: "https://github.com/bayupaths/laravel-api-boilerplate",
  },
];
