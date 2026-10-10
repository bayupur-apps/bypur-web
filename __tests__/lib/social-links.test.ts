import { getSocialLinks, normalizeExternalUrl } from "@/lib/helpers/social-links";

describe("social-links helpers", () => {
  describe("normalizeExternalUrl", () => {
    it("should prepend https:// to bare domain or path without scheme", () => {
      expect(normalizeExternalUrl("www.linkedin.com/in/bayupurnomo1710")).toBe(
        "https://www.linkedin.com/in/bayupurnomo1710"
      );
      expect(normalizeExternalUrl("linkedin.com/in/bayupurnomo1710")).toBe(
        "https://linkedin.com/in/bayupurnomo1710"
      );
    });

    it("should keep existing http:// or https://", () => {
      expect(normalizeExternalUrl("https://www.linkedin.com/in/bayupurnomo1710")).toBe(
        "https://www.linkedin.com/in/bayupurnomo1710"
      );
      expect(normalizeExternalUrl("http://example.com")).toBe("http://example.com");
    });

    it("should handle empty or whitespace strings", () => {
      expect(normalizeExternalUrl("")).toBe("");
      expect(normalizeExternalUrl("   ")).toBe("");
      expect(normalizeExternalUrl(undefined)).toBe("");
    });
  });

  describe("getSocialLinks", () => {
    it("should format and return configured social links with normalized URLs", () => {
      const links = getSocialLinks({
        github: "https://github.com/bayupaths",
        linkedin: "www.linkedin.com/in/bayupurnomo1710",
      });

      expect(links).toHaveLength(2);
      const linkedin = links.find((l) => l.label === "LinkedIn");
      expect(linkedin).toBeDefined();
      expect(linkedin?.href).toBe("https://www.linkedin.com/in/bayupurnomo1710");
    });
  });
});
