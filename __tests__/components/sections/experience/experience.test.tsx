import { render, screen, fireEvent } from "@testing-library/react";
import ExperienceSection from "@/components/sections/experience";
import { PortfolioProvider } from "@/contexts/portfolio-context";

describe("ExperienceSection Zero-Gravity Timeline", () => {
  it("renders the orbital experience hub header and stations", () => {
    render(
      <PortfolioProvider>
        <ExperienceSection />
      </PortfolioProvider>
    );
    expect(screen.getByText(/ZERO-GRAVITY CANVAS/i)).toBeInTheDocument();
    expect(screen.getByText(/ORBITAL STATIONS/i)).toBeInTheDocument();
  });

  it("switches orbital station when clicking timeline item", () => {
    render(
      <PortfolioProvider>
        <ExperienceSection />
      </PortfolioProvider>
    );
    const freelanceTabs = screen.getAllByRole("tab", { name: /Freelance/i });
    if (freelanceTabs.length > 0) {
      fireEvent.click(freelanceTabs[0]);
      expect(freelanceTabs[0]).toHaveAttribute("aria-selected", "true");
    }
  });
});
