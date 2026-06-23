import { cn } from "@/lib/helpers";

describe("cn utility function", () => {
  it("should merge class names correctly", () => {
    expect(cn("px-2", "py-1")).toBe("px-2 py-1");
  });

  it("should handle conditional classes", () => {
    expect(cn("base", true && "active", false && "disabled")).toBe(
      "base active"
    );
  });

  it("should merge Tailwind classes and resolve conflicts", () => {
    // tailwind-merge should keep the last conflicting class
    expect(cn("px-2", "px-4")).toBe("px-4");
    expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
  });

  it("should handle arrays of classes", () => {
    expect(cn(["px-2", "py-1"])).toBe("px-2 py-1");
  });

  it("should handle objects with boolean values", () => {
    expect(
      cn({
        "px-2": true,
        "py-1": true,
        hidden: false,
      })
    ).toBe("px-2 py-1");
  });

  it("should handle undefined and null values", () => {
    expect(cn("px-2", undefined, null, "py-1")).toBe("px-2 py-1");
  });

  it("should handle empty inputs", () => {
    expect(cn()).toBe("");
    expect(cn("")).toBe("");
  });

  it("should handle complex nested conditions", () => {
    const isActive = true;
    const isDisabled = false;
    const size = "large";

    expect(
      cn(
        "base-class",
        isActive && "active",
        isDisabled && "disabled",
        size === "large" && "text-lg"
      )
    ).toBe("base-class active text-lg");
  });
});
