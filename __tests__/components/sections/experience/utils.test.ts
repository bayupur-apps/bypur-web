// Unit Tests for Experience Section Utils
import { calculateYearsExp } from "@/components/sections/experience/utils";
import type { Experience } from "@/lib/types";

describe("Experience Section Utils", () => {
  describe("calculateYearsExp", () => {
    const currentYear = new Date().getFullYear();

    it("should calculate years from earliest experience", () => {
      const experiences: Experience[] = [
        {
          id: "1",
          company: "Company A",
          role: "Developer",
          period: "Jan 2020 - Present",
          description: ["Test"],
        },
        {
          id: "2",
          company: "Company B",
          role: "Developer",
          period: "Jan 2018 - Dec 2019",
          description: ["Test"],
        },
      ];

      const result = calculateYearsExp(experiences);
      expect(result).toBe(currentYear - 2018);
    });

    it("should return 0 for empty experiences array", () => {
      const result = calculateYearsExp([]);
      expect(result).toBe(0);
    });

    it("should handle single experience", () => {
      const experiences: Experience[] = [
        {
          id: "1",
          company: "Company A",
          role: "Developer",
          period: "Jan 2021 - Present",
          description: ["Test"],
        },
      ];

      const result = calculateYearsExp(experiences);
      expect(result).toBe(currentYear - 2021);
    });

    it("should extract year from various period formats", () => {
      const experiences: Experience[] = [
        {
          id: "1",
          company: "Company A",
          role: "Developer",
          period: "2019 - 2020",
          description: ["Test"],
        },
      ];

      const result = calculateYearsExp(experiences);
      expect(result).toBe(currentYear - 2019);
    });

    it("should use current year if no year found in period", () => {
      const experiences: Experience[] = [
        {
          id: "1",
          company: "Company A",
          role: "Developer",
          period: "Present",
          description: ["Test"],
        },
      ];

      const result = calculateYearsExp(experiences);
      expect(result).toBe(0); // current year - current year
    });
  });
});
