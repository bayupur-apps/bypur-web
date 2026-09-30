// Unit Tests for Hero Section Utils
import { Briefcase, Code2, Layers, Server } from "lucide-react";
import {
  mapRolesToIcons,
  getDefaultMobileStats,
  escapeRegExp,
  parseStatValue,
} from "@/components/sections/hero/utils";
import type { Profile } from "@/lib/types";

describe("Hero Section Utils", () => {
  describe("mapRolesToIcons", () => {
    it("should map roles to icon objects correctly", () => {
      const roles = ["Backend Engineer", "Systems Architect"];
      const result = mapRolesToIcons(roles);

      expect(result).toHaveLength(2);
      expect(result[0]).toHaveProperty("label", "Backend Engineer");
      expect(result[0]).toHaveProperty("icon");
      expect(result[1]).toHaveProperty("label", "Systems Architect");
    });

    it("should handle empty roles array", () => {
      const result = mapRolesToIcons([]);
      expect(result).toEqual([]);
    });

    it("should handle undefined roles", () => {
      const result = mapRolesToIcons(undefined);
      expect(result).toEqual([]);
    });

    it("should map roles to have icon property", () => {
      const roles = ["Backend Engineer", "Systems Architect"];
      const result = mapRolesToIcons(roles);
      expect(result[0].icon).toBeDefined();
      expect(typeof result[0].icon).toBe("object"); // Lucide icons are React components (objects)
    });

    it("should map Developer roles correctly", () => {
      const roles = ["Full Stack Developer"];
      const result = mapRolesToIcons(roles);
      expect(result[0].icon).toBeDefined();
      expect(typeof result[0].icon).toBe("object");
    });

    it("should pick a role-specific icon, falling back to Briefcase", () => {
      const result = mapRolesToIcons([
        "Full Stack Developer",
        "Laravel Developer",
        "Backend Developer",
        "Product Manager",
      ]);
      expect(result.map((r) => r.icon)).toEqual([Layers, Code2, Server, Briefcase]);
    });
  });

  describe("escapeRegExp", () => {
    it("should make special characters match literally", () => {
      const highlight = "C++ (and .NET)?";
      const regex = new RegExp(escapeRegExp(highlight));
      expect(regex.test(`I write ${highlight} daily`)).toBe(true);
      expect(regex.test("I write C (and xNET) daily")).toBe(false);
    });
  });

  describe("parseStatValue", () => {
    it("should split prefix, number and suffix", () => {
      expect(parseStatValue("4+")).toEqual({ prefix: "", number: 4, suffix: "+" });
      expect(parseStatValue("~12k")).toEqual({ prefix: "~", number: 12, suffix: "k" });
      expect(parseStatValue("100%")).toEqual({ prefix: "", number: 100, suffix: "%" });
    });

    it("should return null for non-numeric or decimal values", () => {
      expect(parseStatValue("Full Stack")).toBeNull();
      expect(parseStatValue("4.5")).toBeNull();
    });
  });

  describe("getDefaultMobileStats", () => {
    const mockProfile: Profile = {
      name: "Bayu Purnomo",
      title: "Backend Engineer",
      bio: "Test bio",
      email: "test@example.com",
      location: "Indonesia",
      avatar: "/avatar.png",
      socials: {},
    };

    it("should generate default mobile stats from profile", () => {
      const result = getDefaultMobileStats(mockProfile);

      expect(result).toHaveLength(4);
      expect(result[0]).toMatchObject({
        label: "years experience",
        accent: true,
        icon: "ti-briefcase",
      });
    });

    it("should include years experience stat", () => {
      const result = getDefaultMobileStats(mockProfile);
      const yearsStat = result.find((stat) => stat.label === "years experience");
      expect(yearsStat).toBeDefined();
      expect(yearsStat?.value).toMatch(/\d+\+/);
    });

    it("should include projects shipped stat", () => {
      const result = getDefaultMobileStats(mockProfile);
      const projectsStat = result.find((stat) => stat.label === "projects shipped");
      expect(projectsStat).toBeDefined();
      expect(projectsStat?.accent).toBe(true);
    });

    it("should include primary stack stat", () => {
      const result = getDefaultMobileStats(mockProfile);
      const stackStat = result.find((stat) => stat.label === "primary stack");
      expect(stackStat).toBeDefined();
      expect(stackStat?.value).toBeTruthy();
      expect(stackStat?.accent).toBe(false);
    });

    it("should include remote ready stat", () => {
      const result = getDefaultMobileStats(mockProfile);
      const remoteStat = result.find((stat) => stat.label === "remote ready");
      expect(remoteStat).toBeDefined();
      expect(remoteStat?.value).toBe("100%");
    });
  });
});
