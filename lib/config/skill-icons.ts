import {
  siClaude,
  siDocker,
  siFigma,
  siGit,
  siGithub,
  siGithubactions,
  siGithubcopilot,
  siGo,
  siHtml5,
  siJenkins,
  siLaravel,
  siMysql,
  siNextdotjs,
  siNodedotjs,
  siPhp,
  siPostgresql,
  siPostman,
  siPusher,
  siReact,
  siRedis,
  siTailwindcss,
  siTerraform,
  siTypescript,
  siVuedotjs,
  type SimpleIcon,
} from "simple-icons";
import {
  Bot,
  Boxes,
  Code2,
  Network,
  Repeat,
  Sparkles,
  SquareCode,
  Webhook,
  Workflow,
  type LucideIcon,
} from "lucide-react";

export type SkillIcon =
  | { kind: "brand"; path: string; hex: string }
  | { kind: "lucide"; icon: LucideIcon };

const brand = (icon: SimpleIcon): SkillIcon => ({ kind: "brand", path: icon.path, hex: icon.hex });
const lucide = (icon: LucideIcon): SkillIcon => ({ kind: "lucide", icon });

/**
 * Skill name (normalised: lowercase, alphanumerics only) -> icon. Brand logos
 * come from simple-icons; skills without a brand (practices, concepts) or
 * brands simple-icons no longer ships (VS Code, OpenAI) use lucide icons.
 */
const SKILL_ICONS: Record<string, SkillIcon> = {
  // Frontend
  vuejs: brand(siVuedotjs),
  vue: brand(siVuedotjs),
  nextjs: brand(siNextdotjs),
  react: brand(siReact),
  typescript: brand(siTypescript),
  tailwindcss: brand(siTailwindcss),
  tailwind: brand(siTailwindcss),
  html5css3: brand(siHtml5),
  html5: brand(siHtml5),
  // Backend
  laravel: brand(siLaravel),
  php: brand(siPhp),
  golang: brand(siGo),
  go: brand(siGo),
  nodejs: brand(siNodedotjs),
  mysql: brand(siMysql),
  postgresql: brand(siPostgresql),
  redis: brand(siRedis),
  pusher: brand(siPusher),
  restapi: lucide(Webhook),
  // Tools
  gitgithub: brand(siGithub),
  github: brand(siGithub),
  git: brand(siGit),
  docker: brand(siDocker),
  figma: brand(siFigma),
  postman: brand(siPostman),
  githubactions: brand(siGithubactions),
  jenkins: brand(siJenkins),
  terraform: brand(siTerraform),
  cicd: lucide(Workflow),
  vscode: lucide(SquareCode),
  visualstudiocode: lucide(SquareCode),
  // AI
  githubcopilot: brand(siGithubcopilot),
  claude: brand(siClaude),
  chatgpt: lucide(Bot),
  aiapisintegration: lucide(Sparkles),
  // Practices
  agilescrum: lucide(Repeat),
  agile: lucide(Repeat),
  scrum: lucide(Repeat),
  cleancode: lucide(Code2),
  systemdesign: lucide(Boxes),
};

const normalise = (name: string) => name.toLowerCase().replace(/[^a-z0-9]/g, "");

/** Icon for a known skill, or undefined (callers decide on a fallback). */
export function findSkillIcon(name: string): SkillIcon | undefined {
  return SKILL_ICONS[normalise(name)];
}

export function getSkillIcon(name: string): SkillIcon {
  return findSkillIcon(name) ?? lucide(Network);
}

/**
 * Near-black brand colours (Next.js, GitHub, Copilot) vanish on the dark
 * theme, so those fall back to the theme's text colour on hover.
 */
export function isDarkBrand(hex: string) {
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b < 0.2;
}
