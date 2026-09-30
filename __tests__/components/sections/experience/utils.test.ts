// Unit Tests for Experience Section Utils
import { calculateYearsExp, formatDuration } from "@/components/sections/experience/utils";
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

describe("formatDuration", () => {
  const now = new Date(2026, 8, 30); // 30 Sep 2026

  it("counts months inclusively for month-precise periods", () => {
    expect(formatDuration("May 2024 - Present", now)).toBe("2 yrs 5 mos");
    expect(formatDuration("Jan 2023 - Dec 2023", now)).toBe("1 yr");
    expect(formatDuration("Sep 2026 - Present", now)).toBe("1 mo");
  });

  it("gives whole years for year-only periods", () => {
    expect(formatDuration("2022 - Present", now)).toBe("4 yrs");
    expect(formatDuration("2026 - Present", now)).toBe("< 1 yr");
  });

  it("returns an empty string for unparsable periods", () => {
    expect(formatDuration("Sometime", now)).toBe("");
    expect(formatDuration("Q1 2024 - Q2 2024", now)).toBe("");
  });
});
