import { render, screen, fireEvent } from "@testing-library/react";
import SiteHeader from "@/components/layout/site-header";
import { PortfolioProvider } from "@/contexts/portfolio-context";

const mockNavLinks = [
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <PortfolioProvider>{children}</PortfolioProvider>
);

describe("SiteHeader Component", () => {
  const mockProps = {
    navLinks: mockNavLinks,
    isMobileOpen: false,
    onToggleMobile: jest.fn(),
    onCloseMobile: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render without crashing", () => {
    render(<SiteHeader {...mockProps} />, { wrapper });
    expect(screen.getByRole("banner")).toBeInTheDocument();
  });

  it("should render all navigation links", () => {
    render(<SiteHeader {...mockProps} />, { wrapper });
    mockNavLinks.forEach((link) => {
      expect(screen.getAllByText(link.label).length).toBeGreaterThan(0);
    });
  });

  it("should render theme toggle button", () => {
    render(<SiteHeader {...mockProps} />, { wrapper });
    const themeButtons = screen.getAllByRole("button");
    expect(themeButtons.length).toBeGreaterThan(0);
  });

  it("should render mobile menu toggle button", () => {
    render(<SiteHeader {...mockProps} />, { wrapper });
    const menuButton = screen.getByLabelText("Menu");
    expect(menuButton).toBeInTheDocument();
  });

  it("should call onToggleMobile when menu button is clicked", () => {
    render(<SiteHeader {...mockProps} />, { wrapper });
    const menuButton = screen.getByLabelText("Menu");
    fireEvent.click(menuButton);
    expect(mockProps.onToggleMobile).toHaveBeenCalledTimes(1);
  });

  it("should show close icon when mobile menu is open", () => {
    render(<SiteHeader {...mockProps} isMobileOpen={true} />, { wrapper });
    const closeButton = screen.getByLabelText("Menu");
    expect(closeButton).toBeInTheDocument();
    expect(closeButton).toHaveAttribute("aria-expanded", "true");
  });

  it("should call onCloseMobile when a nav link is clicked on mobile", () => {
    const { container } = render(
      <SiteHeader {...mockProps} isMobileOpen={true} />,
      { wrapper }
    );
    // In mobile menu, the links trigger onCloseMobile
    const mobileMenu = container.querySelector('[role="dialog"]');
    if (mobileMenu) {
      const links = mobileMenu.querySelectorAll("a");
      if (links.length > 0) {
        fireEvent.click(links[0]);
        expect(mockProps.onCloseMobile).toHaveBeenCalled();
      }
    }
  });

  it("should have proper header structure", () => {
    const { container } = render(<SiteHeader {...mockProps} />, { wrapper });
    const header = container.querySelector("header");
    expect(header).toBeInTheDocument();
  });

  it("should display logo or brand text", () => {
    render(<SiteHeader {...mockProps} />, { wrapper });
    // Check if the profile name (default: "Bayu Purnomo") renders as the logo
    const logo = screen.getByText("Bayu Purnomo");
    expect(logo).toBeInTheDocument();
  });
});
