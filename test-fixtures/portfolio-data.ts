import { certificatesDefault } from "@/lib/data/certificates.default";
import { experiencesDefault } from "@/lib/data/experiences.default";
import { profileDataDefault } from "@/lib/data/profile.default";
import { projectsDefault } from "@/lib/data/projects.default";
import { servicesDefault } from "@/lib/data/services.default";
import { skillsDefault } from "@/lib/data/skills.default";
import type { PortfolioData } from "@/contexts/portfolio-context";

export const portfolioDataFixture: PortfolioData = {
  profile: profileDataDefault,
  services: servicesDefault,
  skills: skillsDefault,
  experiences: experiencesDefault,
  projects: projectsDefault,
  certificates: certificatesDefault,
};
