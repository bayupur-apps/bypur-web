import { render, screen, fireEvent } from "@testing-library/react";
import ExperienceSection from "@/components/sections/experience";
import { PortfolioProvider } from "@/contexts/portfolio-context";
import { portfolioDataFixture } from "@/test-fixtures/portfolio-data";

describe("ExperienceSection Zero-Gravity Timeline", () => {
  it("renders the career experience hub header and timeline", () => {
    render(
      <PortfolioProvider initialData={portfolioDataFixture}>
        <ExperienceSection />
      </PortfolioProvider>
    );
    expect(screen.getByText(/TRACK RECORD & CONTRIBUTIONS/i)).toBeInTheDocument();
    expect(screen.getByRole("tablist", { name: /experience timeline/i })).toBeInTheDocument();
  });

  it("selects a timeline item when clicked", () => {
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

  it("navigates timeline tabs with keyboard arrow keys", () => {
    const multiExpFixture = {
      ...portfolioDataFixture,
      experiences: [
        {
          id: "exp-1",
          company: "Company Alpha",
          role: "Senior Engineer",
          period: "Jan 2024 - Present",
          isCurrent: true,
          description: ["Built microservices", "Led sprint planning"],
          techStack: ["Next.js", "Go"],
        },
        {
          id: "exp-2",
          company: "Company Beta",
          role: "Fullstack Developer",
          period: "Jan 2022 - Dec 2023",
          description: ["Developed portals"],
          techStack: ["React", "PostgreSQL"],
        },
      ],
    };

    render(
      <PortfolioProvider initialData={multiExpFixture}>
        <ExperienceSection />
      </PortfolioProvider>
    );

    const tabs = screen.getAllByRole("tab");
    expect(tabs).toHaveLength(2);

    // Click first tab to activate
    fireEvent.click(tabs[0]);
    expect(tabs[0]).toHaveAttribute("aria-selected", "true");

    // Navigate right / down to next tab
    fireEvent.keyDown(tabs[0], { key: "ArrowRight" });
    expect(tabs[1]).toHaveAttribute("aria-selected", "true");

    // Navigate left / up back to first tab
    fireEvent.keyDown(tabs[1], { key: "ArrowLeft" });
    expect(tabs[0]).toHaveAttribute("aria-selected", "true");
  });
});
