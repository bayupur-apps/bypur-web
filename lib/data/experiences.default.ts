/**
 * Experience fallback copied from the current resume.
 */

import type { Experience } from "@/lib/types";

export const experiencesDefault: Experience[] = [
  {
    id: "1",
    company: "PT Ethos Kreatif Indonesia",
    role: "Full Stack Developer",
    period: "May 2024 - Present",
    location: "Banyumas, Central Java, Indonesia",
    isCurrent: true,
    description: [
      "Built an internal ticketing system for customer service and helpdesk teams to track delivery issues, cash-on-delivery shipment problems, and operational cases.",
      "Developed a CMS for the company's product branding website.",
      "Maintained and enhanced EDIS, an order management platform handed over from an external vendor.",
      "Built an ERP extension for Hashmicro with analytics dashboards and additional workflow support.",
      "Implemented CI/CD pipelines with Jenkins and SonarQube.",
      "Delivered work in Scrum, Agile, and Kanban teams with Product Owners, Business Analysts, and QA.",
    ],
    techStack: [
      "Laravel",
      "Node.js",
      "Go",
      "MySQL",
      "PostgreSQL",
      "Docker",
      "Git",
      "Postman",
      "Jenkins",
      "SonarQube",
    ],
  },
];
