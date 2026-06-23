/**
 * Skills Data (Default/Static)
 * Fallback untuk jika API tidak tersedia
 * Dapat juga digunakan untuk testing & development
 */

import type { Skill } from "@/lib/types";

export const skillsDefault: Skill[] = [
  // ================= FRONTEND =================
  { name: "Vue.js", category: "frontend" },
  { name: "Next.js", category: "frontend" },
  { name: "TypeScript", category: "frontend" },
  { name: "Tailwind CSS", category: "frontend" },
  { name: "HTML5 / CSS3", category: "frontend" },

  // ================= BACKEND =================
  { name: "Laravel", category: "backend" },
  { name: "PHP", category: "backend" },
  { name: "Golang", category: "backend" },
  { name: "Node.js", category: "backend" },
  { name: "REST API", category: "backend" },
  { name: "MySQL", category: "backend" },
  { name: "PostgreSQL", category: "backend" },
  { name: "Redis", category: "backend" },

  // ================= TOOLS =================
  { name: "Git & GitHub", category: "tools" },
  { name: "Docker", category: "tools" },
  { name: "VS Code", category: "tools" },
  { name: "Figma", category: "tools" },
  { name: "Postman", category: "tools" },
  { name: "CI/CD", category: "tools" },

  // ================= AI (INTEGRATION LEVEL) =================
  { name: "ChatGPT", category: "ai" },
  { name: "GitHub Copilot", category: "ai" },
  { name: "Claude", category: "ai" },
  { name: "AI APIs Integration", category: "ai" },

  // ================= PRACTICES =================
  { name: "Agile / Scrum", category: "other" },
  { name: "Clean Code", category: "other" },
  { name: "System Design", category: "other" },
];
