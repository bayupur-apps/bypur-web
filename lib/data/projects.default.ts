/**
 * Selected projects from the current resume.
 */

import type { Project } from "@/lib/types";

export const projectsDefault: Project[] = [
  {
    id: "waos",
    title: "WAOS: WhatsApp Automation Service",
    featured: true,
    description:
      "Core workflow orchestration engine for an enterprise WhatsApp automation platform, covering routing, forms, approvals, and notifications.",
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
    architectureHighlights: [
      "DDD modular monolith architecture with tenant-scoped isolation",
      "Idempotent webhook pipeline with DLQ and automatic retry backoff",
      "Real-time SSE and WebSocket engine for live agent telemetry",
      "Zero-downtime rolling container deployments on staging and production",
    ],
    endpoints: [
      {
        method: "POST",
        path: "/api/v1/webhooks/whatsapp",
        description: "Inbound webhook ingest with signature verification",
      },
      {
        method: "POST",
        path: "/api/v1/workflows/dispatch",
        description: "Trigger event-driven flow execution",
      },
      {
        method: "GET",
        path: "/api/v1/metrics/telemetry",
        description: "p99 latency and queue backlog metrics",
      },
      {
        method: "WS",
        path: "/api/v1/live/activity",
        description: "Live streaming event socket",
      },
    ],
  },
  {
    id: "personal-portfolio-cms",
    title: "Personal Portfolio CMS: by.pur_",
    featured: true,
    description:
      "Go REST API and PostgreSQL backend for the public portfolio and CMS administration console. React and TypeScript dashboard manages content, and the Next.js site presents the portfolio.",
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
    architectureHighlights: [
      "Decoupled architecture: Go REST API backend, Vite React CMS, Next.js portfolio",
      "Cloudflare R2 object storage integration for zero-latency asset distribution",
      "Stateless JWT authentication with rotating refresh tokens and RBAC",
      "Automated CI/CD pipeline via GitHub Actions and SonarQube quality gate",
    ],
    endpoints: [
      {
        method: "GET",
        path: "/api/public/projects",
        description: "Public portfolio projects query with caching",
      },
      {
        method: "POST",
        path: "/api/admin/projects",
        description: "CMS admin mutation with R2 media binding",
      },
      {
        method: "POST",
        path: "/api/admin/storage/upload",
        description: "Multipart direct upload to Cloudflare R2 bucket",
      },
    ],
    liveUrl: "https://bypur.my.id",
    repoUrl: "https://github.com/bayupaths/bypur-web",
  },
  {
    id: "damas-oms",
    title: "DAMAS: Data Management System (OMS)",
    description:
      "Built Laravel REST APIs for order processing and real-time integration with internal business systems.",
    content:
      "Designed database structures and business logic in Laravel and MySQL to preserve data accuracy across the order lifecycle, using API contracts and validation rules based on stakeholder requirements.",
    techStack: ["Laravel", "REST API", "MySQL", "SQL"],
    architectureHighlights: [
      "Relational database schema design for high-integrity order workflows",
      "Standardized REST API contract with rigorous request validation",
      "Synchronous ERP integration connectors and scheduled reconciliations",
    ],
    endpoints: [
      {
        method: "GET",
        path: "/api/v1/orders/reconcile",
        description: "Daily transaction reconciliation feed",
      },
      {
        method: "POST",
        path: "/api/v1/orders/sync",
        description: "ERP synchronous batch order processing",
      },
    ],
  },
];
