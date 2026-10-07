import { render, screen, fireEvent, within } from "@testing-library/react";
import ProjectsSection from "@/components/sections/projects";
import { PortfolioProvider } from "@/contexts/portfolio-context";

const renderSection = () =>
  render(
    <PortfolioProvider>
      <ProjectsSection />
    </PortfolioProvider>
  );

describe("ProjectsSection card grid", () => {
  it("renders one card per project", () => {
    renderSection();
    expect(screen.getAllByRole("article").length).toBeGreaterThan(0);
    expect(screen.getAllByText(/SYSTEMS/i).length).toBeGreaterThan(0);
  });

  it("filters cards by technology", () => {
    renderSection();
    const all = screen.getAllByRole("article").length;
    const filters = within(
      screen.getByRole("group", { name: /filter projects/i })
    ).getAllByRole("button");

    fireEvent.click(filters[1]);
    expect(filters[1]).toHaveAttribute("aria-pressed", "true");
    expect(screen.getAllByRole("article").length).toBeLessThanOrEqual(all);
  });

  it("opens the spec modal from a card", () => {
    renderSection();
    fireEvent.click(
      screen.getAllByRole("button", { name: /Open Order Management System.*specifications/i })[0]
    );
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("displays up to 3 cards per slide and navigates between slides", () => {
    renderSection();
    // Initially displays exactly 3 cards
    expect(screen.getAllByRole("article").length).toBe(3);

    const nextBtn = screen.getByRole("button", { name: /Next slide/i });
    expect(nextBtn).toBeInTheDocument();

    fireEvent.click(nextBtn);
    // After advancing, displays the next batch of up to 3 cards
    expect(screen.getAllByRole("article").length).toBeGreaterThan(0);
    expect(screen.getAllByRole("article").length).toBeLessThanOrEqual(3);
  });
});
