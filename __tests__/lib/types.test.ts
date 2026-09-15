import type {
  Project,
  Skill,
  Experience,
  Service,
  Profile,
  ProfileStat,
  ProfileHighlight,
} from "@/lib/types";

describe("TypeScript Interfaces", () => {
  describe("Project Interface", () => {
    it("should accept valid project object", () => {
      const project: Project = {
        id: "1",
        title: "Test Project",
        description: "A test project",
        techStack: ["React", "TypeScript"],
      };
      expect(project).toBeDefined();
      expect(project.id).toBe("1");
    });

    it("should accept optional fields", () => {
      const project: Project = {
        id: "1",
        title: "Test Project",
        description: "A test project",
        techStack: ["React"],
        imageUrl: "/test.png",
        liveUrl: "https://test.com",
        repoUrl: "https://github.com/test",
      };
      expect(project.imageUrl).toBe("/test.png");
    });
  });

  describe("Skill Interface", () => {
    it("should accept valid skill object", () => {
      const skill: Skill = {
        name: "React",
        category: "frontend",
      };
      expect(skill).toBeDefined();
      expect(skill.category).toBe("frontend");
    });

    it("should only accept valid categories", () => {
      const validCategories = ["frontend", "backend", "tools", "ai", "other"];
      validCategories.forEach((category) => {
        const skill: Skill = {
          name: "Test",
          category: category as Skill["category"],
        };
        expect(skill.category).toBe(category);
      });
    });
  });

  describe("Experience Interface", () => {
    it("should accept valid experience object", () => {
      const experience: Experience = {
        id: "1",
        company: "Test Company",
        role: "Developer",
        period: "2023 - Present",
        description: ["Built things"],
      };
      expect(experience).toBeDefined();
      expect(experience.company).toBe("Test Company");
    });

    it("should accept optional fields", () => {
      const experience: Experience = {
        id: "1",
        company: "Test Company",
        role: "Developer",
        period: "2023 - Present",
        location: "Remote",
        isCurrent: true,
        description: ["Built things"],
        techStack: ["React", "Node.js"],
      };
      expect(experience.location).toBe("Remote");
      expect(experience.isCurrent).toBe(true);
    });
  });

  describe("Service Interface", () => {
    it("should accept valid service object", () => {
      const service: Service = {
        title: "Web Development",
        slug: "web-dev",
        description: "Build websites",
      };
      expect(service).toBeDefined();
      expect(service.slug).toBe("web-dev");
    });
  });

  describe("Profile Interface", () => {
    it("should accept valid profile object", () => {
      const profile: Profile = {
        name: "John Doe",
        title: "Developer",
        bio: "I code things",
        email: "john@example.com",
        location: "Earth",
        avatar: "/avatar.png",
        socials: {
          github: "https://github.com/john",
        },
      };
      expect(profile).toBeDefined();
      expect(profile.name).toBe("John Doe");
    });

    it("should accept optional profile fields", () => {
      const profile: Profile = {
        name: "John Doe",
        title: "Developer",
        bio: "I code things",
        email: "john@example.com",
        location: "Earth",
        avatar: "/avatar.png",
        phone: "+1234567890",
        resumeUrl: "/resume.pdf",
        roles: ["Frontend", "Backend"],
        techStack: ["React", "Node"],
        stats: [{ value: "10+", label: "Years" }],
        socials: {},
      };
      expect(profile.phone).toBe("+1234567890");
      expect(profile.roles).toHaveLength(2);
    });
  });

  describe("ProfileStat Interface", () => {
    it("should accept valid stat object", () => {
      const stat: ProfileStat = {
        value: "5+",
        label: "Years",
      };
      expect(stat).toBeDefined();
      expect(stat.value).toBe("5+");
    });
  });

  describe("ProfileHighlight Interface", () => {
    it("should accept valid highlight object", () => {
      const highlight: ProfileHighlight = {
        icon: "Code",
      };
      expect(highlight).toBeDefined();
      expect(highlight.icon).toBe("Code");
    });

    it("should accept optional label", () => {
      const highlight: ProfileHighlight = {
        label: "JavaScript",
        icon: "Code",
      };
      expect(highlight.label).toBe("JavaScript");
    });
  });
});
