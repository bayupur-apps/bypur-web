import { Network, Workflow } from "lucide-react";
import { siLaravel, siNextdotjs } from "simple-icons";
import { getSkillIcon, isDarkBrand } from "@/lib/config/skill-icons";

describe("getSkillIcon", () => {
  it("matches brand logos regardless of punctuation and case", () => {
    expect(getSkillIcon("Next.js")).toEqual({ kind: "brand", path: siNextdotjs.path, hex: siNextdotjs.hex });
    expect(getSkillIcon("LARAVEL")).toMatchObject({ kind: "brand", hex: siLaravel.hex });
  });

  it("uses lucide icons for non-brand skills", () => {
    expect(getSkillIcon("CI/CD")).toEqual({ kind: "lucide", icon: Workflow });
  });

  it("falls back to a generic icon for unknown skills", () => {
    expect(getSkillIcon("Some New Tool")).toEqual({ kind: "lucide", icon: Network });
  });
});

describe("isDarkBrand", () => {
  it("flags near-black brand colours only", () => {
    expect(isDarkBrand("000000")).toBe(true);
    expect(isDarkBrand("181717")).toBe(true);
    expect(isDarkBrand("FF2D20")).toBe(false);
    expect(isDarkBrand("4FC08D")).toBe(false);
  });
});
