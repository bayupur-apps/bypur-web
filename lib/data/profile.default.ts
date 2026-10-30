import type { Profile } from "@/lib/types";
import { profileAssets } from "@/lib/config/cdn";

export const profileDataDefault: Profile = {
  // Avatar dan Resume URLs dari CDN
  name: "Bayu Purnomo",
  title: "Full Stack Developer",
  tagline: "I build secure APIs and backend systems for business applications.",
  taglineHighlight: "secure APIs and backend systems",
  bio: "Full Stack Developer who designs and builds secure, well-architected REST APIs and backend systems for enterprise business applications, including ERP and OMS platforms. Strong across the stack in Go, Node.js/TypeScript, React/Next.js, and PHP (Laravel), with hands-on depth in PostgreSQL/MySQL schema design and query optimization, Domain-Driven Design, and background-worker processing for services that stay correct under concurrency. Experienced setting up CI/CD pipelines with Docker and Jenkins, and increasingly applies AI-assisted development tools and LLM integrations to ship faster without cutting corners on architecture. Comfortable translating complex business logic into maintainable, secure systems within Agile teams.",
  email: "bayupurnomo.dev@gmail.com",
  phone: "+62 881 2785 635",
  location: "Banyumas, Central Java, Indonesia",
  avatar: profileAssets.avatar,
  resumeUrl: profileAssets.resume,
  isCvVisible: true,
  roles: ["Full Stack Developer"],
  rolesLabel: "Currently working as",
  techStack: [
    "Go",
    "Node.js",
    "TypeScript",
    "React",
    "Next.js",
    "PHP",
    "Laravel",
    "PostgreSQL",
    "MySQL",
  ],

  stats: [
    { value: "3", label: "Selected projects" },
    { value: "2+", label: "Years in current role" },
    { value: "2", label: "SQL databases" },
  ],

  mobileStats: [
    {
      value: "2+",
      label: "years at PT Ethos",
      accent: true,
      icon: "ti-briefcase",
    },
    {
      value: "3",
      label: "selected projects",
      accent: true,
      icon: "ti-rocket",
    },
    {
      value: "Go",
      label: "primary backend language",
      accent: false,
      icon: "ti-server",
    },
    {
      value: "DDD",
      label: "architecture approach",
      accent: false,
      icon: "ti-world",
    },
  ],

  highlights: [
    { label: "Go & backend systems", icon: "Server" },
    { label: "REST API design", icon: "Code2" },
    { label: "PostgreSQL & MySQL", icon: "Database" },
    { label: "DDD & background workers", icon: "Zap" },
  ],

  skills: {
    label: "Skills",
    title: "Technical Architecture & Matrix",
    titleHighlight: "Technical Architecture",
    description:
      "Languages, databases, frameworks, and infrastructure tools across backend and full-stack systems.",

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

    cta: {
      secondary: {
        text: "Download CV",
      },
    },
  },

  experience: {
    label: "Experience",
    title: "Career Experience & Timeline",
    titleHighlight: "Career Experience",

    description:
      "Enterprise applications, backend systems, and production engineering workflows.",

    stats: {
      yearsExp: "2+",
      positions: "Roles",
      highlight: {
        value: "Enterprise",
        label: "application experience",
      },
    },
  },

  projects: {
    label: "Projects",
    title: "Production Systems & Architecture",
    titleHighlight: "Production Systems",

    description:
      "Enterprise software architectures, backend workflows, and live deployments.",
  },

  certificates: {
    label: "Certificates",
    title: "Professional Credentials & Licenses",
    titleHighlight: "Professional Credentials",

    description:
      "Verified industry accreditations validating hands-on engineering competencies.",
  },

  contact: {
    label: "Contact",
    title: "Communication Hub & Direct Dispatch",
    titleHighlight: "Communication Hub",

    description:
      "Get in touch for backend architecture, full-stack systems, or role inquiries.",

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
        value: "Banyumas, Central Java, Indonesia",
        href: "#",
        copyable: false,
      },
    ],

    form: {
      title: "Send me a message",
      subtitle: "I usually respond within 1-2 working days.",
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
    linkedin: "https://www.linkedin.com/in/bayupurnomo1710",
    instagram: "https://instagram.com/bayuuu.p",
    whatsapp: "https://wa.me/628812785635",
    website: "https://bypur.my.id",
  },
};
