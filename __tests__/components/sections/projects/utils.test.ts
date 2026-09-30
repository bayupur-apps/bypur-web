// Unit Tests for Projects Section Utils
import { generateTags, hasRealImage, pickCoverPalette } from "@/components/sections/projects/utils";
import type { Project } from "@/lib/types";

describe("Projects Section Utils", () => {
  describe("generateTags", () => {
    it("should extract unique tags from projects", () => {
      const projects: Project[] = [
        {
          id: "1",
          title: "Project A",
          description: "Desc",
          techStack: ["React", "TypeScript"],
        },
        {
          id: "2",
          title: "Project B",
          description: "Desc",
          techStack: ["Vue", "TypeScript"],
        },
      ];

      const result = generateTags(projects);
      expect(result).toContain("All");
      expect(result).toContain("React");
      expect(result).toContain("TypeScript");
      expect(result).toContain("Vue");
    });

    it("should not duplicate tags", () => {
      const projects: Project[] = [
        {
          id: "1",
          title: "Project A",
          description: "Desc",
          techStack: ["React", "TypeScript"],
        },
        {
          id: "2",
          title: "Project B",
          description: "Desc",
          techStack: ["React", "TypeScript"],
        },
      ];

      const result = generateTags(projects);
      const reactCount = result.filter((tag) => tag === "React").length;
      const tsCount = result.filter((tag) => tag === "TypeScript").length;

      expect(reactCount).toBe(1);
      expect(tsCount).toBe(1);
    });

    it("should limit to 6 tags plus 'All'", () => {
      const projects: Project[] = [
        {
          id: "1",
          title: "Project A",
          description: "Desc",
          techStack: [
            "Tech1",
            "Tech2",
            "Tech3",
            "Tech4",
            "Tech5",
            "Tech6",
            "Tech7",
            "Tech8",
          ],
        },
      ];

      const result = generateTags(projects);
      expect(result).toHaveLength(7); // "All" + 6 techs
    });

    it("should always include 'All' as first tag", () => {
      const projects: Project[] = [
        {
          id: "1",
          title: "Project A",
          description: "Desc",
          techStack: ["React"],
        },
      ];

      const result = generateTags(projects);
      expect(result[0]).toBe("All");
    });

    it("should return only 'All' for empty projects", () => {
      const result = generateTags([]);
      expect(result).toEqual(["All"]);
    });

    it("should return only 'All' for projects without tech stacks", () => {
      const projects: Project[] = [
        {
          id: "1",
          title: "Project A",
          description: "Desc",
          techStack: [],
        },
      ];

      const result = generateTags(projects);
      expect(result).toEqual(["All"]);
    });
  });
});

describe("cover helpers", () => {
  it("treats missing and placeholder images as no image", () => {
    expect(hasRealImage(undefined)).toBe(false);
    expect(hasRealImage("/images/projects/placeholder.svg")).toBe(false);
    expect(hasRealImage("https://cdn.example.com/oms.png")).toBe(true);
  });

  it("picks a stable palette index within range", () => {
    const a = pickCoverPalette("Order Management System (OMS)", 4);
    expect(a).toBe(pickCoverPalette("Order Management System (OMS)", 4));
    expect(a).toBeGreaterThanOrEqual(0);
    expect(a).toBeLessThan(4);
  });
});
