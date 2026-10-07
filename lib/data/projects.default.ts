/**
 * Projects Data (Default/Static)
 * Fallback untuk jika API tidak tersedia
 * Dapat juga digunakan untuk testing & development
 */

import type { Project } from "@/lib/types";

export const projectsDefault: Project[] = [
  {
    id: "1",
    title: "Order Management System (OMS)",
    featured: true,
    description:
      "Large-scale order processing platform used at PT Ethos Kreatif Indonesia. Handles order creation, inventory tracking, fulfillment workflows, and real-time queue notifications for F&B chains and retailers.",
    content:
      "Engineered with Laravel queue workers and Redis caching to handle order processing under concurrent peak traffic, with real-time status broadcasting via Pusher/WebSockets.",
    techStack: ["Laravel", "Vue.js", "PostgreSQL", "Redis", "Pusher", "Docker"],
    imageUrl: "/images/projects/placeholder.svg",
    architectureHighlights: [
      "Asynchronous dispatch for order fulfillment pipelines",
      "Redis cached inventory counts with row-level locking in PostgreSQL",
      "Pusher WebSocket channels for real-time kitchen and dispatch screens",
      "Role-based access control with granular permission checks",
    ],
    endpoints: [
      { method: "POST", path: "/api/v1/orders/checkout", description: "Atomic checkout with inventory reservation and payment dispatch" },
      { method: "GET", path: "/api/v1/orders/pipeline", description: "Real-time query for order progress status and fulfillment stage" },
      { method: "WS", path: "orders.channel.{storeId}", description: "Live WebSocket feed for kitchen display system notifications" },
    ],
  },
  {
    id: "2",
    title: "HR Operations & Attendance Platform",
    featured: true,
    description:
      "Internal platform developed at PT Ethos Kreatif Indonesia to manage employee attendance, payroll processing, leave management, and personnel data. Features RBAC, audit logs, and automated reporting.",
    content:
      "Automates monthly payroll calculations and validates clock-in coordinates against company geo-fences, eliminating manual reconciliation overhead.",
    techStack: ["Laravel", "Vue.js", "MySQL", "Redis", "Docker"],
    imageUrl: "/images/projects/placeholder.svg",
    architectureHighlights: [
      "Geo-fence radius computation on check-in requests",
      "Automated monthly payroll generation engine with tax deductions",
      "Comprehensive immutable audit trail on administrative actions",
    ],
    endpoints: [
      { method: "POST", path: "/api/v1/attendance/clock", description: "Records timestamp, biometric proof, and geo-coordinates" },
      { method: "GET", path: "/api/v1/payroll/export", description: "Aggregates tax, overtime, and deductions into payroll summary" },
      { method: "GET", path: "/api/v1/audit/logs", description: "Query tamper-resistant access records and status changes" },
    ],
  },
  {
    id: "3",
    title: "Compliance & Asset Management System",
    description:
      "Enterprise web application for tracking and managing company assets, compliance requirements, and audit trails. Integrates with other internal systems via REST APIs.",
    content:
      "Centralized asset lifecycle registry with automated depreciation schedules and scheduled maintenance tracking.",
    techStack: ["Laravel", "Node.js", "PostgreSQL", "Docker", "CI/CD"],
    imageUrl: "/images/projects/placeholder.svg",
    architectureHighlights: [
      "Automated asset depreciation computation engine",
      "Periodic compliance check reminders and task assignments",
      "QR code scanning integration for physical asset audits",
    ],
    endpoints: [
      { method: "GET", path: "/api/v1/assets/registry", description: "Paginated asset inventory with depreciation curves and status" },
      { method: "POST", path: "/api/v1/assets/audit/scan", description: "Validates physical asset QR tag and logs inspector metadata" },
    ],
  },
  {
    id: "4",
    title: "Attendance SaaS Platform",
    description:
      "Cloud-based employee attendance and management platform built as freelance project. Features employee scheduling, real-time attendance tracking, payroll integration, and admin dashboard.",
    content:
      "Multi-tenant backend built in Golang with high-concurrency request handling, deployed in containerized cloud infrastructure.",
    techStack: ["Golang", "Vue.js", "PostgreSQL", "Docker", "REST API"],
    imageUrl: "/images/projects/placeholder.svg",
    liveUrl: "https://example.com",
    architectureHighlights: [
      "High throughput token authentication in Golang",
      "Multi-tenant schema isolation in PostgreSQL",
      "Lightweight memory footprint in container cluster",
    ],
    endpoints: [
      { method: "POST", path: "/api/v1/auth/token", description: "High-throughput JWT verification and token issue" },
      { method: "POST", path: "/api/v1/checkin/pulse", description: "Lightweight check-in ingest with microsecond latency" },
    ],
  },
  {
    id: "5",
    title: "by.pur_ Studio: Personal Portfolio",
    featured: true,
    description:
      "Personal portfolio shell showcasing systems architecture and full stack engineering. Custom Neumorphic design system with zero global scroll, smooth spring motion, and accessible WCAG contrast.",
    content:
      "Built with Next.js App Router, React 19, and Tailwind CSS. Employs a desktop application paradigm with master-detail navigation and keyboard shortcuts.",
    techStack: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    imageUrl: "/images/projects/placeholder.svg",
    liveUrl: "https://bypur.my.id",
    repoUrl: "https://github.com/bayupaths/bypur-web",
    architectureHighlights: [
      "Zero-scroll desktop shell architecture with isolated viewport panes",
      "Custom CSS design tokens for Neumorphic depth and dynamic theme switching",
      "Accessibility-tested keyboard navigation and WCAG AA contrast compliance",
    ],
    endpoints: [
      { method: "GET", path: "/api/portfolio", description: "Unified payload for profile metadata, skills, and projects" },
      { method: "POST", path: "/api/contact", description: "Validated contact inquiry pipeline with rate limiting" },
    ],
  },
  {
    id: "6",
    title: "Laravel API Boilerplate & DevOps Kit",
    description:
      "Open-source boilerplate for building production-ready Laravel APIs with built-in authentication, RBAC, OpenAPI documentation, and CI/CD pipelines. Reusable across multiple projects.",
    content:
      "Standardized starter template reducing initial microservice setup time, with pre-configured Docker Compose environments and GitHub Actions workflows.",
    techStack: ["Laravel", "Node.js", "Docker", "GitHub Actions", "Terraform"],
    imageUrl: "/images/projects/placeholder.svg",
    repoUrl: "https://github.com/bayupaths/laravel-api-boilerplate",
    architectureHighlights: [
      "Pre-configured Docker Compose with PHP-FPM, Nginx, PostgreSQL, and Redis",
      "OpenAPI 3.0 / Swagger automated endpoint documentation generation",
      "Automated lint, unit test, and deployment GitHub Actions pipeline",
    ],
    endpoints: [
      { method: "GET", path: "/api/v1/health", description: "Container and database connection liveness verification" },
      { method: "GET", path: "/api/docs", description: "Interactive Swagger UI documentation specification" },
    ],
  },
];
