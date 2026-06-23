import { render, screen, waitFor } from "@testing-library/react";
import HeroSection from "@/components/sections/hero";
import { PortfolioProvider } from "@/contexts/portfolio-context";
import * as portfolioApiModule from "@/lib/api/portfolio";
import { ReactNode } from "react";

// Mock the portfolio API
jest.mock("@/lib/api/portfolio");

const mockProfile = {
  name: "Bayu Purnomo",
  title: "Backend Engineer",
  bio: "Building scalable systems",
  email: "bayupurnomo.dev@gmail.com",
  location: "Indonesia",
  avatar: "/images/avatar/avatar.png",
  socials: {},
  roles: ["Backend Engineer", "Systems Architect"],
  tagline: "I craft scalable digital products.",
  rolesLabel: "Currently working as",
  mobileStats: [
    { value: "5+", label: "years experience", accent: true, icon: "ti-briefcase" },
  ],
  techStack: ["Go", "Laravel", "Vue / Nuxt", "PostgreSQL", "REST API"],
};

const wrapper = ({ children }: { children: ReactNode }) => (
  <PortfolioProvider>{children}</PortfolioProvider>
);

describe("HeroSection Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock successful API responses
    (portfolioApiModule.portfolioApi.getAllPortfolioData as jest.Mock).mockResolvedValue({
      profile: mockProfile,
      services: [],
      skills: [],
      experiences: [],
      projects: [],
    });
  });

  it("should render without crashing", async () => {
    const { container } = render(<HeroSection />, { wrapper });
    
    await waitFor(() => {
      const section = container.querySelector("section");
      expect(section).toBeInTheDocument();
    });
  });

  it("should display the main heading with profile name", async () => {
    render(<HeroSection />, { wrapper });
    
    await waitFor(() => {
      expect(screen.getByText(/Hi, I'm Bayu/i)).toBeInTheDocument();
    });
  });

  it("should display the tagline", async () => {
    render(<HeroSection />, { wrapper });
    
    await waitFor(() => {
      expect(screen.getByText(/I craft scalable digital products/i)).toBeInTheDocument();
    });
  });

  it("should display the bio", async () => {
    render(<HeroSection />, { wrapper });
    
    await waitFor(() => {
      expect(screen.getByText(/Building scalable systems/i)).toBeInTheDocument();
    });
  });

  it("should have the correct section id", async () => {
    const { container } = render(<HeroSection />, { wrapper });
    
    await waitFor(() => {
      const section = container.querySelector("#hero");
      expect(section).toBeInTheDocument();
      expect(section).toHaveAttribute("id", "hero");
    });
  });

  it("should render profile avatar image", async () => {
    render(<HeroSection />, { wrapper });
    
    await waitFor(() => {
      const image = screen.getByAltText("Bayu Purnomo");
      expect(image).toBeInTheDocument();
    });
  });

  it("should have proper responsive classes", async () => {
    const { container } = render(<HeroSection />, { wrapper });
    
    await waitFor(() => {
      const section = container.querySelector("section");
      expect(section?.className).toContain("min-h-svh");
    });
  });

  it("should display mobile stats on mobile view", async () => {
    render(<HeroSection />, { wrapper });
    
    await waitFor(() => {
      expect(screen.getByText(/years experience/i)).toBeInTheDocument();
    });
  });
});
