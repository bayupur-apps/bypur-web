import type { Profile } from "@/lib/types";
import { profileAssets } from "@/lib/config/cdn";

export const profileDataDefault: Profile = {
  // Avatar dan Resume URLs dari CDN
  name: "Bayu Purnomo",
  title: "Full Stack Developer",
  tagline: "I build practical and scalable web applications.",
  taglineHighlight: "scalable web applications",
  bio: "I'm a Full Stack Developer focused on building real-world business applications. Currently at PT Ethos Kreatif Indonesia, I work on enterprise systems, APIs, and database-driven applications. Additional experience as a freelancer building SaaS platforms and custom solutions.",
  email: "bayupurnomo.dev@gmail.com",
  phone: "+62 881 2785 635",
  location: "Indonesia",
  avatar: profileAssets.avatar,
  resumeUrl: profileAssets.resume,
  roles: [
    "Full Stack Developer",
    "Laravel Developer",
    "Backend Architect",
  ],
  rolesLabel: "Currently working as",
  techStack: [
    "Laravel",
    "Node.js",
    "PostgreSQL",
    "MySQL",
    "Vue.js",
    "Next.js",
    "Docker",
    "AI Integration",
  ],

  stats: [
    { value: "4+", label: "Production systems delivered" },
    { value: "2+", label: "Years professional experience" },
    { value: "10+", label: "Web applications built" },
  ],

  mobileStats: [
    {
      value: "2+",
      label: "years in production",
      accent: true,
      icon: "ti-briefcase",
    },
    {
      value: "4+",
      label: "systems deployed",
      accent: true,
      icon: "ti-rocket",
    },
    {
      value: "Full Stack",
      label: "expertise",
      accent: false,
      icon: "ti-server",
    },
    {
      value: "Enterprise",
      label: "focused",
      accent: false,
      icon: "ti-world",
    },
  ],

  highlights: [
    { label: "Full Stack Developer", icon: "Server" },
    { label: "REST API Design", icon: "Code2" },
    { label: "Database Architecture", icon: "Database" },
    { label: "System Integration", icon: "Zap" },
  ],

  skills: {
    label: "Skills",
    title: "Tools I use to build applications.",
    titleHighlight: "build applications.",
    description:
      "Technologies used to build production and freelance projects.",

    primaryStack: [
      {
        name: "Laravel",
        desc: "Backend & business applications",
        icon: "Server",
      },
      {
        name: "Node.js",
        desc: "API & integration services",
        icon: "Cpu",
      },
      {
        name: "PostgreSQL",
        desc: "Database design & optimization",
        icon: "Database",
      },
      {
        name: "Next.js / Vue",
        desc: "Frontend applications",
        icon: "Layers",
      },
    ],

    familiarWith: [
      "Docker",
      "Redis",
      "CI/CD",
      "Git",
      "System Design",
      "AI APIs (OpenAI / LLM Integration)",
    ],

    cta: {
      label: "Projects",
      title: "See what I've built",
      description:
        "Real-world applications and systems built for business use cases",
      button: {
        text: "View Projects",
        href: "#projects",
      },
    },
  },

  about: {
    label: "About",
    title: "A developer who builds",
    titleHighlight: "real working systems.",

    headline:
      "Full Stack Developer focused on building real-world business applications.",

    description:
      "I build web applications with a strong focus on backend logic, APIs, and database design. My experience includes production systems used in real business operations, freelance projects, and integrating modern tools including AI-powered features where needed.",

    yearLabel: "years",

    cta: {
      primary: {
        text: "Get in touch",
        href: "#contact",
      },
      secondary: {
        text: "Download CV",
        href: profileAssets.resume,
      },
    },
  },

  experience: {
    label: "Experience",
    title: "Building real systems through practice.",
    titleHighlight: "real systems.",

    description:
      "Experience from production system development and freelance projects focused on backend and full stack implementation.",

    stats: {
      yearsExp: "2+",
      positions: "Roles",
      highlight: {
        value: "Production",
        label: "system experience",
      },
    },
  },

  projects: {
    label: "Projects",
    title: "Systems I've worked on.",
    titleHighlight: "I've worked on.",

    description:
      "Real-world applications including business systems and freelance project implementations.",
  },

  contact: {
    label: "Contact",
    title: "Let's work together.",
    titleHighlight: "together.",

    description:
      "Open to freelance projects, full stack development, and system collaboration.",

    info: [
      {
        icon: "Mail",
        label: "Email",
        value: "bayupurnomo.dev@gmail.com",
        href: "mailto:bayupurnomo.dev@gmail.com",
        copyable: true,
      },
      {
        icon: "Phone",
        label: "Phone",
        value: "+62 881 2785 635",
        href: "tel:+628812785635",
        copyable: false,
      },
      {
        icon: "MapPin",
        label: "Location",
        value: "Indonesia · UTC+7",
        href: "#",
        copyable: false,
      },
    ],

    form: {
      title: "Send me a message",
      subtitle: "I usually respond within 1–2 working days.",
      projectTypes: [
        "Full Stack Web App",
        "Backend System",
        "API Development",
        "AI Integration",
        "Business Application",
        "Other",
      ],
    },
  },

  cta: {
    primary: {
      text: "View my work",
      href: "#projects",
    },
    secondary: {
      text: "Let's talk",
      href: "#contact",
    },
  },

  socials: {
    github: "https://github.com/bayupaths",
    linkedin: "https://linkedin.com/in/bayupurnomo1710",
    instagram: "https://instagram.com/bayuuu.p",
    whatsapp: "https://wa.me/628812785635",
  },
};
