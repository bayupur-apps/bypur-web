import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AIChatbot, renderMessageContent } from "@/components/ui/ai-chatbot";

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

describe("AIChatbot component", () => {
  beforeEach(() => {
    jest.spyOn(window, "scrollTo").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("opens the chat, sends a message, and displays the assistant response", async () => {
    const mockFetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ message: "Hello from AI" }),
    });

    global.fetch = mockFetch as unknown as typeof fetch;

    render(<AIChatbot />);

    const [openButton] = screen.getAllByRole("button");
    expect(openButton).toBeInTheDocument();
    await userEvent.click(openButton);

    const input = screen.getByPlaceholderText("Type your message...");
    await userEvent.type(input, "Hello there");

    const sendButton = input.parentElement?.querySelector("button");

    expect(sendButton).toBeInTheDocument();
    if (!sendButton) {
      throw new Error("Send button not found");
    }

    await userEvent.click(sendButton);

    expect(mockFetch).toHaveBeenCalledWith("/api/chat", expect.objectContaining({
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: expect.any(String),
    }));

    expect(await screen.findByText("Hello from AI")).toBeInTheDocument();
  });

  it("displays an error message when the API call fails", async () => {
    const mockFetch = jest.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ message: "Bad request" }),
    });

    global.fetch = mockFetch as unknown as typeof fetch;

    render(<AIChatbot />);

    const [openButton] = screen.getAllByRole("button");
    expect(openButton).toBeInTheDocument();
    await userEvent.click(openButton);

    const input = screen.getByPlaceholderText("Type your message...");
    await userEvent.type(input, "Hello there");

    const sendButton = input.parentElement?.querySelector("button");

    expect(sendButton).toBeInTheDocument();
    if (!sendButton) {
      throw new Error("Send button not found");
    }

    await userEvent.click(sendButton);

    expect(await screen.findByText(/sorry, i'm having trouble responding/i)).toBeInTheDocument();
  });
});
