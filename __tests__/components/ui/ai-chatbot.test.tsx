import { render, screen } from "@testing-library/react";
import { renderMessageContent } from "@/components/ui/ai-chatbot";

describe("AIChatbot renderMessageContent", () => {
  it("renders bold, italic, code, link, and hash tags correctly", () => {
    const content =
      "Hello **strong** and *emphasis* with `code` and [link](https://example.com) plus #contact and #projects.";

    render(<>{renderMessageContent(content)}</>);

    expect(screen.getByText("strong")).toBeInTheDocument();
    expect(screen.getByText("emphasis")).toBeInTheDocument();
    expect(screen.getByText("code")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /link/i })).toHaveAttribute(
      "href",
      "https://example.com"
    );
    expect(screen.getByRole("link", { name: /#contact/i })).toHaveAttribute(
      "href",
      "#contact"
    );
    expect(screen.getByRole("link", { name: /#projects/i })).toHaveAttribute(
      "href",
      "#projects"
    );
  });

  it("renders plain text when markup is incomplete", () => {
    const content = "This is *not closed and [bad](ftp://example.com) text";
    render(<>{renderMessageContent(content)}</>);
    expect(screen.getByText(content)).toBeInTheDocument();
  });

  it("processes large inputs safely without regex backtracking issues", () => {
    const repeated = "*".repeat(10000) + " end";
    expect(() => renderMessageContent(repeated)).not.toThrow();
  });
});
