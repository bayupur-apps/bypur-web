// Integration Tests for PortfolioContext
import { act, renderHook } from "@testing-library/react";
import { PortfolioProvider, usePortfolio } from "@/contexts/portfolio-context";
import { ReactNode } from "react";
import * as portfolioApiModule from "@/lib/api/portfolio";
import { profileDataDefault } from "@/lib/data/profile.default";

// Mock the portfolio API
jest.mock("@/lib/api/portfolio");

describe("PortfolioContext Integration", () => {
  const initialData = {
    profile: profileDataDefault,
    services: [],
    skills: [],
    experiences: [],
    projects: [],
    certificates: [],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (portfolioApiModule.portfolioApi.getAllPortfolioData as jest.Mock).mockResolvedValue({
      profile: { name: "Bayu Purnomo" },
      services: [],
      skills: [],
      experiences: [],
      projects: [],
    });
  });

  const wrapper = ({ children }: { children: ReactNode }) => (
    <PortfolioProvider initialData={initialData}>{children}</PortfolioProvider>
  );

  it("provides server data immediately without fetching again", () => {
    (portfolioApiModule.portfolioApi.getAllPortfolioData as jest.Mock).mockImplementation(
      () => new Promise(() => {}),
    );

    const { result } = renderHook(() => usePortfolio(), { wrapper });

    expect(result.current.loading).toBe(false);
    expect(result.current.profile.name).toBe(profileDataDefault.name);
    expect(portfolioApiModule.portfolioApi.getAllPortfolioData).not.toHaveBeenCalled();
  });

  it("refetches all data on demand", async () => {
    const mockData = {
      profile: { name: "Test", email: "test@test.com" },
      services: [{ title: "Service 1", slug: "service-1" }],
      skills: [{ name: "React", category: "frontend" }],
      experiences: [{ id: 1, company: "Company A", role: "Developer" }],
      projects: [{ id: 1, title: "Project A", description: "Desc", techStack: [] }],
    };

    (portfolioApiModule.portfolioApi.getAllPortfolioData as jest.Mock).mockResolvedValue(mockData);

    const { result } = renderHook(() => usePortfolio(), { wrapper });

    await act(async () => {
      await result.current.refetch();
    });

    expect(portfolioApiModule.portfolioApi.getAllPortfolioData).toHaveBeenCalledTimes(1);
    expect(result.current.profile.name).toBe("Test");
    expect(result.current.services[0].title).toBe("Service 1");
    expect(result.current.skills[0].name).toBe("React");
  });

  it("uses server-provided data without showing defaults or fetching again", () => {
    const serverData = {
      profile: { ...profileDataDefault, name: "Server Profile" },
      services: [],
      skills: [],
      experiences: [],
      projects: [],
      certificates: [],
    };
    const serverWrapper = ({ children }: { children: ReactNode }) => (
      <PortfolioProvider initialData={serverData}>{children}</PortfolioProvider>
    );

    const { result } = renderHook(() => usePortfolio(), { wrapper: serverWrapper });

    expect(result.current.profile.name).toBe("Server Profile");
    expect(portfolioApiModule.portfolioApi.getAllPortfolioData).not.toHaveBeenCalled();
  });

  it("keeps server data when a refetch fails", async () => {
    // Suppress console.error for this test since we expect it
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

    (portfolioApiModule.portfolioApi.getAllPortfolioData as jest.Mock).mockRejectedValue(
      new Error("API Error")
    );

    const { result } = renderHook(() => usePortfolio(), { wrapper });

    await act(async () => {
      await result.current.refetch();
    });

    expect(result.current.profile).toBe(profileDataDefault);
    expect(portfolioApiModule.portfolioApi.getAllPortfolioData).toHaveBeenCalledTimes(1);

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

    await act(async () => {
      await result.current.refetch();
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
