/**
 * Experiences Data (Default/Static)
 * Fallback untuk jika API tidak tersedia
 * Dapat juga digunakan untuk testing & development
 */

import type { Experience } from "@/lib/types";

export const experiencesDefault: Experience[] = [
  {
    id: 1,
    company: "PT Ethos Kreatif Indonesia",
    role: "Full Stack Developer",
    period: "May 2024 - Present",
    location: "Purwokerto, Indonesia",
    type: "On-site",
    description: [
      "Develop and maintain internal business applications that support company operations and cross-system integrations.",
      "Build and enhance web-based systems including Ticketing, CMS, Compliance, Asset Management, Outlet Management, and Order Management System (OMS).",
      "Design and develop RESTful APIs and backend services using Laravel, Node.js, MySQL, and PostgreSQL.",
      "Maintain and extend the OMS platform after vendor handover, delivering bug fixes, performance improvements, and new business features.",
      "Collaborate with cross-functional teams in Agile Scrum environments to deliver scalable and maintainable software solutions.",
      "Contribute to CI/CD implementation, deployment automation, and system reliability improvements.",
    ],
    techStack: [
      "Laravel",
      "Vue.js",
      "Node.js",
      "MySQL",
      "PostgreSQL",
      "Golang",
      "Docker",
      "Jenkins",
      "CI/CD",
      "Git",
      "REST API",
      "Agile",
      "Scrum",
    ],
  },
  {
    id: 2,
    company: "Freelance",
    role: "Full Stack Developer",
    period: "2022 - Present",
    location: "Remote",
    type: "Freelance",
    description: [
      "Architected and developed a custom Order Management System (OMS) to support order processing, inventory management, and operational workflows.",
      "Built a SaaS-based attendance management platform with employee management, attendance tracking, reporting, and administrative features.",
      "Designed and developed scalable backend services and RESTful APIs using Golang and Laravel.",
      "Developed responsive web applications and administrative dashboards using Next.js and Vue.js.",
      "Designed database schemas and optimized queries using PostgreSQL and MySQL.",
      "Managed Linux servers, deployment workflows, and production environments.",
    ],
    techStack: [
      "Golang",
      "Laravel",
      "Next.js",
      "Vue.js",
      "PostgreSQL",
      "MySQL",
      "Linux",
      "Docker",
      "REST API",
      "Git",
    ],
  },
];
