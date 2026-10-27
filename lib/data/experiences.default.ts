/**
 * Experience fallback copied from the current resume and backend production data.
 */

import type { Experience } from "@/lib/types";

export const experiencesDefault: Experience[] = [
  {
    id: "63db58aa-4792-4e0b-99ec-7485f6d30313",
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
      "Worked in Agile, Scrum, and Kanban teams with Product Owners, Business Analysts, and QA.",
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
  {
    id: "13d84199-6f17-4ba9-8d3d-51926118a398",
    company: "Self-Employed / Freelance",
    role: "Freelance Full Stack Developer",
    period: "Jan 2022 - Present",
    location: "Remote / Indonesia",
    isCurrent: true,
    description: [
      "Merancang dan menguji aplikasi web kustom untuk berbagai klien dari tahap analisis kebutuhan bisnis hingga serah terima produksi (deployment).",
      "Membangun RESTful API dan sistem backend berkinerja tinggi menggunakan Golang, Node.js, dan Laravel dengan arsitektur yang aman dan terstruktur.",
      "Mengembangkan antarmuka pengguna (frontend) yang responsif, cepat, dan SEO-friendly menggunakan Next.js, React, Vue.js, dan Tailwind CSS.",
      "Mengelola infrastruktur cloud dan deployment VPS menggunakan Docker, Nginx, SSL, serta integrasi CI/CD pipeline untuk otomasi perilisan.",
      "Berkolaborasi langsung dengan pemangku kepentingan (stakeholders) dalam menentukan skala proyek, estimasi waktu, serta solusi arsitektur teknis terbaik.",
    ],
    techStack: [
      "Laravel",
      "MySQL",
      "VPS",
      "Node.js",
      "Vue",
      "Cloudflare R2",
      "Go",
      "TypeScript",
      "Redis",
    ],
  },
  {
    id: "fea89a00-a30f-40ac-9491-3771e502d1b8",
    company: "Cazh",
    role: "Web Developer Intern",
    period: "Sep 2021 - Nov 2021",
    location: "Purwokerto, Indonesia",
    isCurrent: false,
    description: [
      "Berpartisipasi sebagai Web Developer Intern selama 3 bulan, berfokus pada pengembangan sistem web dan integrasi layanan pembayaran digital (payment gateway).",
      "Menggunakan framework Laravel dalam membangun dan mengoptimalkan fitur-fitur aplikasi berbasis web",
      "Mempelajari dan mengimplementasikan integrasi sistem pembayaran digital menggunakan Xendit dan Midtrans.",
      "Memahami alur kerja (workflow) transaksi online, penanganan API callback/webhook, serta pengelolaan status pembayaran (pending, success, failed) dari kedua payment gateway tersebut.",
    ],
    techStack: [
      "Web Development",
      "Laravel",
      "Payment Gateway",
      "Rest API",
      "PHP",
    ],
  },
];
