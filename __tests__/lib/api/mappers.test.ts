import { profileDataDefault } from "@/lib/data/profile.default";
import { mapProfile, type BackendProfile } from "@/lib/api/mappers";

describe("mapProfile hero fields", () => {
  const backendProfile: BackendProfile = {
    name: "Bayu Purnomo",
    email: "bayu@example.com",
    title: "Fullstack Developer",
    tagline: "Engineering Ideas Into Reality.",
    tagline_highlight: "Scalable Web Applications",
    roles: [],
    roles_label: "Fullstack Developer",
    cta_primary_text: "View Projects",
    cta_primary_href: "#projects",
    cta_secondary_text: "Get in touch",
    cta_secondary_href: "#contact",
  };

  it("preserves CMS hero copy, empty roles, and both CTA destinations", () => {
    const profile = mapProfile(backendProfile, profileDataDefault);

    expect(profile.tagline).toBe("Engineering Ideas Into Reality.");
    expect(profile.taglineHighlight).toBe("Scalable Web Applications");
    expect(profile.roles).toEqual([]);
    expect(profile.rolesLabel).toBe("Fullstack Developer");
    expect(profile.cta).toEqual({
      primary: { text: "View Projects", href: "#projects" },
      secondary: { text: "Get in touch", href: "#contact" },
    });
  });

  it("does not replace intentionally empty CMS CTA text with defaults", () => {
    const profile = mapProfile(
      { ...backendProfile, cta_primary_text: "", cta_secondary_text: "" },
      profileDataDefault,
    );

    expect(profile.cta?.primary?.text).toBe("");
    expect(profile.cta?.secondary?.text).toBe("");
  });
});
