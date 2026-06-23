import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AIChatbotWindow } from "@/components/ui/ai-chatbot-window";
import type { Message } from "@/components/ui/chat-types";

describe("AIChatbotWindow", () => {
  const messages: Message[] = [
    {
      id: "1",
      role: "assistant",
      content: "Welcome to the AI assistant.",
      timestamp: new Date(),
    },
    {
      id: "2",
      role: "user",
      content: "Hello there.",
      timestamp: new Date(),
    },
  ];

  it("renders messages and can send a message", async () => {
    const onInputChange = jest.fn();
    const onSend = jest.fn();
    const onClose = jest.fn();
    const onKeyPress = jest.fn();

    render(
      <AIChatbotWindow
        messages={messages}
        isLoading={false}
        input="Hello"
        onInputChange={onInputChange}
        onSend={onSend}
        onClose={onClose}
        onKeyPress={onKeyPress}
        renderMessageContent={(content) => <span>{content}</span>}
        inputRef={{ current: null }}
        messagesEndRef={{ current: null }}
      />,
    );

    expect(screen.getByText("Welcome to the AI assistant.")).toBeInTheDocument();
    expect(screen.getByText("Hello there.")).toBeInTheDocument();

    const sendButtons = screen.getAllByRole("button");
    const sendButton = sendButtons.find(
      (button) => button.getAttribute("aria-label") !== "Minimize" && button.getAttribute("aria-label") !== "Close"
    );

    expect(sendButton).toBeDefined();
    if (sendButton) {
      await userEvent.click(sendButton);
      expect(onSend).toHaveBeenCalled();
    }
  });

  it("calls close when close button is clicked", async () => {
    const onInputChange = jest.fn();
    const onSend = jest.fn();
    const onClose = jest.fn();
    const onKeyPress = jest.fn();

    render(
      <AIChatbotWindow
        messages={messages}
        isLoading={false}
        input="Hello"
        onInputChange={onInputChange}
        onSend={onSend}
        onClose={onClose}
        onKeyPress={onKeyPress}
        renderMessageContent={(content) => <span>{content}</span>}
        inputRef={{ current: null }}
        messagesEndRef={{ current: null }}
      />,
    );

    const closeButton = screen.getByLabelText("Close");
    await userEvent.click(closeButton);
    expect(onClose).toHaveBeenCalled();
  });
});
