import { splitTitle } from "@/components/ui/highlighted-title";

describe("splitTitle", () => {
  it("highlights a phrase at the end of the title", () => {
    expect(splitTitle("Tools I use to build applications.", "build applications.")).toEqual([
      "Tools I use to ",
      "build applications.",
      "",
    ]);
  });

  it("highlights in place even when trailing punctuation differs", () => {
    expect(splitTitle("Building real systems through practice.", "real systems.")).toEqual([
      "Building ",
      "real systems",
      " through practice.",
    ]);
  });

  it("appends a highlight that isn't part of the title", () => {
    expect(splitTitle("A developer who builds", "real working systems.")).toEqual([
      "A developer who builds ",
      "real working systems.",
      "",
    ]);
  });

  it("returns the plain title without a highlight", () => {
    expect(splitTitle("Plain title", undefined)).toEqual(["Plain title", "", ""]);
  });
});
