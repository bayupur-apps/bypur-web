// Integration Tests for PortfolioContext
import { renderHook, waitFor } from "@testing-library/react";
import { PortfolioProvider, usePortfolio } from "@/contexts/portfolio-context";
import { ReactNode } from "react";
import * as portfolioApiModule from "@/lib/api/portfolio";

// Mock the portfolio API
jest.mock("@/lib/api/portfolio");

describe("PortfolioContext Integration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const wrapper = ({ children }: { children: ReactNode }) => (
    <PortfolioProvider>{children}</PortfolioProvider>
  );

  it("should provide initial loading state", async () => {
    // Suppress React act warning for initial state check
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation((msg) => {
      if (!msg.toString().includes("act(")) {
        console.warn(msg);
      }
    });

    const { result } = renderHook(() => usePortfolio(), { wrapper });

    expect(result.current.loading).toBe(true);

    // Wait for loading to complete to avoid memory leaks
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    consoleErrorSpy.mockRestore();
  });

  it("should fetch all data in parallel", async () => {
    const mockData = {
      profile: { name: "Test", email: "test@test.com" },
      services: [{ title: "Service 1", slug: "service-1" }],
      skills: [{ name: "React", category: "frontend" }],
      experiences: [{ id: 1, company: "Company A", role: "Developer" }],
      projects: [{ id: 1, title: "Project A", description: "Desc", techStack: [] }],
    };

    (portfolioApiModule.portfolioApi.getAllPortfolioData as jest.Mock).mockResolvedValue(mockData);

    const { result } = renderHook(() => usePortfolio(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(portfolioApiModule.portfolioApi.getAllPortfolioData).toHaveBeenCalled();
    expect(result.current.profile.name).toBe("Test");
    expect(result.current.services[0].title).toBe("Service 1");
    expect(result.current.skills[0].name).toBe("React");
  });

  it("should handle API failures gracefully and use fallback data", async () => {
    // Suppress console.error for this test since we expect it
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

    (portfolioApiModule.portfolioApi.getAllPortfolioData as jest.Mock).mockRejectedValue(
      new Error("API Error")
    );

    const { result } = renderHook(() => usePortfolio(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Should still have fallback static data
    expect(result.current.profile).toBeDefined();
    expect(result.current.services).toBeDefined();
    expect(result.current.skills).toBeDefined();
    expect(result.current.experiences).toBeDefined();
    expect(result.current.projects).toBeDefined();

    consoleErrorSpy.mockRestore();
  });

  it("should update profile data when API returns successfully", async () => {
    const mockData = {
      profile: {
        name: "Bayu Purnomo Updated",
        title: "Senior Backend Engineer",
        email: "new@test.com",
        location: "Jakarta",
        avatar: "/new-avatar.png",
        bio: "Updated bio",
        socials: {},
      },
      services: [],
      skills: [],
      experiences: [],
      projects: [],
    };

    (portfolioApiModule.portfolioApi.getAllPortfolioData as jest.Mock).mockResolvedValue(mockData);

    const { result } = renderHook(() => usePortfolio(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.profile.name).toBe("Bayu Purnomo Updated");
    expect(result.current.profile.title).toBe("Senior Backend Engineer");
  });

  it("should throw error when usePortfolio is used outside provider", () => {
    // Suppress console.error for this test
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();

    expect(() => {
      renderHook(() => usePortfolio());
    }).toThrow("usePortfolio must be used within a PortfolioProvider");

    consoleSpy.mockRestore();
  });
});
