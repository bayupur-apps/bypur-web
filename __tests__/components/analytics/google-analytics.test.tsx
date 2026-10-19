import React from "react";
import { render } from "@testing-library/react";
import { GoogleAnalytics } from "@/components/analytics/google-analytics";

jest.mock("@next/third-parties/google", () => ({
  GoogleAnalytics: ({ gaId }: { gaId: string }) => (
    <div data-testid="next-google-analytics" data-gaid={gaId} />
  ),
}));

describe("GoogleAnalytics Component", () => {
  it("renders next google analytics when gaId is provided", () => {
    const { getByTestId } = render(<GoogleAnalytics gaId="G-TEST12345" />);
    const el = getByTestId("next-google-analytics");
    expect(el).toBeInTheDocument();
    expect(el).toHaveAttribute("data-gaid", "G-TEST12345");
  });

  it("returns null when gaId is undefined or empty", () => {
    const { container: emptyContainer } = render(<GoogleAnalytics gaId="" />);
    expect(emptyContainer.firstChild).toBeNull();

    const { container: undefContainer } = render(<GoogleAnalytics />);
    expect(undefContainer.firstChild).toBeNull();
  });
});
