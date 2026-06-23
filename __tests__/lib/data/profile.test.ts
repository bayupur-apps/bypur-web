import { profileDataDefault as profile } from "@/lib/data/profile.default";
import { Profile } from "@/lib/types";

describe("Profile Data", () => {
  it("should have all required profile fields", () => {
    expect(profile).toBeDefined();
    expect(profile.name).toBe("Bayu Purnomo");
    expect(profile.title).toBe("Full Stack Developer");
    expect(profile.email).toBeTruthy();
    expect(profile.location).toBeTruthy();
  });

  it("should have valid email format", () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    expect(emailRegex.test(profile.email)).toBe(true);
  });

  it("should have social media links", () => {
    expect(profile.socials).toBeDefined();
    expect(typeof profile.socials).toBe("object");
  });

  it("should have stats array", () => {
    expect(Array.isArray(profile.stats)).toBe(true);
    expect(profile.stats!.length).toBeGreaterThan(0);
  });

  it("should have valid stat structure", () => {
    profile.stats?.forEach((stat) => {
      expect(stat).toHaveProperty("value");
      expect(stat).toHaveProperty("label");
      expect(typeof stat.value).toBe("string");
      expect(typeof stat.label).toBe("string");
    });
  });

  it("should have tech stack array", () => {
    expect(Array.isArray(profile.techStack)).toBe(true);
    expect(profile.techStack!.length).toBeGreaterThan(0);
  });

  it("should have roles array", () => {
    expect(Array.isArray(profile.roles)).toBe(true);
    expect(profile.roles!.length).toBeGreaterThan(0);
  });

  it("should match Profile interface", () => {
    const validateProfile = (p: Profile): boolean => {
      return (
        typeof p.name === "string" &&
        typeof p.title === "string" &&
        typeof p.bio === "string" &&
        typeof p.email === "string" &&
        typeof p.location === "string" &&
        typeof p.avatar === "string" &&
        typeof p.socials === "object"
      );
    };

    expect(validateProfile(profile)).toBe(true);
  });
});
