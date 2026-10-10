import { render, screen, fireEvent } from "@testing-library/react";
import { SkillBentoMatrix } from "@/components/sections/stack/skill-bento-matrix";
import { PortfolioProvider } from "@/contexts/portfolio-context";
import type { Skill } from "@/lib/types";

const mockSkills: Skill[] = [
  { name: "Next.js", category: "frontend", level: 5 },
  { name: "TypeScript", category: "frontend", level: 5 },
  { name: "Laravel", category: "backend", level: 4 },
  { name: "Golang", category: "backend", level: 4 },
  { name: "PostgreSQL", category: "backend", level: 4 },
  { name: "Docker", category: "tools", level: 3 },
  { name: "Claude", category: "ai", level: 3 },
  { name: "Clean Code", category: "other", level: 4 },
];

const renderComponent = (skills = mockSkills) => {
  return render(
    <PortfolioProvider>
      <SkillBentoMatrix skills={skills} />
    </PortfolioProvider>
  );
};

describe("SkillBentoMatrix Architecture Console", () => {
  it("renders the technical architecture header and core engines", () => {
    renderComponent();
    expect(screen.getByText(/Technical Architecture & Matrix/i)).toBeInTheDocument();
    expect(screen.getByText(/Core Production Engines/i)).toBeInTheDocument();
  });

  it("renders architectural tier bus lines", () => {
    renderComponent();
    expect(screen.getByText(/01_CLIENT/i)).toBeInTheDocument();
    expect(screen.getByText(/02_SERVER/i)).toBeInTheDocument();
    expect(screen.getByText(/03_DATA/i)).toBeInTheDocument();
  });

  it("inspects linked projects when clicking on a technology node", () => {
    renderComponent();
    const nextjsButtons = screen.getAllByRole("button", { name: /Next\.js/i });
    expect(nextjsButtons.length).toBeGreaterThan(0);

    fireEvent.click(nextjsButtons[0]);
    expect(screen.getAllByText(/Personal Portfolio/i)[0]).toBeInTheDocument();
  });

  it("handles empty skills gracefully", () => {
    renderComponent([]);
    expect(screen.getByText(/No skills configured/i)).toBeInTheDocument();
  });
});
