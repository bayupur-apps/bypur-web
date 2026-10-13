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
  roles: [],
  tagline: "Engineering Ideas Into Reality.",
  taglineHighlight: "Scalable Web Applications",
  rolesLabel: "Fullstack Developer",
  cta: {
    primary: { text: "View Projects", href: "#projects" },
    secondary: { text: "Get in touch", href: "#contact" },
  },
  resumeUrl: "/resume.pdf",
  isCvVisible: true,
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
      expect(screen.getAllByText(/Hi, I'm/i)[0]).toBeInTheDocument();
    });
  });

  it("should display the tagline", async () => {
    render(<HeroSection />, { wrapper });
    
    await waitFor(() => {
      expect(screen.getAllByText(/Engineering Ideas Into Reality\./i)[0]).toBeInTheDocument();
    });
  });

  it("shows the CMS highlight and role label when the role list is empty", async () => {
    render(<HeroSection />, { wrapper });

    await waitFor(() => {
      expect(screen.getAllByText("Scalable Web Applications")[0]).toBeInTheDocument();
      expect(screen.getAllByText("Fullstack Developer")[0]).toBeInTheDocument();
    });
  });

  it("renders both configured hero calls to action", async () => {
    render(<HeroSection />, { wrapper });

    await waitFor(() => {
      expect(screen.getAllByRole("link", { name: "View Projects" })[0]).toHaveAttribute("href", "#projects");
      expect(screen.getAllByRole("link", { name: "Get in touch" })[0]).toHaveAttribute("href", "#contact");
    });
  });

  it("shows the CV action when enabled", async () => {
    render(<HeroSection />, { wrapper });

    await waitFor(() => {
      expect(screen.getAllByRole("link", { name: "Download CV" })[0]).toHaveAttribute("href", "/resume.pdf");
    });
  });

  it("hides the CV action when disabled", async () => {
    (portfolioApiModule.portfolioApi.getAllPortfolioData as jest.Mock).mockResolvedValueOnce({
      profile: { ...mockProfile, isCvVisible: false },
      services: [],
      skills: [],
      experiences: [],
      projects: [],
    });

    render(<HeroSection />, { wrapper });

    await waitFor(() => {
      expect(screen.queryByRole("link", { name: "Download CV" })).not.toBeInTheDocument();
    });
  });

  it("should display the bio", async () => {
    render(<HeroSection />, { wrapper });
    
    await waitFor(() => {
      expect(screen.getAllByText(/Building scalable systems/i)[0]).toBeInTheDocument();
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
      // Rendered twice: compact mobile avatar + full desktop avatar
      // (both exist in the DOM simultaneously; CSS breakpoints decide
      // which one is visible).
      const images = screen.getAllByAltText("Bayu Purnomo");
      expect(images.length).toBeGreaterThan(0);
    });
  });

  it("should have proper responsive classes", async () => {
    const { container } = render(<HeroSection />, { wrapper });
    
    await waitFor(() => {
      const section = container.querySelector("section");
      expect(section).toBeInTheDocument();
      expect(section?.className).toContain("relative");
    });
  });

  it("should display mobile stats on mobile view", async () => {
    render(<HeroSection />, { wrapper });
    
    await waitFor(() => {
      expect(screen.getByText(/years experience/i)).toBeInTheDocument();
    });
  });
});
