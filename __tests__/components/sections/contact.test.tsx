import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ContactSection from "@/components/sections/contact";
import { PortfolioProvider } from "@/contexts/portfolio-context";
import * as portfolioApiModule from "@/lib/api/portfolio";
import { ReactNode } from "react";

jest.mock("@/lib/api/portfolio");

const wrapper = ({ children }: { children: ReactNode }) => (
  <PortfolioProvider>{children}</PortfolioProvider>
);

describe("ContactSection", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (portfolioApiModule.portfolioApi.getAllPortfolioData as jest.Mock).mockResolvedValue({
      profile: {
        email: "test@example.com",
        location: "Purwokerto",
        availability: "Open to work",
        socials: {},
        contact: { title: "Get in touch" },
      },
      services: [],
      skills: [],
      experiences: [],
      projects: [],
      certificates: [],
    });
  });

  it("submits contact payload matching backend contract", async () => {
    (portfolioApiModule.submitContact as jest.Mock).mockResolvedValue(undefined);

    render(<ContactSection />, { wrapper });

    fireEvent.change(screen.getByLabelText(/Your Name/i), {
      target: { value: "Alex Pratama" },
    });
    fireEvent.change(screen.getByLabelText(/Your Email/i), {
      target: { value: "alex@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Message Payload/i), {
      target: { value: "Looking to build a scalable web application" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Send Message/i }));

    await waitFor(() => {
      expect(portfolioApiModule.submitContact).toHaveBeenCalledWith({
        name: "Alex Pratama",
        email: "alex@example.com",
        subject: "Web app",
        message: "Looking to build a scalable web application",
      });
    });

    expect(
      await screen.findByText(/Message transmitted successfully/i)
    ).toBeInTheDocument();
  });

  it("shows error feedback when submission fails", async () => {
    (portfolioApiModule.submitContact as jest.Mock).mockRejectedValue(
      new Error("Message must be at least 10 characters.")
    );

    render(<ContactSection />, { wrapper });

    fireEvent.change(screen.getByLabelText(/Your Name/i), {
      target: { value: "Alex Pratama" },
    });
    fireEvent.change(screen.getByLabelText(/Your Email/i), {
      target: { value: "alex@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Message Payload/i), {
      target: { value: "A message longer than 10 characters" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Send Message/i }));

    expect(
      await screen.findByText(/Message must be at least 10 characters./i)
    ).toBeInTheDocument();
  });
});
