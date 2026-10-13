import { render, screen, fireEvent } from "@testing-library/react";
import ExperienceSection from "@/components/sections/experience";
import { PortfolioProvider } from "@/contexts/portfolio-context";
import { portfolioDataFixture } from "@/__tests__/fixtures/portfolio-data";

describe("ExperienceSection Zero-Gravity Timeline", () => {
  it("renders the career experience hub header and timeline", () => {
    render(
      <PortfolioProvider initialData={portfolioDataFixture}>
        <ExperienceSection />
      </PortfolioProvider>
    );
    expect(screen.getByText(/FULL STACK TIMELINE/i)).toBeInTheDocument();
    expect(screen.getByText(/EXPERIENCE TIMELINE/i)).toBeInTheDocument();
  });

  it("selects a timeline item when one is available", () => {
    render(
      <PortfolioProvider initialData={portfolioDataFixture}>
        <ExperienceSection />
      </PortfolioProvider>
    );
    const timelineTabs = screen.getAllByRole("tab");
    const selectedTab = timelineTabs[timelineTabs.length - 1];
    fireEvent.click(selectedTab);
    expect(selectedTab).toHaveAttribute("aria-selected", "true");
  });
});
